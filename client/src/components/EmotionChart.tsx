import { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine 
} from 'recharts';
import { format } from 'date-fns';
import type { Dream } from '@shared/schema';

interface EmotionChartProps {
  dreams: Dream[];
}

export function EmotionChart({ dreams }: EmotionChartProps) {
  const data = useMemo(() => {
    return dreams
      .slice()
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(d => ({
        date: format(new Date(d.date), 'MMM d'),
        score: d.sentimentScore || 0,
        title: d.title
      }));
  }, [dreams]);

  if (data.length < 2) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm italic border border-dashed border-white/10 rounded-xl bg-black/20">
        Not enough data to show trends
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="rgba(255,255,255,0.3)" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.3)" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
            domain={[-100, 100]}
          />
          <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(10, 10, 20, 0.9)', 
              borderColor: 'rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#fff'
            }}
            itemStyle={{ color: '#a78bfa' }}
          />
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke="url(#lineGradient)" 
            strokeWidth={3}
            dot={{ fill: '#1a1a2e', stroke: '#8b5cf6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#fff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
