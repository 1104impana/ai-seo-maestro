import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PricingPage = () => {
  return (
    <AppLayout>
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold">Pricing & Plans</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Choose a plan based on your needs. Flexible pricing designed for individuals, developers, and businesses.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Free Plan (Basic) – Best for Beginners</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1.5">
            <p><span className="font-semibold text-foreground">Price:</span> ₹0</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>SEO analysis only</li>
              <li>Limited reports</li>
              <li>No auto-fix feature</li>
              <li>Suitable for beginners</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Starter Plan</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1.5">
            <p><span className="font-semibold text-foreground">Price:</span> ₹599 / month</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>SEO analysis + suggestions</li>
              <li>Limited auto-fix support</li>
              <li>Basic tracking features</li>
              <li>Suitable for small websites</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pro Plan (Recommended)</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1.5">
            <p><span className="font-semibold text-foreground">Price:</span> ₹999 / month</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Full SEO analysis</li>
              <li>Unlimited suggestions</li>
              <li>Full auto-fix capability (for integrated websites)</li>
              <li>Advanced tracking & insights</li>
            </ul>
          </CardContent>
        </Card>

        <p className="text-sm text-muted-foreground">
          Start with the Free Plan and upgrade as your needs grow.
        </p>
      </div>
    </AppLayout>
  );
};

export default PricingPage;