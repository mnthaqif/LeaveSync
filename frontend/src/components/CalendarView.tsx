import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Pressable } from 'react-native';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO, addMonths, subMonths } from 'date-fns';
import { Leave, PublicHoliday } from '../types';
import { getLeaveColor, getHolidayColor } from '../utils/dateHelpers';

interface CalendarViewProps {
  leaves: Leave[];
  holidays: PublicHoliday[];
  onDatePress?: (date: Date) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ leaves, holidays, onDatePress }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const events: Array<{ type: 'leave' | 'holiday'; data: Leave | PublicHoliday; color: string }> = [];

    // Check leaves
    leaves.forEach(leave => {
      const leaveStart = parseISO(leave.start_date);
      const leaveEnd = parseISO(leave.end_date);
      if (date >= leaveStart && date <= leaveEnd) {
        events.push({
          type: 'leave',
          data: leave,
          color: getLeaveColor(leave.leave_type)
        });
      }
    });

    // Check holidays
    holidays.forEach(holiday => {
      if (holiday.date === dateStr) {
        events.push({
          type: 'holiday',
          data: holiday,
          color: getHolidayColor()
        });
      }
    });

    return events;
  };

  const handleDatePress = (date: Date) => {
    setSelectedDate(date);
    const events = getEventsForDate(date);
    if (events.length > 0) {
      setModalVisible(true);
    }
    onDatePress?.(date);
  };

  const renderDayHeader = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <View className="flex-row justify-around py-3 border-b border-gray-200">
        {days.map(day => (
          <Text key={day} className="text-sm font-semibold text-gray-600 w-12 text-center">
            {day}
          </Text>
        ))}
      </View>
    );
  };

  const renderDay = (date: Date) => {
    const events = getEventsForDate(date);
    const isCurrentMonth = isSameMonth(date, currentDate);
    const isToday = isSameDay(date, new Date());

    return (
      <TouchableOpacity
        key={date.toISOString()}
        onPress={() => handleDatePress(date)}
        className={`w-12 h-16 justify-start items-center p-1 ${!isCurrentMonth ? 'opacity-30' : ''}`}
      >
        <View className={`w-8 h-8 rounded-full justify-center items-center ${isToday ? 'bg-blue-500' : ''}`}>
          <Text className={`text-sm ${isToday ? 'text-white font-bold' : 'text-gray-800'}`}>
            {format(date, 'd')}
          </Text>
        </View>
        
        {/* Event indicators */}
        <View className="flex-row mt-1 space-x-1">
          {events.slice(0, 3).map((event, idx) => (
            <View
              key={idx}
              style={{ backgroundColor: event.color }}
              className="w-1.5 h-1.5 rounded-full"
            />
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  const renderCalendar = () => {
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];

    // Add empty cells for days before month start
    const firstDayOfWeek = monthStart.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      const emptyDate = new Date(monthStart);
      emptyDate.setDate(emptyDate.getDate() - (firstDayOfWeek - i));
      currentWeek.push(emptyDate);
    }

    // Add month days
    monthDays.forEach(day => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    });

    // Add empty cells for remaining days
    if (currentWeek.length > 0) {
      const remainingDays = 7 - currentWeek.length;
      for (let i = 1; i <= remainingDays; i++) {
        const emptyDate = new Date(monthEnd);
        emptyDate.setDate(emptyDate.getDate() + i);
        currentWeek.push(emptyDate);
      }
      weeks.push(currentWeek);
    }

    return weeks.map((week, weekIdx) => (
      <View key={weekIdx} className="flex-row justify-around">
        {week.map(day => renderDay(day))}
      </View>
    ));
  };

  const renderModal = () => {
    if (!selectedDate) return null;

    const events = getEventsForDate(selectedDate);
    const dateStr = format(selectedDate, 'MMMM d, yyyy');

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable 
          className="flex-1 justify-center items-center bg-black/50"
          onPress={() => setModalVisible(false)}
        >
          <Pressable 
            className="bg-white rounded-2xl p-6 w-11/12 max-w-md"
            onPress={(e) => e.stopPropagation()}
          >
            <Text className="text-2xl font-bold text-gray-800 mb-4">{dateStr}</Text>

            <ScrollView className="max-h-96">
              {events.length === 0 ? (
                <Text className="text-gray-500 text-center py-8">No events on this day</Text>
              ) : (
                events.map((event, idx) => (
                  <View key={idx} className="mb-4 p-4 rounded-xl" style={{ backgroundColor: `${event.color}20` }}>
                    {event.type === 'holiday' ? (
                      <View>
                        <View className="flex-row items-center mb-2">
                          <View 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: event.color }}
                          />
                          <Text className="text-xs font-semibold text-gray-600 uppercase">Public Holiday</Text>
                        </View>
                        <Text className="text-lg font-bold text-gray-800">
                          {(event.data as PublicHoliday).holiday_name}
                        </Text>
                        <Text className="text-sm text-gray-600 mt-1">
                          State: {(event.data as PublicHoliday).state}
                        </Text>
                      </View>
                    ) : (
                      <View>
                        <View className="flex-row items-center mb-2">
                          <View 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: event.color }}
                          />
                          <Text className="text-xs font-semibold text-gray-600 uppercase">
                            {(event.data as Leave).leave_type} Leave
                          </Text>
                        </View>
                        <Text className="text-lg font-bold text-gray-800">
                          {(event.data as Leave).user_name}
                        </Text>
                        <Text className="text-sm text-gray-600">
                          {(event.data as Leave).department}
                        </Text>
                        {(event.data as Leave).notes && (
                          <Text className="text-sm text-gray-500 mt-2 italic">
                            {(event.data as Leave).notes}
                          </Text>
                        )}
                      </View>
                    )}
                  </View>
                ))
              )}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="mt-4 bg-blue-500 py-3 rounded-xl"
            >
              <Text className="text-white text-center font-semibold text-base">Close</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    );
  };

  return (
    <View className="bg-white rounded-2xl shadow-lg">
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 py-4 border-b border-gray-200">
        <TouchableOpacity
          onPress={() => setCurrentDate(subMonths(currentDate, 1))}
          className="p-2 rounded-lg bg-gray-100"
        >
          <Text className="text-lg font-bold text-gray-700">←</Text>
        </TouchableOpacity>

        <Text className="text-xl font-bold text-gray-800">
          {format(currentDate, 'MMMM yyyy')}
        </Text>

        <TouchableOpacity
          onPress={() => setCurrentDate(addMonths(currentDate, 1))}
          className="p-2 rounded-lg bg-gray-100"
        >
          <Text className="text-lg font-bold text-gray-700">→</Text>
        </TouchableOpacity>
      </View>

      {/* Day headers */}
      {renderDayHeader()}

      {/* Calendar grid */}
      <View className="p-2">
        {renderCalendar()}
      </View>

      {/* Legend */}
      <View className="px-6 py-4 border-t border-gray-200">
        <Text className="text-xs font-semibold text-gray-600 mb-2">LEGEND</Text>
        <View className="flex-row flex-wrap gap-4">
          <View className="flex-row items-center">
            <View className="w-3 h-3 rounded-full bg-green-500 mr-2" />
            <Text className="text-xs text-gray-600">Normal Leave</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-3 h-3 rounded-full bg-amber-500 mr-2" />
            <Text className="text-xs text-gray-600">Connected Leave</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
            <Text className="text-xs text-gray-600">Public Holiday</Text>
          </View>
        </View>
      </View>

      {renderModal()}
    </View>
  );
};

export default CalendarView;
