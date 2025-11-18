import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { format } from 'date-fns';
import { getUsers, createLeave } from '../services/api';
import { User } from '../types';

interface AddLeaveScreenProps {
  navigation: any;
}

const AddLeaveScreen: React.FC<AddLeaveScreenProps> = ({ navigation }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersData = await getUsers();
      setUsers(usersData);
      if (usersData.length > 0) {
        setSelectedUserId(usersData[0].id);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      Alert.alert('Error', 'Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const validateDates = (): boolean => {
    if (!startDate || !endDate) {
      Alert.alert('Validation Error', 'Please enter both start and end dates');
      return false;
    }

    // Check date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      Alert.alert('Validation Error', 'Please use YYYY-MM-DD format for dates');
      return false;
    }

    // Check if end date is after or equal to start date
    if (new Date(endDate) < new Date(startDate)) {
      Alert.alert('Validation Error', 'End date must be after or equal to start date');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!selectedUserId) {
      Alert.alert('Validation Error', 'Please select a staff member');
      return;
    }

    if (!validateDates()) {
      return;
    }

    setLoading(true);
    try {
      await createLeave({
        user_id: selectedUserId,
        start_date: startDate,
        end_date: endDate,
        notes: notes.trim() || undefined
      });

      Alert.alert(
        'Success',
        'Leave has been added successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (err: any) {
      console.error('Error creating leave:', err);
      Alert.alert('Error', err.response?.data?.error || 'Failed to create leave');
    } finally {
      setLoading(false);
    }
  };

  const setTodayAsStart = () => {
    setStartDate(format(new Date(), 'yyyy-MM-dd'));
  };

  const setTodayAsEnd = () => {
    setEndDate(format(new Date(), 'yyyy-MM-dd'));
  };

  if (loadingUsers) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white pt-12 pb-6 px-6 shadow-sm">
        <View className="flex-row items-center mb-2">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
            <Text className="text-2xl text-gray-700">←</Text>
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-gray-800">Add Leave</Text>
        </View>
        <Text className="text-gray-600">Submit a new leave request</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          {/* Staff Selection */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-600 mb-2">STAFF MEMBER *</Text>
            <View className="border border-gray-300 rounded-xl overflow-hidden">
              <Picker
                selectedValue={selectedUserId}
                onValueChange={(value) => setSelectedUserId(value)}
              >
                {users.map(user => (
                  <Picker.Item 
                    key={user.id} 
                    label={`${user.name} (${user.department})`} 
                    value={user.id}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Start Date */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm font-semibold text-gray-600">START DATE *</Text>
              <TouchableOpacity onPress={setTodayAsStart}>
                <Text className="text-blue-500 text-sm font-semibold">Today</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 text-base"
              placeholder="YYYY-MM-DD (e.g., 2024-12-25)"
              value={startDate}
              onChangeText={setStartDate}
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* End Date */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm font-semibold text-gray-600">END DATE *</Text>
              <TouchableOpacity onPress={setTodayAsEnd}>
                <Text className="text-blue-500 text-sm font-semibold">Today</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 text-base"
              placeholder="YYYY-MM-DD (e.g., 2024-12-28)"
              value={endDate}
              onChangeText={setEndDate}
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Notes */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-600 mb-2">NOTES (Optional)</Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 text-base min-h-24"
              placeholder="Add any notes or reasons for leave..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Info Box */}
          <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <Text className="text-blue-800 text-sm font-semibold mb-1">ℹ️ Connected Leave Detection</Text>
            <Text className="text-blue-700 text-sm">
              The system will automatically detect if this leave is adjacent to a weekend or public holiday
              and mark it as "Connected Leave" accordingly.
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className={`py-4 rounded-xl ${loading ? 'bg-gray-400' : 'bg-blue-500'}`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold text-base">Submit Leave</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default AddLeaveScreen;
