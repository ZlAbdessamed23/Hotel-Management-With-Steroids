"use client"

import React from 'react';
import { BarChart , Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StockBarChartsDataType, TooltipProps } from '@/app/types/types';



interface BarChartProps {
  data: StockBarChartsDataType[];
}

const COLORS = ['#006FEE', '#EE0000'];

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white w-40 font-segoe p-4 shadow-md rounded-md text-black dark:bg-gray-900 dark:text-white">
        <p className="font-bold">{label}</p>
        {payload.map((item, index) => (
          <p key={index} className={`ml-1 ${COLORS[index]} ${index > 0 ? 'mt-2' : ''}`}>
            {item.name}: {item.value}
          </p>
        ))}
      </div>
    )
  }
  return null
};

const StockBarChart: React.FC<BarChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey="name" tick={false} />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign='top'/>
        <Bar dataKey="value1" name="Budget" barSize={15} fill={COLORS[0]} />
        <Bar dataKey="value2" name="Costs" barSize={15} fill={COLORS[1]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StockBarChart;