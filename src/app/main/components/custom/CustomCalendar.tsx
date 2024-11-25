import React, { useState, useRef } from 'react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import styles from '@/app/main/styles/CustomCalendar.module.css';
import { IoMdArrowDropdown } from "react-icons/io";

interface CustomCalendarProps {
  onDateSelect?: (date: Date) => void;
  startDate?: Date;
  endDate?: Date;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({ onDateSelect, startDate, endDate }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekdays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleMonthChange = (key: React.Key) => {
    setCurrentDate(new Date(currentDate.getFullYear(), Number(key), 1));
  };

  const handleYearChange = (key: React.Key) => {
    setCurrentDate(new Date(Number(key), currentDate.getMonth(), 1));
  };

  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const isStartDate = (date: Date): boolean => {
    return startDate ? date.toDateString() === startDate.toDateString() : false;
  };

  const isEndDate = (date: Date): boolean => {
    return endDate ? date.toDateString() === endDate.toDateString() : false;
  };

  const renderCalendarDays = (): JSX.Element[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const days: JSX.Element[] = [];

    for (let i = 0; i < daysInMonth; i++) {
      const dayIndex = (i + firstDayOfMonth) % 7;
      const dayNumber = i + 1;
      const currentDay = new Date(year, month, dayNumber);
      const isStart = isStartDate(currentDay);
      const isEnd = isEndDate(currentDay);

      days.push(
        <div
          key={i}
          className={`${styles.dayColumn} ${isStart ? styles.startDate : ''} ${isEnd ? styles.endDate : ''}`}
        >
          <div className={styles.dayName}>{weekdays[dayIndex]}</div>
          <div className={styles.dayNumber}>{dayNumber}</div>
        </div>
      );
    }

    return days;
  };

  const generateYearOptions = (): number[] => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  return (
    <div className={`font-poppins ${styles.customCalendar} dark:!bg-slate-800 dark:!text-white`}>
      <div className={styles.calendarHeader}>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="flat" className='text-gray-900 font-semibold text-xl bg-transparent dark:text-white' endContent={<IoMdArrowDropdown className='size-5' />}>
              {months[currentDate.getMonth()]}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Month selection"
            onAction={(key) => handleMonthChange(key)}
          >
            {months.map((month, index) => (
              <DropdownItem key={index}>{month}</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>

        <Dropdown>
          <DropdownTrigger>
            <Button variant="flat" className='text-gray-900 font-semibold text-xl bg-transparent dark:text-white' endContent={<IoMdArrowDropdown className='size-5' />}>
              {currentDate.getFullYear()}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Year selection"
            onAction={(key) => handleYearChange(key)}
          >
            {generateYearOptions().map((year) => (
              <DropdownItem key={year}>{year}</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
      <div
        className={styles.calendarGrid}
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {renderCalendarDays()}
      </div>
    </div>
  );
};

export default CustomCalendar;