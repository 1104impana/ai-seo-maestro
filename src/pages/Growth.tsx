import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GrowthPage = () => {
  return (
    <AppLayout>
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold">Growth & Social Media Optimization</h1>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tips</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Share content on platforms like Instagram, LinkedIn, and Twitter.</li>
              <li>Use relevant hashtags to improve visibility.</li>
              <li>Post consistently to build an audience.</li>
              <li>Optimize captions with target keywords.</li>
              <li>Add your website link in your bio.</li>
              <li>Encourage engagement (likes, comments, shares).</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default GrowthPage;