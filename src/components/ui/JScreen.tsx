import React from 'react';
import { SafeAreaView, StyleSheet, View, ViewProps } from 'react-native';

interface JScreenProps extends ViewProps {
  children: React.ReactNode;
  withPadding?: boolean;
}

export const JScreen: React.FC<JScreenProps> = ({ children, style, withPadding = true, ...rest }) => (
  <SafeAreaView style={styles.safeArea}>
    <View style={[withPadding && styles.container, style]} {...rest}>
      {children}
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  container: {
    flex: 1,
    padding: 16,
  },
});

export default JScreen; 