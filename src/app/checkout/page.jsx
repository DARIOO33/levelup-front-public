'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { CheckCircle, ArrowLeft, Package, ChevronLeft, MailCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ordersApi, couponApi } from '@/lib/api';
import { useCartStore, useAuthStore } from '@/store';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import Select from 'react-select';
import { useMemo } from 'react';
import GuestAccountBanner from '@/components/GuestAccountBanner';

const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>{label}</label>
    {children}
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);

// ── OTP input grid ────────────────────────────────────────────────────────────
function OtpGrid({ otp, onChange, onKeyDown }) {
  return (
    <div className="flex justify-center gap-2">
      {otp.map((digit, i) => (
        <input
          key={i} id={`otp-${i}`} type="text" inputMode="numeric" maxLength={1} value={digit}
          onChange={(e) => onChange(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          className="w-12 h-14 text-center font-mono input-field"
          style={{ fontSize: '1.5rem' }}
          autoFocus={i === 0}
        />
      ))}
    </div>
  );
}

// Custom styles for react-select
const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: 'var(--bg-tertiary)',
    borderColor: state.isFocused ? 'var(--purple)' : 'var(--border)',
    borderWidth: '1px',
    borderRadius: '2px',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(124,58,255,0.1)' : 'none',
    '&:hover': {
      borderColor: 'var(--purple)',
    },
  }),
  input: (base) => ({
    ...base,
    color: 'var(--text-primary)',
  }),
  singleValue: (base) => ({
    ...base,
    color: 'var(--text-primary)',
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: '2px',
  }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    backgroundColor: isSelected ? 'var(--purple)' : isFocused ? 'rgba(124,58,255,0.1)' : 'transparent',
    color: isSelected ? 'white' : 'var(--text-primary)',
    '&:active': {
      backgroundColor: 'var(--purple)',
    },
  }),
  placeholder: (base) => ({
    ...base,
    color: 'var(--text-muted)',
  }),
};

