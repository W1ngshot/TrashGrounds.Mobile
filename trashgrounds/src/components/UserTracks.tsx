import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getTrackListFromUser } from '../api/trackApi';
import { getDefaultImageUrl, getImageUrl } from '../utility/fileLink';
import { FullTrackInfo } from '../models/fullTrackInfo';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Navigation';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface UserTracksProps {
  userId: string;
}

export default function UserTracks({ userId }: UserTracksProps) {
  const [tracks, setTracks] = useState<FullTrackInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const trackList = await getTrackListFromUser(userId, null, 10, 0);
        setTracks(trackList);
      } catch (error) {
        console.error('Error fetching user tracks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a6bff" />
      </View>
    );
  }

  if (tracks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="musical-notes-outline" size={48} color="#ccc" />
        <Text style={styles.emptyText}>No tracks yet</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {tracks.map((track) => (
        <TouchableOpacity
          key={track.trackInfo?.id}
          onPress={() => navigation.navigate('Track', { trackId: track.trackInfo?.id ?? '' })}
          style={styles.trackCard}
        >
          <Image
            source={{
              uri: track.trackInfo?.pictureId
                ? getImageUrl(track.trackInfo.pictureId)
                : getDefaultImageUrl(),
            }}
            style={styles.trackImage}
          />
          
          <View style={styles.trackInfo}>
            <Text style={styles.trackTitle} numberOfLines={1}>
              {track.trackInfo?.title}
            </Text>
            
            <View style={styles.trackMeta}>
              <Text style={styles.trackPlays}>
                <Ionicons name="play" size={14} color="#666" />{' '}
                {track.trackInfo?.listensCount || 0}
              </Text>
              <Text style={styles.trackRating}>
                <Ionicons name="star" size={14} color="#FFD700" />{' '}
                {track.rate?.rating?.toFixed(1) || '0.0'}
              </Text>
            </View>
          </View>
          
          <LinearGradient
            colors={['#4a6bff', '#8a63ff']}
            style={styles.playButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="play" size={24} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 16,
  },
  trackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  trackImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  trackMeta: {
    flexDirection: 'row',
  },
  trackPlays: {
    fontSize: 14,
    color: '#666',
    marginRight: 16,
  },
  trackRating: {
    fontSize: 14,
    color: '#666',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});