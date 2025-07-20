import React from 'react';
import { Button, ButtonProps } from 'react-native-paper';

export interface JButtonProps extends Omit<ButtonProps, 'mode'> {
  mode?: 'contained' | 'outlined' | 'text';
}

export const JButton: React.FC<JButtonProps> = ({ children, mode = 'contained', ...rest }) => (
  <Button mode={mode} {...rest}>
    {children}
  </Button>
);

export default JButton; 