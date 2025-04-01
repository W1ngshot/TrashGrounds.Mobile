import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getTrackListByCategory } from '../api/trackApi';
import { FullTrackInfo } from '../models/fullTrackInfo';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Navigation';
import { getDefaultImageUrl, getImageUrl } from '../utility/fileLink';

const categories = ['New', 'Popular', 'MostStreaming'];

type TrackScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Track'>;

export default function HomeScreen() {
  const [tracks, setTracks] = useState<FullTrackInfo[][]>([[], [], []]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation<TrackScreenNavigationProp>();

  const fetchTracksByCategory = async () => {
    setLoading(true);
    try {
      const trackRequests = categories.map((category) =>
        getTrackListByCategory(category, 5, 0)
      );

      const trackResponses = await Promise.all(trackRequests);
      setTracks(trackResponses);
    } catch (error) {
      console.error('Error fetching tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracksByCategory();
  }, []);

  const handleTrackClick = (track: FullTrackInfo) => {
    navigation.navigate('Track', { trackId: track.trackInfo?.id ?? '' });
  };

  const hasTracks = tracks.some(categoryTracks => categoryTracks.length > 0);

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : hasTracks ? (
        categories.map((category, index) =>
          tracks[index].length > 0 && (
            <View key={category} style={styles.categoryContainer}>
              <Text style={styles.categoryTitle}>{category}</Text>
              <ScrollView horizontal>
                {tracks[index].map((item) => (
                  <TouchableOpacity key={item.trackInfo?.id} onPress={() => handleTrackClick(item)} style={styles.trackCard}>
                    <Image
                      source={{
                        uri: item.trackInfo?.pictureId
                          ? getImageUrl(item.trackInfo?.pictureId)
                          : getDefaultImageUrl(),
                      }}
                      style={styles.trackImage}
                    />
                    <Text style={styles.trackTitle}>{item.trackInfo?.title}</Text>
                    <Text style={styles.trackAuthor}>{item.userInfo?.nickname}</Text>
                    <Text style={styles.trackRating}>Rating: {item.rate?.rating ?? 0}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )
        )
      ) : (
        <Text style={styles.noTracksMessage}>Треков пока что нет, вы можете добавить свой</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  trackCard: {
    marginRight: 10,
    alignItems: 'center',
    width: 140,
  },
  trackImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  trackTitle: {
    textAlign: 'center',
    marginTop: 5,
    fontWeight: 'bold',
  },
  trackAuthor: {
    fontSize: 12,
    color: 'gray',
  },
  trackRating: {
    fontSize: 12,
    color: 'gray',
  },
  noTracksMessage: {
    textAlign: 'center',
    fontSize: 18,
    color: 'gray',
    marginTop: 20,
  },
});
