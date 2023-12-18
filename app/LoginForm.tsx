'use client';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const loginMutation = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      firstName
      type
      accessory
    }
  }
`;

export default function LoginForm() {
  const [onError, setOnError] = useState('');
  const [info, setInfo] = useState('');
  const router = useRouter();

  const [loginHandler] = useMutation(loginMutation, {
    variables: {
      username: 'lucia',
      password: 'asdf',
    },

    onError: (error) => {
      setOnError(error.message);
    },

    onCompleted: () => {
      router.refresh();
      setInfo('Successfully logged in');
    },
  });
  return (
    <div>
      <h1>Login</h1>
      <div>
        <button
          onClick={async () => {
            await loginHandler();
          }}
        >
          Login
        </button>
      </div>
      <div className="error">{onError}</div>
      <div className="success">{info}</div>
    </div>
  );
}
