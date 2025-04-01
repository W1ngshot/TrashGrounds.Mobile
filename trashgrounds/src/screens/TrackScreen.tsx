import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, ScrollView, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { getTrackDetails } from '../api/trackApi';
import { FullTrack } from '../models/fullTrack';
import CommentsSection from '../components/CommentSection';
import UserTracksSection from '../components/UserTracksSection';
import UserInfoSection from '../components/UserInfoSection';
import TrackInfoSection from '../components/TrackInfoSection';
import TrackRatingSection from '../components/TrackRatingSection';

export default function TrackScreen() {
  const [track, setTrack] = useState<FullTrack | null>(null);
  const route = useRoute();
  const { trackId } = route.params as { trackId: string };

  useEffect(() => {
    const fetchTrackDetails = async () => {
      try {
        const trackDetails = await getTrackDetails(trackId);
        setTrack(trackDetails);
      } catch (error) {
        console.error('Error fetching track details:', error);
      }
    };

    fetchTrackDetails();
  }, [trackId]);

  if (!track) return <Text>Loading track details...</Text>;

  return (
    <ScrollView style={styles.container}>
      {track.track && <TrackInfoSection track={track.track} />}

      {track.userInfo && <UserInfoSection userInfo={track.userInfo} />}

      {track.rate && (
        <View style={styles.ratingContainer}>
          <TrackRatingSection trackId={trackId} averageRating={track.rate.rating} />
        </View>
      )}

      <UserTracksSection fullTrack={track} />

      <CommentsSection trackId={trackId} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  ratingContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
});
