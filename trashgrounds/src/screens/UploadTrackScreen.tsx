import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Switch, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
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
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setMessage('');
  };

  const handleImageUploadSuccess = (pictureId: string) => {
    setPictureId(pictureId);
    setMessage('');
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

    setIsSubmitting(true);
    setMessage('');

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
      setMessage(`Track "${addedTrack.track?.title}" added successfully!`);
      if (addedTrack.track?.id) {
        setTimeout(() => {
          navigation.navigate('Track', { trackId: addedTrack.track.id });
        }, 1500);
      }
    } catch (error) {
      setMessage('Error adding track. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAddButtonDisabled = !musicId || isSubmitting;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerTitle}>Upload New Track</Text>
      
      {/* Track Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Track Information</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Track Title"
          placeholderTextColor="#999"
          value={title}
          onChangeText={setTitle}
        />
        
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Description (Optional)"
          placeholderTextColor="#999"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
        
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Explicit Content</Text>
          <Switch 
            value={isExplicit} 
            onValueChange={setIsExplicit}
            thumbColor={isExplicit ? '#4a6bff' : '#f4f3f4'}
            trackColor={{ false: '#e9ecef', true: '#cce5ff' }}
          />
        </View>
      </View>

      {/* Genres Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Genres</Text>
        {loadingGenres ? (
          <ActivityIndicator size="large" color="#4a6bff" />
        ) : (
          <View style={styles.genreContainer}>
            {genres.map((genre) => (
              <TouchableOpacity 
                key={genre.id}
                onPress={() => handleGenreSelection(genre.id)}
                style={[
                  styles.genreItem,
                  selectedGenres.includes(genre.id) && styles.selectedGenre
                ]}
              >
                <Text style={[
                  styles.genreText,
                  selectedGenres.includes(genre.id) && styles.selectedGenreText
                ]}>
                  {genre.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Upload Sections */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upload Music</Text>
        <MusicUpload 
          onSuccess={handleMusicUploadSuccess} 
          onError={(msg) => setMessage(msg)} 
          style={styles.uploadButton}
        />
        {musicId && (
          <View style={styles.uploadSuccess}>
            <Ionicons name="checkmark-circle" size={20} color="#28a745" />
            <Text style={styles.uploadSuccessText}>Music uploaded</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upload Cover Image (Optional)</Text>
        <ImageUpload 
          onSuccess={handleImageUploadSuccess} 
          onError={(msg) => setMessage(msg)}
          style={styles.uploadButton}
        />
        {pictureId && (
          <View style={styles.uploadSuccess}>
            <Ionicons name="checkmark-circle" size={20} color="#28a745" />
            <Text style={styles.uploadSuccessText}>Image uploaded</Text>
          </View>
        )}
      </View>

      {/* Message */}
      {message ? (
        <View style={[
          styles.messageContainer,
          message.includes('Error') ? styles.errorMessage : styles.successMessage
        ]}>
          <Ionicons 
            name={message.includes('Error') ? 'alert-circle' : 'checkmark-circle'} 
            size={20} 
            color={message.includes('Error') ? '#dc3545' : '#28a745'} 
          />
          <Text style={styles.messageText}>{message}</Text>
        </View>
      ) : null}

      {/* Submit Button */}
      <TouchableOpacity 
        style={[
          styles.submitButton,
          isAddButtonDisabled && styles.disabledButton
        ]}
        onPress={handleAddTrack}
        disabled={isAddButtonDisabled}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <LinearGradient
            colors={['#4a6bff', '#8a63ff']}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.submitButtonText}>Upload Track</Text>
            <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
          </LinearGradient>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  genreItem: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: '#e9ecef',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  selectedGenre: {
    backgroundColor: '#4a6bff',
    borderColor: '#4a6bff',
  },
  genreText: {
    fontSize: 14,
    color: '#333',
  },
  selectedGenreText: {
    color: '#fff',
  },
  uploadButton: {
    backgroundColor: '#4a6bff',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  uploadSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  uploadSuccessText: {
    color: '#28a745',
    marginLeft: 5,
    fontSize: 14,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  successMessage: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
  },
  errorMessage: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
  },
  messageText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#155724',
  },
  submitButton: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 30,
  },
  gradientButton: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
  },
});