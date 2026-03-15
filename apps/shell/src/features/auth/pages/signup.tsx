import { useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Signup() {
  const { signup, loading } = useAuthStore();

  const [form, setForm] = useState<SignupForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordsMatch =
    form.password && form.confirmPassword && form.password === form.confirmPassword;

  const passwordsDontMatch = form.confirmPassword && form.password !== form.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signup(form);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-black text-white pt-16">
      {/* LEFT SIDE — FORM */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-2">Create your account</h2>
          <p className="text-zinc-400 mb-8">Start tracking your attendance today</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-zinc-400">Name</label>
              <input
                type="text"
                required
                className="mt-1 w-full px-4 py-3 rounded-lg
                           bg-zinc-900 border border-zinc-800
                           focus:outline-none focus:border-yellow-500"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

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

            <div className="relative">
              <label className="text-sm text-zinc-400">Confirm Password</label>

              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                className="mt-1 w-full px-4 py-3 pr-12 rounded-lg
                           bg-zinc-900 border border-zinc-800
                           focus:outline-none focus:border-yellow-500"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-[38px] text-zinc-400 hover:text-yellow-400"
              >
                {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>

            {form.confirmPassword && (
              <div className="flex items-center gap-2 text-sm">
                {passwordsMatch ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-green-500">Passwords match</span>
                  </>
                ) : passwordsDontMatch ? (
                  <>
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-red-500">Passwords don’t match</span>
                  </>
                ) : null}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-black
                         bg-yellow-400 hover:bg-yellow-500
                         flex items-center justify-center gap-2
                         transition disabled:opacity-60"
            >
              {loading ? (
                'Creating account...'
              ) : (
                <>
                  Sign Up
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-sm text-zinc-400 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-yellow-400 hover:text-yellow-300">
              Login
            </Link>
          </p>
        </div>
      </div>


      <div
        className="hidden lg:flex flex-col justify-center px-16 relative overflow-hidden
                      bg-black"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.15),transparent_60%)]" />

        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-bold leading-tight">
            Never lose track of
            <span className="text-yellow-400"> attendance </span>
            again
          </h1>

          <p className="mt-6 text-zinc-400 text-lg">
            Built for students who want to know exactly how many classes they can safely bunk
            without regret.
          </p>

          <div className="mt-10 space-y-3 text-zinc-300">
            <p>• Smart lecture & lab tracking</p>
            <p>• Attendance analytics</p>
            <p>• Designed for daily college life</p>
          </div>
        </div>
      </div>
    </div>
  );
}
