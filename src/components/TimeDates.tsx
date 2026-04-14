import React, { useState } from 'react';

export default function TimeDates() {
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const calculateDifference = () => {
    if (!startDate || !endDate) return null;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Swap if start > end
    const isNegative = start > end;
    const d1 = isNegative ? end : start;
    const d2 = isNegative ? start : end;

    let years = d2.getFullYear() - d1.getFullYear();
    let months = d2.getMonth() - d1.getMonth();
    let days = d2.getDate() - d1.getDate();

    if (days < 0) {
      months -= 1;
      // Get days in previous month
      const prevMonth = new Date(d2.getFullYear(), d2.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const totalDays = Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));

    return { years, months, days, totalDays, isNegative };
  };

  const diff = calculateDifference();

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      {diff && (
        <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-md space-y-6">
          <div className="text-center">
            <div className="text-blue-100 text-sm mb-2">Difference</div>
            <div className="flex justify-center items-baseline gap-2">
              {diff.years > 0 && (
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-semibold">{diff.years}</span>
                  <span className="text-xs text-blue-200 uppercase tracking-wider">Years</span>
                </div>
              )}
              {diff.years > 0 && <span className="text-blue-300">,</span>}
              
              {(diff.months > 0 || diff.years > 0) && (
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-semibold">{diff.months}</span>
                  <span className="text-xs text-blue-200 uppercase tracking-wider">Months</span>
                </div>
              )}
              {(diff.months > 0 || diff.years > 0) && <span className="text-blue-300">,</span>}
              
              <div className="flex flex-col items-center">
                <span className="text-3xl font-semibold">{diff.days}</span>
                <span className="text-xs text-blue-200 uppercase tracking-wider">Days</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-blue-500/50 w-full"></div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-blue-100">Total Days</span>
            <span className="font-medium bg-blue-500/50 px-3 py-1 rounded-md">{diff.totalDays} days</span>
          </div>
        </div>
      )}
    </div>
  );
}
