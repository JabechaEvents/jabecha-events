import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { Divider, Text, useTheme } from 'react-native-paper';

import JButton from '@/src/components/ui/JButton';
import JDateTimePicker from '@/src/components/ui/JDateTimePicker';
import JImagePicker from '@/src/components/ui/JImagePicker';
import JInput from '@/src/components/ui/JInput';
import JScreen from '@/src/components/ui/JScreen';

import { useAuth } from '@/src/context/AuthContext';
import { EventService } from '@/src/services/eventService';
import { CreateEventFormData, createEventSchema, transformFormToCreateData } from '@/src/validation/eventValidation';
import { useLocalSearchParams } from 'expo-router';

export default function EditEventScreen() {
  const { id: eventId } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
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

  function toDateSafe(val: any): Date | undefined {
    if (!val) return undefined;
    if (val instanceof Date) return val;
    if (val.toDate) return val.toDate();
    return undefined;
  }

  useEffect(() => {
    const loadEventDetails = async () => {
      try {
        const event = await EventService.getEvent(eventId);
        if (!event) {
          Alert.alert('Error', 'Event not found.');
          return;
        }
        setValue('title', event.title);
        setValue('description', event.description);
        setValue('venue', event.venue);
        const dateValue = toDateSafe(event.dateTime);
        if (dateValue) setValue('dateTime', dateValue);
        setValue('isPrivate', !!event.isPrivate);
        setValue('maxGuests', event.maxGuests);
        setValue('coverImage', event.coverImage);
      } catch (error) {
        console.error('Error loading event details:', error);
        Alert.alert('Error', 'Failed to load event details.');
      }
    };
    loadEventDetails();
  }, [eventId, setValue]);

  const handleEditEvent = async (formData: CreateEventFormData) => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to edit an event');
      return;
    }

    try {
      setIsSubmitting(true);

      // Transform form data to service data
      const eventData = transformFormToCreateData(formData);

      // Update event in Firestore
      await EventService.updateEvent(eventId, eventData);

      // Upload cover image if provided
      if (formData.coverImage) {
        setUploadingImage(true);
        try {
          const imageUrl = await EventService.uploadCoverImage(eventId, formData.coverImage);
          await EventService.updateEvent(eventId, { coverImage: imageUrl });
        } catch (imageError) {
          console.error('Error uploading image:', imageError);
          // Continue without image - don't block event update
        } finally {
          setUploadingImage(false);
        }
      }

      Alert.alert('Success! 🎉', 'Your event has been updated successfully!', [
        {
          text: 'View Event',
          onPress: () => router.push(`/events/${eventId}`),
        },
      ]);
    } catch (error) {
      console.error('Error updating event:', error);
      Alert.alert('Error', 'Failed to update event. Please try again.', [{ text: 'OK' }]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <JScreen>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Edit Event
          </Text>
          <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>Edit the details of your event</Text>
        </View>

        <View style={styles.form}>
          {/* Event Title */}
          <Controller
            name="title"
            control={control}
            render={({ field: { onChange, value } }) => (
              <>
                <JInput
                  label="Event Title *"
                  value={value}
                  onChangeText={onChange}
                  error={!!errors.title}
                  placeholder="e.g., Memorial Service for..."
                  maxLength={100}
                />
                {errors.title?.message && <Text style={{ color: 'red' }}>{errors.title.message}</Text>}
              </>
            )}
          />

          {/* Event Description */}
          <Controller
            name="description"
            control={control}
            render={({ field: { onChange, value } }) => (
              <>
                <JInput
                  label="Description *"
                  value={value}
                  onChangeText={onChange}
                  error={!!errors.description}
                  placeholder="Tell people about this event..."
                  multiline
                  numberOfLines={4}
                  maxLength={1000}
                />
                {errors.description?.message && <Text style={{ color: 'red' }}>{errors.description.message}</Text>}
              </>
            )}
          />

          {/* Venue */}
          <Controller
            name="venue"
            control={control}
            render={({ field: { onChange, value } }) => (
              <>
                <JInput
                  label="Venue *"
                  value={value}
                  onChangeText={onChange}
                  error={!!errors.venue}
                  placeholder="e.g., St. Mary's Church, Lagos"
                  maxLength={200}
                />
                {errors.venue?.message && <Text style={{ color: 'red' }}>{errors.venue.message}</Text>}
              </>
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
              <>
                <JInput
                  label="Maximum Guests (Optional)"
                  value={value?.toString() || ''}
                  onChangeText={(text) => {
                    const number = parseInt(text);
                    onChange(isNaN(number) ? undefined : number);
                  }}
                  error={!!errors.maxGuests}
                  placeholder="e.g., 100"
                  keyboardType="numeric"
                />
                {errors.maxGuests?.message && <Text style={{ color: 'red' }}>{errors.maxGuests.message}</Text>}
              </>
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
            onPress={handleSubmit(handleEditEvent as any)}
            loading={isSubmitting || uploadingImage}
            disabled={!isValid || isSubmitting || uploadingImage}
            style={styles.createButton}
          >
            {uploadingImage ? 'Uploading...' : 'Update Event'}
          </JButton>
        </View>

        {/* Progress indicator */}
        {(isSubmitting || uploadingImage) && (
          <View style={styles.progressContainer}>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {uploadingImage ? 'Uploading cover image...' : 'Updating your event...'}
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