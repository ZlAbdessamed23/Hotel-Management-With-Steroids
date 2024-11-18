import { useTheme } from 'next-themes';
import React from 'react'
import Chart from 'react-google-charts';

interface TaskLineChartDataType {
  data :Array<Array<string | number>>;
  title : string;
};

const TasksLineChart : React.FC<TaskLineChartDataType> = ({data , title}) => {
  const {theme , setTheme} = useTheme();
  const isDarkMode = theme === "dark";

    const options = {
        title: title,
        hAxis: {
          title: "Jours",
          textStyle: { color: isDarkMode ? '#E0E0E0' : '#333333' },
          titleTextStyle: { color: isDarkMode ? '#E0E0E0' : '#333333' },
        },
        vAxis: {
          title: "Nombre",
          viewWindow: { min: 0 },
          textStyle: { color: isDarkMode ? '#E0E0E0' : '#333333' },
          titleTextStyle: { color: isDarkMode ? '#E0E0E0' : '#333333' },
        },
        curveType: 'function',
        legend: { 
          position: 'top',
          textStyle: { color: isDarkMode ? '#E0E0E0' : '#333333' },
        },
        // colors: ['#5B63B7'],
        titlePosition: 'none',
        series: {
          0: { lineWidth: 5 },
        },
        backgroundColor: isDarkMode ? '#1E2A3C' : "#FFFFF",

      };
  return (
    <div className='w-96 overflow-x-scroll sm:w-[36rem] md:w-[45rem] lg:w-[47] xl:w-[49.5rem] rounded-xl sm:overflow-hidden bg-black'>
      <Chart
        chartType="LineChart"
        width="800px"
        height="250px"
        data={data}
        options={options}
      />
    </div>
  )
}


export default TasksLineChart;