import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle, Users, MessageSquare, FileText, Calculator, AlertTriangle, DollarSign, TrendingDown } from "lucide-react";
import { CostBreakdown } from "./CostBreakdown";
import { PricingExplainer } from "./PricingExplainer";

// Pricing constants (USD per token)
const PRICING = {
  embed: 0.12 / 1_000_000,
  input: 1.00 / 1_000_000,
  output: 5.00 / 1_000_000,
  cacheWrite: 1.25 / 1_000_000,
  cacheRead: 0.10 / 1_000_000,
};

const MIN_CACHE_TOKENS = 4096;

interface InputFieldProps {
  label: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  icon: React.ReactNode;
  unit?: string;
  highlight?: boolean;
}

function InputField({ label, description, value, onChange, min, max, step, icon, unit = "tokens", highlight }: InputFieldProps) {
  return (
    <div className={`p-4 rounded-xl transition-all ${highlight ? 'bg-primary/5 border-2 border-primary/20' : 'bg-secondary/30'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            {icon}
          </div>
          <div>
            <Label className="text-base font-semibold">{label}</Label>
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="font-mono text-lg font-bold text-primary">
            {value.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground ml-1">{unit}</span>
        </div>
      </div>
      <Slider
        value={[value]}
        onValueChange={(v) => onChange(v[0])}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground mt-2">
        <span>{min.toLocaleString()}</span>
        <span>{max.toLocaleString()}</span>
      </div>
    </div>
  );
}

export function PriceCalculator() {
  const [numStudents, setNumStudents] = useState(100);
  const [contextTokens, setContextTokens] = useState(4096);
  const [numQueries, setNumQueries] = useState(10);
  const [outputTokens, setOutputTokens] = useState(200);

  // Fixed reasonable defaults
  const embedTokens = 800;
  const questionTokens = 200;

  const costs = useMemo(() => {
    const cachingEnabled = contextTokens >= MIN_CACHE_TOKENS;

    // Per student calculations
    const embedCost = PRICING.embed * embedTokens;

    const firstQueryCacheOrInput = cachingEnabled
      ? PRICING.cacheWrite * contextTokens
      : PRICING.input * contextTokens;
    const firstQueryInput = PRICING.input * questionTokens;
    const firstQueryOutput = PRICING.output * outputTokens;
    const firstQueryCost = firstQueryCacheOrInput + firstQueryInput + firstQueryOutput;

    const subsequentCacheOrInput = cachingEnabled
      ? PRICING.cacheRead * contextTokens
      : PRICING.input * contextTokens;
    const subsequentInput = PRICING.input * questionTokens;
    const subsequentOutput = PRICING.output * outputTokens;
    const subsequentQueryCost = subsequentCacheOrInput + subsequentInput + subsequentOutput;

    // Per student cost
    const perStudentCost = embedCost + firstQueryCost + (numQueries - 1) * subsequentQueryCost;

    // Total for all students
    const totalCost = perStudentCost * numStudents;

    // Without caching comparison
    const withoutCachingPerQuery = PRICING.input * (contextTokens + questionTokens) + PRICING.output * outputTokens;
    const withoutCachingPerStudent = embedCost + withoutCachingPerQuery * numQueries;
    const withoutCachingTotal = withoutCachingPerStudent * numStudents;
    const savings = withoutCachingTotal - totalCost;
    const savingsPercent = (savings / withoutCachingTotal) * 100;

    return {
      cachingEnabled,
      perStudentCost,
      totalCost,
      withoutCachingTotal,
      savings,
      savingsPercent,
      breakdown: {
        embed: embedCost * numStudents,
        cacheWrite: cachingEnabled ? PRICING.cacheWrite * contextTokens * numStudents : 0,
        cacheRead: cachingEnabled ? PRICING.cacheRead * contextTokens * (numQueries - 1) * numStudents : 0,
        inputContext: cachingEnabled ? 0 : PRICING.input * contextTokens * numQueries * numStudents,
        inputQuestion: PRICING.input * questionTokens * numQueries * numStudents,
        output: PRICING.output * outputTokens * numQueries * numStudents,
      }
    };
  }, [contextTokens, outputTokens, numQueries, numStudents]);

  const formatDollars = (cost: number) => {
    if (cost < 0.01) return `$${cost.toFixed(4)}`;
    if (cost < 1) return `$${cost.toFixed(2)}`;
    return `$${cost.toFixed(2)}`;
  };

  const formatCents = (cost: number) => {
    const cents = cost * 100;
    if (cents < 1) return `${cents.toFixed(2)}¢`;
    return `${cents.toFixed(1)}¢`;
  };

  return (
    <div className="min-h-screen bg-background py-6 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            <Calculator className="h-4 w-4" />
            AI Cost Calculator
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            How much will Claude Haiku 4.5 cost?
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm">
            Estimate your costs for running an AI-powered learning assistant. Adjust the sliders below.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Inputs - Left Side */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Your Setup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InputField
                  label="Number of Students"
                  description="How many students will use the AI?"
                  value={numStudents}
                  onChange={setNumStudents}
                  min={1}
                  max={1000}
                  step={1}
                  icon={<Users className="h-5 w-5" />}
                  unit="students"
                  highlight
                />

                <InputField
                  label="Questions per Student"
                  description="Average questions each student asks per session"
                  value={numQueries}
                  onChange={setNumQueries}
                  min={1}
                  max={50}
                  step={1}
                  icon={<MessageSquare className="h-5 w-5" />}
                  unit="questions"
                />

                <InputField
                  label="Document Context Size"
                  description="Size of course materials sent to AI (system prompt + docs)"
                  value={contextTokens}
                  onChange={setContextTokens}
                  min={500}
                  max={50000}
                  step={500}
                  icon={<FileText className="h-5 w-5" />}
                  unit="tokens"
                />

                <InputField
                  label="Answer Length"
                  description="How long should AI responses be?"
                  value={outputTokens}
                  onChange={setOutputTokens}
                  min={50}
                  max={2000}
                  step={50}
                  icon={<MessageSquare className="h-5 w-5" />}
                  unit="tokens"
                />
              </CardContent>
            </Card>

            {/* Caching Notice */}
            {contextTokens < MIN_CACHE_TOKENS && (
              <div className="bg-warning/10 border border-warning/30 rounded-lg p-3 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-warning">Caching needs 4,096+ tokens</p>
                  <p className="text-muted-foreground mt-0.5">
                    Increase your context to enable cost savings from caching.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Results - Right Side */}
          <div className="lg:col-span-2 space-y-4">
            {/* Total Cost */}
            <Card className="shadow-lg border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Total Cost
                  </p>
                  <div className="flex items-baseline justify-center gap-1">
                    <DollarSign className="h-8 w-8 text-primary" />
                    <span className="text-5xl font-bold text-primary font-mono">
                      {costs.totalCost < 1 
                        ? costs.totalCost.toFixed(2) 
                        : costs.totalCost.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    for {numStudents.toLocaleString()} students × {numQueries} questions each
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Per Student Cost */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-secondary/50 rounded-lg">
                    <p className="text-xs text-muted-foreground uppercase mb-1">Per Student</p>
                    <p className="text-2xl font-bold font-mono text-primary">
                      {formatCents(costs.perStudentCost)}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-accent/10 rounded-lg">
                    <p className="text-xs text-muted-foreground uppercase mb-1">You Save</p>
                    <p className="text-2xl font-bold font-mono text-accent">
                      {costs.savingsPercent > 0 ? `${costs.savingsPercent.toFixed(0)}%` : '—'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Simple Breakdown */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingDown className="h-4 w-4" />
                  Cost Comparison
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">With caching:</span>
                  <span className="font-mono font-bold text-primary">{formatDollars(costs.totalCost)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Without caching:</span>
                  <span className="font-mono text-muted-foreground line-through">{formatDollars(costs.withoutCachingTotal)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="text-sm font-medium">Your savings:</span>
                  <span className="font-mono font-bold text-accent">{formatDollars(costs.savings)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Visual Breakdown */}
            <CostBreakdown 
              breakdown={costs.breakdown} 
              cachingEnabled={costs.cachingEnabled}
              totalCost={costs.totalCost}
            />
          </div>
        </div>

        {/* How It Works */}
        <PricingExplainer />
      </div>
    </div>
  );
}
