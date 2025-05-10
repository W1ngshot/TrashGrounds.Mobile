import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import ImageUpload from '../components/ImageUpload';
import { addPost } from '../api/postApi';
import { getImageUrl } from '../utility/fileLink';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Navigation';

type PostScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'UserProfile'>;

export default function UploadPostScreen() {
  const navigation = useNavigation<PostScreenNavigationProp>();
  const [text, setText] = useState('');
  const [pictureId, setPictureId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUploadSuccess = (pictureId: string) => {
    setPictureId(pictureId);
    setMessage('');
  };

  const handleAddPost = async () => {
    if (!text.trim()) {
      setMessage('Post text is required!');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      await addPost({ text, assetId: pictureId });
      setMessage('Post added successfully!');
      
      // Navigate back after 1.5 seconds
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error) {
      setMessage('Error adding post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = () => {
    setPictureId(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerTitle}>Create New Post</Text>
      
      {/* Post Content Section */}
      <View style={styles.section}>
        <TextInput
          style={styles.input}
          placeholder="What's on your mind?"
          placeholderTextColor="#999"
          value={text}
          onChangeText={setText}
          multiline
          numberOfLines={5}
        />
      </View>

      {/* Image Upload Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add Image (Optional)</Text>
        
        {pictureId ? (
          <View style={styles.imagePreviewContainer}>
            <Image
              source={{ uri: getImageUrl(pictureId) }}
              style={styles.previewImage}
            />
            <TouchableOpacity 
              style={styles.removeImageButton}
              onPress={removeImage}
            >
              <Ionicons name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <ImageUpload 
            onSuccess={handleImageUploadSuccess} 
            onError={(msg) => setMessage(msg)}
            style={styles.uploadButton}
          >
            <Ionicons name="image-outline" size={24} color="#4a6bff" />
            <Text style={styles.uploadButtonText}>Upload Image</Text>
          </ImageUpload>
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
          (!text.trim() || isSubmitting) && styles.disabledButton
        ]}
        onPress={handleAddPost}
        disabled={!text.trim() || isSubmitting}
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
            <Text style={styles.submitButtonText}>Publish Post</Text>
            <Ionicons name="send-outline" size={20} color="#fff" />
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
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#333',
    minHeight: 150,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 15,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4a6bff',
    backgroundColor: 'rgba(74, 107, 255, 0.1)',
  },
  uploadButtonText: {
    color: '#4a6bff',
    fontSize: 16,
    marginLeft: 10,
  },
  imagePreviewContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
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