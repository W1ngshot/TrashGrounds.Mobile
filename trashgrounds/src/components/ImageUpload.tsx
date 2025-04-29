import React, { useState } from 'react';
import { Button, View, Text, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadImage } from '../api/fileApi';

interface ImageUploadProps {
  onSuccess: (pictureId: string) => void;
  onError: (message: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onSuccess, onError }) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<ImagePicker.ImagePickerAsset | null>(null);

  const handleFilePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageFile(result.assets[0]);
      }
    } catch (error) {
      onError('Failed to pick image');
    }
  };

  const handleUpload = async () => {
    if (imageFile) {
      setUploading(true);
      try {
        const fileToSend = {
          uri: imageFile.uri,
          name: imageFile.fileName || 'photo.jpg',
          type: imageFile.type || 'image/jpeg',
        };

        const pictureId = await uploadImage(fileToSend); // Передаем объект с uri, name, type
        onSuccess(pictureId);
      } catch (error) {
        onError('Error uploading image');
      } finally {
        setUploading(false);
      }
    } else {
      onError('Please select an image');
    }
  };

  return (
    <View>
      <Button title="Choose Image" onPress={handleFilePick} />
      {imageFile && (
        <View style={{ alignItems: 'center', marginVertical: 10 }}>
          <Image source={{ uri: imageFile.uri }} style={{ width: 200, height: 200 }} />
          <Text>Selected Image</Text>
        </View>
      )}
      <Button title="Upload Image" onPress={handleUpload} disabled={uploading || !imageFile} />
      {uploading && <Text>Uploading image...</Text>}
    </View>
  );
};

export default ImageUpload;
