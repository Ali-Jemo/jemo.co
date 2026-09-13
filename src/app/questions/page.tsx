import type { Metadata } from "next";
import OpenQuestionsView from "@/components/OpenQuestionsView";
import { getLiveOpenQuestions } from "@/lib/live-content";

export const metadata: Metadata = {
  title: "الأسئلة المفتوحة (Open Problems) | JEMO",
  description: "معضلات علمية مفتوحة بانتظار من يستكشفها عبر تجارب متتالية وتكرارات وتحديات نقدية.",
};

export default async function OpenQuestionsPage() {
  const questions = await getLiveOpenQuestions();

  return <OpenQuestionsView initialQuestions={questions} />;
}
