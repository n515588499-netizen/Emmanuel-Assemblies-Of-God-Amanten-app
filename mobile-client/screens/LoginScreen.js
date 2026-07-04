import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    try {
      const resp = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await resp.json();
      if (!resp.ok) return Alert.alert('Login failed', data.error || 'Check credentials');

      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('userRole', data.user.role);
      await AsyncStorage.setItem('ministryId', data.user.ministry_id || '');
      await AsyncStorage.setItem('userId', data.user.id);

      if (data.user.role === 'admin') {
        navigation.reset({ index: 0, routes: [{ name: 'AdminDashboard' }] });
      } else if (data.user.role === 'member') {
        if (data.user.ministry_id) {
          navigation.reset({ index: 0, routes: [{ name: 'MinistryDashboard', params: { ministryId: data.user.ministry_id } }] });
        } else {
          navigation.reset({ index: 0, routes: [{ name: 'MemberDashboard' }] });
        }
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'MemberDashboard' }] });
      }
    } catch (err) {
      Alert.alert('Error', 'Unable to login');
      console.error(err);
    }
  }

  return (
    <View style={{ padding: 16 }}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}
