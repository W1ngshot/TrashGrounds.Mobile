import React, { useState } from 'react';
import { Button, View, Text } from 'react-native';
import { uploadImage } from '../api/fileApi';

interface ImageUploadProps {
  onSuccess: (pictureId: string) => void;
  onError: (message: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onSuccess, onError }) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    setImageFile(file);
  };

  const handleUpload = async () => {
    if (imageFile) {
      setUploading(true);
      try {
        const pictureId = await uploadImage(imageFile);
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
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <Button title="Upload Image" onPress={handleUpload} disabled={uploading} />
      {uploading && <Text>Uploading image...</Text>}
    </View>
  );
};

export default ImageUpload;