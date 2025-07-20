import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
// @ts-ignore
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import JScreen from '@/components/ui/JScreen';
import JInput from '@/components/ui/JInput';
import JButton from '@/components/ui/JButton';
import { useAuth } from '@/context/AuthContext';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  confirm: z.string().min(6),
}).refine((data) => data.password === data.confirm, {
  message: 'Passwords do not match',
  path: ['confirm'],
});

type FormData = z.infer<typeof schema>;

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useAuth();

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await signUp(data.email, data.password);
      router.replace('/');
    } catch (e: any) {
      Alert.alert('Sign up error', e.message);
    }
  };

  return (
    <JScreen>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <JInput label="Email" keyboardType="email-address" autoCapitalize="none" onBlur={onBlur} onChangeText={onChange} value={value} error={!!errors.email} style={{ marginBottom: 16 }} />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <JInput label="Password" secureTextEntry onBlur={onBlur} onChangeText={onChange} value={value} error={!!errors.password} style={{ marginBottom: 16 }} />
        )}
      />
      <Controller
        control={control}
        name="confirm"
        render={({ field: { onChange, onBlur, value } }) => (
          <JInput label="Confirm Password" secureTextEntry onBlur={onBlur} onChangeText={onChange} value={value} error={!!errors.confirm} style={{ marginBottom: 24 }} />
        )}
      />
      <JButton style={{ marginBottom: 8 }} loading={isSubmitting} onPress={handleSubmit(onSubmit)}>Sign Up</JButton>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      <JButton mode="text" onPress={() => router.push('/(auth)/login' as any)}>Already have an account? Login</JButton>
    </JScreen>
  );
} 