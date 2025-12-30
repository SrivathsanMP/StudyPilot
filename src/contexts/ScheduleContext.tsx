import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface SchedulePeriod {
  id: string;
  periodNumber: number;
  gradeId: number | null;
  subject: string;
  topic: string;
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

export interface WeeklySchedule {
  [key: string]: SchedulePeriod[];
}

interface ScheduleContextType {
  dailySchedule: SchedulePeriod[];
  weeklySchedule: WeeklySchedule;
  updateDailyPeriod: (id: string, updates: Partial<SchedulePeriod>) => void;
  updateWeeklyPeriod: (day: DayOfWeek, id: string, updates: Partial<SchedulePeriod>) => void;
  resetDailySchedule: () => void;
  resetWeeklySchedule: () => void;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const DAYS_OF_WEEK: { key: DayOfWeek; label: string }[] = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
];

const createDefaultDaySchedule = (dayPrefix: string = 'daily'): SchedulePeriod[] => {
  return Array.from({ length: 8 }, (_, i) => ({
    id: `${dayPrefix}-period-${i + 1}`,
    periodNumber: i + 1,
    gradeId: null,
    subject: '',
    topic: '',
  }));
};

const createDefaultWeeklySchedule = (): WeeklySchedule => {
  const weekly: WeeklySchedule = {};
  DAYS_OF_WEEK.forEach((day) => {
    weekly[day.key] = createDefaultDaySchedule(day.key);
  });
  return weekly;
};

export function ScheduleProvider({ children }: { children: ReactNode }) {
  const [dailySchedule, setDailySchedule] = useState<SchedulePeriod[]>(() => {
    const saved = localStorage.getItem('studypilot_daily_schedule');
    return saved ? JSON.parse(saved) : createDefaultDaySchedule('daily');
  });

  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>(() => {
    const saved = localStorage.getItem('studypilot_weekly_schedule');
    return saved ? JSON.parse(saved) : createDefaultWeeklySchedule();
  });

  const saveDailyToStorage = (schedule: SchedulePeriod[]) => {
    localStorage.setItem('studypilot_daily_schedule', JSON.stringify(schedule));
  };

  const saveWeeklyToStorage = (schedule: WeeklySchedule) => {
    localStorage.setItem('studypilot_weekly_schedule', JSON.stringify(schedule));
  };

  const updateDailyPeriod = useCallback((id: string, updates: Partial<SchedulePeriod>) => {
    setDailySchedule((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
      saveDailyToStorage(updated);
      return updated;
    });
  }, []);

  const updateWeeklyPeriod = useCallback((day: DayOfWeek, id: string, updates: Partial<SchedulePeriod>) => {
    setWeeklySchedule((prev) => {
      const updated = {
        ...prev,
        [day]: prev[day].map((p) => (p.id === id ? { ...p, ...updates } : p)),
      };
      saveWeeklyToStorage(updated);
      return updated;
    });
  }, []);

  const resetDailySchedule = useCallback(() => {
    const defaultSchedule = createDefaultDaySchedule('daily');
    saveDailyToStorage(defaultSchedule);
    setDailySchedule(defaultSchedule);
  }, []);

  const resetWeeklySchedule = useCallback(() => {
    const defaultSchedule = createDefaultWeeklySchedule();
    saveWeeklyToStorage(defaultSchedule);
    setWeeklySchedule(defaultSchedule);
  }, []);

  return (
    <ScheduleContext.Provider
      value={{
        dailySchedule,
        weeklySchedule,
        updateDailyPeriod,
        updateWeeklyPeriod,
        resetDailySchedule,
        resetWeeklySchedule,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
}

export function useSchedule() {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
}
