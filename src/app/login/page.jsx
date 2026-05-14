'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, ArrowRight, ChevronLeft, MapPin, Check, SkipForward } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store';
import toast from 'react-hot-toast';
import { usersApi, addressesApi } from '@/lib/api';
import Select from 'react-select';

const fade = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: 0.2 } };

const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: 'var(--bg-tertiary)',
    borderColor: state.isFocused ? 'var(--purple)' : 'var(--border)',
    borderWidth: '1px',
    borderRadius: '2px',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(124,58,255,0.1)' : 'none',
    '&:hover': { borderColor: 'var(--purple)' },
  }),
  input: (base) => ({ ...base, color: 'var(--text-primary)' }),
  singleValue: (base) => ({ ...base, color: 'var(--text-primary)' }),
  menu: (base) => ({ ...base, backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '2px' }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    backgroundColor: isSelected ? 'var(--purple)' : isFocused ? 'rgba(124,58,255,0.1)' : 'transparent',
    color: isSelected ? 'white' : 'var(--text-primary)',
    '&:active': { backgroundColor: 'var(--purple)' },
  }),
  placeholder: (base) => ({ ...base, color: 'var(--text-muted)' }),
};

const wilayatTunisie = [
  { value: "Tunis", label: "Tunis" }, { value: "Ariana", label: "Ariana" },
  { value: "Ben Arous", label: "Ben Arous" }, { value: "Mannouba", label: "Mannouba" },
  { value: "Nabeul", label: "Nabeul" }, { value: "Zaghouan", label: "Zaghouan" },
  { value: "Bizerte", label: "Bizerte" }, { value: "Beja", label: "Beja" },
  { value: "Jendouba", label: "Jendouba" }, { value: "Kef", label: "Kef" },
  { value: "Siliana", label: "Siliana" }, { value: "Sousse", label: "Sousse" },
  { value: "Monastir", label: "Monastir" }, { value: "Mahdia", label: "Mahdia" },
  { value: "Sfax", label: "Sfax" }, { value: "Kairouan", label: "Kairouan" },
  { value: "Kasserine", label: "Kasserine" }, { value: "Sidi Bouzid", label: "Sidi Bouzid" },
  { value: "Gabes", label: "Gabes" }, { value: "Medenine", label: "Medenine" },
  { value: "Tataouine", label: "Tataouine" }, { value: "Gafsa", label: "Gafsa" },
  { value: "Tozeur", label: "Tozeur" }, { value: "Kebili", label: "Kebili" },
];

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { login, googleLogin, loading } = useAuthStore();

  const [isLogin, setIsLogin]                     = useState(true);
  const [showPass, setShowPass]                   = useState(false);
  const [showOtp, setShowOtp]                     = useState(false);
  const [showAddressStep, setShowAddressStep]     = useState(false);
  const [otpCode, setOtpCode]                     = useState(['', '', '', '', '', '']);
  const [pendingRegistration, setPendingRegistration] = useState(null);
  const [form, setForm]                           = useState({ name: '', email: '', password: '', phoneNumber: '' });
  const [googleReady, setGoogleReady]             = useState(false);
  const [savingAddress, setSavingAddress]         = useState(false);

  // Address step state
  const [addrForm, setAddrForm]           = useState({ label: 'Home', fullname: '', phone: '', address: '' });
  const [addrGovernorate, setAddrGovernorate] = useState(null);
  const [addrCity, setAddrCity]           = useState(null);
  const [addrCityOptions, setAddrCityOptions] = useState([]);

  const set = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));
  const setAddr = (k) => (e) => setAddrForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleGoogleCallback = useCallback(async (response) => {
    const res = await googleLogin(response.credential);
    if (res.ok) {
      toast.success('Welcome!');
      if (res.isNewUser) {
        // New Google account — show optional address step
        setAddrForm(f => ({ ...f, fullname: res.user?.name || '', phone: '' }));
        setShowAddressStep(true);
      } else {
        const next = new URLSearchParams(window.location.search).get('next') || '/';
        router.push(next);
      }
    } else {
      toast.error(res.message);
    }
  }, [googleLogin, router]);

  useEffect(() => {
    if (document.getElementById('google-gsi-script')) {
      if (window.google?.accounts) setGoogleReady(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'google-gsi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true; script.defer = true;
    script.onload = () => setGoogleReady(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!googleReady || showOtp || showAddressStep) return;
    const id = requestAnimationFrame(() => {
      const el = document.getElementById('google-signin-btn');
      if (!el) return;
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleCallback,
      });
      el.innerHTML = '';
      window.google.accounts.id.renderButton(el, { theme: 'outline', size: 'large', width: el.offsetWidth || 320, text: 'continue_with' });
    });
    return () => cancelAnimationFrame(id);
  }, [googleReady, showOtp, showAddressStep, handleGoogleCallback]);

  /* ── Governorate/City for address step ── */
  const handleAddrGovernorateChange = async (option) => {
    setAddrGovernorate(option);
    setAddrCity(null);
    if (!option) { setAddrCityOptions([]); return; }
    const res = await fetch(`/api/municipalities?name=${option.value}`);
    const data = await res.json();
    const cities = data[0]?.Delegations || [];
    const seen = new Set();
    const unique = cities.filter(c => {
      const k = c.Name?.trim().toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k); return true;
    });
    setAddrCityOptions(unique.map(c => ({ value: c, label: `${c.Name}${c.PostalCode ? ` (${c.PostalCode})` : ''}` })));
  };

  /* ── OTP handlers ── */
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const next = [...otpCode]; next[index] = value; setOtpCode(next);
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  };
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0)
      document.getElementById(`otp-${index - 1}`)?.focus();
  };

  const sendOtp = async () => {
    try {
      setPendingRegistration({ name: form.name, email: form.email, password: form.password, phoneNumber: form.phoneNumber });
      await usersApi.sendOtp({ email: form.email });
      toast.success('Verification code sent to your email!');
      setShowOtp(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const verifyOtpAndRegister = async () => {
    try {
      const { data } = await usersApi.verifyOtpAndRegister({ ...pendingRegistration, otp: otpCode.join('') });
      const { resetRefreshState } = await import('@/lib/api');
      resetRefreshState();
      useAuthStore.setState({ user: data.user });
      toast.success(`Welcome, ${data.user?.name || 'aboard'}! 🎉`);
      // Pre-fill address form
      setAddrForm(f => ({ ...f, fullname: data.user?.name || '', phone: pendingRegistration?.phoneNumber || '' }));
      setShowOtp(false);
      setShowAddressStep(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    }
  };

  const handleSaveAddress = async () => {
    if (!addrGovernorate || !addrCity) {
      toast.error('Please select a governorate and city');
      return;
    }
    if (addrForm.phone && !/^\+216[23457 9]\d{7}$/.test(addrForm.phone)) {
      toast.error('Invalid phone number');
      return;
    }
    setSavingAddress(true);
    try {
      await addressesApi.add({
        label: addrForm.label || 'Home',
        fullname: addrForm.fullname,
        phone: addrForm.phone,
        address: addrForm.address,
        governorate: addrGovernorate.value,
        city: addrCity.value.Name,
        postalCode: addrCity.value.PostalCode || '',
        isDefault: true,
      });
      toast.success('Address saved! You can manage it from your profile.');
      const next = new URLSearchParams(window.location.search).get('next') || '/';
      router.push(next);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save address');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleSkipAddress = () => {
    const next = new URLSearchParams(window.location.search).get('next') || '/';
    router.push(next);
  };

  const handleSubmit = async () => {
    if (isLogin) {
      const res = await login(form.email, form.password);
      if (res.ok) { toast.success('Welcome back!'); router.push('/'); }
      else toast.error(res.message);
    } else {
      if (!form.name || !form.email || !form.password) { toast.error('Please fill in all required fields'); return; }
      await sendOtp();
    }
  };

  /* ── render ── */
  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-[0.04]" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center,rgba(124,58,255,0.08),transparent 70%)' }} />

      <div className="w-full max-w-md relative">
        <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg,transparent,#7c3aff,transparent)' }} />
        <div className="card-glass p-8" style={{ borderRadius: '0 0 4px 4px' }}>

          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-purple-500 rotate-45" />
              <div className="absolute inset-1 bg-purple-900 rotate-45" />
              <span className="absolute inset-0 flex items-center justify-center font-display text-xs text-white z-10">LU</span>
            </div>
            <span className="font-display text-lg tracking-widest" style={{ color: 'var(--text-primary)' }}>
              LEVEL<span className="text-purple-500">UP</span>
            </span>
          </div>

          {/* ── Address step (shown after successful registration) ── */}
          <AnimatePresence mode="wait">
            {showAddressStep && (
              <motion.div key="address-step" {...fade}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(124,58,255,0.15)' }}>
                    <MapPin size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <h1 className="font-display text-2xl tracking-wider" style={{ color: 'var(--text-primary)' }}>
                      Save a shipping address
                    </h1>
                    <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                      Optional — skip and add later in profile
                    </p>
                  </div>
                </div>

                <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
                  Save your address now for one-click checkout next time.
                </p>

                <div className="space-y-3">
                  {/* Label tabs */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>Label</label>
                    <div className="flex gap-2">
                      {['Home', 'Work', 'Other'].map(l => (
                        <button key={l} onClick={() => setAddrForm(f => ({ ...f, label: l }))}
                          className="flex-1 py-1.5 text-xs font-mono border transition-colors"
                          style={{
                            borderRadius: '2px',
                            borderColor: addrForm.label === l ? 'var(--purple)' : 'var(--border)',
                            background: addrForm.label === l ? 'rgba(124,58,255,0.1)' : 'transparent',
                            color: addrForm.label === l ? 'var(--purple)' : 'var(--text-muted)',
                          }}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>Full Name</label>
                      <input className="input-field" value={addrForm.fullname} onChange={setAddr('fullname')} placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>Phone</label>
                      <div className="flex">
                        <span className="flex items-center px-3 text-xs font-mono flex-shrink-0"
                          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRight: 'none', borderRadius: '2px 0 0 2px', color: 'var(--purple)' }}>
                          +216
                        </span>
                        <input
                          className="input-field flex-1 min-w-0"
                          style={{ borderRadius: '0 2px 2px 0' }}
                          value={addrForm.phone.replace(/^\+216/, '')}
                          onChange={e => {
                            const digits = e.target.value.replace(/\D/g, '').slice(0, 8);
                            if (digits.length > 0 && !/^[23457 9]/.test(digits)) return;
                            setAddrForm(f => ({ ...f, phone: digits ? '+216' + digits : '' }));
                          }}
                          placeholder="XX XXX XXX"
                          inputMode="numeric"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>Governorate</label>
                    <Select options={wilayatTunisie} value={addrGovernorate} onChange={handleAddrGovernorateChange}
                      placeholder="Select governorate..." isClearable styles={customSelectStyles} />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>City / Delegation</label>
                    <Select options={addrCityOptions} value={addrCity} onChange={setAddrCity}
                      placeholder={addrGovernorate ? 'Select city...' : 'Select governorate first'}
                      isClearable isDisabled={!addrGovernorate} styles={customSelectStyles}
                      noOptionsMessage={() => 'No cities found'} />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>
                      Street / Detailed Address <span className="normal-case opacity-50">(optional)</span>
                    </label>
                    <input className="input-field" value={addrForm.address} onChange={setAddr('address')} placeholder="Street, building, apartment..." />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={handleSaveAddress} disabled={savingAddress}
                    className="btn-primary flex-1 py-3.5 text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                    {savingAddress ? <div className="spinner !w-4 !h-4" /> : <Check size={15} />}
                    Save & Continue
                  </button>
                  <button onClick={handleSkipAddress}
                    className="px-5 py-3.5 text-sm flex items-center gap-1.5 border transition-all"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', borderRadius: '2px' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--purple)'; e.currentTarget.style.color = 'var(--purple)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                    <SkipForward size={14} /> Skip
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── OTP view ── */}
          <AnimatePresence mode="wait">
            {showOtp && !showAddressStep && (
              <motion.div key="otp" {...fade}>
                <div className="flex items-center justify-between mb-4">
                  <button onClick={() => { setShowOtp(false); setOtpCode(['','','','','','']); }}
                    className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                    <ChevronLeft size={16} /> Back
                  </button>
                  <button onClick={() => { setShowOtp(false); setPendingRegistration(null); setOtpCode(['','','','','','']); }}
                    className="text-sm text-red-400 hover:text-red-300">
                    Cancel
                  </button>
                </div>

                <h1 className="font-display text-3xl tracking-wider leading-none mb-2" style={{ color: 'var(--text-primary)' }}>
                  Verify your email
                </h1>
                <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
                  Enter the 6-digit code sent to <span className="text-purple-400">{pendingRegistration?.email}</span>
                </p>

                <div className="flex justify-center gap-2 mb-8">
                  {otpCode.map((digit, i) => (
                    <input key={i} id={`otp-${i}`} type="text" inputMode="numeric" maxLength={1} value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-12 h-14 text-center font-mono input-field" style={{ fontSize: '1.5rem' }}
                      autoFocus={i === 0} />
                  ))}
                </div>

                <button onClick={verifyOtpAndRegister} disabled={loading || otpCode.some(d => !d)}
                  className="btn-primary w-full py-4 text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading ? <div className="spinner !w-4 !h-4" /> : <ArrowRight size={15} />}
                  Verify & Create Account
                </button>

                <p className="text-center text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
                  Didn't receive code?{' '}
                  <button onClick={sendOtp} className="text-purple-400 hover:text-purple-300" disabled={loading}>Resend</button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Login / Register view — always rendered so Google button stays alive ── */}
          <div style={{ display: (showOtp || showAddressStep) ? 'none' : 'block' }}>
            <AnimatePresence mode="wait">
              <motion.div key={isLogin ? 'login-head' : 'register-head'} {...fade}>
                <h1 className="font-display text-4xl tracking-wider leading-none" style={{ color: 'var(--text-primary)' }}>
                  {isLogin ? t('auth.login_title') : t('auth.register_title')}
                </h1>
                <p className="text-sm mt-2 mb-8" style={{ color: 'var(--text-muted)' }}>
                  {isLogin ? t('auth.login_sub') : t('auth.register_sub')}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="space-y-4">
              <AnimatePresence>
                {!isLogin && (
                  <motion.div key="name-field" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
                    <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>{t('auth.name')}</label>
                    <input className="input-field" placeholder="John Doe" value={form.name} onChange={set('name')} />
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>{t('auth.email')}</label>
                <input type="email" className="input-field" placeholder="john@example.com" value={form.email} onChange={set('email')} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{t('auth.password')}</label>
                  {isLogin && (
                    <a href="/forgot-password" className="text-[10px] font-mono hover:text-purple-400 transition-colors" style={{ color: 'var(--text-muted)' }}>
                      Forgot password?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} className="input-field pr-10" placeholder="••••••••"
                    value={form.password} onChange={set('password')} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {!isLogin && (
                  <motion.div key="phone-field" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
                    <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>{t('auth.phone')}</label>
                    <input type="tel" className="input-field" placeholder="+21612345678" value={form.phoneNumber} onChange={set('phoneNumber')} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button onClick={handleSubmit} disabled={loading}
              className="btn-primary w-full mt-6 py-4 text-sm flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <div className="spinner !w-4 !h-4" /> : <ArrowRight size={15} />}
              {loading ? (isLogin ? t('auth.logging_in') : 'Sending code...') : (isLogin ? t('auth.login_btn') : t('auth.register_btn'))}
            </button>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
              <span className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>or</span>
              <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            </div>

            <div id="google-signin-btn" className="w-full flex justify-center min-h-[44px]" />

            <p className="text-center text-xs mt-5" style={{ color: 'var(--text-muted)' }}>
              {isLogin ? t('auth.no_account') : t('auth.has_account')}{' '}
              <button onClick={() => { setIsLogin(v => !v); setForm({ name: '', email: '', password: '', phoneNumber: '' }); }}
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                {isLogin ? t('auth.register_link') : t('auth.login_link')}
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
