"use client"

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip,ResponsiveContainer } from 'recharts';

interface BarChartProps {
    data: { name: string; value: number }[];
    title: string;
}

const BarChartComponent: React.FC<BarChartProps> = ({ data, title }) => {
    const CustomBar = (props: any) => {
        const { x, y, width, height } = props;
        return (
            <g>
                <rect x={x} y={y} width={width} height={height} fill="#9353d3" rx={10} ry={10} />
            </g>
        );
    };

    return (
        <div className='font-segoe'>
            <h2 className='text-center text-xl font-semibold mb-4'>{title}</h2>
            <ResponsiveContainer width="100%" height={150}>
                <BarChart data={data} margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false}/>
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="value" shape={<CustomBar />} barSize={15} background={{ fill: '#eee', radius: 100 }} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BarChartComponent;