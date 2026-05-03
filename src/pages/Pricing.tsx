import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PricingPage = () => {
  return (
    <AppLayout>
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold">Pricing & Revenue Model</h1>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Plans</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p><span className="font-semibold text-foreground">Free Plan:</span> Basic SEO analysis is free.</p>
            <p><span className="font-semibold text-foreground">Pro Plan:</span> Advanced insights, detailed reports, and tracking.</p>
            <p><span className="font-semibold text-foreground">Premium Plan:</span> Includes one-click optimization (for integrated websites).</p>
            <p><span className="font-semibold text-foreground">API Access:</span> Developers can use SEO analysis via API (paid).</p>
            <p><span className="font-semibold text-foreground">Business Plan:</span> Bulk analysis and features for agencies and startups.</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default PricingPage;