import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SettingsScreen from '../screens/SettingsScreen';
import UploadTrackScreen from '../screens/UploadTrackScreen';
import UploadPostScreen from '../screens/UploadPostScreen';
import UserProfileScreen from '../screens/UserProfileScreen';

const Tab = createBottomTabNavigator();

function MainTabs() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        setUserId(storedUserId);
      } catch (error) {
        console.error('Error fetching userId:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  if (loading) return null;

  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      {!userId ? (
        <>
          <Tab.Screen name="Login" component={LoginScreen} />
          <Tab.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Tab.Screen name="Profile" component={UserProfileScreen} initialParams={{ userId }} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
          <Tab.Screen name="Upload Track" component={UploadTrackScreen} />
          <Tab.Screen name="Upload Post" component={UploadPostScreen} />
        </>
      )}
    </Tab.Navigator>
  );
}

export default MainTabs;
