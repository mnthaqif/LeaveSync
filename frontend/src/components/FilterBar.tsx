import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Pressable } from 'react-native';
import { User } from '../types';
import { malaysianStates, departments } from '../utils/dateHelpers';

interface FilterBarProps {
  users: User[];
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  userId?: number;
  department?: string;
  leaveType?: string;
  state?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({ users, onFilterChange }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({});

  const updateFilter = (key: keyof FilterState, value: string | number | undefined) => {
    const newFilters = { ...filters };
    if (value === undefined || value === '' || value === 'all') {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const activeFilterCount = Object.keys(filters).length;

  return (
    <View className="mb-4">
      <TouchableOpacity
        onPress={() => setShowFilters(true)}
        className="flex-row items-center justify-between bg-white rounded-xl p-4 shadow-sm"
      >
        <View className="flex-row items-center">
          <Text className="text-base font-semibold text-gray-700">Filters</Text>
          {activeFilterCount > 0 && (
            <View className="ml-2 bg-blue-500 rounded-full w-6 h-6 justify-center items-center">
              <Text className="text-white text-xs font-bold">{activeFilterCount}</Text>
            </View>
          )}
        </View>
        <Text className="text-gray-400 text-lg">⚙️</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showFilters}
        onRequestClose={() => setShowFilters(false)}
      >
        <Pressable 
          className="flex-1 justify-end bg-black/50"
          onPress={() => setShowFilters(false)}
        >
          <Pressable 
            className="bg-white rounded-t-3xl"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="p-6">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-2xl font-bold text-gray-800">Filter Calendar</Text>
                <TouchableOpacity onPress={clearFilters}>
                  <Text className="text-blue-500 font-semibold">Clear All</Text>
                </TouchableOpacity>
              </View>

              <ScrollView className="max-h-96">
                {/* Staff Filter */}
                <View className="mb-6">
                  <Text className="text-sm font-semibold text-gray-600 mb-2">STAFF</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                    <TouchableOpacity
                      onPress={() => updateFilter('userId', undefined)}
                      className={`mr-2 px-4 py-2 rounded-full ${!filters.userId ? 'bg-blue-500' : 'bg-gray-100'}`}
                    >
                      <Text className={!filters.userId ? 'text-white font-semibold' : 'text-gray-700'}>
                        All Staff
                      </Text>
                    </TouchableOpacity>
                    {users.map(user => (
                      <TouchableOpacity
                        key={user.id}
                        onPress={() => updateFilter('userId', user.id)}
                        className={`mr-2 px-4 py-2 rounded-full ${filters.userId === user.id ? 'bg-blue-500' : 'bg-gray-100'}`}
                      >
                        <Text className={filters.userId === user.id ? 'text-white font-semibold' : 'text-gray-700'}>
                          {user.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Department Filter */}
                <View className="mb-6">
                  <Text className="text-sm font-semibold text-gray-600 mb-2">DEPARTMENT</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                    <TouchableOpacity
                      onPress={() => updateFilter('department', undefined)}
                      className={`mr-2 px-4 py-2 rounded-full ${!filters.department ? 'bg-blue-500' : 'bg-gray-100'}`}
                    >
                      <Text className={!filters.department ? 'text-white font-semibold' : 'text-gray-700'}>
                        All Departments
                      </Text>
                    </TouchableOpacity>
                    {departments.map(dept => (
                      <TouchableOpacity
                        key={dept}
                        onPress={() => updateFilter('department', dept)}
                        className={`mr-2 px-4 py-2 rounded-full ${filters.department === dept ? 'bg-blue-500' : 'bg-gray-100'}`}
                      >
                        <Text className={filters.department === dept ? 'text-white font-semibold' : 'text-gray-700'}>
                          {dept}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Leave Type Filter */}
                <View className="mb-6">
                  <Text className="text-sm font-semibold text-gray-600 mb-2">LEAVE TYPE</Text>
                  <View className="flex-row">
                    {['All', 'Normal', 'Connected'].map(type => (
                      <TouchableOpacity
                        key={type}
                        onPress={() => updateFilter('leaveType', type === 'All' ? undefined : type)}
                        className={`mr-2 px-4 py-2 rounded-full ${
                          (type === 'All' && !filters.leaveType) || filters.leaveType === type
                            ? 'bg-blue-500'
                            : 'bg-gray-100'
                        }`}
                      >
                        <Text className={
                          (type === 'All' && !filters.leaveType) || filters.leaveType === type
                            ? 'text-white font-semibold'
                            : 'text-gray-700'
                        }>
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* State Filter */}
                <View className="mb-6">
                  <Text className="text-sm font-semibold text-gray-600 mb-2">STATE</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                    <TouchableOpacity
                      onPress={() => updateFilter('state', undefined)}
                      className={`mr-2 px-4 py-2 rounded-full ${!filters.state ? 'bg-blue-500' : 'bg-gray-100'}`}
                    >
                      <Text className={!filters.state ? 'text-white font-semibold' : 'text-gray-700'}>
                        All States
                      </Text>
                    </TouchableOpacity>
                    {malaysianStates.map(state => (
                      <TouchableOpacity
                        key={state}
                        onPress={() => updateFilter('state', state)}
                        className={`mr-2 px-4 py-2 rounded-full ${filters.state === state ? 'bg-blue-500' : 'bg-gray-100'}`}
                      >
                        <Text className={filters.state === state ? 'text-white font-semibold' : 'text-gray-700'}>
                          {state}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </ScrollView>

              <TouchableOpacity
                onPress={() => setShowFilters(false)}
                className="mt-4 bg-blue-500 py-4 rounded-xl"
              >
                <Text className="text-white text-center font-semibold text-base">Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default FilterBar;
