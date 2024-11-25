"use client"

import { StockLineChartDataType } from '@/app/types/types';
import React from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white w-40 font-segoe p-4 shadow-md rounded-md text-black dark:bg-gray-900 dark:text-white">
        <p className="font-bold">{label}</p>
        <p className="ml-1 text-blue-400">
          {payload[0].name}: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

interface ReAreaChartProps {
  title: string;
  data: StockLineChartDataType[];
}

export default function ReAreaChart({ title, data }: ReAreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height="95%" className="bg-white dark:bg-slate-800 rounded-xl">
      <AreaChart data={data}>
        <Legend
          wrapperStyle={{
            position: "absolute",
            top: -30,
            left: -220,
          }}
          className="text-sm font-segoe"
          payload={[
            { value: title, type: 'circle' as const, color: '#5DAAEE' },
          ]}
        />
        <Tooltip content={<CustomTooltip />} />
        <XAxis dataKey="name" axisLine={false} tickLine={false} />
        <YAxis axisLine={false} tickLine={false} />
        <CartesianGrid strokeDasharray="5 5" stroke='#334E6840' />
        <defs>
          <linearGradient id="gradient1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5DAAEE" stopOpacity={1} />
            <stop offset="100%" stopColor="#5DAAEE" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          dataKey="value"
          fill="url(#gradient1)"
          stroke="transparent"
          type="monotone"
          activeDot={{ stroke: '#006FEE', strokeWidth: 2, r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}