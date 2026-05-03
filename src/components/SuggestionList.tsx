import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

export interface Suggestion {
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  category: string;
  what_is_wrong?: string;
  why_it_matters?: string;
  how_to_fix?: string;
}

const impactColors = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-info/10 text-info border-info/20",
};

export function SuggestionCard({ suggestion }: { suggestion: Suggestion }) {
  return (
    <Card className="transition-all hover:shadow-lg hover:-translate-y-0.5">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-primary shrink-0" />
            <CardTitle className="text-sm font-semibold">{suggestion.title}</CardTitle>
          </div>
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${impactColors[suggestion.impact]}`}>
            {suggestion.impact}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm leading-relaxed">{suggestion.description}</CardDescription>
        {(suggestion.what_is_wrong || suggestion.why_it_matters || suggestion.how_to_fix) && (
          <div className="mt-3 space-y-1.5 text-xs leading-relaxed border-l-2 border-primary/30 pl-3">
            {suggestion.what_is_wrong && (
              <p><span className="font-semibold">Issue:</span> {suggestion.what_is_wrong}</p>
            )}
            {suggestion.why_it_matters && (
              <p><span className="font-semibold">Why it matters:</span> {suggestion.why_it_matters}</p>
            )}
            {suggestion.how_to_fix && (
              <p><span className="font-semibold">Fix:</span> {suggestion.how_to_fix}</p>
            )}
          </div>
        )}
        <span className="mt-3 inline-block rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">
          {suggestion.category}
        </span>
      </CardContent>
    </Card>
  );
}

export function SuggestionList({ suggestions }: { suggestions: Suggestion[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {suggestions.map((s, i) => (
        <div key={i} className={`animate-in-up-delay-${Math.min(i, 4)}`}>
          <SuggestionCard suggestion={s} />
        </div>
      ))}
    </div>
  );
}
