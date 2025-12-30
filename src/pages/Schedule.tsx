import React, { useState } from 'react';
import { useSchedule, DAYS_OF_WEEK, DayOfWeek, SchedulePeriod } from '@/contexts/ScheduleContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, RefreshCw, Clock, CalendarDays } from 'lucide-react';
import { toast } from 'sonner';

const GRADES = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  label: `Grade ${i + 1}`,
}));

const PERIOD_TIMES = [
  '8:00 - 8:45',
  '8:45 - 9:30',
  '9:45 - 10:30',
  '10:30 - 11:15',
  '11:30 - 12:15',
  '12:15 - 1:00',
  '2:00 - 2:45',
  '2:45 - 3:30',
];

const periodColors = [
  'from-grade-1/20 to-grade-2/20',
  'from-grade-3/20 to-grade-4/20',
  'from-grade-5/20 to-grade-6/20',
  'from-grade-7/20 to-grade-8/20',
  'from-grade-9/20 to-grade-10/20',
  'from-grade-11/20 to-grade-12/20',
  'from-grade-2/20 to-grade-3/20',
  'from-grade-4/20 to-grade-5/20',
];

const dayColors: Record<DayOfWeek, string> = {
  monday: 'bg-grade-1/10 border-grade-1/30',
  tuesday: 'bg-grade-3/10 border-grade-3/30',
  wednesday: 'bg-grade-5/10 border-grade-5/30',
  thursday: 'bg-grade-7/10 border-grade-7/30',
  friday: 'bg-grade-9/10 border-grade-9/30',
  saturday: 'bg-grade-11/10 border-grade-11/30',
};

const dayHeaderColors: Record<DayOfWeek, string> = {
  monday: 'bg-grade-1 text-white',
  tuesday: 'bg-grade-3 text-white',
  wednesday: 'bg-grade-5 text-white',
  thursday: 'bg-grade-7 text-white',
  friday: 'bg-grade-9 text-white',
  saturday: 'bg-grade-11 text-white',
};

const getCurrentDay = (): DayOfWeek => {
  const dayIndex = new Date().getDay();
  // Sunday = 0, so map to monday-saturday
  const dayMap: Record<number, DayOfWeek> = {
    0: 'monday', // Sunday defaults to Monday
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday',
  };
  return dayMap[dayIndex];
};

interface PeriodCardProps {
  period: SchedulePeriod;
  index: number;
  onUpdate: (id: string, updates: Partial<SchedulePeriod>) => void;
  compact?: boolean;
}

