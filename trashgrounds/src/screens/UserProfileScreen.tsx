import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useRoute } from '@react-navigation/native';
import { getUserProfile } from '../api/userApi';
import { getDefaultImageUrl, getImageUrl } from '../utility/fileLink';
import UserTracks from '../components/UserTracks';
import UserPosts from '../components/UserPosts';
import { UserProfile } from '../models/userProfile';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a6bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {profile ? (
        <>
          <LinearGradient
            colors={['#4a6bff', '#8a63ff']}
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.profileHeader}>
              <Image
                source={{
                  uri: profile.avatarId ? getImageUrl(profile.avatarId) : getDefaultImageUrl(),
                }}
                style={styles.avatar}
              />
              <View style={styles.profileInfo}>
                <Text style={styles.nickname}>{profile.nickname}</Text>
                <View style={styles.metaContainer}>
                  <View style={styles.metaItem}>
                    <Ionicons name="calendar" size={16} color="#fff" />
                    <Text style={styles.metaText}>
                      Joined {new Date(profile.registrationDate).toLocaleDateString()}
                    </Text>
                  </View>
                  {profile.status && (
                    <View style={styles.metaItem}>
                      <Ionicons name="information-circle" size={16} color="#fff" />
                      <Text style={styles.metaText}>{profile.status}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </LinearGradient>

          <Tab.Navigator
            screenOptions={{
              tabBarActiveTintColor: '#4a6bff',
              tabBarInactiveTintColor: '#666',
              tabBarIndicatorStyle: {
                backgroundColor: '#4a6bff',
                height: 3,
              },
              tabBarLabelStyle: {
                fontSize: 14,
                fontWeight: '600',
                textTransform: 'none',
              },
              tabBarStyle: {
                backgroundColor: '#fff',
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 1,
                borderBottomColor: '#eee',
              },
            }}
          >
            <Tab.Screen 
              name="Tracks" 
              options={{
                tabBarIcon: ({ color }) => (
                  <Ionicons name="musical-notes" size={20} color={color} />
                ),
              }}
            >
              {() => <UserTracks userId={userId} />}
            </Tab.Screen>
            <Tab.Screen 
              name="Posts" 
              options={{
                tabBarIcon: ({ color }) => (
                  <Ionicons name="document-text" size={20} color={color} />
                ),
              }}
            >
              {() => <UserPosts userId={userId} />}
            </Tab.Screen>
          </Tab.Navigator>
        </>
      ) : (
        <View style={styles.notFoundContainer}>
          <Ionicons name="sad-outline" size={48} color="#999" />
          <Text style={styles.notFoundText}>User not found</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  profileInfo: {
    marginLeft: 20,
    flex: 1,
  },
  nickname: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  metaContainer: {
    marginTop: 5,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  metaText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 14,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
  },
});