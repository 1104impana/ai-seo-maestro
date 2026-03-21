import { supabase } from "@/integrations/supabase/client";
import type { AnalysisResult } from "./seo";

export interface Fix {
  id: string;
  category: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  before_code: string;
  after_code: string;
  auto_fixable: boolean;
  selected?: boolean;
  applied?: boolean;
}

export async function generateFixes(analysisResult: AnalysisResult): Promise<Fix[]> {
  const { data, error } = await supabase.functions.invoke("generate-fixes", {
    body: { analysisResult },
  });

  if (error) throw new Error(error.message || "Fix generation failed");
  if (!data?.success) throw new Error(data?.error || "Fix generation failed");

  return data.fixes.map((f: Fix) => ({ ...f, selected: true, applied: false }));
}
