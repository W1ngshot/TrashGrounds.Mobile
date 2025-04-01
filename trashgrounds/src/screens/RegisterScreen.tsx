import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { registerUser } from '../api/authApi';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Navigation';
import { useNavigation } from '@react-navigation/native';


type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    try {
      await registerUser(email, nickname, password);
      setMessage('Registration success');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage('An unknown error occurred');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Register</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Nickname" value={nickname} onChangeText={setNickname} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button title="Register" onPress={handleRegister} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontSize: 18, fontWeight: 'bold' },
  input: { borderWidth: 1, padding: 10, marginVertical: 5 },
  message: { marginTop: 10, color: 'green' },
});