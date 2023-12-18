import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';
import LoginForm from './LoginForm';

export default function LoginPage() {
  const fakeSessionToken = cookies().get('fakeSession');

  if (fakeSessionToken?.value) {
    redirect('/animals');
  }
  return <LoginForm />;
}
