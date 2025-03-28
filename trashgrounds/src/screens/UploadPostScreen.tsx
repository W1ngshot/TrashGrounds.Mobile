import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Image } from 'react-native';
import ImageUpload from '../components/ImageUpload';
import { addPost } from '../api/postApi';
import { getImageUrl } from '../utility/fileLink';

export default function UploadPostScreen() {
  const [text, setText] = useState('');
  const [pictureId, setPictureId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const handleImageUploadSuccess = (pictureId: string) => {
    setPictureId(pictureId);
  };

  const handleAddPost = async () => {
    if (!text.trim()) {
      setMessage('Post text is required!');
      return;
    }

    try {
      await addPost({ text, assetId: pictureId });
      setMessage('Post added successfully');
      // TODO navigate to user profile posts
    } catch (error) {
      setMessage('Error adding post');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Write your post..."
        value={text}
        onChangeText={setText}
        multiline
      />
      {pictureId && <Image
        source={{
          uri: getImageUrl(pictureId),
        }}
        style={styles.avatar}
      />}
      <ImageUpload onSuccess={handleImageUploadSuccess} onError={(msg) => setMessage(msg)} />
      <Text>{message}</Text>
      <Button title="Add Post" onPress={handleAddPost} disabled={!text.trim()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    textAlignVertical: 'top',
  },
  avatar: {
    width: 100,
    height: 100,
    marginBottom: 10
  },
});
