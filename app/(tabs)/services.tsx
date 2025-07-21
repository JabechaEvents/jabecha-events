import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';

import JScreen from '@/src/components/ui/JScreen';
import { useAuth } from '@/src/context/AuthContext';

export default function ServicesScreen() {
  const theme = useTheme();
  const { isAuthenticated } = useAuth();

  const serviceCategories = [
    {
      id: 1,
      name: 'Catering Services',
      description: 'Professional catering for memorial events',
      icon: '🍽️',
      color: '#FF6B6B',
    },
    {
      id: 2,
      name: 'Tent & Equipment Rental',
      description: 'Tents, chairs, tables, and sound systems',
      icon: '⛺',
      color: '#4ECDC4',
    },
    {
      id: 3,
      name: 'Photography & Videography',
      description: 'Capture precious memories professionally',
      icon: '📸',
      color: '#45B7D1',
    },
    {
      id: 4,
      name: 'Floral Arrangements',
      description: 'Beautiful flowers for memorial services',
      icon: '🌺',
      color: '#FFA726',
    },
    {
      id: 5,
      name: 'Transportation',
      description: 'Buses and vehicles for guests',
      icon: '🚌',
      color: '#66BB6A',
    },
    {
      id: 6,
      name: 'Program Design & Printing',
      description: 'Custom memorial programs and materials',
      icon: '📄',
      color: '#AB47BC',
    },
  ];

  return (
    <JScreen>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Services & Vendors
          </Text>
          <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            Find trusted service providers for your event needs
          </Text>
        </View>

        {/* Service Categories */}
        <View style={styles.categoriesGrid}>
          {serviceCategories.map((category) => (
            <Card key={category.id} style={styles.categoryCard}>
              <Card.Content style={styles.categoryContent}>
                <View style={styles.categoryHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: `${category.color}20` }]}>
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                  </View>
                </View>
                <Text variant="titleMedium" style={styles.categoryName}>
                  {category.name}
                </Text>
                <Text variant="bodySmall" style={[styles.categoryDescription, { color: theme.colors.onSurfaceVariant }]}>
                  {category.description}
                </Text>
              </Card.Content>
            </Card>
          ))}
        </View>

        {/* Coming Soon Notice */}
        <Card style={styles.comingSoonCard}>
          <Card.Content style={styles.comingSoonContent}>
            <Text variant="titleLarge" style={styles.comingSoonTitle}>
              🚀 Coming Soon!
            </Text>
            <Text variant="bodyMedium" style={[styles.comingSoonText, { color: theme.colors.onSurfaceVariant }]}>
              We're building an amazing marketplace to connect you with the best service providers in your area. 
              Stay tuned for vetted vendors, reviews, and easy booking.
            </Text>
            {!isAuthenticated && (
              <Button
                mode="outlined"
                onPress={() => router.push('/auth/signup')}
                style={styles.signUpButton}
                icon="bell"
              >
                Get Notified When Ready
              </Button>
            )}
          </Card.Content>
        </Card>
      </View>
    </JScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    lineHeight: 20,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  categoryCard: {
    width: '47%', // Two columns with gap
    minHeight: 140,
  },
  categoryContent: {
    height: '100%',
    justifyContent: 'space-between',
  },
  categoryHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryName: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryDescription: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 16,
  },
  comingSoonCard: {
    backgroundColor: '#E3F2FD',
  },
  comingSoonContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  comingSoonTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1976D2',
  },
  comingSoonText: {
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  signUpButton: {
    marginTop: 8,
    borderColor: '#1976D2',
  },
});