import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Lightbulb, Zap, Clock, DollarSign, BookOpen } from "lucide-react";

export function PricingExplainer() {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="h-5 w-5 text-primary" />
          How Does Pricing Work?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="simple">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                The Simple Explanation
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <p className="text-sm text-muted-foreground">
                You pay for the text going <strong>into</strong> the AI and the text coming <strong>out</strong>. Text is measured in "tokens" (roughly 4 characters = 1 token).
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="font-medium text-sm mb-2">📥 Input Costs</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Your course materials</li>
                    <li>• System instructions</li>
                    <li>• Student's question</li>
                  </ul>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="font-medium text-sm mb-2">📤 Output Costs</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• AI's answer</li>
                    <li>• This is the expensive part!</li>
                    <li>• Longer answers = higher cost</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="caching">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-accent" />
                What is Caching? (How You Save Money)
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <p className="text-sm text-muted-foreground">
                <strong>Caching</strong> is like the AI "remembering" your course materials so you don't have to send them again.
              </p>

              <div className="bg-accent/10 rounded-lg p-4 border border-accent/30">
                <p className="text-sm">
                  <strong className="text-accent">💡 Example:</strong> If you send the same 10,000-word syllabus with every question, caching means you pay full price once, then get a <strong>90% discount</strong> on the next questions!
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded">1st Question</span>
                  <span className="text-sm text-muted-foreground">Pay 25% extra to "cache" your materials</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-accent/10 text-accent text-xs font-medium px-2 py-1 rounded">2nd+ Questions</span>
                  <span className="text-sm text-muted-foreground">Get 90% off the materials (they're cached!)</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="timing">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                The 5-Minute Rule
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2">
              <p className="text-sm text-muted-foreground">
                The cache only lasts <strong>5 minutes</strong>. If a student waits longer than 5 minutes between questions, the cache expires and you pay full price again.
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Good news:</strong> In a typical study session, students ask multiple questions quickly, so caching works great!
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="minimum">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-warning" />
                Minimum Size for Caching
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2">
              <p className="text-sm text-muted-foreground">
                Claude Haiku 4.5 requires at least <strong>4,096 tokens</strong> (~3,000 words) in your context for caching to work.
              </p>
              <p className="text-sm text-muted-foreground">
                If your course materials are smaller than this, consider adding more context or combining multiple documents to reach the minimum.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="rates">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                Exact Pricing Rates
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Type</th>
                      <th className="text-right py-2 font-medium">Price per 1M tokens</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b">
                      <td className="py-2">Input (standard)</td>
                      <td className="text-right font-mono">$1.00</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Output (AI responses)</td>
                      <td className="text-right font-mono">$5.00</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Cache Write (first time)</td>
                      <td className="text-right font-mono">$1.25</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-accent font-medium">Cache Read (90% off!)</td>
                      <td className="text-right font-mono text-accent">$0.10</td>
                    </tr>
                    <tr>
                      <td className="py-2">Embedding (Cohere v4)</td>
                      <td className="text-right font-mono">$0.12</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
