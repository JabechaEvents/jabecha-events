import EventsListScreen from '@/src/screens/events/EventsListScreen';
import { Stack } from 'expo-router';
import React from 'react';

export default function EventsPage() {
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Events',
          headerShown: true,
          headerBackTitle: 'Back',
        }} 
      />
      <EventsListScreen />
    </>
  );
}