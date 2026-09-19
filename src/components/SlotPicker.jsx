import React, { useState, useMemo } from 'react';
import { format, addDays, parseISO } from 'date-fns';
import { Calendar, Clock, Sun, Moon, CheckCircle2, AlertCircle } from 'lucide-react';

export const SlotPicker = ({ timeSlots = [], selectedSlot, onSelectSlot }) => {
  // Generate 7 days starting from today
  const dateTabs = useMemo(() => {
    const list = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const d = addDays(now, i);
      const dateStr = format(d, 'yyyy-MM-dd');
      list.push({
        dateStr,
        dayName: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : format(d, 'EEE'),
        dayNumber: format(d, 'd'),
        monthName: format(d, 'MMM'),
      });
    }
    return list;
  }, []);

  const [selectedDate, setSelectedDate] = useState(dateTabs[0].dateStr);

  // Filter slots for currently selected date
  const currentSlots = useMemo(() => {
    return timeSlots.filter((s) => s.date === selectedDate);
  }, [timeSlots, selectedDate]);

  // Separate into Morning and Afternoon/Evening
  const morningSlots = currentSlots.filter((s) => s.startTime.includes('AM'));
  const afternoonSlots = currentSlots.filter((s) => s.startTime.includes('PM'));

  return (
    <div className="space-y-6">
      {/* Date Selector Tabs */}
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-teal-600" />
          Select Consultation Date
        </label>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {dateTabs.map((tab) => {
            const isSelected = selectedDate === tab.dateStr;
            const availableCount = timeSlots.filter(
              (s) => s.date === tab.dateStr && !s.isBooked
            ).length;

            return (
              <button
                key={tab.dateStr}
                type="button"
                onClick={() => {
                  setSelectedDate(tab.dateStr);
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-600 shadow-md scale-102'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-teal-300 hover:bg-slate-50'
                }`}
              >
                <span className={`text-[11px] font-bold ${isSelected ? 'text-teal-100' : 'text-slate-500'}`}>
                  {tab.dayName}
                </span>
                <span className="text-lg font-extrabold my-0.5">{tab.dayNumber}</span>
                <span className={`text-[10px] font-medium ${isSelected ? 'text-teal-200' : 'text-slate-400'}`}>
                  {tab.monthName}
                </span>

                {availableCount > 0 ? (
                  <span className={`text-[9px] mt-1 font-bold px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-teal-700 text-teal-100' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {availableCount} open
                  </span>
                ) : (
                  <span className="text-[9px] mt-1 text-slate-400 font-medium">Full</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Slots Section */}
      <div className="space-y-5">
        {currentSlots.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No time slots listed for this date</p>
            <p className="text-xs text-slate-500 mt-1">Please select another date from the calendar above.</p>
          </div>
        ) : (
          <>
            {/* Morning Slots */}
            {morningSlots.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Morning Slots</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {morningSlots.map((slot) => {
                    const isSelected = selectedSlot?._id === slot._id;
                    const isBooked = slot.isBooked;

                    return (
                      <button
                        key={slot._id}
                        type="button"
                        disabled={isBooked}
                        onClick={() => onSelectSlot(slot, selectedDate)}
                        className={`px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between border transition-all ${
                          isBooked
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                            : isSelected
                            ? 'bg-teal-600 text-white border-teal-600 shadow-glow-teal ring-2 ring-teal-500 ring-offset-2'
                            : 'bg-white text-slate-800 border-slate-200 hover:border-teal-400 hover:bg-teal-50/50'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 opacity-70" />
                          {slot.startTime}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Afternoon Slots */}
            {afternoonSlots.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Moon className="w-4 h-4 text-indigo-500" />
                  <span>Afternoon & Evening Slots</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {afternoonSlots.map((slot) => {
                    const isSelected = selectedSlot?._id === slot._id;
                    const isBooked = slot.isBooked;

                    return (
                      <button
                        key={slot._id}
                        type="button"
                        disabled={isBooked}
                        onClick={() => onSelectSlot(slot, selectedDate)}
                        className={`px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between border transition-all ${
                          isBooked
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                            : isSelected
                            ? 'bg-teal-600 text-white border-teal-600 shadow-glow-teal ring-2 ring-teal-500 ring-offset-2'
                            : 'bg-white text-slate-800 border-slate-200 hover:border-teal-400 hover:bg-teal-50/50'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 opacity-70" />
                          {slot.startTime}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
