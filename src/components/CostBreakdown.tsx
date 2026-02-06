import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

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
    if (cost < 0.0001) return `$${cost.toFixed(6)}`;
    if (cost < 0.01) return `$${cost.toFixed(4)}`;
    return `$${cost.toFixed(4)}`;
  };

  const data = [
    { name: "Embedding", value: breakdown.embed, color: "hsl(280, 65%, 55%)" },
    ...(cachingEnabled 
      ? [
          { name: "Cache Write", value: breakdown.cacheWrite, color: "hsl(200, 85%, 50%)" },
          { name: "Cache Read", value: breakdown.cacheRead, color: "hsl(168, 75%, 42%)" },
        ]
      : [
          { name: "Context Input", value: breakdown.inputContext, color: "hsl(220, 70%, 55%)" },
        ]
    ),
    { name: "Question Input", value: breakdown.inputQuestion, color: "hsl(220, 70%, 65%)" },
    { name: "Output", value: breakdown.output, color: "hsl(340, 75%, 55%)" },
  ].filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const percentage = ((item.value / totalCost) * 100).toFixed(1);
      return (
        <div className="bg-card border rounded-lg shadow-lg p-3">
          <p className="font-medium">{item.name}</p>
          <p className="text-sm text-muted-foreground">
            {formatCost(item.value)} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Cost Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                formatter={(value, entry: any) => (
                  <span className="text-sm text-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* List breakdown */}
        <div className="mt-4 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-muted-foreground">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono">{formatCost(item.value)}</span>
                <span className="text-muted-foreground text-xs">
                  ({((item.value / totalCost) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
