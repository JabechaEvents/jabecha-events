import { Event, EventStatus } from '@/src/types/event';
import { format } from 'date-fns';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Chip, Text, useTheme } from 'react-native-paper';

interface EventCardProps {
  event: Event;
  onPress?: () => void;
  style?: any;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onPress, style }) => {
  const theme = useTheme();

  const formatEventDate = (timestamp: any) => {
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, 'PPP p'); // Monday, April 4th, 2022 at 5:00 PM
    } catch (error) {
      return 'Date TBD';
    }
  };

  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case EventStatus.UPCOMING:
        return theme.colors.primary;
      case EventStatus.ONGOING:
        return '#4CAF50'; // Green
      case EventStatus.COMPLETED:
        return theme.colors.onSurfaceVariant;
      case EventStatus.CANCELLED:
        return theme.colors.error;
      default:
        return theme.colors.onSurfaceVariant;
    }
  };

  const getStatusLabel = (status: EventStatus) => {
    switch (status) {
      case EventStatus.UPCOMING:
        return 'Upcoming';
      case EventStatus.ONGOING:
        return 'Ongoing';
      case EventStatus.COMPLETED:
        return 'Completed';
      case EventStatus.CANCELLED:
        return 'Cancelled';
      default:
        return status;
    }
  };

  const CardContent = () => (
    <Card style={[styles.card, style]} elevation={2}>
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
              {getStatusLabel(event.status)}
            </Chip>
          </View>
        </View>
      )}

      <Card.Content style={styles.content}>
        {/* Event Title */}
        <Text variant="titleMedium" style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>

        {/* Date and Time */}
        <View style={styles.dateRow}>
          <Text variant="bodyMedium" style={[styles.date, { color: theme.colors.primary }]}>
            📅 {formatEventDate(event.dateTime)}
          </Text>
        </View>

        {/* Venue */}
        <View style={styles.venueRow}>
          <Text variant="bodyMedium" style={[styles.venue, { color: theme.colors.onSurfaceVariant }]}>
            📍 {event.venue}
          </Text>
        </View>

        {/* Description Preview */}
        {event.description && (
          <Text 
            variant="bodySmall" 
            style={[styles.description, { color: theme.colors.onSurfaceVariant }]}
            numberOfLines={2}
          >
            {event.description}
          </Text>
        )}

        {/* Event Meta */}
        <View style={styles.metaRow}>
          {event.isPrivate && (
            <Chip
              mode="outlined"
              compact
              icon="lock"
              style={styles.metaChip}
              textStyle={styles.metaChipText}
            >
              Private
            </Chip>
          )}
          
          {event.maxGuests && (
            <Chip
              mode="outlined"
              compact
              icon="account-group"
              style={styles.metaChip}
              textStyle={styles.metaChipText}
            >
              Max {event.maxGuests}
            </Chip>
          )}
        </View>

        {/* Host Info */}
        <Text variant="bodySmall" style={[styles.host, { color: theme.colors.onSurfaceVariant }]}>
          Hosted by {event.hostName}
        </Text>
      </Card.Content>
    </Card>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <CardContent />
      </TouchableOpacity>
    );
  }

  return <CardContent />;
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  imageContainer: {
    position: 'relative',
    height: 180,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
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
    paddingVertical: 16,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 12,
    lineHeight: 24,
  },
  dateRow: {
    marginBottom: 8,
  },
  date: {
    fontWeight: '500',
  },
  venueRow: {
    marginBottom: 8,
  },
  venue: {
    fontWeight: '400',
  },
  description: {
    marginBottom: 12,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 8,
  },
  metaChip: {
    height: 28,
  },
  metaChipText: {
    fontSize: 11,
  },
  host: {
    fontStyle: 'italic',
  },
});

export default EventCard;