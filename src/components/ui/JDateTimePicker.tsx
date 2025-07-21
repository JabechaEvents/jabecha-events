import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import React, { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

interface JDateTimePickerProps {
  value: Date | undefined;
  onChange: (date: Date) => void;
  label?: string;
  error?: string;
  mode?: 'date' | 'time' | 'datetime';
  minimumDate?: Date;
  style?: any;
}

export const JDateTimePicker: React.FC<JDateTimePickerProps> = ({
  value,
  onChange,
  label = 'Select Date & Time',
  error,
  mode = 'datetime',
  minimumDate = new Date(),
  style,
}) => {
  const theme = useTheme();
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(value || new Date());

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    
    if (selectedDate) {
      setTempDate(selectedDate);
      if (Platform.OS === 'android') {
        onChange(selectedDate);
      }
    }
  };

  const handleConfirm = () => {
    onChange(tempDate);
    setShowPicker(false);
  };

  const handleCancel = () => {
    setTempDate(value || new Date());
    setShowPicker(false);
  };

  const formatDisplayDate = (date: Date | undefined) => {
    if (!date) return 'Select date and time';
    
    if (mode === 'date') {
      return format(date, 'PPP'); // Monday, April 4th, 2022
    } else if (mode === 'time') {
      return format(date, 'p'); // 5:00 PM
    } else {
      return format(date, 'PPP p'); // Monday, April 4th, 2022 at 5:00 PM
    }
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text variant="labelMedium" style={[styles.label, { color: theme.colors.onSurface }]}>
          {label}
        </Text>
      )}
      
      <Button
        mode="outlined"
        onPress={() => setShowPicker(true)}
        style={[
          styles.button,
          error && { borderColor: theme.colors.error },
        ]}
        contentStyle={styles.buttonContent}
        labelStyle={[
          styles.buttonLabel,
          { color: value ? theme.colors.onSurface : theme.colors.onSurfaceVariant }
        ]}
        icon="calendar"
      >
        {formatDisplayDate(value)}
      </Button>

      {error && (
        <Text variant="bodySmall" style={[styles.error, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}

      {showPicker && (
        <>
          <DateTimePicker
            value={tempDate}
            mode={mode === 'datetime' ? 'date' : mode}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            minimumDate={minimumDate}
          />
          
          {/* For iOS, show time picker after date if datetime mode */}
          {Platform.OS === 'ios' && mode === 'datetime' && (
            <DateTimePicker
              value={tempDate}
              mode="time"
              display="spinner"
              onChange={handleDateChange}
            />
          )}
          
          {/* iOS confirmation buttons */}
          {Platform.OS === 'ios' && (
            <View style={styles.iosButtons}>
              <Button onPress={handleCancel} textColor={theme.colors.onSurfaceVariant}>
                Cancel
              </Button>
              <Button onPress={handleConfirm} mode="contained">
                Confirm
              </Button>
            </View>
          )}
        </>
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
  button: {
    justifyContent: 'flex-start',
    minHeight: 56,
  },
  buttonContent: {
    height: 56,
    justifyContent: 'flex-start',
    paddingHorizontal: 12,
  },
  buttonLabel: {
    fontSize: 16,
    textAlign: 'left',
    flex: 1,
  },
  error: {
    marginTop: 4,
    marginLeft: 12,
  },
  iosButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
  },
});

export default JDateTimePicker;