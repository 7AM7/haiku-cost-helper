import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Info, ArrowRight, Repeat, DollarSign, Zap, Clock } from "lucide-react";

export function PricingExplainer() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          How Pricing Works
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pricing">Pricing Table</TabsTrigger>
            <TabsTrigger value="formulas">Formulas</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            {/* Simple explanation */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  What You Pay For
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="cost-badge cost-badge-embed flex-shrink-0">Embed</span>
                    <span>One-time cost to add documents to your knowledge base</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="cost-badge cost-badge-input flex-shrink-0">Input</span>
                    <span>Every token sent to the model (context + your question)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="cost-badge cost-badge-output flex-shrink-0">Output</span>
                    <span>Every token the AI generates in its response</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Zap className="h-4 w-4 text-accent" />
                  How Caching Saves Money
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="cost-badge cost-badge-cache-write flex-shrink-0">Cache Write</span>
                    <span>First query pays 25% extra to cache the context</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="cost-badge cost-badge-cache-read flex-shrink-0">Cache Read</span>
                    <span>Following queries get 90% discount on cached context!</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Visual flow */}
            <div className="bg-secondary/50 rounded-lg p-6 mt-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Session Flow (5-minute cache window)
              </h3>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex-1 bg-card rounded-lg p-4 border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">First Query</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="cost-badge cost-badge-cache-write">Cache Write</span>
                    <span className="cost-badge cost-badge-input">Question</span>
                    <span className="cost-badge cost-badge-output">Answer</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Pays 25% premium to cache context</p>
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground hidden md:block" />
                <Repeat className="h-6 w-6 text-muted-foreground md:hidden" />
                <div className="flex-1 bg-card rounded-lg p-4 border border-accent/30">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Queries 2, 3, 4...</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="cost-badge cost-badge-cache-read">Cache Read</span>
                    <span className="cost-badge cost-badge-input">Question</span>
                    <span className="cost-badge cost-badge-output">Answer</span>
                  </div>
                  <p className="text-sm text-accent mt-2">Gets 90% discount on context!</p>
                </div>
              </div>
            </div>

            {/* Key requirement */}
            <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
              <p className="font-medium text-warning">⚠️ Minimum for Caching</p>
              <p className="text-sm text-muted-foreground mt-1">
                Claude Haiku 4.5 requires at least <strong>4,096 tokens</strong> in the cached context for caching to work.
                Smaller contexts are charged at the standard input rate.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Per 1K Tokens</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <span className="cost-badge cost-badge-embed">Embedding</span>
                  </TableCell>
                  <TableCell className="font-mono">$0.12 / M</TableCell>
                  <TableCell className="font-mono">$0.00012</TableCell>
                  <TableCell className="text-sm text-muted-foreground">Cohere Embed v4</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <span className="cost-badge cost-badge-input">Input</span>
                  </TableCell>
                  <TableCell className="font-mono">$1.00 / M</TableCell>
                  <TableCell className="font-mono">$0.001</TableCell>
                  <TableCell className="text-sm text-muted-foreground">Standard input rate</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <span className="cost-badge cost-badge-output">Output</span>
                  </TableCell>
                  <TableCell className="font-mono">$5.00 / M</TableCell>
                  <TableCell className="font-mono">$0.005</TableCell>
                  <TableCell className="text-sm text-muted-foreground">Generated tokens</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <span className="cost-badge cost-badge-cache-write">Cache Write</span>
                  </TableCell>
                  <TableCell className="font-mono">$1.25 / M</TableCell>
                  <TableCell className="font-mono">$0.00125</TableCell>
                  <TableCell className="text-sm text-muted-foreground">25% premium over input</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <span className="cost-badge cost-badge-cache-read">Cache Read</span>
                  </TableCell>
                  <TableCell className="font-mono">$0.10 / M</TableCell>
                  <TableCell className="font-mono">$0.0001</TableCell>
                  <TableCell className="text-sm text-accent font-medium">90% discount!</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="formulas" className="mt-6 space-y-6">
            <div className="space-y-4">
              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Embedding Cost (one-time)</h4>
                <code className="text-sm bg-card px-2 py-1 rounded">
                  C_embed = $0.00000012 × T_embed
                </code>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">First Query Cost (with caching)</h4>
                <code className="text-sm bg-card px-2 py-1 rounded block">
                  C_first = ($0.00000125 × T_context) + ($0.000001 × T_question) + ($0.000005 × T_output)
                </code>
                <p className="text-sm text-muted-foreground mt-2">
                  Context is charged at cache-write rate (25% more than input)
                </p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Subsequent Query Cost (with caching)</h4>
                <code className="text-sm bg-card px-2 py-1 rounded block">
                  C_next = ($0.0000001 × T_context) + ($0.000001 × T_question) + ($0.000005 × T_output)
                </code>
                <p className="text-sm text-accent mt-2">
                  Context is charged at cache-read rate (90% cheaper!)
                </p>
              </div>

              <div className="bg-primary/10 rounded-lg p-4 border border-primary/30">
                <h4 className="font-semibold mb-2">Total Session Cost</h4>
                <code className="text-sm bg-card px-2 py-1 rounded block">
                  C_total = C_embed + C_first + (num_queries - 1) × C_next
                </code>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              <p><strong>Variables:</strong></p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>T_embed</strong> – tokens of new content to embed</li>
                <li><strong>T_context</strong> – cached context tokens (system prompt + documents)</li>
                <li><strong>T_question</strong> – tokens in the user's question</li>
                <li><strong>T_output</strong> – tokens generated per response</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
