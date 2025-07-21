import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
// @ts-ignore
import JButton from '@/components/ui/JButton';
import JInput from '@/components/ui/JInput';
import JScreen from '@/components/ui/JScreen';
import { useAuth } from '@/context/AuthContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await signIn(data.email, data.password);
      router.replace('/');
    } catch (e: any) {
      Alert.alert('Login error', e.message);
    }
  };

  return (
    <JScreen>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <JInput
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.email}
            style={{ marginBottom: 16 }}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <JInput
            label="Password"
            secureTextEntry
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.password}
            style={{ marginBottom: 24 }}
          />
        )}
      />
      <JButton style={{ marginBottom: 8 }} loading={isSubmitting} onPress={handleSubmit(onSubmit)}>
        Login
      </JButton>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      <JButton style={{ marginBottom: 4 }} mode="text" onPress={() => router.push('/(auth)/forgot' as any)}>Forgot password?</JButton>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      <JButton mode="text" onPress={() => router.push('/(auth)/signup' as any)}>Create account</JButton>
    </JScreen>
  );
} 