export default function CheckoutPage() {
  const { t } = useTranslation();
  const { items, clear } = useCartStore();
  const { user } = useAuthStore();

  const [form, setForm] = useState({ fullname: '', email: '', phone: '', address: '' });

  const [selectedGovernorate, setSelectedGovernorate] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [cityOptions, setCityOptions] = useState([]);

  const wilayatTunisie = [
    { value: "Tunis", label: "Tunis" },
    { value: "Ariana", label: "Ariana" },
    { value: "Ben Arous", label: "Ben Arous" },
    { value: "Mannouba", label: "Mannouba" },
    { value: "Nabeul", label: "Nabeul" },
    { value: "Zaghouan", label: "Zaghouan" },
    { value: "Bizerte", label: "Bizerte" },
    { value: "Beja", label: "Beja" },
    { value: "Jendouba", label: "Jendouba" },
    { value: "Kef", label: "Kef" },
    { value: "Siliana", label: "Siliana" },
    { value: "Sousse", label: "Sousse" },
    { value: "Monastir", label: "Monastir" },
    { value: "Mahdia", label: "Mahdia" },
    { value: "Sfax", label: "Sfax" },
    { value: "Kairouan", label: "Kairouan" },
    { value: "Kasserine", label: "Kasserine" },
    { value: "Sidi Bouzid", label: "Sidi Bouzid" },
    { value: "Gabes", label: "Gabes" },
    { value: "Medenine", label: "Medenine" },
    { value: "Tataouine", label: "Tataouine" },
    { value: "Gafsa", label: "Gafsa" },
    { value: "Tozeur", label: "Tozeur" },
    { value: "Kebili", label: "Kebili" }
  ];

  const handleGovernorateChange = async (selectedOption) => {
    setSelectedGovernorate(selectedOption);
    setSelectedCity(null); // Reset city when governorate changes
    
    if (!selectedOption) {
      setCityOptions([]);
      return;
    }

    const res = await fetch(`/api/municipalities?name=${selectedOption.value}`);
    const data = await res.json();
    
    // Transform cities to react-select format with unique values
    const cities = data[0]?.Delegations || [];
    const seen = new Set();
    const uniqueCities = cities.filter((c) => {
      const key = c.Name?.trim().toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    
    setCityOptions(uniqueCities.map(city => ({
      value: city,
      label: `${city.Name} ${city.PostalCode ? `(${city.PostalCode})` : ''}`
    })));
  };

  const handleCityChange = (selectedOption) => {
    setSelectedCity(selectedOption);
  };

  // Pre-fill form with logged-in user data
  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        fullname: f.fullname || user.name || '',
        email: user.email || '',
        phone: f.phone || user.phoneNumber || '',
      }));
    }
  }, [user]);
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Guest OTP state
  const [step, setStep] = useState('form');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [pendingEmail, setPendingEmail] = useState('');
  const [emailConflict, setEmailConflict] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponData, setCouponData] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const validate = () => {
    const e = {};
    if (!form.fullname.trim()) e.fullname = t('checkout.required');
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = t('checkout.invalid_email');
    if (!form.phone.trim() || !/^\+?[0-9]{8,15}$/.test(form.phone)) e.phone = t('checkout.invalid_phone');
    if (!form.address.trim()) e.address = t('checkout.required');
    if (!selectedGovernorate) e.governorate = t('checkout.required');
    if (!selectedCity) e.city = t('checkout.required');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const res = await couponApi.validate(couponCode.trim(), total);
      setCouponData(res.data.coupon);
    } catch (e) {
      setCouponError(e.response?.data?.message || 'Invalid coupon code');
      setCouponData(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => { setCouponData(null); setCouponCode(''); setCouponError(''); };

  const finalTotal = couponData ? Math.max(0, total - couponData.discount) : total;

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0)
      document.getElementById(`otp-${index - 1}`)?.focus();
  };

  // Step 1: place order
  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const orderItems = items.map(i => ({ product: i.productId, variantID: i.variantId, quantity: i.quantity }));
      const fullAddress = selectedCity
        ? `${form.address || ''} ${selectedCity.value.Name} ${selectedCity.value.PostalCode || ''} ${selectedGovernorate.value}`
        : form.address;
      
      const res = await ordersApi.create({ 
        customer: { ...form, address: fullAddress }, 
        items: orderItems, 
        ...(couponData ? { couponCode: couponData.code } : {}) 
      });

      if (res.data.status === 'otp_required') {
        setPendingEmail(form.email);
        setStep('otp');
        toast.success('Check your email for a verification code!');
      } else {
        clear();
        setStep('success');
      }
    } catch (e) {
      if (e.response?.status === 409) {
        setEmailConflict(true);
      } else {
        toast.error(e.response?.data?.message || t('common.error'));
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: verify OTP
  const handleVerifyOtp = async () => {
    if (otp.some(d => !d)) return;
    setLoading(true);
    try {
      await ordersApi.verifyGuestOtp({ email: pendingEmail, otp: otp.join('') });
      clear();
      setStep('success');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await ordersApi.resendGuestOtp({ email: pendingEmail });
      setOtp(['', '', '', '', '', '']);
      toast.success('A new code has been sent!');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to resend code.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && step === 'form') return (
    <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4">
      <p className="font-display text-3xl" style={{ color: 'var(--text-muted)' }}>Cart is empty</p>
      <Link href="/shop" className="btn-primary flex items-center gap-2"><ArrowLeft size={14} /> Shop</Link>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <AnimatePresence mode="wait">

          {/* ── Success ── */}
          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center gap-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center animate-pulse-glow"
                style={{ background: 'rgba(124,58,255,0.15)' }}>
                <CheckCircle size={40} className="text-purple-500" />
              </div>
              <div>
                <h2 className="font-display text-5xl tracking-widest" style={{ color: 'var(--text-primary)' }}>
                  {t('checkout.success_title')}
                </h2>
                <p className="mt-3 text-sm max-w-sm" style={{ color: 'var(--text-muted)' }}>
                  {t('checkout.success_sub')}
                </p>
                <p className="mt-2 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                  A confirmation email has been sent to {pendingEmail || form.email}
                </p>
              </div>

              {!user && (
                <div className="w-full max-w-md">
                  <GuestAccountBanner
                    context="checkout"
                    prefillEmail={pendingEmail || form.email}
                    prefillName={form.fullname}
                    prefillPhone={form.phone}
                  />
                </div>
              )}

              <Link href="/shop" className="btn-primary flex items-center gap-2 text-sm">
                <Package size={15} /> {t('checkout.continue')}
              </Link>
            </motion.div>
          )}

          {/* ── OTP verification (guest only) ── */}
          {step === 'otp' && (
            <motion.div key="otp" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto py-16">
              <div className="h-0.5 w-full mb-0" style={{ background: 'linear-gradient(90deg,transparent,#7c3aff,transparent)' }} />
              <div className="card-glass p-8" style={{ borderRadius: '0 0 4px 4px' }}>

                <button onClick={() => { setStep('form'); setOtp(['', '', '', '', '', '']); }}
                  className="flex items-center gap-1 text-xs font-mono mb-6 hover:text-purple-400 transition-colors"
                  style={{ color: 'var(--text-muted)' }}>
                  <ChevronLeft size={14} /> Back to form
                </button>

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(124,58,255,0.15)' }}>
                    <MailCheck size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl tracking-wider" style={{ color: 'var(--text-primary)' }}>
                      Verify your email
                    </h2>
                    <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                      Code sent to <span className="text-purple-400">{pendingEmail}</span>
                    </p>
                  </div>
                </div>

                <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                  We sent a 6-digit code to your email to confirm this order. It expires in 10 minutes.
                </p>

                <OtpGrid otp={otp} onChange={handleOtpChange} onKeyDown={handleOtpKeyDown} />

                <button onClick={handleVerifyOtp} disabled={loading || otp.some(d => !d)}
                  className="btn-primary w-full mt-6 py-4 text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading ? <div className="spinner !w-4 !h-4" /> : <CheckCircle size={15} />}
                  Confirm Order
                </button>

                <p className="text-center text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
                  Didn't receive it?{' '}
                  <button onClick={handleResendOtp} disabled={loading}
                    className="text-purple-400 hover:text-purple-300 transition-colors" style={{ fontWeight: 500 }}>
                    Resend code
                  </button>
                </p>
              </div>
            </motion.div>
          )}

          {/* ── Checkout form ── */}
          {step === 'form' && (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <span className="tag mb-3 inline-flex">Secure Checkout</span>
              <h1 className="section-title mb-10">{t('checkout.title')}</h1>

              {!user && (
                <GuestAccountBanner
                  context="cart"
                  prefillEmail={form.email}
                  prefillName={form.fullname}
                  prefillPhone={form.phone}
                />
              )}
              {!user && (
                <div className="mb-2 p-4 border rounded text-xs font-mono flex items-start gap-3"
                  style={{ borderColor: 'rgba(124,58,255,0.3)', background: 'rgba(124,58,255,0.05)', color: 'var(--text-muted)' }}>
                  <MailCheck size={15} className="text-purple-400 flex-shrink-0 mt-0.5" />
                  <span>
                    Checking out as a guest. We&apos;ll send a verification code to your email to confirm the order.{' '}
                    <Link href="/login" className="text-purple-400 hover:underline">Log in</Link>{' '}
                    to skip this step and track your orders easily.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Form */}
                <div className="lg:col-span-3 space-y-5">
                  <h2 className="font-mono text-xs uppercase tracking-widest mb-4 text-purple-500">{t('checkout.info')}</h2>
                  <Field label={t('checkout.fullname')} error={errors.fullname}>
                    <input className="input-field" value={form.fullname}
                      onChange={e => setForm({ ...form, fullname: e.target.value })} placeholder="John Doe" />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label={t('checkout.email')} error={errors.email}>
                      {user ? (
                        <div className="input-field flex items-center gap-2 cursor-not-allowed"
                          style={{ opacity: 0.75, background: 'var(--bg-secondary)' }}>
                          <span className="flex-1 text-sm" style={{ color: 'var(--text-primary)' }}>{form.email}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded flex-shrink-0"
                            style={{ background: 'rgba(124,58,255,0.12)', color: 'var(--purple)' }}>account</span>
                        </div>
                      ) : (
                        <>
                          <input type="email"
                            className="input-field"
                            style={emailConflict ? { borderColor: '#f59e0b', boxShadow: '0 0 0 2px rgba(245,158,11,0.15)' } : {}}
                            value={form.email}
                            onChange={e => { setForm({ ...form, email: e.target.value }); setEmailConflict(false); }}
                            placeholder="john@example.com" />
                          {emailConflict && (
                            <div className="mt-2 p-3 rounded text-xs leading-relaxed"
                              style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b' }}>
                              <span className="font-semibold">This email has an account.</span>{' '}
                              <Link href={`/login?next=/checkout`} className="underline underline-offset-2 hover:text-amber-300 transition-colors">
                                Log in to continue
                              </Link>
                              {' '}or use a different email address.
                            </div>
                          )}
                        </>
                      )}
                    </Field>
                    <Field label={t('checkout.phone')} error={errors.phone}>
                      <input type="tel" className="input-field" value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+21612345678" />
                    </Field>
                  </div>
                  
                  {/* Governorate - Auto Complete */}
                  <Field label={t('checkout.governorate')} error={errors.governorate}>
                    <Select
                      options={wilayatTunisie}
                      value={selectedGovernorate}
                      onChange={handleGovernorateChange}
                      placeholder="Search or select governorate..."
                      isClearable
                      styles={customSelectStyles}
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </Field>

                  {/* City - Auto Complete */}
                  <Field label={t('checkout.city')} error={errors.city}>
                    <Select
                      options={cityOptions}
                      value={selectedCity}
                      onChange={handleCityChange}
                      placeholder={selectedGovernorate ? "Search or select city..." : "Select a governorate first"}
                      isClearable
                      isDisabled={!selectedGovernorate}
                      styles={customSelectStyles}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      noOptionsMessage={() => selectedGovernorate ? "No cities found" : "Please select a governorate first"}
                    />
                  </Field>

                  {/* Detailed address */}
                  <Field label="Detailed Address" error={errors.address}>
                    <input
                      className="input-field"
                      value={form.address}
                      onChange={e => setForm({ ...form, address: e.target.value })}
                      placeholder="Street, building..."
                    />
                  </Field>
                </div>

                {/* Summary */}
                <div className="lg:col-span-2">
                  <div className="card-glass p-5 sticky top-24">
                    <h2 className="font-display text-xl tracking-wide mb-4" style={{ color: 'var(--text-primary)' }}>
                      {t('cart.summary')}
                    </h2>
                    <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                      {items.map(item => (
                        <div key={`${item.productId}-${item.variantId}`} className="flex items-center gap-3 text-sm">
                          <div className="relative w-10 h-10 flex-shrink-0 overflow-hidden"
                            style={{ borderRadius: '2px', background: 'var(--bg-secondary)' }}>
                            {item.image
                              ? <Image src={item.image} alt="" fill className="object-cover" sizes="40px" />
                              : <div className="w-full h-full flex items-center justify-center text-lg opacity-20">🎧</div>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate text-xs" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
                            <p className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{item.variantName} × {item.quantity}</p>
                          </div>
                          <span className="font-mono text-xs flex-shrink-0" style={{ color: 'var(--purple)' }}>
                            {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t mt-4 pt-4 space-y-2 text-sm" style={{ borderColor: 'var(--border)' }}>
                      <div className="flex justify-between" style={{ color: 'var(--text-muted)' }}>
                        <span>{t('cart.shipping')}</span>
                        <span className="text-green-400 font-mono">{t('cart.shipping_free')}</span>
                      </div>
                      {/* Coupon row */}
                      <div className="pt-2">
                        {couponData ? (
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1.5" style={{ color: '#22c55e' }}>
                              🏷️ <span className="font-mono">{couponData.code}</span>
                              <button onClick={removeCoupon} className="text-red-400 hover:text-red-300 transition-colors ml-1">✕</button>
                            </span>
                            <span className="font-mono font-semibold" style={{ color: '#22c55e' }}>-{couponData.discount.toFixed(2)} TND</span>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <input
                              className="input-field text-xs flex-1 py-1.5"
                              placeholder="Coupon code"
                              value={couponCode}
                              onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                              onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                            />
                            <button onClick={applyCoupon} disabled={couponLoading}
                              className="text-xs font-mono px-3 py-1.5 border transition-colors disabled:opacity-50 flex-shrink-0"
                              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', borderRadius: '2px' }}
                              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--purple)'}
                              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                              {couponLoading ? <div className="spinner !w-3 !h-3" /> : 'Apply'}
                            </button>
                          </div>
                        )}
                        {couponError && <p className="text-[10px] text-red-400 mt-1">{couponError}</p>}
                      </div>
                      <div className="flex justify-between font-bold" style={{ color: 'var(--text-primary)' }}>
                        <span>{t('cart.total')}</span>
                        <span className="font-mono" style={{ color: 'var(--purple)' }}>{finalTotal.toFixed(2)} TND</span>
                      </div>
                    </div>
                    <button onClick={handleSubmit} disabled={loading}
                      className="btn-primary w-full mt-5 py-4 text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                      {loading && <div className="spinner !w-4 !h-4" />}
                      {loading ? t('checkout.placing') : (user ? t('checkout.place_order') : 'Continue & Verify Email')}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}