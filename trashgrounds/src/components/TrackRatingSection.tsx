import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserTrackRate, rateTrack } from '../api/rateApi';

interface TrackRatingProps {
  trackId: string;
  averageRating: number;
}

export default function TrackRatingSection({ trackId, averageRating }: TrackRatingProps) {
  const [userRating, setUserRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkUserIdAndFetchRating = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      setUserId(storedUserId);

      if (!storedUserId) {
        setLoading(false);
        return;
      }

      try {
        const response = await getUserTrackRate(trackId);
        setUserRating(response.rate);
      } catch (err) {
        setError('Failed to load user rating');
      } finally {
        setLoading(false);
      }
    };

    checkUserIdAndFetchRating();
  }, [trackId]);

  const handleRate = async (rate: number) => {
    try {
      await rateTrack(trackId, rate);
      setUserRating(rate);
    } catch (err) {
      setError('Failed to update rating');
    }
  };

  if (loading) return <Text>Loading rating...</Text>;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Average Rating: {averageRating.toFixed(1)}</Text>
      {userId && (
        <>
          <Text style={styles.title}>Your Rating: {userRating ?? 'Not rated'}</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((rate) => (
              <TouchableOpacity key={rate} onPress={() => handleRate(rate)} style={styles.star}>
                <Text style={[styles.starText, userRating === rate && styles.selectedStar]}>{rate}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  star: {
    marginHorizontal: 5,
    padding: 8,
  },
  starText: {
    fontSize: 18,
    color: '#555',
  },
  selectedStar: {
    color: '#ffcc00',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: 5,
  },
});
