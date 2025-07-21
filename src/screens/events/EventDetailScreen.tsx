import JScreen from '@/src/components/ui/JScreen';
import { useAuth } from '@/src/context/AuthContext';
import { StackParamList } from '@/src/navigation/types';
import { EventService } from '@/src/services/eventService';
import { RouteProp } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Linking, Share, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';

// Define the route prop type
interface EventDetailScreenProps {
  route: RouteProp<StackParamList, 'EventDetail'>;
}

export default function EventDetailScreen({ route }: EventDetailScreenProps) {
  const { eventId } = route.params;
  const [qrValue, setQrValue] = useState(`https://jabecha-events.com/events/${eventId}`);
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const evt = await EventService.getEvent(eventId);
        setEvent(evt);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

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
        {/* Only show Edit/Delete buttons if current user is the host */}
        {loading ? (
          <Text>Loading...</Text>
        ) : event && user && event.hostId === user.uid && (
          <>
            <Button
              mode="outlined"
              onPress={() => router.push(`/events/${eventId}/edit`)}
              style={{ marginTop: 16 }}
            >
              Edit Event
            </Button>
            <Button
              mode="outlined"
              onPress={async () => {
                Alert.alert('Delete Event', 'Are you sure you want to delete this event?', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', style: 'destructive', onPress: async () => {
                    await EventService.deleteEvent(eventId);
                    router.push('/profile');
                  }}
                ]);
              }}
              style={{ marginTop: 8 }}
              textColor="red"
            >
              Delete Event
            </Button>
          </>
        )}
        {/* Sharing Enhancements */}
        <Button
          mode="text"
          onPress={async () => {
            await Clipboard.setStringAsync(qrValue);
            Alert.alert('Copied!', 'Event link copied to clipboard.');
          }}
          style={{ marginTop: 16 }}
        >
          Copy Link
        </Button>
        <Button
          mode="text"
          onPress={() => Linking.openURL(`https://wa.me/?text=${encodeURIComponent(qrValue)}`)}
          style={{ marginTop: 8 }}
        >
          Share via WhatsApp
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