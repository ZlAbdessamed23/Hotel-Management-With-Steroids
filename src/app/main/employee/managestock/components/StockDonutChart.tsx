"use client"

import { StockDonutChartsDataType, TooltipProps } from '@/app/types/types';
import React from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend } from 'recharts';



interface DonutChartProps {
  data: StockDonutChartsDataType;
};

const COLORS = ['#920B3A', '#00EE43', '#006FEE'];

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
  };
  return null
};


const DonutChart: React.FC<DonutChartProps> = ({ data }) => {

  const chartData = [
    { name: 'Transportation', value: data.value1 },
    { name: 'Achat', value: data.value2 },
  ];

  if(data.value1 > 0 || data.value2 > 0){
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Legend />
          <Pie
            data={chartData}
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <style type="text/css">{`
            .recharts-pie-sector path {
              stroke: #fff;
              stroke-width: 1px;
            }
          `}</style>
        </PieChart>
      </ResponsiveContainer>
    );
  }
  else{
    return(<div>
      <p className='text-2xl font-semibold text-center'>aucun transaction existe pour le moment</p>
    </div>)
  }
 
};

export default DonutChart;