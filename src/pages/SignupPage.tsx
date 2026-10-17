import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SignupPageProps {
  onShowToast: (message: string, type?: 'success' | 'error') => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onShowToast }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setErrorMsg('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    const result = await signUp(email, password, name);
    setSubmitting(false);

    if (result.success) {
      onShowToast('Account created successfully!', 'success');
      navigate('/tools', { replace: true });
    } else {
      setErrorMsg(result.error || 'Failed to create account.');
      onShowToast(result.error || 'Signup failed', 'error');
    }
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <div className="bg-[#0D1424] border border-[#263653] rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold text-[#F8FAFF]">Create an Account</h1>
          <p className="text-xs text-[#AAB8D0]">Get instant access to AI tools and workspaces</p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-950/40 border border-rose-800 rounded-xl flex items-start gap-2.5 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#AAB8D0]">Full Name</label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-[#AAB8D0] absolute left-3.5" />
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-3 bg-[#090F1D] border border-[#263653] rounded-xl text-[#F8FAFF] placeholder-[#AAB8D0]/50 text-xs focus:outline-none focus:ring-2 focus:ring-[#4776FF]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#AAB8D0]">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-[#AAB8D0] absolute left-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 bg-[#090F1D] border border-[#263653] rounded-xl text-[#F8FAFF] placeholder-[#AAB8D0]/50 text-xs focus:outline-none focus:ring-2 focus:ring-[#4776FF]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#AAB8D0]">Password</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-[#AAB8D0] absolute left-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-4 py-3 bg-[#090F1D] border border-[#263653] rounded-xl text-[#F8FAFF] placeholder-[#AAB8D0]/50 text-xs focus:outline-none focus:ring-2 focus:ring-[#4776FF]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#4776FF] to-[#8957FF] hover:opacity-90 text-white font-semibold text-xs transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-[#263653] text-center text-xs text-[#AAB8D0]">
          <span>Already have an account? </span>
          <Link to="/login" className="text-[#4776FF] font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
