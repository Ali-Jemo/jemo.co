"""Unit tests for JEMO Python SDK."""

import unittest
from jemo import ResearchRegistry, DiscoveryResult, JemoApiError


class TestJemoSdk(unittest.TestCase):
    def test_init_validation(self):
        with self.assertRaises(ValueError):
            ResearchRegistry(api_key="")

        # Obvious placeholder — the jemo_live_res_ prefix belongs only to real
        # issued tokens, so secret scanners don't flag this file as a leak.
        client = ResearchRegistry(api_key="test_placeholder_key_not_a_credential")
        self.assertEqual(client.api_key, "test_placeholder_key_not_a_credential")
        self.assertEqual(client.endpoint, "https://jemo.co/api")

    def test_discovery_result_wrapper(self):
        raw = {
            "success": True,
            "id": "JEMO-OBJ-123456",
            "slug": "test-discovery-jemo-obj-123456",
            "url": "https://jemo.co/research/test-discovery-jemo-obj-123456",
            "message": "Registered successfully",
            "data": {
                "id": "JEMO-OBJ-123456",
                "title": "تدقيق استدلالي لنماذج التفكير العميق",
                "field": "الذكاء الاصطناعي",
                "findings": "انخفاض معدل الخطأ في الإعراب بنسبة 34%.",
                "question": "هل تنخفض نسبة الهلوسة؟",
            },
        }

        res = DiscoveryResult(raw)
        self.assertTrue(res.success)
        self.assertEqual(res.id, "JEMO-OBJ-123456")
        self.assertEqual(res.slug, "test-discovery-jemo-obj-123456")
        self.assertEqual(res.title, "تدقيق استدلالي لنماذج التفكير العميق")
        self.assertEqual(res.field, "الذكاء الاصطناعي")
        self.assertEqual(res["id"], "JEMO-OBJ-123456")
        self.assertIn("JEMO-OBJ-123456", repr(res))

    def test_jemo_api_error(self):
        err = JemoApiError("Unauthorized key", status_code=401, details={"code": "invalid_key"})
        self.assertEqual(err.status_code, 401)
        self.assertEqual(err.message, "Unauthorized key")
        self.assertEqual(err.details.get("code"), "invalid_key")
        self.assertIn("[401]", str(err))


if __name__ == "__main__":
    unittest.main()
