import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Searchbar, Text, useTheme } from 'react-native-paper';

import EventCard from '@/src/components/events/EventCard';
import JScreen from '@/src/components/ui/JScreen';
import { useAuth } from '@/src/context/AuthContext';
import { EventService } from '@/src/services/eventService';
import { Event } from '@/src/types/event';

export default function EventsListScreen() {
  const theme = useTheme();
  const { user, isAuthenticated } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  const loadEvents = async () => {
    try {
      if (isAuthenticated && user) {
        // Load user's events if authenticated
        const userEvents = await EventService.getUserEvents(user.uid, 50);
        setEvents(userEvents);
      } else {
        // Load public events for browsing
        const publicEvents = await EventService.getPublicEvents(50);
        setEvents(publicEvents);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(event =>
        event.title.toLowerCase().includes(query.toLowerCase()) ||
        event.description.toLowerCase().includes(query.toLowerCase()) ||
        event.venue.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredEvents(filtered);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [user, isAuthenticated]);

  useEffect(() => {
    setFilteredEvents(events);
  }, [events]);

  const handleEventPress = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  const displayEvents = searchQuery.trim() === '' ? events : filteredEvents;

  if (loading) {
    return (
      <JScreen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text variant="bodyMedium" style={styles.loadingText}>
            Loading events...
          </Text>
        </View>
      </JScreen>
    );
  }

  return (
    <JScreen>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            {isAuthenticated ? 'Your Events' : 'Discover Events'}
          </Text>
          <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            {isAuthenticated 
              ? `${events.length} event${events.length !== 1 ? 's' : ''} in your collection`
              : `${events.length} public event${events.length !== 1 ? 's' : ''} available`
            }
          </Text>
        </View>

        {/* Search Bar */}
        <Searchbar
          placeholder="Search events..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchbar}
          inputStyle={styles.searchInput}
          iconColor={theme.colors.onSurfaceVariant}
        />

        {/* Events List */}
        <ScrollView
          style={styles.eventsList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {displayEvents.length > 0 ? (
            displayEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onPress={() => handleEventPress(event.id)}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text variant="headlineSmall" style={styles.emptyTitle}>
                {searchQuery.trim() !== '' ? 'No Results Found' : 'No Events Available'}
              </Text>
              <Text variant="bodyMedium" style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                {searchQuery.trim() !== ''
                  ? `No events found matching "${searchQuery}". Try adjusting your search terms.`
                  : isAuthenticated
                    ? 'You haven\'t created any events yet. Tap the + button to create your first event.'
                    : 'There are no public events at the moment. Check back later or create your own event.'
                }
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
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
  header: {
    marginBottom: 20,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    lineHeight: 20,
  },
  searchbar: {
    marginBottom: 20,
    elevation: 2,
  },
  searchInput: {
    fontSize: 16,
  },
  eventsList: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 48,
    marginTop: 64,
  },
  emptyTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    lineHeight: 22,
  },
});