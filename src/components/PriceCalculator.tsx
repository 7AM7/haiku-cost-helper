import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle, Zap, Database, MessageSquare, FileText, ArrowRight, Calculator, Info, AlertTriangle } from "lucide-react";
import { CostBreakdown } from "./CostBreakdown";
import { PricingExplainer } from "./PricingExplainer";

// Pricing constants (USD per token)
const PRICING = {
  embed: 0.12 / 1_000_000,      // $0.12 per M tokens
  input: 1.00 / 1_000_000,      // $1.00 per M tokens
  output: 5.00 / 1_000_000,     // $5.00 per M tokens
  cacheWrite: 1.25 / 1_000_000, // $1.25 per M tokens
  cacheRead: 0.10 / 1_000_000,  // $0.10 per M tokens
};

const MIN_CACHE_TOKENS = 4096;

interface InputFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  tooltip: string;
  icon: React.ReactNode;
  unit?: string;
}

function InputField({ label, value, onChange, min, max, step, tooltip, icon, unit = "tokens" }: InputFieldProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">{icon}</span>
          <Label className="text-sm font-medium">{label}</Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-sm">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <span className="font-mono text-sm font-medium bg-secondary px-2 py-0.5 rounded">
          {value.toLocaleString()} {unit}
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(v) => onChange(v[0])}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{min.toLocaleString()}</span>
        <span>{max.toLocaleString()}</span>
      </div>
    </div>
  );
}

