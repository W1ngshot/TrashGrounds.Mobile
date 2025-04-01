import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getTrackListFromUser } from '../api/trackApi';
import { getDefaultImageUrl, getImageUrl } from '../utility/fileLink';
import { FullTrackInfo } from '../models/fullTrackInfo';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Navigation';

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
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (tracks.length === 0) {
    return <Text style={styles.noTracks}>No tracks available</Text>;
  }

  return (
    <ScrollView>
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
            <Text style={styles.trackTitle}>{track.trackInfo?.title}</Text>
            <Text>Plays: {track.trackInfo?.listensCount}</Text>
            <Text>Rating: {track.rate?.rating ?? 0}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  noTracks: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
  trackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  trackImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
