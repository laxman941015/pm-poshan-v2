import React, { useState } from 'react';
import { AlertCircle, ArrowLeft, CheckCircle2, Key, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Request, 2: Reset
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL || '';

  // Timer logic for resend OTP
  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleRequestToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to request reset');
      
      setSuccess('Verification OTP sent successfully to your email.');
      setCountdown(180); // 3 minutes
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: newPassword }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to reset password');
      
      setSuccess('Password has been reset successfully. You can now login.');
      setStep(3); // Success state
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans text-gray-900 min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-orange-50 flex flex-col relative overflow-hidden">
      
      {/* Background blobs */}
      <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-blue-100 rounded-full blur-[120px] opacity-40 pointer-events-none"></div>
      <div className="absolute bottom-0 -left-1/4 w-[600px] h-[600px] bg-orange-100 rounded-full blur-[100px] opacity-50 pointer-events-none"></div>

      <header className="fixed w-full top-0 z-50 bg-white/70 backdrop-blur-md border-b border-white/20 shadow-sm px-4 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-indigo-800 tracking-tight">
          PM-POSHAN Tracker
        </div>
        <Link to="/login" className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold py-2 px-5 rounded-full shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 text-sm backdrop-blur-sm">
          <ArrowLeft size={16} className="text-slate-500" />
          Back to Login
        </Link>
      </header>

      <main className="flex-grow pt-32 pb-20 px-4 flex items-center justify-center relative z-10">
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white relative overflow-hidden">
            
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl mb-4 shadow-inner">
                {step === 1 ? <Mail size={32} /> : step === 2 ? <Key size={32} /> : <CheckCircle2 size={32} />}
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {step === 1 ? 'Forgot Password?' : step === 2 ? 'Verify & Reset' : 'Success!'}
              </h2>
              <p className="text-slate-500 mt-2 font-medium">
                {step === 1 
                  ? 'Enter your email to receive a 6-digit OTP code.' 
                  : step === 2 
                    ? 'Enter the 6-digit OTP code sent to your email.'
                    : 'Your password has been successfully updated.'}
              </p>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 text-red-600 border border-red-100 p-3 rounded-xl text-sm font-medium flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {success && step !== 3 && (
              <div className="mb-6 bg-green-50 text-green-600 border border-green-100 p-3 rounded-xl text-sm font-medium flex items-center gap-2">
                <CheckCircle2 size={16} />
                {success}
              </div>
            )}

            {step === 1 && (
              <form onSubmit={handleRequestToken} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="school@example.com"
                    className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 transition-all outline-none text-slate-700 placeholder-slate-400 font-medium shadow-sm"
                  />
                </div>
                
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-sm text-slate-600 space-y-2">
                  <p className="font-bold text-slate-800">Security Guidelines:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>OTP is valid for <span className="font-bold">1 hour</span>.</li>
                    <li>Wait <span className="font-bold">3 minutes</span> before requesting a new OTP.</li>
                    <li>Maximum <span className="font-bold">3 attempts</span> allowed.</li>
                    <li>If limits are exceeded, you must wait <span className="font-bold">24 hours</span> to try again.</li>
                  </ul>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all h-14 flex items-center justify-center"
                >
                  {loading ? 'Processing...' : 'Send Verification Code'}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">6-Digit OTP</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="123456"
                    className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 transition-all outline-none text-slate-700 font-medium tracking-widest text-center text-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 transition-all outline-none text-slate-700 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 transition-all outline-none text-slate-700 font-medium"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl transition-all h-14 flex items-center justify-center"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>

                {/* Resend OTP Section */}
                <div className="text-center pt-4 border-t border-slate-100">
                  {countdown > 0 ? (
                    <p className="text-sm font-medium text-slate-500">
                      Resend OTP in <span className="font-bold text-blue-600">{Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleRequestToken}
                      disabled={loading}
                      className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Didn't receive code? Resend OTP
                    </button>
                  )}
                </div>
              </form>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-green-50 text-green-700 p-4 rounded-2xl border border-green-100 flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 shrink-0" size={18} />
                  <p className="text-sm font-medium leading-relaxed">
                    Password updated! You can now log in to the PM-POSHAN Tracker with your new credentials.
                  </p>
                </div>
                <Link
                  to="/login"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all h-14 flex items-center justify-center"
                >
                  Go to Login
                </Link>
              </div>
            )}

          </div>
        </div>
      </main>

      <footer className="py-8 bg-slate-950 text-slate-500 px-4 text-center border-t border-slate-900 mt-auto">
        <p className="text-sm font-medium tracking-wide">© 2026 PM-POSHAN Tracker - Secure Password Recovery.</p>
      </footer>
    </div>
  );
}
