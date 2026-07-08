'use client';

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Cross, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(result.error);
      toast.error(result.error);
      return;
    }

    toast.success('Welcome back!');
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <div className="flex min-h-screen">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-primary-700 to-primary-900 p-12 text-white">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
            <Cross className="h-6 w-6" />
          </div>
          <span className="text-lg font-bold">ILEYSCARE</span>
        </div>

        <div>
          <h1 className="text-4xl font-bold leading-tight">
            Manage your pharmacy,
            <br />
            beautifully simplified.
          </h1>
          <p className="mt-4 max-w-md text-primary-100">
            Track inventory, process sales, and generate reports — all from one
            clean, modern dashboard built for pharmacy teams.
          </p>
        </div>

        <p className="text-sm text-primary-200">© {new Date().getFullYear()} ILEYSCARE Pharmacy Systems</p>
      </div>

      {/* Right form panel */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-gray-50 dark:bg-gray-950 p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
              <Cross className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-gray-800 dark:text-gray-100">ILEYSCARE</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Sign in</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Enter your credentials to access the dashboard.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              id="email"
              type="email"
              label="Email address"
              placeholder="you@pharmacy.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 dark:bg-red-950/50 px-3 py-2 text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" loading={loading} size="lg">
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">
            Authorized users only. Contact your administrator for access.
          </p>
        </div>
      </div>
    </div>
  );
}