const PeriodCard: React.FC<PeriodCardProps> = ({ period, index, onUpdate, compact = false }) => {
  return (
    <div
      className={`bg-gradient-to-r ${periodColors[index]} rounded-xl border border-border/50 ${compact ? 'p-3' : 'p-5'} shadow-soft`}
    >
      <div className={`flex flex-col ${compact ? 'gap-2' : 'lg:flex-row lg:items-center gap-4'}`}>
        {/* Period Info */}
        <div className={`flex items-center gap-3 ${compact ? '' : 'lg:w-48'}`}>
          <div className={`${compact ? 'w-10 h-10' : 'w-14 h-14'} rounded-xl bg-card shadow-soft flex flex-col items-center justify-center`}>
            <span className="text-xs text-muted-foreground">P</span>
            <span className={`${compact ? 'text-lg' : 'text-xl'} font-bold text-foreground`}>{period.periodNumber}</span>
          </div>
          {!compact && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              {PERIOD_TIMES[index]}
            </div>
          )}
        </div>

        {/* Inputs */}
        <div className={`flex-1 grid ${compact ? 'grid-cols-1 gap-2' : 'sm:grid-cols-3 gap-3'}`}>
          <Select
            value={period.gradeId?.toString() || ''}
            onValueChange={(value) =>
              onUpdate(period.id, { gradeId: value ? parseInt(value) : null })
            }
          >
            <SelectTrigger className={`bg-card border-2 ${compact ? 'h-9 text-sm' : 'h-12'} rounded-xl`}>
              <SelectValue placeholder="Grade" />
            </SelectTrigger>
            <SelectContent>
              {GRADES.map((grade) => (
                <SelectItem key={grade.id} value={grade.id.toString()}>
                  {grade.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Subject"
            value={period.subject}
            onChange={(e) => onUpdate(period.id, { subject: e.target.value })}
            className={`bg-card border-2 ${compact ? 'h-9 text-sm' : 'h-12'} rounded-xl`}
          />

          {!compact && (
            <Input
              placeholder="Topic (optional)"
              value={period.topic}
              onChange={(e) => onUpdate(period.id, { topic: e.target.value })}
              className="bg-card border-2 h-12 rounded-xl"
            />
          )}
        </div>
      </div>

      {/* Active indicator for filled periods */}
      {!compact && period.gradeId && period.subject && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse-soft"></div>
            <span className="text-muted-foreground">
              Teaching <strong className="text-foreground">Grade {period.gradeId}</strong> - {period.subject}
              {period.topic && <span className="text-muted-foreground"> ({period.topic})</span>}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const Schedule = () => {
  const { dailySchedule, weeklySchedule, updateDailyPeriod, updateWeeklyPeriod, resetDailySchedule, resetWeeklySchedule } = useSchedule();
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(getCurrentDay());

  const handleResetDaily = () => {
    resetDailySchedule();
    toast.success('Daily schedule reset');
  };

  const handleResetWeekly = () => {
    resetWeeklySchedule();
    toast.success('Weekly schedule reset');
  };

  const getScheduleStats = (schedule: SchedulePeriod[]) => ({
    classesScheduled: schedule.filter((p) => p.gradeId).length,
    uniqueGrades: new Set(schedule.filter((p) => p.gradeId).map((p) => p.gradeId)).size,
    subjects: new Set(schedule.filter((p) => p.subject).map((p) => p.subject)).size,
    freePeriods: 8 - schedule.filter((p) => p.gradeId).length,
  });

  const dailyStats = getScheduleStats(dailySchedule);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in">
        <div>
          <div className="flex items-center gap-2 text-primary mb-2">
            <Calendar className="w-5 h-5" />
            <span className="text-sm font-medium uppercase tracking-wide">Schedule Management</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground">
            Class Timetable
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your daily and weekly teaching schedule
          </p>
        </div>
      </div>

      {/* Tabs for Daily/Weekly */}
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6 h-12 p-1 bg-muted/50">
          <TabsTrigger value="daily" className="gap-2 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Calendar className="w-4 h-4" />
            Daily View
          </TabsTrigger>
          <TabsTrigger value="weekly" className="gap-2 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <CalendarDays className="w-4 h-4" />
            Weekly View
          </TabsTrigger>
        </TabsList>

        {/* Daily View */}
        <TabsContent value="daily" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-display font-semibold text-foreground">Today's Timetable</h2>
            <Button variant="outline" onClick={handleResetDaily} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Reset
            </Button>
          </div>

          {/* Schedule Grid */}
          <div className="space-y-4">
            {dailySchedule.map((period, index) => (
              <div key={period.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                <PeriodCard
                  period={period}
                  index={index}
                  onUpdate={updateDailyPeriod}
                />
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-soft animate-fade-in">
            <h2 className="text-lg font-display font-bold text-foreground mb-4">
              Today's Summary
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted/50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-primary">{dailyStats.classesScheduled}</div>
                <div className="text-sm text-muted-foreground">Classes Scheduled</div>
              </div>
              <div className="bg-muted/50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-secondary">{dailyStats.uniqueGrades}</div>
                <div className="text-sm text-muted-foreground">Unique Grades</div>
              </div>
              <div className="bg-muted/50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-accent">{dailyStats.subjects}</div>
                <div className="text-sm text-muted-foreground">Subjects</div>
              </div>
              <div className="bg-muted/50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-success">{dailyStats.freePeriods}</div>
                <div className="text-sm text-muted-foreground">Free Periods</div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Weekly View */}
        <TabsContent value="weekly" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-display font-semibold text-foreground">Weekly Timetable</h2>
            <Button variant="outline" onClick={handleResetWeekly} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Reset Week
            </Button>
          </div>

          {/* Day Selector Tabs */}
          <div className="flex flex-wrap gap-2">
            {DAYS_OF_WEEK.map((day) => {
              const isToday = day.key === getCurrentDay();
              const isSelected = day.key === selectedDay;
              return (
                <button
                  key={day.key}
                  onClick={() => setSelectedDay(day.key)}
                  className={`
                    px-4 py-2 rounded-xl font-medium transition-all duration-200
                    ${isSelected 
                      ? dayHeaderColors[day.key] + ' shadow-lg scale-105' 
                      : 'bg-card hover:bg-muted border border-border text-foreground'}
                    ${isToday && !isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
                  `}
                >
                  {day.label}
                  {isToday && (
                    <span className="ml-1.5 text-xs opacity-75">(Today)</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Day Schedule */}
          <div className={`rounded-2xl border-2 ${dayColors[selectedDay]} p-4 lg:p-6`}>
            <div className={`inline-block ${dayHeaderColors[selectedDay]} px-4 py-2 rounded-xl mb-4`}>
              <h3 className="text-lg font-display font-bold">
                {DAYS_OF_WEEK.find(d => d.key === selectedDay)?.label}
                {selectedDay === getCurrentDay() && <span className="ml-2 text-sm font-normal">(Today)</span>}
              </h3>
            </div>

            <div className="space-y-3">
              {weeklySchedule[selectedDay]?.map((period, index) => (
                <PeriodCard
                  key={period.id}
                  period={period}
                  index={index}
                  onUpdate={(id, updates) => updateWeeklyPeriod(selectedDay, id, updates)}
                  compact
                />
              ))}
            </div>
          </div>

          {/* Weekly Overview */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
            <h2 className="text-lg font-display font-bold text-foreground mb-4">
              Weekly Overview
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {DAYS_OF_WEEK.map((day) => {
                const daySchedule = weeklySchedule[day.key] || [];
                const scheduled = daySchedule.filter(p => p.gradeId).length;
                const isToday = day.key === getCurrentDay();
                return (
                  <button
                    key={day.key}
                    onClick={() => setSelectedDay(day.key)}
                    className={`
                      p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105
                      ${dayColors[day.key]}
                      ${isToday ? 'ring-2 ring-primary ring-offset-2' : ''}
                    `}
                  >
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      {day.label.slice(0, 3)}
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {scheduled}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      classes
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Schedule;
