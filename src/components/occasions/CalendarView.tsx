import { useState, useEffect } from 'react';
import { Occasion } from '@/types/occasions';

interface CalendarViewProps {
    occasions: Occasion[];
    onOccasionClick: (occasion: Occasion) => void;
}

export default function CalendarView({ occasions, onOccasionClick }: CalendarViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarDays, setCalendarDays] = useState<Array<{ date: Date; occasions: Occasion[] }>>([]);

    // Get type icon based on occasion type
    const getTypeIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'birthday':
                return '🎂';
            case 'anniversary':
                return '💍';
            case 'graduation':
                return '🎓';
            case 'wedding':
                return '👰';
            case 'holiday':
                return '🎄';
            default:
                return '📅';
        }
    };

    // Generate calendar days for the current month
    useEffect(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // First day of the month
        const firstDay = new Date(year, month, 1);
        // Last day of the month
        const lastDay = new Date(year, month + 1, 0);

        // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
        const firstDayOfWeek = firstDay.getDay();

        // Calculate days from previous month to show
        const daysFromPrevMonth = firstDayOfWeek;

        // Calculate total days to show (previous month days + current month days)
        const totalDays = daysFromPrevMonth + lastDay.getDate();

        // Calculate rows needed (7 days per row)
        const rows = Math.ceil(totalDays / 7);

        // Calculate total calendar days (rows * 7)
        const totalCalendarDays = rows * 7;

        // Generate calendar days
        const days: Array<{ date: Date; occasions: Occasion[] }> = [];

        // Add days from previous month
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = 0; i < daysFromPrevMonth; i++) {
            const day = prevMonthLastDay - daysFromPrevMonth + i + 1;
            const date = new Date(year, month - 1, day);

            // Find occasions for this date
            const dayOccasions = occasions.filter(occasion => {
                const occasionDate = new Date(occasion.date);
                return (
                    occasionDate.getDate() === day &&
                    occasionDate.getMonth() === month - 1 &&
                    occasionDate.getFullYear() === year
                );
            });

            days.push({ date, occasions: dayOccasions });
        }

        // Add days from current month
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const date = new Date(year, month, i);

            // Find occasions for this date
            const dayOccasions = occasions.filter(occasion => {
                const occasionDate = new Date(occasion.date);
                return (
                    occasionDate.getDate() === i &&
                    occasionDate.getMonth() === month &&
                    occasionDate.getFullYear() === year
                );
            });

            days.push({ date, occasions: dayOccasions });
        }

        // Add days from next month
        const remainingDays = totalCalendarDays - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            const date = new Date(year, month + 1, i);

            // Find occasions for this date
            const dayOccasions = occasions.filter(occasion => {
                const occasionDate = new Date(occasion.date);
                return (
                    occasionDate.getDate() === i &&
                    occasionDate.getMonth() === month + 1 &&
                    occasionDate.getFullYear() === year
                );
            });

            days.push({ date, occasions: dayOccasions });
        }

        setCalendarDays(days);
    }, [currentDate, occasions]);

    // Navigate to previous month
    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    // Navigate to next month
    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    // Navigate to today
    const goToToday = () => {
        setCurrentDate(new Date());
    };

    // Format date for display
    const formatMonthYear = (date: Date) => {
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    };

    // Check if a date is today
    const isToday = (date: Date) => {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    // Check if a date is in the current month
    const isCurrentMonth = (date: Date) => {
        return date.getMonth() === currentDate.getMonth();
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">{formatMonthYear(currentDate)}</h2>
                <div className="flex space-x-2">
                    <button
                        onClick={goToPreviousMonth}
                        className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
                        aria-label="Previous month"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={goToToday}
                        className="px-4 py-1 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors text-sm font-medium shadow-sm"
                    >
                        Today
                    </button>
                    <button
                        onClick={goToNextMonth}
                        className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
                        aria-label="Next month"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center font-medium text-gray-500 py-2">
                        {day}
                    </div>
                ))}

                {/* Calendar days */}
                {calendarDays.map((day, index) => (
                    <div
                        key={index}
                        className={`min-h-[100px] border rounded-lg p-2 ${isToday(day.date)
                            ? 'bg-orange-50 border-orange-200'
                            : isCurrentMonth(day.date)
                                ? 'bg-white border-gray-200'
                                : 'bg-gray-50 border-gray-100 text-gray-400'
                            }`}
                    >
                        <div className="text-right mb-1">
                            <span className={`text-sm ${isToday(day.date) ? 'font-bold text-orange-500' : ''}`}>
                                {day.date.getDate()}
                            </span>
                        </div>
                        <div className="space-y-1 overflow-y-auto max-h-[80px]">
                            {day.occasions.map((occasion) => (
                                <div
                                    key={occasion.id}
                                    onClick={() => onOccasionClick(occasion)}
                                    className={`text-xs p-1 rounded truncate cursor-pointer ${occasion.is_draft
                                        ? 'bg-gray-100 text-gray-700'
                                        : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                                        }`}
                                >
                                    <span className="mr-1">{getTypeIcon(occasion.type)}</span>
                                    {occasion.label}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}