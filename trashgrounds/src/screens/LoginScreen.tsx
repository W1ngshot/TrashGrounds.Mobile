import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { loginUser } from '../api/authApi';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Navigation';
import { useNavigation } from '@react-navigation/native';


type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    try {
      await loginUser(email, password);
      setMessage('Login success');
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
      <Text style={styles.label}>Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button title="Login" onPress={handleLogin} />
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
