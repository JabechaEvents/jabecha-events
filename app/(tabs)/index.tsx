import React from 'react';
import { Text } from 'react-native-paper';
import JScreen from '@/components/ui/JScreen';
import JButton from '@/components/ui/JButton';
import { useAuth } from '@/context/AuthContext';

export default function HomeScreen() {
  const { user, signOut } = useAuth();

  return (
    <JScreen>
      <Text variant="titleLarge" style={{ marginBottom: 24 }}>
        Welcome{user?.email ? `, ${user.email}` : ''}!
      </Text>
      <JButton onPress={signOut}>Log Out</JButton>
    </JScreen>
  );
}
