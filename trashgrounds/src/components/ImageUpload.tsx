import React, { useState } from 'react';
import { View, Text, Button, Image, Modal, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadImage } from '../api/fileApi';

interface ImageUploadProps {
  onSuccess: (pictureId: string) => void;
  onError: (message: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onSuccess, onError }) => {
  const [imageFile, setImageFile] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [uploading, setUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleFilePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        setImageFile(result.assets[0]);
      }
    } catch (error) {
      onError('Не удалось выбрать изображение');
    }
  };

  const handleUpload = async () => {
    if (!imageFile) {
      onError('Пожалуйста, выберите изображение');
      return;
    }

    setUploading(true);
    try {
      const fileToSend = {
        uri: imageFile.uri,
        name: imageFile.fileName || 'photo.jpg',
        type: imageFile.type || 'image/jpeg',
      };

      const pictureId = await uploadImage(fileToSend);
      onSuccess(pictureId);
      setModalVisible(false);
      setImageFile(null);
    } catch (error) {
      onError('Ошибка при загрузке изображения');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Загрузить изображение" onPress={() => setModalVisible(true)} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setImageFile(null);
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>Выбор изображения</Text>

            {imageFile ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: imageFile.uri }} style={styles.image} />
                <Text>Выбранное изображение</Text>
              </View>
            ) : (
              <Button title="Выбрать из галереи" onPress={handleFilePick} />
            )}

            <View style={styles.buttonRow}>
              <Pressable
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setImageFile(null);
                }}
              >
                <Text style={styles.buttonText}>Отмена</Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.uploadButton]}
                onPress={handleUpload}
                disabled={!imageFile || uploading}
              >
                {uploading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Загрузить</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ImageUpload;


const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    marginHorizontal: 30,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#aaa',
  },
  uploadButton: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

