import { getLatestPublished, type Brief } from "@/app/lib/briefs";
import DailyBriefClient from "./DailyBriefClient";

export default async function DailyBriefPage() {
  let brief: Brief | null = null;
  let fetchError = false;

  try {
    brief = await getLatestPublished();
  } catch {
    fetchError = true;
  }

  return <DailyBriefClient brief={brief} fetchError={fetchError} />;
}