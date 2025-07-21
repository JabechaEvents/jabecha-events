import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, FAB, Text, useTheme } from 'react-native-paper';

import EventCard from '@/src/components/events/EventCard';
import JScreen from '@/src/components/ui/JScreen';
import { useAuth } from '@/src/context/AuthContext';
import { EventService } from '@/src/services/eventService';
import { Event } from '@/src/types/event';

export default function HomeScreen() {
  const theme = useTheme();
  const { user, signOut } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadEvents = async () => {
    if (!user) return;
    
    try {
      const userEvents = await EventService.getUpcomingEvents(user.uid, 5);
      setEvents(userEvents);
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

  useEffect(() => {
    loadEvents();
  }, [user]);

  const handleCreateEvent = () => {
    router.push('/events/create');
  };

  const handleEventPress = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  const renderEmptyState = () => (
    <Card style={styles.emptyCard}>
      <Card.Content style={styles.emptyContent}>
        <Text variant="headlineSmall" style={styles.emptyTitle}>
          🎉 Welcome to Jabecha Events!
        </Text>
        <Text variant="bodyMedium" style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
          Create your first event to get started. Manage funeral services, memorial gatherings, and special occasions with ease.
        </Text>
        <Button
          mode="contained"
          onPress={handleCreateEvent}
          style={styles.emptyButton}
          icon="plus"
        >
          Create Your First Event
        </Button>
      </Card.Content>
    </Card>
  );

  return (
    <JScreen style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.greeting}>
            Welcome back{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}! 👋
          </Text>
          <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            {events.length > 0 
              ? `You have ${events.length} upcoming event${events.length > 1 ? 's' : ''}`
              : 'Ready to create your first event?'
            }
          </Text>
        </View>

        {/* Events Section */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text variant="bodyMedium">Loading your events...</Text>
          </View>
        ) : events.length > 0 ? (
          <View style={styles.eventsSection}>
            <View style={styles.sectionHeader}>
              <Text variant="titleLarge" style={styles.sectionTitle}>
                Upcoming Events
              </Text>
              <Button
                mode="text"
                onPress={() => router.push('/events')}
                compact
              >
                View All
              </Button>
            </View>
            
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onPress={() => handleEventPress(event.id)}
              />
            ))}
          </View>
        ) : (
          renderEmptyState()
        )}

        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.actionsTitle}>
              Quick Actions
            </Text>
            <View style={styles.actionsRow}>
              <Button
                mode="outlined"
                onPress={() => router.push('/marketplace')}
                style={styles.actionButton}
                icon="store"
              >
                Browse Services
              </Button>
              <Button
                mode="outlined"
                onPress={() => router.push('/profile')}
                style={styles.actionButton}
                icon="account"
              >
                View Profile
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Temporary logout button */}
        {user && (
          <View style={styles.footer}>
            <Button
              mode="text"
              onPress={signOut}
              textColor={theme.colors.onSurfaceVariant}
              icon="logout"
            >
              Sign Out
            </Button>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleCreateEvent}
        label="Create Event"
        mode="extended"
      />
      {/* Floating Auth Buttons */}
      {!user && (
        <View style={styles.authButtonsContainer}>
          <FAB
            icon="login"
            style={[styles.authFab, { backgroundColor: theme.colors.primary }]}
            onPress={() => router.push('/(auth)/login')}
            label="Login"
            mode="flat"
          />
          <FAB
            icon="account-plus"
            style={[styles.authFab, { backgroundColor: theme.colors.secondary }]}
            onPress={() => router.push('/(auth)/signup')}
            label="Sign Up"
            mode="flat"
          />
        </View>
      )}
    </JScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    lineHeight: 20,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  eventsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  emptyCard: {
    marginBottom: 24,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyButton: {
    minWidth: 200,
  },
  actionsCard: {
    marginBottom: 24,
  },
  actionsTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  authButtonsContainer: {
    position: 'absolute',
    bottom: 80,
    right: 16,
    flexDirection: 'column',
    gap: 12,
  },
  authFab: {
    marginBottom: 8,
  },
});
