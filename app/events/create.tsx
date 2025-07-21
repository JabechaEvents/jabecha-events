import CreateEventScreen from '@/src/screens/events/CreateEventScreen';
import { Stack } from 'expo-router';
import React from 'react';

export default function CreateEventPage() {
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Create Event',
          headerShown: true,
          headerBackTitle: 'Back',
        }} 
      />
      <CreateEventScreen />
    </>
  );
}