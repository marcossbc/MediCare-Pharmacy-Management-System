'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface CategoryChartProps {
  data: { category: string; value: number }[];
}

const COLORS = ['#1fa571', '#2563eb', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function CategoryChart({ data }: CategoryChartProps) {
  if (!data.length) {
    return (
      <div className="flex h-[260px] items-center justify-center text-sm text-gray-400">
        No product data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="category"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="none" />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: 'none',
            fontSize: 12,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
