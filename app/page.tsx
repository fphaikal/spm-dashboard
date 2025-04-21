'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthForm } from '@/components/auth-form';
import { Alert } from '@heroui/react';
import { IoMdAlert } from "react-icons/io";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (credentials: { username: string; password: string }) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        // Redirect ke halaman dashboard setelah login berhasil
        router.push('/dashboard');
        console.log('Login success');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
    }
  };

  return (
    <>
      <div className="flex min-h-screen w-screen">
        <div className="w-1/2 hidden xl:block">
          <img
            src="https://www.astragraphia.co.id/id/gallery-download/1"
            alt="Nature"
            className="object-cover w-full h-screen dark:brightness-50"
          />
        </div>
        <div className="w-full xl:w-1/2 flex flex-col items-center justify-center">
          <div className="w-1/2 flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Login</h1>
            {error && <Alert icon={<IoMdAlert size={25}/>} color='danger' title={error} />}
            <AuthForm onSubmit={handleLogin} />
          </div>
        </div>
      </div>
    </>
  );
}