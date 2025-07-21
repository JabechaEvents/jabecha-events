import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Divider, Switch, Text, useTheme } from 'react-native-paper';

import JButton from '@/src/components/ui/JButton';
import JDateTimePicker from '@/src/components/ui/JDateTimePicker';
import JImagePicker from '@/src/components/ui/JImagePicker';
import JInput from '@/src/components/ui/JInput';
import JScreen from '@/src/components/ui/JScreen';

import { useAuth } from '@/src/context/AuthContext';
import { EventService } from '@/src/services/eventService';
import { CreateEventFormData, createEventSchema, transformFormToCreateData } from '@/src/validation/eventValidation';

export default function CreateEventScreen() {
  const theme = useTheme();
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      Alert.alert(
        'Authentication Required',
        'You need to sign in to create events.',
        [
          {
            text: 'Sign In',
            onPress: () => {
              router.back();
              router.push('/(auth)/login');
            }
          },
          {
            text: 'Cancel',
            onPress: () => router.back(),
            style: 'cancel'
          }
        ]
      );
    }
  }, [isAuthenticated]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: '',
      description: '',
      venue: '',
      dateTime: undefined,
      isPrivate: false,
      maxGuests: undefined,
      coverImage: undefined,
    },
    mode: 'onChange',
  });

  const watchedFields = watch();

  const handleCreateEvent = async (formData: CreateEventFormData) => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to create an event');
      return;
    }

    try {
      setIsSubmitting(true);

      // Transform form data to service data
      const eventData = transformFormToCreateData(formData);
      
      // Create event in Firestore
      const eventId = await EventService.createEvent(
        eventData,
        user.uid,
        user.displayName || user.email || 'Unknown User'
      );

      // Upload cover image if provided
      if (formData.coverImage) {
        setUploadingImage(true);
        try {
          const imageUrl = await EventService.uploadCoverImage(eventId, formData.coverImage);
          await EventService.updateEvent(eventId, { coverImage: imageUrl });
        } catch (imageError) {
          console.error('Error uploading image:', imageError);
          // Continue without image - don't block event creation
        } finally {
          setUploadingImage(false);
        }
      }

      Alert.alert(
        'Success! 🎉',
        'Your event has been created successfully!',
        [
          {
            text: 'View Event',
            onPress: () => router.push(`/events/${eventId}`),
          },
          {
            text: 'Create Another',
            onPress: () => router.back(),
          }
        ]
      );

    } catch (error) {
      console.error('Error creating event:', error);
      Alert.alert(
        'Error',
        'Failed to create event. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (Object.values(watchedFields).some(value => value && value !== '')) {
      Alert.alert(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to go back?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  };

  // Show loading while checking authentication
  if (!isAuthenticated) {
    return (
      <JScreen>
        <View style={styles.authCheckContainer}>
          <Text variant="bodyMedium">Checking authentication...</Text>
        </View>
      </JScreen>
    );
  }

  return (
    <JScreen>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Create Event
          </Text>
          <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            Fill in the details for your new event
          </Text>
        </View>

        <View style={styles.form}>
          {/* Event Title */}
          <Controller
            name="title"
            control={control}
            render={({ field: { onChange, value } }) => (
              <JInput
                label="Event Title *"
                value={value}
                onChangeText={onChange}
                error={errors.title?.message}
                placeholder="e.g., Memorial Service for..."
                maxLength={100}
              />
            )}
          />

          {/* Event Description */}
          <Controller
            name="description"
            control={control}
            render={({ field: { onChange, value } }) => (
              <JInput
                label="Description *"
                value={value}
                onChangeText={onChange}
                error={errors.description?.message}
                placeholder="Tell people about this event..."
                multiline
                numberOfLines={4}
                maxLength={1000}
              />
            )}
          />

          {/* Venue */}
          <Controller
            name="venue"
            control={control}
            render={({ field: { onChange, value } }) => (
              <JInput
                label="Venue *"
                value={value}
                onChangeText={onChange}
                error={errors.venue?.message}
                placeholder="e.g., St. Mary's Church, Lagos"
                maxLength={200}
              />
            )}
          />

          {/* Date and Time */}
          <Controller
            name="dateTime"
            control={control}
            render={({ field: { onChange, value } }) => (
              <JDateTimePicker
                label="Date & Time *"
                value={value}
                onChange={onChange}
                error={errors.dateTime?.message}
                minimumDate={new Date()}
              />
            )}
          />

          {/* Cover Image */}
          <Controller
            name="coverImage"
            control={control}
            render={({ field: { onChange, value } }) => (
              <JImagePicker
                label="Cover Image"
                value={value}
                onChange={onChange}
                error={errors.coverImage?.message}
              />
            )}
          />

          <Divider style={styles.divider} />

          {/* Event Settings */}
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Event Settings
          </Text>

          {/* Private Event Toggle */}
          <View style={styles.switchRow}>
            <View style={styles.switchContent}>
              <Text variant="bodyLarge">Private Event</Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Only invited guests can see this event
              </Text>
            </View>
            <Controller
              name="isPrivate"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Switch
                  value={value}
                  onValueChange={onChange}
                />
              )}
            />
          </View>

          {/* Maximum Guests */}
          <Controller
            name="maxGuests"
            control={control}
            render={({ field: { onChange, value } }) => (
              <JInput
                label="Maximum Guests (Optional)"
                value={value?.toString() || ''}
                onChangeText={(text) => {
                  const number = parseInt(text);
                  onChange(isNaN(number) ? undefined : number);
                }}
                error={errors.maxGuests?.message}
                placeholder="e.g., 100"
                keyboardType="numeric"
              />
            )}
          />
        </View>

        <View style={styles.actions}>
          <JButton
            mode="outlined"
            onPress={handleCancel}
            style={styles.cancelButton}
            disabled={isSubmitting}
          >
            Cancel
          </JButton>
          
          <JButton
            mode="contained"
            onPress={handleSubmit(handleCreateEvent)}
            loading={isSubmitting || uploadingImage}
            disabled={!isValid || isSubmitting || uploadingImage}
            style={styles.createButton}
          >
            {uploadingImage ? 'Uploading...' : 'Create Event'}
          </JButton>
        </View>

        {/* Progress indicator */}
        {(isSubmitting || uploadingImage) && (
          <View style={styles.progressContainer}>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {uploadingImage ? 'Uploading cover image...' : 'Creating your event...'}
            </Text>
          </View>
        )}
      </ScrollView>
    </JScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  authCheckContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  form: {
    flex: 1,
  },
  divider: {
    marginVertical: 24,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 16,
  },
  switchContent: {
    flex: 1,
    marginRight: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    marginBottom: 16,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  createButton: {
    flex: 2,
  },
  progressContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
});