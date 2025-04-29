import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getCurrentUserProfile, updateUserStatus, updateUserAvatar } from '../api/userApi';
import { changePassword } from '../api/authApi';
import { UserProfile } from '../models/userProfile';
import ImageUpload from '../components/ImageUpload';
import { getDefaultImageUrl, getImageUrl } from '../utility/fileLink';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Navigation';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [message, setMessage] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getCurrentUserProfile();
        setProfile(profileData);
        setNewStatus(profileData.status || '');
      } catch (error) {
        setMessage('Error loading profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateStatus = async () => {
    try {
      await updateUserStatus(newStatus);
      setProfile(prevProfile => (prevProfile ? { ...prevProfile, status: newStatus } : prevProfile));
      setMessage('Status updated successfully');
    } catch (error: unknown) {
      setMessage(error instanceof Error ? `Error: ${error.message}` : 'Failed to update status');
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      await changePassword(oldPassword, newPassword);
      setMessage('Password changed successfully');
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a6bff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {profile && (
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: profile.avatarId ? getImageUrl(profile.avatarId) : getDefaultImageUrl(),
              }}
              style={styles.userAvatar}
            />
            <ImageUpload 
              onSuccess={handleAvatarUpdate} 
              onError={(msg) => setMessage(msg)}
              style={styles.uploadButton}
            >
              <Ionicons name="camera" size={24} color="#fff" />
            </ImageUpload>
          </View>

          <Text style={styles.nickname}>{profile.nickname}</Text>
          <Text style={styles.userId}>ID: {profile.id}</Text>
          <Text style={styles.registrationDate}>
            Member since {new Date(profile.registrationDate).toLocaleDateString()}
          </Text>
        </View>
      )}

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'profile' && styles.activeTab]}
          onPress={() => setActiveTab('profile')}
        >
          <Text style={[styles.tabText, activeTab === 'profile' && styles.activeTabText]}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'security' && styles.activeTab]}
          onPress={() => setActiveTab('security')}
        >
          <Text style={[styles.tabText, activeTab === 'security' && styles.activeTabText]}>Security</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'profile' ? (
        <View style={styles.profileSection}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={styles.statusContainer}>
            <TextInput
              style={styles.input}
              placeholder="What's on your mind?"
              value={newStatus}
              onChangeText={setNewStatus}
              multiline
            />
            <TouchableOpacity 
              style={styles.updateButton}
              onPress={handleUpdateStatus}
            >
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={20} color="#666" />
              <Text style={styles.infoText}>
                Joined {new Date(profile?.registrationDate || '').toLocaleDateString()}
              </Text>
            </View>
            {profile?.status && (
              <View style={styles.infoItem}>
                <Ionicons name="information-circle-outline" size={20} color="#666" />
                <Text style={styles.infoText}>{profile.status}</Text>
              </View>
            )}
          </View>
        </View>
      ) : (
        <View style={styles.securitySection}>
          <Text style={styles.sectionTitle}>Change Password</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Current password"
            secureTextEntry
            value={oldPassword}
            onChangeText={setOldPassword}
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            placeholder="New password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm new password"
            secureTextEntry
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
            placeholderTextColor="#999"
          />
          
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleChangePassword}
          >
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      )}

      {message ? (
        <View style={message.includes('Error') ? styles.errorMessage : styles.successMessage}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      ) : null}

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={20} color="#dc3545" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  userAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#e9ecef',
  },
  uploadButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#4a6bff',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  nickname: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userId: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  registrationDate: {
    fontSize: 14,
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#e9ecef',
    borderRadius: 10,
    overflow: 'hidden',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#4a6bff',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  profileSection: {
    paddingHorizontal: 20,
  },
  securitySection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statusContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  updateButton: {
    backgroundColor: '#4a6bff',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#4a6bff',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  successMessage: {
    backgroundColor: '#d4edda',
    padding: 16,
    borderRadius: 10,
    margin: 20,
    borderWidth: 1,
    borderColor: '#c3e6cb',
  },
  errorMessage: {
    backgroundColor: '#f8d7da',
    padding: 16,
    borderRadius: 10,
    margin: 20,
    borderWidth: 1,
    borderColor: '#f5c6cb',
  },
  messageText: {
    color: '#155724',
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    margin: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  logoutText: {
    color: '#dc3545',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});