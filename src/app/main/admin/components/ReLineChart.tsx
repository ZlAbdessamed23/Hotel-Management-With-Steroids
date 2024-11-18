"use client"

import { StockLineChartDataType } from '@/app/types/types';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';


interface StockLineChartProps {
    data: StockLineChartDataType[];
};

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-gray-300 p-2 shadow-md rounded-md dark:bg-gray-900">
                <p className="font-bold">{`${label}`}</p>
                <p className="text-purple-600">{`Value: ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

const ReLineChart: React.FC<StockLineChartProps> = ({ data }) => {
    return (
        <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid  horizontal={false} vertical={true} stroke="#324B55" strokeWidth={1}  />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#0096C7"
                        strokeWidth={20}
                        strokeOpacity={0.2}
                        dot={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#800080"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{
                            r: 6,
                            fill: "#00F9FF",
                            stroke: "black",
                            strokeWidth: 2
                        }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ReLineChart;