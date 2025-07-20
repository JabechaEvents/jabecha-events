import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
// @ts-ignore
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert } from 'react-native';
import JScreen from '@/components/ui/JScreen';
import JInput from '@/components/ui/JInput';
import JButton from '@/components/ui/JButton';
import { useAuth } from '@/context/AuthContext';

const schema = z.object({
  email: z.string().email(),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordScreen() {
  const { resetPassword } = useAuth();

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await resetPassword(data.email);
      Alert.alert('Success', 'Password reset email sent');
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <JScreen>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <JInput label="Email" keyboardType="email-address" autoCapitalize="none" onBlur={onBlur} onChangeText={onChange} value={value} error={!!errors.email} style={{ marginBottom: 24 }} />
        )}
      />
      <JButton loading={isSubmitting} onPress={handleSubmit(onSubmit)}>Send Reset Email</JButton>
    </JScreen>
  );
} 