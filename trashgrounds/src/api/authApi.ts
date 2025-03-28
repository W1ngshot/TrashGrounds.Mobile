import apiClient from './apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const registerUser = async (email: string, nickname: string, password: string) => {
  try {
    const response = await apiClient.post('/auth/register', {
      Email: email,
      Nickname: nickname,
      Password: password,
    });
    await AsyncStorage.setItem('accessToken', response.data.accessToken);
    await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
    await AsyncStorage.setItem('userId', response.data.userId);

    console.log('User registered successfully');
    return response.data;
  } catch (error) {
    console.error('Registration failed', error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await apiClient.post('/auth/login', {
      Email: email,
      Password: password,
    });
    await AsyncStorage.setItem('accessToken', response.data.accessToken);
    await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
    await AsyncStorage.setItem('userId', response.data.userId);

    console.log('User logged in successfully');
    return response.data;
  } catch (error) {
    console.error('Login failed', error);
    throw error;
  }
};

export const changePassword = async (oldPassword: string, newPassword: string) => {
  try {
    const response = await apiClient.patch('/auth/change-password', {
      OldPassword: oldPassword,
      NewPassword: newPassword,
    });
    console.log(response.data.message);
    return response.data;
  } catch (error) {
    console.error('Failed to change password', error);
    throw error;
  }
};