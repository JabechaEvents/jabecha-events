import React from 'react';
import { TextInput, TextInputProps } from 'react-native-paper';

export interface JInputProps extends TextInputProps {}

export const JInput: React.FC<JInputProps> = (props) => {
  return <TextInput mode="outlined" {...props} />;
};

export default JInput; 