import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ForgotPasswordPageProps {
  onShowToast: (message: string, type?: 'success' | 'error') => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onShowToast }) => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    const res = await resetPassword(email);
    setSubmitting(false);

    if (res.success) {
      setSuccess(true);
      onShowToast('Password reset link sent to your email.', 'success');
    } else {
      setErrorMsg(res.error || 'Failed to send reset email.');
      onShowToast(res.error || 'Error', 'error');
    }
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <div className="bg-[#0D1424] border border-[#263653] rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold text-[#F8FAFF]">Reset Password</h1>
          <p className="text-xs text-[#AAB8D0]">Enter your account email to receive recovery instructions</p>
        </div>

        {success ? (
          <div className="space-y-4 text-center">
            <div className="p-4 bg-emerald-950/40 border border-emerald-800 rounded-xl text-emerald-300 text-xs space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400" />
              <p className="font-semibold">Reset instructions sent!</p>
              <p>Check your inbox for a password reset link for <span className="text-white font-mono">{email}</span>.</p>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#4776FF] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Sign In</span>
            </Link>
          </div>
        ) : (
          <>
            {errorMsg && (
              <div className="p-3.5 bg-rose-950/40 border border-rose-800 rounded-xl flex items-start gap-2.5 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#4776FF] to-[#8957FF] hover:opacity-90 text-white font-semibold text-xs transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Reset Link...</span>
                  </>
                ) : (
                  <span>Send Reset Link</span>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-[#263653] text-center text-xs text-[#AAB8D0]">
              <Link to="/login" className="text-[#4776FF] font-semibold hover:underline">
                Return to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
