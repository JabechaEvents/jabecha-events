import JScreen from '@/src/components/ui/JScreen';
import { StackParamList } from '@/src/navigation/types';
import { RouteProp } from '@react-navigation/native';
import React, { useState } from 'react';
import { Share, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';

// Define the route prop type
interface EventDetailScreenProps {
  route: RouteProp<StackParamList, 'EventDetail'>;
}

export default function EventDetailScreen({ route }: EventDetailScreenProps) {
  const { eventId } = route.params;
  const [qrValue, setQrValue] = useState(`https://jabecha-events.com/events/${eventId}`);

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out this event: https://jabecha-events.com/events/${eventId}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  return (
    <JScreen>
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>
          Event Details
        </Text>
        <QRCode
          value={qrValue}
          size={200}
        />
        <Button mode="contained" onPress={handleShare} style={styles.shareButton}>
          Share Event
        </Button>
      </View>
    </JScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    marginBottom: 24,
    fontWeight: 'bold',
  },
  shareButton: {
    marginTop: 24,
  },
}); 