import { format } from 'date-fns';
import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, Chip, Text, useTheme } from 'react-native-paper';

import JScreen from '@/src/components/ui/JScreen';
import { useAuth } from '@/src/context/AuthContext';
import { EventService } from '@/src/services/eventService';
import { Event, EventStatus } from '@/src/types/event';

export default function EventDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const eventData = await EventService.getEvent(id);
      setEvent(eventData);
    } catch (error) {
      console.error('Error loading event:', error);
      Alert.alert('Error', 'Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const formatEventDate = (timestamp: any) => {
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, 'EEEE, MMMM do, yyyy \'at\' h:mm a');
    } catch (error) {
      return 'Date TBD';
    }
  };

  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case EventStatus.UPCOMING:
        return theme.colors.primary;
      case EventStatus.ONGOING:
        return '#4CAF50';
      case EventStatus.COMPLETED:
        return theme.colors.onSurfaceVariant;
      case EventStatus.CANCELLED:
        return theme.colors.error;
      default:
        return theme.colors.onSurfaceVariant;
    }
  };

  const isEventHost = event && user && event.hostId === user.uid;

  if (loading) {
    return (
      <JScreen>
        <Stack.Screen options={{ title: 'Loading...' }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text variant="bodyMedium" style={styles.loadingText}>
            Loading event details...
          </Text>
        </View>
      </JScreen>
    );
  }

  if (!event) {
    return (
      <JScreen>
        <Stack.Screen options={{ title: 'Event Not Found' }} />
        <View style={styles.errorContainer}>
          <Text variant="headlineSmall" style={styles.errorTitle}>
            Event Not Found
          </Text>
          <Text variant="bodyMedium" style={styles.errorText}>
            This event may have been deleted or you don't have permission to view it.
          </Text>
          <Button mode="contained" onPress={() => router.back()}>
            Go Back
          </Button>
        </View>
      </JScreen>
    );
  }

  return (
    <JScreen>
      <Stack.Screen 
        options={{ 
          title: event.title,
          headerTitleStyle: { fontSize: 16 }
        }} 
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Cover Image */}
        {event.coverImage && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: event.coverImage }}
              style={styles.coverImage}
              contentFit="cover"
            />
            <View style={styles.imageOverlay}>
              <Chip
                mode="flat"
                textStyle={styles.statusChipText}
                style={[styles.statusChip, { backgroundColor: getStatusColor(event.status) }]}
              >
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </Chip>
            </View>
          </View>
        )}

        <View style={styles.content}>
          {/* Event Title */}
          <Text variant="headlineMedium" style={styles.title}>
            {event.title}
          </Text>

          {/* Event Metadata */}
          <View style={styles.metaContainer}>
            {event.isPrivate && (
              <Chip icon="lock" mode="outlined" compact style={styles.metaChip}>
                Private Event
              </Chip>
            )}
            {event.maxGuests && (
              <Chip icon="account-group" mode="outlined" compact style={styles.metaChip}>
                Max {event.maxGuests} guests
              </Chip>
            )}
          </View>

          {/* Date & Time */}
          <Card style={styles.infoCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.infoTitle}>
                📅 When
              </Text>
              <Text variant="bodyLarge" style={styles.infoText}>
                {formatEventDate(event.dateTime)}
              </Text>
            </Card.Content>
          </Card>

          {/* Venue */}
          <Card style={styles.infoCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.infoTitle}>
                📍 Where
              </Text>
              <Text variant="bodyLarge" style={styles.infoText}>
                {event.venue}
              </Text>
            </Card.Content>
          </Card>

          {/* Description */}
          <Card style={styles.infoCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.infoTitle}>
                📝 About This Event
              </Text>
              <Text variant="bodyLarge" style={styles.description}>
                {event.description}
              </Text>
            </Card.Content>
          </Card>

          {/* Host Information */}
          <Card style={styles.infoCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.infoTitle}>
                👤 Host
              </Text>
              <Text variant="bodyLarge" style={styles.infoText}>
                {event.hostName}
              </Text>
            </Card.Content>
          </Card>

          {/* Actions */}
          {isEventHost && (
            <View style={styles.actionsContainer}>
              <Text variant="titleMedium" style={styles.actionsTitle}>
                Event Management
              </Text>
              <View style={styles.actionsRow}>
                <Button
                  mode="outlined"
                  onPress={() => router.push(`/events/${event.id}/edit`)}
                  style={styles.actionButton}
                  icon="pencil"
                >
                  Edit Event
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => router.push(`/events/${event.id}/guests`)}
                  style={styles.actionButton}
                  icon="account-group"
                >
                  Manage Guests
                </Button>
              </View>
              <Button
                mode="contained"
                onPress={() => router.push(`/events/${event.id}/share`)}
                style={styles.shareButton}
                icon="share"
              >
                Share Event
              </Button>
            </View>
          )}

          {/* Success Message */}
          <Card style={styles.successCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.successTitle}>
                🎉 Event Created Successfully!
              </Text>
              <Text variant="bodyMedium" style={styles.successText}>
                Your event has been created and saved. You can now share it with guests, manage RSVPs, and add more details as needed.
              </Text>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </JScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  imageContainer: {
    position: 'relative',
    height: 240,
    marginBottom: 16,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  statusChip: {
    opacity: 0.95,
  },
  statusChipText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
    lineHeight: 32,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  metaChip: {
    height: 32,
  },
  infoCard: {
    marginBottom: 16,
  },
  infoTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    lineHeight: 22,
  },
  description: {
    lineHeight: 22,
  },
  actionsContainer: {
    marginTop: 24,
    marginBottom: 16,
  },
  actionsTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
  },
  shareButton: {
    marginTop: 4,
  },
  successCard: {
    backgroundColor: '#E8F5E8',
    marginTop: 16,
  },
  successTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2E7D32',
  },
  successText: {
    lineHeight: 20,
    color: '#2E7D32',
  },
});