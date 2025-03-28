import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { MusicTrack } from '../models/musicTrack';
import { getImageUrl } from '../utility/fileLink';

interface TrackInfoSectionProps {
  track: MusicTrack;
}

function TrackInfoSection({ track }: TrackInfoSectionProps) {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: track.pictureId ? getImageUrl(track.pictureId) : 'https://example.com/default-image.jpg',
        }}
        style={styles.trackImage}
      />
      <Text style={styles.trackTitle}>{track.title}</Text>
      <Text>{track.listensCount} listens</Text>
      <Text>{track.description}</Text>

      {track.isExplicit && (
        <Text style={styles.explicit}>Explicit</Text>
      )}

      <View style={styles.genresContainer}>
        {track.genres && track.genres.length > 0 && (
          <Text style={styles.genresTitle}>Genres:</Text>
        )}
        {track.genres.map((genre) => (
          <Text key={genre.id} style={styles.genre}>{genre.name}</Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  trackImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  trackTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  explicit: {
    marginTop: 10,
    color: 'red',
    fontWeight: 'bold',
  },
  genresContainer: {
    marginTop: 10,
  },
  genresTitle: {
    fontWeight: 'bold',
  },
  genre: {
    fontSize: 16,
    marginVertical: 2,
  },
});

export default TrackInfoSection;