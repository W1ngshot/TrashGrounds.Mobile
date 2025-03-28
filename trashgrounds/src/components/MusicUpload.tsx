import React, { useState } from 'react';
import { Button, View, Text } from 'react-native';
import { uploadMusic } from '../api/fileApi';

interface MusicUploadProps {
  onSuccess: (musicId: string) => void;
  onError: (message: string) => void;
}

const MusicUpload: React.FC<MusicUploadProps> = ({ onSuccess, onError }) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [musicFile, setMusicFile] = useState<File | null>(null);

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    setMusicFile(file);
  };

  const handleUpload = async () => {
    if (musicFile) {
      setUploading(true);
      try {
        const musicId = await uploadMusic(musicFile);
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
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <Button title="Upload Music" onPress={handleUpload} disabled={uploading} />
      {uploading && <Text>Uploading music...</Text>}
    </View>
  );
};

export default MusicUpload;
