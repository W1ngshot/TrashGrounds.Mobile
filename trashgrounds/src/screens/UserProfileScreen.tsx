import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useRoute } from '@react-navigation/native';
import { getUserProfile } from '../api/userApi';
import { getDefaultImageUrl, getImageUrl } from '../utility/fileLink';
import UserTracks from '../components/UserTracks';
import UserPosts from '../components/UserPosts';
import { UserProfile } from '../models/userProfile';

const Tab = createMaterialTopTabNavigator();

export default function UserProfileScreen() {
  const route = useRoute();
  const { userId } = route.params as { userId: string };
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile(userId);
        setProfile(data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      {profile ? (
        <>
          <Image
            source={{
              uri: profile.avatarId ? getImageUrl(profile.avatarId) : getDefaultImageUrl(),
            }}
            style={styles.avatar}
          />
          <Text style={styles.nickname}>{profile.nickname}</Text>
          <Text>Registered: {profile.registrationDate}</Text>
          {profile.status && <Text>Status: {profile.status}</Text>}

          <Tab.Navigator>
            <Tab.Screen name="Tracks">
              {() => <UserTracks userId={userId} />}
            </Tab.Screen>
            <Tab.Screen name="Posts">
              {() => <UserPosts userId={userId} />}
            </Tab.Screen>
          </Tab.Navigator>
        </>
      ) : (
        <Text>User not found</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  nickname: { fontSize: 20, fontWeight: 'bold' },
});
