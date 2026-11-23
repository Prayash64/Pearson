import React, { useState } from 'react';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Hotel,
  Sparkles,
  Lock,
  User,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginView: React.FC = () => {
  const { login, firstLogin, isLoading, error, useDemoHotel } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
  });

  // First Login (Registration) form state
  const [registerForm, setRegisterForm] = useState({
    restaurantName: '',
    ownerName: '',
    phoneNumber: '',
    ownerPhoneNumber: '',
    address: '',
    email: '',
    ownerEmail: '',
  });

  const [generatedCreds, setGeneratedCreds] = useState<{
    username?: string;
    password?: string;
  } | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.username || !loginForm.password) return;
    await login(loginForm.username, loginForm.password);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerForm.restaurantName || !registerForm.ownerName || !registerForm.phoneNumber) return;

    const creds = await firstLogin(registerForm);
    if (creds && (creds.username || creds.password)) {
      setGeneratedCreds(creds);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#f6f8f6]">
      {/* Left Visual Column */}
      <div className="hidden lg:flex lg:col-span-6 bg-[#113b3a] text-stone-200 flex-col justify-between p-12 relative overflow-hidden">
        {/* Subtle background grid pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #d9e85a 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#d9e85a] text-[#113b3a] font-bold text-xl flex items-center justify-center shadow-md font-['Space_Grotesk']">
              P
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white font-['Space_Grotesk']">
              PEARSON
            </h1>
          </div>
        </div>

        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b4e4c] border border-[#266865] text-[#d9e85a] text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Hospitality Platform</span>
          </div>

          <h2 className="text-4xl font-bold font-['Space_Grotesk'] text-white tracking-tight leading-tight">
            Effortless restaurant ordering powered by AI.
          </h2>

          <p className="text-sm text-[#b2cfc6] leading-relaxed">
            Connect your hotel WhatsApp numbers via Baileys, deploy an autonomous LangGraph agent,
            and index your menus in Pinecone RAG for instant customer query handling.
          </p>

          <div className="p-4 rounded-xl bg-[#174644] border border-[#215452] space-y-2 text-xs">
            <div className="flex items-center gap-2 text-stone-200 font-semibold">
              <CheckCircle className="w-4 h-4 text-[#d9e85a]" />
              <span>4-State Order Pipeline (Pending, In Prep, Ready, Completed)</span>
            </div>
            <div className="flex items-center gap-2 text-stone-200 font-semibold">
              <CheckCircle className="w-4 h-4 text-[#d9e85a]" />
              <span>Interactive Chatbot with Thread-based LLM Memory</span>
            </div>
            <div className="flex items-center gap-2 text-stone-200 font-semibold">
              <CheckCircle className="w-4 h-4 text-[#d9e85a]" />
              <span>Pinecone Vector Menu Ingestion & Retrieval</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-[#7ea599] font-mono">
          © 2026 Pearson Technologies · Open Source Project
        </div>
      </div>

      {/* Right Login / Onboarding Form Column */}
      <div className="lg:col-span-6 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 font-bold">
                Operations Portal
              </span>
              <button
                type="button"
                onClick={useDemoHotel}
                className="text-xs font-semibold text-[#113b3a] hover:underline flex items-center gap-1"
              >
                <span>Instant Demo Access</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <h2 className="text-2xl font-bold text-stone-900 font-['Space_Grotesk'] tracking-tight">
              {mode === 'login' ? 'Sign in to your restaurant' : 'Register your restaurant'}
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              {mode === 'login'
                ? 'Enter your credentials to access live orders, hotel data, and the chatbot.'
                : 'Complete the /hotel/first-login onboarding to generate credentials.'}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex p-1 bg-stone-200/70 rounded-xl text-xs font-semibold">
            <button
              onClick={() => {
                setMode('login');
                setGeneratedCreds(null);
              }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('register');
                setGeneratedCreds(null);
              }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              First Time Onboarding
            </button>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {generatedCreds && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2 font-bold text-emerald-800">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Restaurant successfully registered via /hotel/first-login!</span>
              </div>
              <p className="text-[11px] text-emerald-700">
                Auto-generated credentials (save these for future sign-ins):
              </p>
              <div className="p-2.5 rounded-lg bg-white border border-emerald-200 font-mono text-[11px] space-y-1">
                <div>
                  Username: <strong>{generatedCreds.username || 'Saved'}</strong>
                </div>
                <div>
                  Password: <strong>{generatedCreds.password || 'Saved'}</strong>
                </div>
              </div>
            </div>
          )}

          {/* Login Form */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Owner Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                  <input
                    type="text"
                    value={loginForm.username}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, username: e.target.value })
                    }
                    placeholder="Enter owner username or 'Chef Julian Vance'"
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-[#113b3a]/30 focus:border-[#113b3a] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, password: e.target.value })
                    }
                    placeholder="Enter your password"
                    required
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-[#113b3a]/30 focus:border-[#113b3a] outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-[#113b3a] hover:bg-[#184d4b] text-[#d9e85a] font-bold font-['Space_Grotesk'] text-xs flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-50"
              >
                <span>{isLoading ? 'Signing in...' : 'Sign In to Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={useDemoHotel}
                  className="text-stone-500 hover:text-[#113b3a] text-xs underline font-medium"
                >
                  Skip login with preconfigured Demo Bistro
                </button>
              </div>
            </form>
          ) : (
            /* First Login Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Restaurant Name *
                </label>
                <div className="relative">
                  <Hotel className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                  <input
                    type="text"
                    value={registerForm.restaurantName}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, restaurantName: e.target.value })
                    }
                    placeholder="e.g. Seabrook Hotel & Grill"
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-[#113b3a]/30 focus:border-[#113b3a] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Owner Name *
                  </label>
                  <input
                    type="text"
                    value={registerForm.ownerName}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, ownerName: e.target.value })
                    }
                    placeholder="Owner Full Name"
                    required
                    className="w-full p-2 text-xs rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-[#113b3a]/30 focus:border-[#113b3a] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Phone (10-15 digits) *
                  </label>
                  <input
                    type="tel"
                    value={registerForm.phoneNumber}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, phoneNumber: e.target.value })
                    }
                    placeholder="e.g. 15551234567"
                    required
                    className="w-full p-2 text-xs rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-[#113b3a]/30 focus:border-[#113b3a] outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Restaurant Email
                  </label>
                  <input
                    type="email"
                    value={registerForm.email}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, email: e.target.value })
                    }
                    placeholder="contact@hotel.com"
                    className="w-full p-2 text-xs rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-[#113b3a]/30 focus:border-[#113b3a] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Owner Phone
                  </label>
                  <input
                    type="tel"
                    value={registerForm.ownerPhoneNumber}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        ownerPhoneNumber: e.target.value,
                      })
                    }
                    placeholder="Owner personal phone"
                    className="w-full p-2 text-xs rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-[#113b3a]/30 focus:border-[#113b3a] outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={registerForm.address}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, address: e.target.value })
                  }
                  placeholder="Street, City, State"
                  className="w-full p-2 text-xs rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-[#113b3a]/30 focus:border-[#113b3a] outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-[#113b3a] hover:bg-[#184d4b] text-[#d9e85a] font-bold font-['Space_Grotesk'] text-xs flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-50 mt-2"
              >
                <span>{isLoading ? 'Creating Restaurant...' : 'Complete First Login'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
