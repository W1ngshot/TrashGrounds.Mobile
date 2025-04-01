import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, Switch, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getGenres } from '../api/trackApi';
import { addTrack } from '../api/trackApi';
import MusicUpload from '../components/MusicUpload';
import ImageUpload from '../components/ImageUpload';
import { Genre } from '../models/genre';
import { AddTrackRequest } from '../models/requests/addTrackRequest';
import { FullTrack } from '../models/fullTrack';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Navigation';

type TrackScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Track'>;

export default function UploadTrackScreen() {
  const navigation = useNavigation<TrackScreenNavigationProp>();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isExplicit, setIsExplicit] = useState(false);
  const [musicId, setMusicId] = useState<string | null>(null);
  const [pictureId, setPictureId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const [loadingGenres, setLoadingGenres] = useState<boolean>(false);

  useEffect(() => {
    const fetchGenres = async () => {
      setLoadingGenres(true);
      try {
        const genreList = await getGenres();
        setGenres(genreList);
      } catch (error) {
        setMessage('Error fetching genres');
      } finally {
        setLoadingGenres(false);
      }
    };

    fetchGenres();
  }, []);

  const handleMusicUploadSuccess = (musicId: string) => {
    setMusicId(musicId);
  };

  const handleImageUploadSuccess = (pictureId: string) => {
    setPictureId(pictureId);
  };

  const handleGenreSelection = (genreId: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId) ? prev.filter((id) => id !== genreId) : [...prev, genreId]
    );
  };

  const handleAddTrack = async () => {
    if (!musicId) {
      setMessage('Please upload music first!');
      return;
    }

    const trackData: AddTrackRequest = {
      Title: title,
      Description: description,
      IsExplicit: isExplicit,
      PictureId: pictureId,
      MusicId: musicId,
      Genres: selectedGenres,
    };

    try {
      const addedTrack: FullTrack = await addTrack(trackData);
      setMessage(`Track added successfully: ${addedTrack.track?.title}`);
      if (addedTrack.track?.id) {
        navigation.navigate('Track', { trackId: addedTrack.track.id });
      }
    } catch (error) {
      setMessage('Error adding track');
    }
  };

  const isAddButtonDisabled = !musicId;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Track Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Track Description"
        value={description}
        onChangeText={setDescription}
      />
      <View style={styles.checkboxContainer}>
        <Text>Explicit</Text>
        <Switch value={isExplicit} onValueChange={setIsExplicit} />
      </View>

      <Text style={styles.sectionTitle}>Genres</Text>
      {loadingGenres ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={genres}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleGenreSelection(item.id)}>
              <Text style={styles.genreItem}>
                {selectedGenres.includes(item.id) ? '✔' : ''} {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      <MusicUpload onSuccess={handleMusicUploadSuccess} onError={(msg) => setMessage(msg)} />
      <ImageUpload onSuccess={handleImageUploadSuccess} onError={(msg) => setMessage(msg)} />

      <Text>{message}</Text>

      <Button title="Add Track" onPress={handleAddTrack} disabled={isAddButtonDisabled} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  genreItem: {
    fontSize: 16,
    padding: 10,
  },
});
