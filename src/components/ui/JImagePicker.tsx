import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, View } from 'react-native';
import { Button, Card, IconButton, Text, useTheme } from 'react-native-paper';

interface JImagePickerProps {
  value?: string;
  onChange: (imageUri: string | undefined) => void;
  label?: string;
  error?: string;
  style?: any;
}

export const JImagePicker: React.FC<JImagePickerProps> = ({
  value,
  onChange,
  label = 'Cover Image',
  error,
  style,
}) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please allow access to your photo library to select an image.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    try {
      setIsLoading(true);
      
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9], // Good aspect ratio for event covers
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets[0]) {
        onChange(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const takePhoto = async () => {
    try {
      setIsLoading(true);
      
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow camera access to take a photo.',
          [{ text: 'OK' }]
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onChange(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Select Image',
      'Choose how you want to add an image',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Photo Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const removeImage = () => {
    Alert.alert(
      'Remove Image',
      'Are you sure you want to remove this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => onChange(undefined) },
      ]
    );
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text variant="labelMedium" style={[styles.label, { color: theme.colors.onSurface }]}>
          {label}
        </Text>
      )}

      {value ? (
        <Card style={styles.imageCard}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: value }} style={styles.image} />
            <View style={styles.imageOverlay}>
              <IconButton
                icon="close"
                iconColor="white"
                style={[styles.removeButton, { backgroundColor: 'rgba(0,0,0,0.6)' }]}
                onPress={removeImage}
              />
            </View>
          </View>
          <Card.Actions>
            <Button onPress={showImageOptions} disabled={isLoading}>
              Change Image
            </Button>
          </Card.Actions>
        </Card>
      ) : (
        <Card style={[styles.placeholderCard, error && { borderColor: theme.colors.error }]}>
          <Card.Content style={styles.placeholderContent}>
            <IconButton
              icon="image-plus"
              size={48}
              iconColor={theme.colors.onSurfaceVariant}
            />
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              Add a cover image for your event
            </Text>
            <Button
              mode="outlined"
              onPress={showImageOptions}
              loading={isLoading}
              disabled={isLoading}
              style={styles.addButton}
            >
              Select Image
            </Button>
          </Card.Content>
        </Card>
      )}

      {error && (
        <Text variant="bodySmall" style={[styles.error, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: '500',
  },
  imageCard: {
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  removeButton: {
    margin: 0,
  },
  placeholderCard: {
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  placeholderContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  addButton: {
    marginTop: 16,
  },
  error: {
    marginTop: 4,
    marginLeft: 12,
  },
});

export default JImagePicker;