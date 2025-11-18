import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import CalendarView from '../components/CalendarView';
import FilterBar, { FilterState } from '../components/FilterBar';
import { getLeaves, getPublicHolidays, getUsers } from '../services/api';
import { Leave, PublicHoliday, User } from '../types';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [filteredLeaves, setFilteredLeaves] = useState<Leave[]>([]);
  const [holidays, setHolidays] = useState<PublicHoliday[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      
      // Fetch all data in parallel
      const [leavesData, usersData] = await Promise.all([
        getLeaves(),
        getUsers()
      ]);

      setLeaves(leavesData);
      setFilteredLeaves(leavesData);
      setUsers(usersData);

      // Fetch holidays for all unique states
      const uniqueStates = [...new Set(usersData.map(u => u.state))];
      const holidaysPromises = uniqueStates.map(state => 
        getPublicHolidays(state, new Date().getFullYear())
      );
      const holidaysResults = await Promise.all(holidaysPromises);
      const allHolidays = holidaysResults.flat();
      
      // Remove duplicates
      const uniqueHolidays = allHolidays.filter((holiday, index, self) =>
        index === self.findIndex(h => h.date === holiday.date && h.state === holiday.state)
      );
      
      setHolidays(uniqueHolidays);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleFilterChange = async (filters: FilterState) => {
    try {
      // Build API filter params
      const params: any = {};
      if (filters.userId) params.user_id = filters.userId;
      if (filters.department) params.department = filters.department;
      if (filters.leaveType) params.leave_type = filters.leaveType;
      if (filters.state) params.state = filters.state;

      const filteredData = await getLeaves(params);
      setFilteredLeaves(filteredData);
    } catch (err: any) {
      console.error('Error filtering leaves:', err);
      setError(err.message || 'Failed to filter leaves');
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-600">Loading calendar...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 px-6">
        <Text className="text-6xl mb-4">⚠️</Text>
        <Text className="text-xl font-bold text-gray-800 mb-2">Connection Error</Text>
        <Text className="text-gray-600 text-center mb-6">{error}</Text>
        <TouchableOpacity
          onPress={fetchData}
          className="bg-blue-500 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="bg-white pt-12 pb-6 px-6 shadow-sm">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-3xl font-bold text-gray-800">LeaveSync</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddLeave')}
            className="bg-blue-500 px-4 py-2 rounded-xl"
          >
            <Text className="text-white font-semibold">+ Add Leave</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-gray-600">Staff Leave & Holiday Calendar</Text>
      </View>

      <ScrollView
        className="flex-1 px-6 pt-6"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Stats */}
        <View className="flex-row mb-6 space-x-4">
          <View className="flex-1 bg-white rounded-xl p-4 shadow-sm">
            <Text className="text-2xl font-bold text-gray-800">{filteredLeaves.length}</Text>
            <Text className="text-gray-600 text-sm">Active Leaves</Text>
          </View>
          <View className="flex-1 bg-white rounded-xl p-4 shadow-sm">
            <Text className="text-2xl font-bold text-gray-800">{users.length}</Text>
            <Text className="text-gray-600 text-sm">Total Staff</Text>
          </View>
          <View className="flex-1 bg-white rounded-xl p-4 shadow-sm">
            <Text className="text-2xl font-bold text-gray-800">{holidays.length}</Text>
            <Text className="text-gray-600 text-sm">Holidays</Text>
          </View>
        </View>

        {/* Filters */}
        <FilterBar users={users} onFilterChange={handleFilterChange} />

        {/* Calendar */}
        <CalendarView leaves={filteredLeaves} holidays={holidays} />

        <View className="h-8" />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
