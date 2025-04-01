import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FullTrackInfo } from '../models/fullTrackInfo';
import { FullTrack } from '../models/fullTrack';
import { getTrackListFromUser } from '../api/trackApi';
import { getDefaultImageUrl, getImageUrl } from '../utility/fileLink';

interface UserTracksSectionProps {
  fullTrack: FullTrack;
}

function UserTracksSection({ fullTrack }: UserTracksSectionProps) {
  const [userTracks, setUserTracks] = useState<FullTrackInfo[]>([]);
  const navigation = useNavigation();
  const { userInfo, track } = fullTrack;

  useEffect(() => {
    const fetchUserTracks = async () => {
      if (userInfo?.id && track?.id) {
        try {
          const tracks = await getTrackListFromUser(userInfo.id, track.id, 5, 0);
          setUserTracks(tracks);
        } catch (error) {
          console.error('Error fetching user tracks:', error);
        }
      }
    };

    fetchUserTracks();
  }, [userInfo?.id, track?.id]);

  if (userTracks.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>More Tracks from This User</Text>
      <View style={styles.tracksContainer}>
        {userTracks.map((item) => (
          <TouchableOpacity
            key={item.trackInfo?.id}
            onPress={() => navigation.navigate('Track', { trackId: item.trackInfo?.id })}
            style={styles.trackItem}
          >
            <Image
              source={{
                uri: item.trackInfo?.pictureId
                  ? getImageUrl(item.trackInfo?.pictureId)
                  : getDefaultImageUrl(),
              }}
              style={styles.trackImage}
            />
            <Text style={styles.trackTitle}>{item.trackInfo?.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  tracksContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  trackItem: {
    marginRight: 10,
    alignItems: 'center',
  },
  trackImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  trackTitle: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default UserTracksSection;