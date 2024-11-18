"use client"


import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend} from 'recharts';
import { Card } from '@nextui-org/react';

export type DataPoint = {
  name: string;
  value1: number;
  value2: number;
  value3: number;
};


interface TooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
  }>
  label?: string
}

const CustomizedDot: React.FC<any> = (props) => {
  const { cx, cy, stroke, payload, value } = props;

  return (
    <g>
      <circle cx={cx} cy={cy} r={4} stroke={stroke} strokeWidth={3} fill="#fff" />
      <circle 
        cx={cx} 
        cy={cy} 
        r={10} 
        fill={`${stroke}33`}
        filter="url(#glow)" 
      />
    </g>
  );
};

const colors = ["text-blue-400" , "text-purple-400"];

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white w-40 font-segoe p-4 shadow-md rounded-md text-black dark:bg-slate-800 dark:text-white">
        <p className="font-bold">{label}</p>
        {payload.map((item, index) => (
          <p key={index} className={`ml-1 ${colors[index]} ${index > 0 ? 'mt-2' : ''}`}>
            {item.name}: {item.value}
          </p>
        ))}
      </div>
    )
  }

  return null
}

const ReGlowingLineChart: React.FC<{data : DataPoint[]}> = ({data}) => {
  const lines = [
    { dataKey: 'value1', stroke: '#006FEE', name: 'Clients' },
    { dataKey: 'value2', stroke: '#7828C8', name: 'Stock' },
    { dataKey: 'value3', stroke: '#F31260', name: 'Sum' },
  ];

  return (
    <Card className="w-full h-96 p-4 bg-white dark:bg-slate-700">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="name" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip 
            // contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: 'none' }}
            // itemStyle={{ color: '#fff' }}
            content={<CustomTooltip />}
          />
          <Legend />
          <defs>
            {lines.map(({ dataKey, stroke }) => (
              <React.Fragment key={dataKey}>
                <filter id={`glow-${dataKey}`} x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                  <feColorMatrix
                    in="blur"
                    type="matrix"
                    values="0 0 0 0 0
                            0 0 0 0 0
                            0 0 0 0 0
                            0 0 0 0.5 0"
                    result="glow"
                  />
                  <feBlend in="SourceGraphic" in2="glow" mode="normal" />
                </filter>
              </React.Fragment>
            ))}
          </defs>
          {lines.map(({ dataKey, stroke, name }) => (
            <Line 
              key={dataKey}
              type="monotone" 
              dataKey={dataKey} 
              stroke={stroke}
              strokeWidth={2}
              strokeOpacity={0.6}
              name={name}
              dot={<CustomizedDot />}
              activeDot={{ r: 3, fill: '#FFF', filter: `url(#glow-${dataKey})` }}
              className={`glow-line-${dataKey}`}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <style jsx>{`
        ${lines.map(({ dataKey, stroke }) => `
          .glow-line-${dataKey} {
            filter: drop-shadow(0 0 10px ${stroke}) 
                    drop-shadow(0 0 20px ${stroke}) 
                    drop-shadow(0 0 30px ${stroke});
          }
        `).join('\n')}
      `}</style>
    </Card>
  );
};

export default ReGlowingLineChart;