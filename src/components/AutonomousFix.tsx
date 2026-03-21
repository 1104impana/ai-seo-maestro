import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { generateFixes, type Fix } from "@/lib/api/fixes";
import type { AnalysisResult } from "@/lib/api/seo";
import {
  Wand2, Copy, Check, Undo2, Eye, Download,
  Zap, AlertTriangle, Info, Loader2,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";

const impactIcons = {
  high: <Zap className="h-3.5 w-3.5" />,
  medium: <AlertTriangle className="h-3.5 w-3.5" />,
  low: <Info className="h-3.5 w-3.5" />,
};

const impactColors = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-info/10 text-info border-info/20",
};

interface AutonomousFixProps {
  analysisResult: AnalysisResult;
}

export function AutonomousFix({ analysisResult }: AutonomousFixProps) {
  const [fixes, setFixes] = useState<Fix[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [appliedFixes, setAppliedFixes] = useState<Fix[]>([]);
  const [previewFix, setPreviewFix] = useState<Fix | null>(null);
  const [changeLog, setChangeLog] = useState<Array<{ fix: Fix; timestamp: Date }>>([]);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generateFixes(analysisResult);
      setFixes(result);
      toast({ title: "Fixes generated", description: `${result.length} fixes ready to apply.` });
    } catch (err: any) {
      toast({ title: "Generation failed", description: err.message, variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleFix = (id: string) => {
    setFixes(prev => prev.map(f => f.id === id ? { ...f, selected: !f.selected } : f));
  };

  const selectAll = () => setFixes(prev => prev.map(f => ({ ...f, selected: true })));
  const deselectAll = () => setFixes(prev => prev.map(f => ({ ...f, selected: false })));

  const applySelected = () => {
    setIsApplying(true);
    const selected = fixes.filter(f => f.selected && !f.applied);
    setTimeout(() => {
      const newApplied = selected.map(f => ({ ...f, applied: true }));
      setAppliedFixes(prev => [...prev, ...newApplied]);
      setChangeLog(prev => [...prev, ...selected.map(f => ({ fix: f, timestamp: new Date() }))]);
      setFixes(prev => prev.map(f => f.selected ? { ...f, applied: true } : f));
      setIsApplying(false);
      toast({ title: "Fixes applied!", description: `${selected.length} fixes applied successfully.` });
    }, 1500);
  };

  const undoFix = (id: string) => {
    setFixes(prev => prev.map(f => f.id === id ? { ...f, applied: false } : f));
    setAppliedFixes(prev => prev.filter(f => f.id !== id));
    setChangeLog(prev => [...prev, {
      fix: { ...fixes.find(f => f.id === id)!, applied: false },
      timestamp: new Date(),
    }]);
    toast({ title: "Fix reverted", description: "Change has been undone." });
  };

  const copyAllFixes = () => {
    const selected = fixes.filter(f => f.selected);
    const code = selected.map(f =>
      `<!-- ${f.category}: ${f.title} -->\n${f.after_code}`
    ).join("\n\n");
    navigator.clipboard.writeText(code);
    toast({ title: "Copied!", description: `${selected.length} fixes copied to clipboard.` });
  };

  const exportFixes = () => {
    const selected = fixes.filter(f => f.selected);
    const report = `# Autonomous Fix Report\n## URL: ${analysisResult.url}\n## Generated: ${new Date().toLocaleString()}\n\n${selected.map(f =>
      `### ${f.category}: ${f.title}\n**Impact:** ${f.impact}\n**Description:** ${f.description}\n\n**Before:**\n\`\`\`html\n${f.before_code || "(new addition)"}\n\`\`\`\n\n**After:**\n\`\`\`html\n${f.after_code}\n\`\`\`\n`
    ).join("\n---\n\n")}`;
    const blob = new Blob([report], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `seo-fixes-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const categories = [...new Set(fixes.map(f => f.category))];
  const selectedCount = fixes.filter(f => f.selected).length;
  const appliedCount = fixes.filter(f => f.applied).length;

  if (fixes.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-12 gap-4">
        <Wand2 className="h-12 w-12 text-primary opacity-60" />
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Autonomous Fix</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            AI will generate concrete code fixes for all detected issues. Preview before applying, undo anytime.
          </p>
        </div>
        <Button onClick={handleGenerate} disabled={isGenerating} size="lg">
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating Fixes…
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4" />
              Generate Fixes
            </>
          )}
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="secondary">{fixes.length} fixes</Badge>
            <Badge variant="outline">{selectedCount} selected</Badge>
            <Badge className="bg-success/10 text-success border-success/20">{appliedCount} applied</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" size="sm" onClick={selectAll}>Select All</Button>
            <Button variant="ghost" size="sm" onClick={deselectAll}>Deselect All</Button>
            <Button variant="outline" size="sm" onClick={copyAllFixes} disabled={selectedCount === 0}>
              <Copy className="h-3.5 w-3.5" /> Copy All
            </Button>
            <Button variant="outline" size="sm" onClick={exportFixes} disabled={selectedCount === 0}>
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
            <Button
              size="sm"
              onClick={applySelected}
              disabled={isApplying || selectedCount === 0 || fixes.filter(f => f.selected && !f.applied).length === 0}
            >
              {isApplying ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Applying…</>
              ) : (
                <><Zap className="h-3.5 w-3.5" /> One-Click Fix ({fixes.filter(f => f.selected && !f.applied).length})</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Fix List by Category */}
      <Tabs defaultValue={categories[0]} className="w-full">
        <TabsList className="w-full justify-start bg-muted/50 flex-wrap h-auto gap-1 p-1">
          {categories.map(cat => (
            <TabsTrigger key={cat} value={cat} className="text-xs">
              {cat} ({fixes.filter(f => f.category === cat).length})
            </TabsTrigger>
          ))}
          {changeLog.length > 0 && (
            <TabsTrigger value="changelog" className="text-xs">
              Change Log ({changeLog.length})
            </TabsTrigger>
          )}
        </TabsList>

        {categories.map(cat => (
          <TabsContent key={cat} value={cat} className="mt-3 space-y-3">
            {fixes.filter(f => f.category === cat).map(fix => (
              <Card key={fix.id} className={`transition-all ${fix.applied ? "border-success/40 bg-success/5" : ""}`}>
                <CardContent className="py-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={fix.selected}
                      onCheckedChange={() => toggleFix(fix.id)}
                      disabled={fix.applied}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">{fix.title}</span>
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${impactColors[fix.impact]}`}>
                          {impactIcons[fix.impact]} {fix.impact}
                        </span>
                        {fix.applied && (
                          <Badge className="bg-success/10 text-success border-success/20 text-[10px]">
                            <Check className="h-3 w-3" /> Applied
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{fix.description}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPreviewFix(fix)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          navigator.clipboard.writeText(fix.after_code);
                          toast({ title: "Copied fix code" });
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      {fix.applied && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => undoFix(fix.id)}>
                          <Undo2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}

        {changeLog.length > 0 && (
          <TabsContent value="changelog" className="mt-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Change Log</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {changeLog.map((entry, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm border-b border-border/50 pb-2 last:border-0">
                    <span className="text-muted-foreground text-xs font-mono">
                      {entry.timestamp.toLocaleTimeString()}
                    </span>
                    <span className={entry.fix.applied ? "text-success" : "text-destructive"}>
                      {entry.fix.applied ? "Applied" : "Reverted"}
                    </span>
                    <span className="font-medium">{entry.fix.title}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Preview Dialog */}
      <Dialog open={!!previewFix} onOpenChange={() => setPreviewFix(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              Preview: {previewFix?.title}
            </DialogTitle>
            <DialogDescription>{previewFix?.description}</DialogDescription>
          </DialogHeader>
          {previewFix && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-destructive uppercase tracking-wider">Before</label>
                <pre className="mt-1 text-xs font-mono bg-destructive/5 border border-destructive/20 rounded-md px-3 py-2 overflow-auto max-h-40 whitespace-pre-wrap">
                  {previewFix.before_code || "(empty — new addition)"}
                </pre>
              </div>
              <div>
                <label className="text-xs font-semibold text-success uppercase tracking-wider">After</label>
                <pre className="mt-1 text-xs font-mono bg-success/5 border border-success/20 rounded-md px-3 py-2 overflow-auto max-h-40 whitespace-pre-wrap">
                  {previewFix.after_code}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
