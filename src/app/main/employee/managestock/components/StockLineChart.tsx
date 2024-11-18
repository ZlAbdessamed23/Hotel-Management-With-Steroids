"use client"

import { useTheme } from 'next-themes';
import React from 'react';
import { Chart } from 'react-google-charts';

export interface LineChartProps {
  data: Array<Array<string | number>>;
  title?: string;
  hAxisTitle?: string;
  vAxisTitle?: string;
}

const LineChart: React.FC<LineChartProps> = ({ data, title = "Line Chart", hAxisTitle = "X-axis", vAxisTitle = "Y-axis" }) => {

  const {theme , setTheme} = useTheme();
  const isDarkMode = theme === "dark";


  const options = {
    title: title,
        hAxis: {
          title: hAxisTitle,
          textStyle: { color: isDarkMode ? '#E0E0E0' : '#333333' },
          titleTextStyle: { color: isDarkMode ? '#E0E0E0' : '#333333' },
        },
        vAxis: {
          title: vAxisTitle,
          viewWindow: { min: 0 },
          textStyle: { color: isDarkMode ? '#E0E0E0' : '#333333' },
          titleTextStyle: { color: isDarkMode ? '#E0E0E0' : '#333333' },
        },
        curveType: 'function',
        legend: { 
          position: 'top',
          textStyle: { color: isDarkMode ? '#E0E0E0' : '#333333' },
        },
        colors: ['#4CAF50', '#5B63B7', '#E92E2E'],
        titlePosition: 'none',
        backgroundColor: isDarkMode ? '#1E2A3C' : "#FFFFF",

  };

  return (
    <Chart
      chartType="LineChart"
      width="100%"
      height="400px"
      data={data}
      options={options}
    />
  );
};

export default LineChart;
