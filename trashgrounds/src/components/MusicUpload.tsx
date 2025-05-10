import React, { useState } from 'react';
import { Button, View, Text } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { uploadMusic } from '../api/fileApi';

interface MusicUploadProps {
  onSuccess: (musicId: string) => void;
  onError: (message: string) => void;
}

const MusicUpload: React.FC<MusicUploadProps> = ({ onSuccess, onError }) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [musicFile, setMusicFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
      });

      if (result.assets && result.assets.length > 0) {
        setMusicFile(result.assets[0]);
      }
    } catch (error) {
      onError('Failed to pick file');
    }
  };

  const handleUpload = async () => {
    if (musicFile) {
      setUploading(true);
      try {
        const fileToSend = {
          uri: musicFile.uri,
          name: musicFile.name,
          type: musicFile.mimeType || 'audio/mpeg',
        };

        const musicId = await uploadMusic(fileToSend); // Передай fileToSend в свой uploadMusic
        onSuccess(musicId);
      } catch (error) {
        onError('Error uploading music');
      } finally {
        setUploading(false);
      }
    } else {
      onError('Please select a music file');
    }
  };

  return (
    <View>
      <Button title="Choose Music File" onPress={handleFilePick} />
      {musicFile && <Text>Selected: {musicFile.name}</Text>}
      <Button title="Upload Music" onPress={handleUpload} disabled={uploading || !musicFile} />
      {uploading && <Text>Uploading music...</Text>}
    </View>
  );
};

export default MusicUpload;
