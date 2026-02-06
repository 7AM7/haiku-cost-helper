import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CostBreakdownProps {
  breakdown: {
    embed: number;
    cacheWrite: number;
    cacheRead: number;
    inputContext: number;
    inputQuestion: number;
    output: number;
  };
  cachingEnabled: boolean;
  totalCost: number;
}

export function CostBreakdown({ breakdown, cachingEnabled, totalCost }: CostBreakdownProps) {
  const formatCost = (cost: number) => {
    if (cost < 0.01) return `$${cost.toFixed(4)}`;
    return `$${cost.toFixed(2)}`;
  };

  const items = [
    { 
      name: "AI Responses", 
      value: breakdown.output, 
      color: "bg-rose-500",
      description: "Output tokens"
    },
    ...(cachingEnabled 
      ? [
          { 
            name: "Cache Setup", 
            value: breakdown.cacheWrite, 
            color: "bg-blue-500",
            description: "First-time cache write"
          },
          { 
            name: "Cached Reads", 
            value: breakdown.cacheRead, 
            color: "bg-emerald-500",
            description: "90% discounted!"
          },
        ]
      : [
          { 
            name: "Context Input", 
            value: breakdown.inputContext, 
            color: "bg-blue-500",
            description: "No caching"
          },
        ]
    ),
    { 
      name: "Questions", 
      value: breakdown.inputQuestion, 
      color: "bg-indigo-500",
      description: "Student questions"
    },
    { 
      name: "Embedding", 
      value: breakdown.embed, 
      color: "bg-purple-500",
      description: "One-time setup"
    },
  ].filter(item => item.value > 0.0001);

  // Sort by value descending
  items.sort((a, b) => b.value - a.value);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Where Does the Money Go?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Simple bar visualization */}
        <div className="h-4 rounded-full overflow-hidden flex bg-secondary">
          {items.map((item, index) => (
            <div
              key={index}
              className={`${item.color} transition-all`}
              style={{ width: `${(item.value / totalCost) * 100}%` }}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded ${item.color}`} />
                <span>{item.name}</span>
                <span className="text-xs text-muted-foreground">({item.description})</span>
              </div>
              <span className="font-mono text-muted-foreground">
                {formatCost(item.value)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
