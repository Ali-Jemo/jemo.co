"""
JEMO Discovery Registry SDK for Python
Official library to document, publish, and audit AI research objects with JEMO.
Zero external dependencies — pure Python 3.8+ stdlib.
"""

from __future__ import annotations

import json
import urllib.error
import urllib.parse
import urllib.request
from typing import Any, Dict, List, Optional, Union

__version__ = "0.1.0"
__all__ = ["ResearchRegistry", "DiscoveryResult", "JemoApiError"]


class JemoApiError(Exception):
    """Exception raised for API request failures."""

    def __init__(self, message: str, status_code: int = 500, details: Optional[Dict[str, Any]] = None):
        super().__init__(f"[{status_code}] {message}")
        self.status_code = status_code
        self.message = message
        self.details = details or {}


class DiscoveryResult:
    """A typed wrapper around a published Research Object."""

    def __init__(self, raw: Dict[str, Any]):
        self._raw = raw
        self.success: bool = raw.get("success", True)
        self.id: str = raw.get("id") or raw.get("data", {}).get("id", "")
        self.slug: str = raw.get("slug") or raw.get("data", {}).get("slug", "")
        self.url: str = raw.get("url") or f"https://jemo.co/research/{self.slug}"
        self.message: str = raw.get("message", "")
        self.data: Dict[str, Any] = raw.get("data", {})

    @property
    def title(self) -> str:
        return self.data.get("title", "")

    @property
    def field(self) -> str:
        return self.data.get("field", "")

    @property
    def findings(self) -> str:
        return self.data.get("findings", "")

    @property
    def question(self) -> Optional[str]:
        return self.data.get("question")

    def __getitem__(self, key: str) -> Any:
        if key in self._raw:
            return self._raw[key]
        if key in self.data:
            return self.data[key]
        raise KeyError(key)

    def __repr__(self) -> str:
        return f"<DiscoveryResult id='{self.id}' title='{self.title[:30]}' url='{self.url}'>"

    def to_dict(self) -> Dict[str, Any]:
        return self._raw


class ResearchRegistry:
    """Client for the JEMO Discovery Registry API."""

    def __init__(
        self,
        api_key: str,
        endpoint: str = "https://jemo.co/api",
        timeout: float = 30.0,
    ):
        if not api_key or not isinstance(api_key, str):
            raise ValueError("ResearchRegistry requires a valid api_key (e.g. 'jemo_live_res_...').")

        self.api_key = api_key.strip()
        self.endpoint = endpoint.rstrip("/")
        self.timeout = timeout

    def _request(
        self,
        path: str,
        method: str = "GET",
        payload: Optional[Dict[str, Any]] = None,
        params: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        url = f"{self.endpoint}{path if path.startswith('/') else '/' + path}"
        if params:
            clean_params = {k: v for k, v in params.items() if v is not None}
            if clean_params:
                url = f"{url}?{urllib.parse.urlencode(clean_params)}"

        data_bytes = None
        if payload is not None:
            data_bytes = json.dumps(payload, ensure_ascii=False).encode("utf-8")

        headers = {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": f"Bearer {self.api_key}",
            "X-API-Key": self.api_key,
            "Accept": "application/json",
            "User-Agent": f"jemo-python-sdk/{__version__}",
        }

        req = urllib.request.Request(url, data=data_bytes, headers=headers, method=method)

        try:
            with urllib.request.urlopen(req, timeout=self.timeout) as response:
                body_bytes = response.read()
                return json.loads(body_bytes.decode("utf-8"))
        except urllib.error.HTTPError as exc:
            try:
                err_body = json.loads(exc.read().decode("utf-8"))
                msg = err_body.get("message") or err_body.get("error") or str(exc)
            except Exception:
                err_body = {}
                msg = str(exc)
            raise JemoApiError(message=msg, status_code=exc.code, details=err_body) from exc
        except urllib.error.URLError as exc:
            raise JemoApiError(message=f"Network error connecting to {url}: {exc.reason}", status_code=0) from exc

    def publish_object(
        self,
        title: str,
        field: str = "الذكاء الاصطناعي وهندسة الاستدلال",
        research_type: str = "Experiment",
        question: Optional[str] = None,
        tools: Optional[List[str]] = None,
        findings: Optional[str] = None,
        confidence: str = "مرتفعة - تم التكرار بنجاح",
        methodology: Optional[str] = None,
        accuracy_check: Optional[str] = None,
        code_url: Optional[str] = None,
        dataset_url: Optional[str] = None,
        **extra: Any,
    ) -> DiscoveryResult:
        """Publishes a new research object resulting from an AI inference session or benchmark."""
        payload: Dict[str, Any] = {
            "title": title,
            "field": field,
            "researchType": research_type,
            "question": question,
            "tools": tools or [],
            "findings": findings,
            "confidence": confidence,
            "methodology": methodology,
            "accuracyCheck": accuracy_check,
            "codeUrl": code_url,
            "datasetUrl": dataset_url,
            **extra,
        }
        res = self._request("/research", method="POST", payload=payload)
        return DiscoveryResult(res)

    def publish(self, *args: Any, **kwargs: Any) -> DiscoveryResult:
        """Alias for publish_object."""
        return self.publish_object(*args, **kwargs)

    def get_object(self, slug_or_id: str) -> Dict[str, Any]:
        """Retrieves a research object by slug or id."""
        res = self._request(f"/research/{urllib.parse.quote(slug_or_id)}")
        return res.get("data", res)

    def list_objects(
        self,
        q: Optional[str] = None,
        field: Optional[str] = None,
        research_type: Optional[str] = None,
        limit: int = 20,
        offset: int = 0,
    ) -> Dict[str, Any]:
        """Lists and searches across research objects in the registry."""
        params = {
            "q": q,
            "field": field,
            "type": research_type,
            "limit": limit,
            "offset": offset,
        }
        return self._request("/research", method="GET", params=params)

    def replicate(
        self,
        paper_slug: str,
        findings: str,
        replication_type: str = "replication",
        confidence: str = "مرتفعة - تم التكرار بنجاح",
        reproduced_accuracy: Optional[int] = None,
        methodology: Optional[str] = None,
        evidence_url: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Submits a peer verification, challenge, or extension for a paper."""
        payload = {
            "type": replication_type,
            "findings": findings,
            "confidence": confidence,
            "reproducedAccuracy": reproduced_accuracy,
            "methodology": methodology,
            "evidenceUrl": evidence_url,
        }
        return self._request(f"/research/{urllib.parse.quote(paper_slug)}", method="POST", payload=payload)
