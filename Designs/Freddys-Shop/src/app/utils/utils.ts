import { SalesOverTimePeriod, Revenue } from '../types/types';

//to get from 1 to 12
export function getLastMonth(): number {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();

  let lastMonth = currentMonth - 1;
  if (lastMonth < 0) {
    lastMonth = 11;
  }

  return lastMonth + 1;
}

//to get from 1 to 7
export function getCurrentWeekDayNumber(): number {
  const currentDate = new Date();
  const day = currentDate.getDay();
  return day === 0 ? 7 : day;
}

export function calculateTotals(data: SalesOverTimePeriod): Revenue {
  let orders = 0;
  let total = 0;

  for (const day in data) {
    orders += data[day].orders;
    total += data[day].total;
  }

  return {
    orders,
    total
  };
}
