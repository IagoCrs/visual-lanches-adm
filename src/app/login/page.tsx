import type { Metadata } from 'next';
import { LoginForm } from '@/components/login/LoginForm';

export const metadata: Metadata = { title: 'Entrar' };

export default function LoginPage() {
  return <LoginForm />;
}
