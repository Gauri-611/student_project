import React, { useState } from 'react';
import { X, ArrowRight, ShieldCheck, Mail, Lock, User, GraduationCap, Briefcase, KeyRound, Check, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

export function AuthModal({ isOpen, onClose, initialMode = 'login', onAuthSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [step, setStep] = useState('form');      // 'form' or 'otp'
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [userType, setUserType] = useState('student'); // 'student' or 'working'
  const [otp, setOtp] = useState('');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [demoOtp, setDemoOtp] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const resetState = () => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(false);
    setDemoOtp('');
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    resetState();
    setLoading(true);

    try {
      const res = await api.register({
        email,
        password,
        name: name || email.split('@')[0],
        user_type: userType
      });

      if (res.otp) {
        setDemoOtp(res.otp);
      }
      setSuccessMsg(`Verification code sent to ${email}`);
      setStep('otp');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    resetState();
    setLoading(true);

    try {
      const res = await api.login({ email, password });
      localStorage.setItem('nearu_token', res.token);
      localStorage.setItem('nearu_user', JSON.stringify(res.user));

      if (onAuthSuccess) {
        onAuthSuccess(res.user, res.token);
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    resetState();
    setLoading(true);

    try {
      const res = await api.verifyOtp(email, otp.trim());
      localStorage.setItem('nearu_token', res.token);
      localStorage.setItem('nearu_user', JSON.stringify(res.user));

      if (onAuthSuccess) {
        onAuthSuccess(res.user, res.token);
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Invalid verification code. Please check again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.sendOtp(email);
      if (res.otp) setDemoOtp(res.otp);
      setSuccessMsg('A new OTP has been sent to your email.');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="mb-6">
          <div className="w-10 h-10 rounded-2xl bg-[#121417] text-[#D2FC00] flex items-center justify-center font-bold text-lg mb-3">
            N
          </div>
          <h3 className="text-2xl font-extrabold font-display text-stone-900">
            {step === 'otp' 
              ? 'Verify Your Email' 
              : mode === 'login' 
                ? 'Welcome Back to NearU' 
                : 'Create Your Indore Pass'}
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            {step === 'otp'
              ? `Enter the 6-digit verification code sent to ${email}`
              : mode === 'login'
                ? 'Sign in to access verified landlord contacts & real local tea'
                : 'Join Indore’s fastest student & newcomer community'}
          </p>
        </div>

        {/* Feedback Alert Messages */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <span>⚠️ {errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <span>✓ {successMsg}</span>
          </div>
        )}

        {/* ----------------- STEP 1: LOGIN OR REGISTER FORM ----------------- */}
        {step === 'form' && (
          <div>
            {/* Mode Toggle Pills (Login vs Register) */}
            <div className="flex bg-stone-100 p-1 rounded-2xl mb-5">
              <button
                type="button"
                onClick={() => { setMode('login'); resetState(); }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  mode === 'login' 
                    ? 'bg-[#121417] text-white shadow-sm' 
                    : 'text-stone-600 hover:text-black'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); resetState(); }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  mode === 'register' 
                    ? 'bg-[#121417] text-white shadow-sm' 
                    : 'text-stone-600 hover:text-black'
                }`}
              >
                Create Account
              </button>
            </div>

            {mode === 'register' ? (
              /* REGISTRATION FORM */
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {/* User Type: Student vs Working Professional */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 font-mono">
                    I am in Indore as a:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setUserType('student')}
                      className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                        userType === 'student'
                          ? 'border-[#121417] bg-stone-50 ring-2 ring-black/5'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        userType === 'student' ? 'bg-[#D2FC00] text-black' : 'bg-stone-100 text-stone-600'
                      }`}>
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-stone-900 block">Student</span>
                        <span className="text-[10px] text-stone-500">College / DAVV</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setUserType('working')}
                      className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                        userType === 'working'
                          ? 'border-[#121417] bg-stone-50 ring-2 ring-black/5'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        userType === 'working' ? 'bg-[#D2FC00] text-black' : 'bg-stone-100 text-stone-600'
                      }`}>
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-stone-900 block">Working</span>
                        <span className="text-[10px] text-stone-500">Job / Internship</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 font-mono">
                    Full Name
                  </label>
                  <div className="flex items-center bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5">
                    <User className="w-4 h-4 text-stone-400 mr-2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priyanshu Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm font-semibold text-stone-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 font-mono">
                    Email Address
                  </label>
                  <div className="flex items-center bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5">
                    <Mail className="w-4 h-4 text-stone-400 mr-2" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. pooja@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm font-semibold text-stone-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 font-mono">
                    Password
                  </label>
                  <div className="flex items-center bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5">
                    <Lock className="w-4 h-4 text-stone-400 mr-2" />
                    <input
                      type="password"
                      required
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm font-semibold text-stone-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Submit Register */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-[#121417] hover:bg-black text-white font-extrabold text-xs sm:text-sm cursor-pointer transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
                >
                  <span>{loading ? 'Creating Account...' : 'Continue to Email OTP'}</span>
                  <ArrowRight className="w-4 h-4 text-[#D2FC00]" />
                </button>
              </form>
            ) : (
              /* LOGIN FORM */
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 font-mono">
                    Email Address
                  </label>
                  <div className="flex items-center bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5">
                    <Mail className="w-4 h-4 text-stone-400 mr-2" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. ananya.iet@davv.ac.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm font-semibold text-stone-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 font-mono">
                    Password
                  </label>
                  <div className="flex items-center bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5">
                    <Lock className="w-4 h-4 text-stone-400 mr-2" />
                    <input
                      type="password"
                      required
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm font-semibold text-stone-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Submit Login */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-[#121417] hover:bg-black text-white font-extrabold text-xs sm:text-sm cursor-pointer transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
                >
                  <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4 text-[#D2FC00]" />
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => { setMode('register'); resetState(); }}
                    className="text-xs text-stone-600 hover:text-black font-semibold underline cursor-pointer"
                  >
                    Don't have an account? Sign up here
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ----------------- STEP 2: EMAIL OTP VERIFICATION ----------------- */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtpSubmit} className="space-y-5 animate-in fade-in duration-200">
            {/* Demo Helper Badge */}
            {demoOtp && (
              <div className="p-3 rounded-2xl bg-[#D2FC00]/25 border border-stone-900/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-stone-600 block">
                    ⚡ Sandbox Email OTP
                  </span>
                  <span className="text-lg font-black tracking-widest font-mono text-stone-900">
                    {demoOtp}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setOtp(demoOtp)}
                  className="px-2.5 py-1 rounded-lg bg-stone-900 text-white text-[10px] font-bold cursor-pointer hover:bg-black"
                >
                  Autofill Code
                </button>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider font-mono">
                  Enter 6-Digit Email Code
                </label>
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="text-[11px] text-stone-500 hover:text-black underline cursor-pointer"
                >
                  Edit email
                </button>
              </div>

              <input
                type="text"
                required
                maxLength={6}
                placeholder="• • • • • •"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center tracking-[0.4em] text-2xl font-black py-3 rounded-xl bg-stone-50 border-2 border-stone-300 text-stone-900 focus:outline-none focus:border-stone-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 4}
              className="w-full py-3 rounded-xl bg-[#121417] hover:bg-black text-white font-extrabold text-xs sm:text-sm cursor-pointer transition-colors shadow-sm disabled:opacity-50"
            >
              <span>{loading ? 'Verifying Code...' : 'Verify Email & Enter'}</span>
            </button>

            <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
              <span>Didn't get the code?</span>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="font-bold text-stone-900 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Resend OTP</span>
              </button>
            </div>
          </form>
        )}

        {/* Security badge */}
        <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-center gap-2 text-[11px] text-stone-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Indore Student ID & Email Protection</span>
        </div>

      </div>
    </div>
  );
}
