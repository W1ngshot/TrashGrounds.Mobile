import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Image, ScrollView } from 'react-native';
import { getCurrentUserProfile, updateUserStatus, updateUserAvatar } from '../api/userApi';
import { changePassword } from '../api/authApi';
import { UserProfile } from '../models/userProfile';
import ImageUpload from '../components/ImageUpload';
import { getDefaultImageUrl, getImageUrl } from '../utility/fileLink';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Navigation';
import { useNavigation } from '@react-navigation/native';


type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [message, setMessage] = useState('');
  const [newStatus, setNewStatus] = useState('');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getCurrentUserProfile();
        setProfile(profileData);
      } catch (error) {
        setMessage('Ошибка загрузки профиля');
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateStatus = async () => {
    try {
      await updateUserStatus(newStatus);
      setProfile(prevProfile => (prevProfile ? { ...prevProfile, status: newStatus } : prevProfile));
      setMessage('Status updated successfully');
      setNewStatus('');
    } catch (error: unknown) {
      setMessage(error instanceof Error ? `Error: ${error.message}` : 'Failed to update status');
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setMessage('Новый пароль и подтверждение пароля не совпадают');
      return;
    }

    try {
      await changePassword(oldPassword, newPassword);
      setMessage('Пароль успешно изменен');
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error: unknown) {
      setMessage(error instanceof Error ? `Error: ${error.message}` : 'Failed to change password');
    }
  };

  const handleAvatarUpdate = async (newAvatarId: string) => {
    try {
      await updateUserAvatar(newAvatarId);

      setProfile(prevProfile => (prevProfile ? { ...prevProfile, avatarId: newAvatarId } : prevProfile));
      setMessage('Avatar updated successfully');
    } catch (error) {
      setMessage('Error updating avatar');
    }
  };

  const handleAvatarError = (message: string) => {
    setMessage(message);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userId']);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {profile && (
        <View>
          <Image
            source={{
              uri: profile.avatarId ? getImageUrl(profile.avatarId) : getDefaultImageUrl(),
            }}
            style={styles.userAvatar}
          />
          <Text>ID: {profile.id}</Text>
          <Text>Nickname: {profile.nickname}</Text>
          <Text>Registered: {profile.registrationDate}</Text>
          {profile.status && <Text>Status: {profile.status}</Text>}
        </View>
      )}

      <View style={styles.inputContainer}>
        <ImageUpload onSuccess={handleAvatarUpdate} onError={handleAvatarError} />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter new status"
          value={newStatus}
          onChangeText={setNewStatus}
        />
        <Button title="Update Status" onPress={handleUpdateStatus} />
      </View>

      <View style={styles.passwordSection}>
        <Text style={styles.sectionTitle}>Change Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter old password"
          secureTextEntry
          value={oldPassword}
          onChangeText={setOldPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter new password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm new password"
          secureTextEntry
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
        />
        <Button title="Change Password" onPress={handleChangePassword} />
      </View>

      {message ? <Text style={styles.message}>{message}</Text> : null}

      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>
        <Button title="Logout" onPress={handleLogout} color="red" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  inputContainer: { marginTop: 20 },
  input: { borderBottomWidth: 1, marginBottom: 10, padding: 5 },
  message: { marginTop: 10, color: 'green' },
  passwordSection: { marginTop: 30 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  userAvatar: { width: 250, height: 250, marginRight: 10, },
  title: { fontSize: 20, marginBottom: 20, },
});