export function PriceCalculator() {
  const [embedTokens, setEmbedTokens] = useState(800);
  const [contextTokens, setContextTokens] = useState(4096);
  const [questionTokens, setQuestionTokens] = useState(200);
  const [outputTokens, setOutputTokens] = useState(200);
  const [numQueries, setNumQueries] = useState(10);

  const costs = useMemo(() => {
    const cachingEnabled = contextTokens >= MIN_CACHE_TOKENS;

    // Embedding cost (one-time)
    const embedCost = PRICING.embed * embedTokens;

    // First query cost
    const firstQueryCacheOrInput = cachingEnabled
      ? PRICING.cacheWrite * contextTokens
      : PRICING.input * contextTokens;
    const firstQueryInput = PRICING.input * questionTokens;
    const firstQueryOutput = PRICING.output * outputTokens;
    const firstQueryCost = firstQueryCacheOrInput + firstQueryInput + firstQueryOutput;

    // Subsequent query cost
    const subsequentCacheOrInput = cachingEnabled
      ? PRICING.cacheRead * contextTokens
      : PRICING.input * contextTokens;
    const subsequentInput = PRICING.input * questionTokens;
    const subsequentOutput = PRICING.output * outputTokens;
    const subsequentQueryCost = subsequentCacheOrInput + subsequentInput + subsequentOutput;

    // Total cost
    const totalCost = embedCost + firstQueryCost + (numQueries - 1) * subsequentQueryCost;

    // Cost per query average
    const costPerQuery = totalCost / numQueries;

    // Without caching comparison
    const withoutCachingPerQuery = PRICING.input * (contextTokens + questionTokens) + PRICING.output * outputTokens;
    const withoutCachingTotal = embedCost + withoutCachingPerQuery * numQueries;
    const savings = withoutCachingTotal - totalCost;
    const savingsPercent = (savings / withoutCachingTotal) * 100;

    return {
      cachingEnabled,
      embedCost,
      firstQueryCost,
      subsequentQueryCost,
      totalCost,
      costPerQuery,
      withoutCachingTotal,
      savings,
      savingsPercent,
      breakdown: {
        embed: embedCost,
        cacheWrite: cachingEnabled ? PRICING.cacheWrite * contextTokens : 0,
        cacheRead: cachingEnabled ? PRICING.cacheRead * contextTokens * (numQueries - 1) : 0,
        inputContext: cachingEnabled ? 0 : PRICING.input * contextTokens * numQueries,
        inputQuestion: PRICING.input * questionTokens * numQueries,
        output: PRICING.output * outputTokens * numQueries,
      }
    };
  }, [embedTokens, contextTokens, questionTokens, outputTokens, numQueries]);

  const formatCost = (cost: number) => {
    if (cost < 0.0001) return `$${cost.toFixed(6)}`;
    if (cost < 0.01) return `$${cost.toFixed(4)}`;
    return `$${cost.toFixed(4)}`;
  };

  const formatCents = (cost: number) => {
    const cents = cost * 100;
    return `${cents.toFixed(2)}¢`;
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            <Calculator className="h-4 w-4" />
            Claude Haiku 4.5 Price Calculator
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Estimate Your AI Costs
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Calculate the cost of running Claude Haiku 4.5 on Amazon Bedrock with prompt caching.
            Adjust the sliders to match your usage pattern.
          </p>
        </div>

        {/* Caching Warning */}
        {contextTokens < MIN_CACHE_TOKENS && (
          <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-warning">Caching Not Available</p>
              <p className="text-sm text-muted-foreground mt-1">
                Claude Haiku 4.5 requires at least {MIN_CACHE_TOKENS.toLocaleString()} tokens in the cached context. 
                Your current context ({contextTokens.toLocaleString()} tokens) will be charged at the standard input rate.
              </p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="shadow-lg border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Configure Your Usage
              </CardTitle>
              <CardDescription>
                Adjust these values to match your typical session
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <InputField
                label="Embed Tokens"
                value={embedTokens}
                onChange={setEmbedTokens}
                min={0}
                max={10000}
                step={100}
                tooltip="Number of tokens in new documents you need to embed. This is a one-time cost when adding new content to your knowledge base."
                icon={<Database className="h-4 w-4" />}
              />

              <InputField
                label="Cached Context"
                value={contextTokens}
                onChange={setContextTokens}
                min={0}
                max={50000}
                step={512}
                tooltip={`System prompt + document snippets that stay the same across queries. Must be at least ${MIN_CACHE_TOKENS.toLocaleString()} tokens to enable caching.`}
                icon={<FileText className="h-4 w-4" />}
              />

              <InputField
                label="Question Tokens"
                value={questionTokens}
                onChange={setQuestionTokens}
                min={10}
                max={2000}
                step={10}
                tooltip="Average number of tokens in each user question. These are not cached and charged at full input rate."
                icon={<MessageSquare className="h-4 w-4" />}
              />

              <InputField
                label="Output Tokens"
                value={outputTokens}
                onChange={setOutputTokens}
                min={50}
                max={4000}
                step={50}
                tooltip="Average number of tokens in the AI's response. Output tokens are the most expensive part."
                icon={<ArrowRight className="h-4 w-4" />}
              />

              <InputField
                label="Number of Queries"
                value={numQueries}
                onChange={setNumQueries}
                min={1}
                max={100}
                step={1}
                tooltip="How many questions a user asks within a 5-minute cache window. More queries = more savings from caching."
                icon={<Zap className="h-4 w-4" />}
                unit="queries"
              />
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Total Cost Card */}
            <Card className="shadow-lg border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Total Session Cost
                  </p>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold text-primary font-mono">
                      {formatCents(costs.totalCost)}
                    </span>
                    <span className="text-lg text-muted-foreground">
                      ({formatCost(costs.totalCost)})
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    for {numQueries} {numQueries === 1 ? 'query' : 'queries'}
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-card rounded-lg p-4 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Per Query Average
                    </p>
                    <p className="text-xl font-bold font-mono">
                      {formatCents(costs.costPerQuery)}
                    </p>
                  </div>
                  <div className="bg-card rounded-lg p-4 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      {costs.cachingEnabled ? 'Cache Savings' : 'No Savings'}
                    </p>
                    <p className={`text-xl font-bold font-mono ${costs.savingsPercent > 0 ? 'text-accent' : 'text-muted-foreground'}`}>
                      {costs.savingsPercent > 0 ? `${costs.savingsPercent.toFixed(1)}%` : '0%'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cost Breakdown */}
            <CostBreakdown 
              breakdown={costs.breakdown} 
              cachingEnabled={costs.cachingEnabled}
              totalCost={costs.totalCost}
            />

            {/* Quick Stats */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">First query:</span>
                    <span className="font-mono font-medium">{formatCost(costs.firstQueryCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Each additional:</span>
                    <span className="font-mono font-medium">{formatCost(costs.subsequentQueryCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Without caching:</span>
                    <span className="font-mono font-medium">{formatCost(costs.withoutCachingTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">You save:</span>
                    <span className="font-mono font-medium text-accent">{formatCost(costs.savings)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* How It Works Section */}
        <PricingExplainer />
      </div>
    </div>
  );
}
