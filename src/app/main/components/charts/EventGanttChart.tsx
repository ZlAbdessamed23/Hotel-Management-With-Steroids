"use client"

import React, { useState } from "react";
import dynamic from 'next/dynamic'
import { ReactGoogleChartEvent } from "react-google-charts";
import { EventStage } from "@/app/types/types";
import { useTheme } from "next-themes";

const Chart = dynamic(() => import('react-google-charts').then(mod => mod.Chart), {
  ssr: false,
});

interface GanttChartProps {
  events: EventStage[];
}

const GanttChart: React.FC<GanttChartProps> = ({ events }) => {
  const {theme , setTheme} = useTheme();
  const isDarkMode = theme === "dark";
  const [selectedData, setSelectedData] = useState<EventStage | null>(null);
  
  const colors = ["#f31260", "#006FEE", "#9353d3", "#17c964", "#f5a524"];

  const parseDate = (dateString: string) => {
    // Parse the date string from the format: 2024-09-20T20:03:46.268+01:00[Africa/Lagos]
    const regex = /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3})([-+]\d{2}:\d{2})/;
    const match = dateString.match(regex);
    
    if (match) {
      const [, dateTimePart, offsetPart] = match;
      // Combine date/time and offset, removing the milliseconds
      const dateTimeString = dateTimePart.split('.')[0] + offsetPart;
      return new Date(dateTimeString);
    }
    
    // Fallback to current date if parsing fails
    const date = new Date(dateString);
    return date.getTime() ? date : new Date(); // 
  };

  const chartData = [
    [
      { type: "string", label: "Task ID" },
      { type: "string", label: "Task Name" },
      { type: "string", label: "Resource" },
      { type: "date", label: "Start Date" },
      { type: "date", label: "End Date" },
      { type: "number", label: "Duration" },
      { type: "number", label: "Percent Complete" },
      { type: "string", label: "Dependencies" },
    ],
    ...events.map((event, index) => [
      event.id || `Task_${index + 1}`,
      event.title || `Task ${index + 1}`,
      event.description || "",
      parseDate(event.start.toString()),
      parseDate(event.end.toString()),
      null,
      0,
      null,
    ]),
  ];

  const options = {
    height: 400,
    gantt: {
      trackHeight: 30,
      barHeight: 20,
      criticalPathEnabled: false,
      arrow: {
        angle: 100,
        width: 5,
        color: isDarkMode ? "#a1a1aa" : "#3f3f46",
      },
      palette: colors,
    },
    backgroundColor: isDarkMode ? "#1E2A3C" : "transparent",
    hAxis: {
      format: "MM/dd HH:mm",
      textStyle: {
        color: isDarkMode ? "#e2e8f0" : "#000000",
      },
    },
    vAxis: {
      textStyle: {
        color: isDarkMode ? "#e2e8f0" : "#000000",
      },
    },
    tooltip: {
      textStyle: {
        color: isDarkMode ? "#e2e8f0" : "#000000",
      },
    },
  };

  const chartEvents: ReactGoogleChartEvent[] = [
    {
      eventName: 'select',
      callback: ({ chartWrapper }) => {
        const chart = chartWrapper.getChart();
        const selection = chart.getSelection();
        if (selection.length === 0) return;

        const [selectedItem] = selection;
        const dataTable = chartWrapper.getDataTable();
        if (!dataTable) return;

        const { row } = selectedItem;

        if (row != null) {
          const getValue = (columnIndex: number): string => {
            const value = dataTable.getValue(row, columnIndex);
            return value !== null ? String(value) : '';
          };

          const clickedData: EventStage = {
            id: getValue(0),
            title: getValue(1),
            description: getValue(2),
            start: getValue(3),
            end: getValue(4),
          };
          setSelectedData(clickedData);
        }
      },
    },
  ];

  return (
    <div className="rounded-xl p-4 bg-white shadow-lg dark:bg-slate-800">
      <div className="text-center mb-4">
        <strong>Ligne de Temps</strong>
      </div>
      {events.length > 0 ? (
        <Chart
          chartType="Gantt"
          width="100%"
          height="400px"
          data={chartData}
          options={options}
          chartEvents={chartEvents}
        />
      ) : (
        <div className="text-center py-8 dark:text-white">No events to display</div>
      )}
    </div>
  );
};

export default GanttChart;