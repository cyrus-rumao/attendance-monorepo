import { useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const { login, loading } = useAuthStore();

  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(form);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-black text-white">
      {/* LEFT SIDE */}
      <div
        className="hidden lg:flex flex-col justify-center px-16 relative overflow-hidden
                     	 bg-gradient-to-br from-zinc-900 via-black to-black"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.15),transparent_60%)]" />

        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-bold leading-tight">
            Track your
            <span className="text-yellow-400"> attendance </span>
            without the chaos
          </h1>

          <p className="mt-6 text-zinc-400 text-lg">
            Manage lectures, labs, and attendance stats in one place. No spreadsheets. No confusion.
          </p>

          <div className="mt-10 space-y-3 text-zinc-300">
            <p>• Smart attendance tracking</p>
            <p>• Visual attendance insights</p>
            <p>• Built for students who hate manual tracking</p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
          <p className="text-zinc-400 mb-8">Login to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-zinc-400">Email</label>
              <input
                type="email"
                required
                className="mt-1 w-full px-4 py-3 rounded-lg
                           bg-zinc-900 border border-zinc-800
                           focus:outline-none focus:border-yellow-500"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="relative">
              <label className="text-sm text-zinc-400">Password</label>

              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="mt-1 w-full px-4 py-3 pr-12 rounded-lg
                           bg-zinc-900 border border-zinc-800
                           focus:outline-none focus:border-yellow-500"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-zinc-400 hover:text-yellow-400"
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-black
                         bg-yellow-400 hover:bg-yellow-500
                         flex items-center justify-center gap-2
                         transition disabled:opacity-60"
            >
              {loading ? (
                'Logging in...'
              ) : (
                <>
                  Login
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-sm text-zinc-400 text-center">
            Don’t have an account?{' '}
            <Link to="/signup" className="text-yellow-400 hover:text-yellow-300">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
