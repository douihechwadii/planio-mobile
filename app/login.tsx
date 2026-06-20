// src/screens/LoginScreen.tsx
import { useAuth } from '@/lib/AuthContext';
import { api } from '@/lib/axios';
import { theme } from '@/theme/theme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const deviceId = "mobile";
      const { data } = await api.post('/auth/login', {
        email,
        password,
        deviceId,
      });
      await login(data.accessToken, data.refreshToken);
      router.replace('/(tabs)');
      // navigation handled by your root navigator watching isAuthenticated
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Invalid username or password');
      } else if (err.message === 'Network Error') {
        setError('Cannot reach server. Check your backend URL and network.');
      } else {
        console.log('FULL ERROR:', JSON.stringify(err.response?.data, null, 2));
        console.log('STATUS:', err.response?.status);
        console.log('MESSAGE:', err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <Text variant="headlineMedium" style={styles.title}>
        Planio Login
      </Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
        style={styles.input}
      />

      <HelperText type="error" visible={!!error}>
        {error}
      </HelperText>

      <Button
        mode="contained"
        onPress={handleLogin}
        loading={isSubmitting}
        disabled={isSubmitting || !email || !password}
        style={styles.button}
      >
        Log In
      </Button>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { marginBottom: 24, textAlign: 'center' },
  input: { marginBottom: 8 },
  button: { marginTop: 8 , backgroundColor: theme.colors.primary},
});