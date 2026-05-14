'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Save, LogOut, ShieldCheck, ListOrdered, Heart, MapPin, Plus, Pencil, Trash2, Star, X, Check } from 'lucide-react';
import { useAuthStore } from '@/store';
import { usersApi, addressesApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
export default function ProfilePage() {
  const {t} = useTranslation()
  const router = useRouter();
  const { user, logout, refreshUser, initialized } = useAuthStore();

  const [nameForm, setNameForm] = useState({ name: '' });
  const [passForm, setPassForm] = useState({ currentPassword: '', password: '', confirm: '' });
  const [loadingName, setLoadingName] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);

  // Address management
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null); // null = add new
  const [addrForm, setAddrForm] = useState({ label: 'Home', fullname: '', phone: '', address: '', governorate: '', city: '', postalCode: '' });
  const [addrGovernorate, setAddrGovernorate] = useState(null);
  const [addrCity, setAddrCity] = useState(null);
  const [addrCityOptions, setAddrCityOptions] = useState([]);
  const [savingAddr, setSavingAddr] = useState(false);

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

  const customSelectStyles = {
    control: (base, state) => ({
      ...base, backgroundColor: 'var(--bg-tertiary)',
      borderColor: state.isFocused ? 'var(--purple)' : 'var(--border)',
      borderWidth: '1px', borderRadius: '2px',
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
    }),
    placeholder: (base) => ({ ...base, color: 'var(--text-muted)' }),
  };

  // Sync nameForm once user is loaded
  useEffect(() => {
    if (user?.name) setNameForm({ name: user.name });
  }, [user?.name]);

  // Load addresses on mount
  useEffect(() => {
    if (!user) return;
    setLoadingAddresses(true);
    addressesApi.getAll()
      .then(res => setAddresses(res.data.addresses || []))
      .catch(() => {})
      .finally(() => setLoadingAddresses(false));
  }, [user]);

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

  const openAddForm = () => {
    setEditingAddress(null);
    setAddrForm({ label: 'Home', fullname: user?.name || '', phone: '', address: '', governorate: '', city: '', postalCode: '' });
    setAddrGovernorate(null);
    setAddrCity(null);
    setAddrCityOptions([]);
    setShowAddressForm(true);
  };

  const openEditForm = async (addr) => {
    setEditingAddress(addr._id);
    setAddrForm({ label: addr.label || 'Home', fullname: addr.fullname || '', phone: addr.phone || '', address: addr.address || '', governorate: addr.governorate || '', city: addr.city || '', postalCode: addr.postalCode || '' });
    const gov = wilayatTunisie.find(w => w.value === addr.governorate) || null;
    setAddrGovernorate(gov);
    if (gov) {
      const res = await fetch(`/api/municipalities?name=${gov.value}`);
      const data = await res.json();
      const cities = data[0]?.Delegations || [];
      const seen = new Set();
      const unique = cities.filter(c => {
        const k = c.Name?.trim().toLowerCase();
        if (seen.has(k)) return false;
        seen.add(k); return true;
      });
      const opts = unique.map(c => ({ value: c, label: `${c.Name}${c.PostalCode ? ` (${c.PostalCode})` : ''}` }));
      setAddrCityOptions(opts);
      const cityOpt = opts.find(o => o.value.Name === addr.city) || null;
      setAddrCity(cityOpt);
    }
    setShowAddressForm(true);
  };

  const handleSaveAddress = async () => {
    if (!addrGovernorate || !addrCity) {
      toast.error('Governorate and city are required');
      return;
    }
    if (addrForm.phone && !/^\+216[23457 9]\d{7}$/.test(addrForm.phone)) {
      toast.error('Invalid phone number');
      return;
    }
    setSavingAddr(true);
    try {
      const payload = {
        label: addrForm.label || 'Home',
        fullname: addrForm.fullname,
        phone: addrForm.phone,
        address: addrForm.address,
        governorate: addrGovernorate.value,
        city: addrCity.value.Name,
        postalCode: addrCity.value.PostalCode || '',
      };
      let res;
      if (editingAddress) {
        res = await addressesApi.update(editingAddress, payload);
        toast.success('Address updated!');
      } else {
        res = await addressesApi.add(payload);
        toast.success('Address added!');
      }
      setAddresses(res.data.addresses || []);
      setShowAddressForm(false);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to save address');
    } finally {
      setSavingAddr(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const res = await addressesApi.remove(id);
      setAddresses(res.data.addresses || []);
      toast.success('Address removed');
    } catch (e) {
      toast.error('Failed to remove address');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const res = await addressesApi.setDefault(id);
      setAddresses(res.data.addresses || []);
      toast.success('Default address updated');
    } catch (e) {
      toast.error('Failed to update default');
    }
  };

  // Wait for auth to initialize BEFORE deciding to redirect
  useEffect(() => {
    if (initialized && !user) {
      router.push('/login');
    }
  }, [initialized, user, router]);

  // Show spinner while auth initializes
  if (!initialized) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  if (!user) return null;

  const isGoogleUser = user.authProvider === 'google';

  const handleNameUpdate = async () => {
    if (!nameForm.name.trim()) return toast.error('Name cannot be empty');
    if (nameForm.name.trim() === user.name) return toast.error('No changes detected');
    setLoadingName(true);
    try {
      await usersApi.updateMe({ name: nameForm.name.trim() });
      toast.success('Name updated!');
      await refreshUser();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Update failed');
    } finally {
      setLoadingName(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!passForm.currentPassword) return toast.error(t('profile.err_current_required'));
    if (!passForm.password) return toast.error(t('profile.err_new_required'));
    if (passForm.password.length < 6) return toast.error(t('profile.err_min_length'));
    if (passForm.password !== passForm.confirm) return toast.error(t('profile.err_mismatch'));
    if (passForm.password === passForm.currentPassword) return toast.error(t('profile.err_same'));
    setLoadingPass(true);
    try {
      await usersApi.updateMe({ password: passForm.password, currentPassword: passForm.currentPassword });
      toast.success(t('profile.success_updated'));
      setPassForm({ currentPassword: '', password: '', confirm: '' });
      await logout();
      router.push('/login');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Update failed');
    } finally {
      setLoadingPass(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    router.push('/');
  };

  const roleColor = {
    owner: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    admin: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    user: 'text-green-400 bg-green-400/10 border-green-400/20',
  }[user.role] || 'text-gray-400 bg-gray-400/10 border-gray-400/20';

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-glass p-6 flex items-center gap-5"
        >
          <div className="relative flex-shrink-0">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover ring-2 ring-purple-500/40" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-purple-500/20 ring-2 ring-purple-500/40 flex items-center justify-center">
                <span className="font-display text-2xl text-purple-400">{user.name?.[0]?.toUpperCase()}</span>
              </div>
            )}
            {isGoogleUser && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow">
                <svg viewBox="0 0 24 24" className="w-3 h-3">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="font-display text-2xl tracking-wider truncate" style={{ color: 'var(--text-primary)' }}>{user.name}</h1>
            <p className="text-sm truncate" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={`inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded border ${roleColor}`}>
                <ShieldCheck size={11} />{user.role}
              </span>
              {isGoogleUser && (
                <span className="inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded border text-blue-400 bg-blue-400/10 border-blue-400/20">
                  Google Account
                </span>
              )}
            </div>
          </div>

          <button onClick={handleLogout} className="flex-shrink-0 p-2 rounded-lg hover:text-red-400 hover:bg-red-400/10 transition-colors" style={{ color: 'var(--text-muted)' }} title="Logout">
            <LogOut size={18} />
          </button>
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card-glass p-4"
        >
          <div className="flex flex-col gap-3">
            <Link href="/orders" className="flex items-center gap-3 hover:text-purple-400 transition-colors group" style={{ color: 'var(--text-secondary)' }}>
              <ListOrdered size={18} className="text-purple-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{t('profile.my_orders')}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('profile.my_orders_sub')}</p>
              </div>
              <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>→</span>
            </Link>
            <div className="border-t" style={{ borderColor: 'var(--border)' }} />
            <Link href="/wishlist" className="flex items-center gap-3 hover:text-purple-400 transition-colors group" style={{ color: 'var(--text-secondary)' }}>
              <Heart size={18} className="text-purple-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{t('profile.my_wishlist')}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('profile.my_wishlist_sub')}</p>
              </div>
              <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>→</span>
            </Link>
          </div>
        </motion.div>

        {/* Update Name */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-glass p-6">
          <div className="flex items-center gap-2 mb-5">
            <User size={16} className="text-purple-400" />
            <h2 className="font-display tracking-wider text-lg" style={{ color: 'var(--text-primary)' }}>{t('profile.display_name')}</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>{t('profile.full_name')}</label>
              <input
                className="input-field"
                value={nameForm.name}
                onChange={(e) => setNameForm({ name: e.target.value })}
                placeholder="Your display name"
                onKeyDown={(e) => e.key === 'Enter' && handleNameUpdate()}
              />
            </div>
            <button onClick={handleNameUpdate} disabled={loadingName} className="btn-primary px-6 py-2.5 text-sm flex items-center gap-2 disabled:opacity-60">
              {loadingName ? <div className="spinner !w-3.5 !h-3.5" /> : <Save size={14} />}
              Save Name
            </button>
          </div>
        </motion.div>

        {/* Update Password */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-glass p-6">
          <div className="flex items-center gap-2 mb-2">
            <Lock size={16} className="text-purple-400" />
            <h2 className="font-display tracking-wider text-lg" style={{ color: 'var(--text-primary)' }}>{t('profile.password_section')}</h2>
          </div>

          {isGoogleUser ? (
            <p className="text-sm mt-3" style={{ color: 'var(--text-muted)' }}>
              {t('profile.google_password')}
            </p>
          ) : (
            <>
              <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>{t('profile.after_change')}</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>{t('profile.current_password')}</label>
                  <input type="password" className="input-field" placeholder={t("profile.current_password")} value={passForm.currentPassword} onChange={(e) => setPassForm(p => ({ ...p, currentPassword: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>{t('profile.new_password')}</label>
                  <input type="password" className="input-field" placeholder={t("profile.new_password")} value={passForm.password} onChange={(e) => setPassForm(p => ({ ...p, password: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>{t('profile.confirm_password')}</label>
                  <input type="password" className="input-field" placeholder={t("profile.confirm_password")} value={passForm.confirm} onChange={(e) => setPassForm(p => ({ ...p, confirm: e.target.value }))} onKeyDown={(e) => e.key === 'Enter' && handlePasswordUpdate()} />
                </div>
                <button onClick={handlePasswordUpdate} disabled={loadingPass} className="btn-primary px-6 py-2.5 text-sm flex items-center gap-2 disabled:opacity-60">
                  {loadingPass ? <div className="spinner !w-3.5 !h-3.5" /> : <Lock size={14} />}
                  Update Password
                </button>
              </div>
            </>
          )}
        </motion.div>

        {/* Shipping Addresses */}
        <motion.div id="addresses" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card-glass p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-purple-400" />
              <h2 className="font-display tracking-wider text-lg" style={{ color: 'var(--text-primary)' }}>Shipping Addresses</h2>
            </div>
            {!showAddressForm && (
              <button onClick={openAddForm}
                className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 border transition-colors"
                style={{ borderColor: 'var(--purple)', color: 'var(--purple)', borderRadius: '2px' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,255,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                <Plus size={12} /> Add Address
              </button>
            )}
          </div>

          {/* Address form */}
          <AnimatePresence>
            {showAddressForm && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="mb-5 p-4 border overflow-hidden" style={{ borderColor: 'rgba(124,58,255,0.3)', borderRadius: '2px', background: 'rgba(124,58,255,0.03)' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {editingAddress ? 'Edit Address' : 'New Address'}
                  </h3>
                  <button onClick={() => setShowAddressForm(false)} style={{ color: 'var(--text-muted)' }}
                    className="hover:text-red-400 transition-colors"><X size={15} /></button>
                </div>

                <div className="space-y-3">
                  {/* Label */}
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
                          }}>{l}</button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>Full Name</label>
                      <input className="input-field" value={addrForm.fullname} onChange={e => setAddrForm(f => ({ ...f, fullname: e.target.value }))} placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>Phone</label>
                      <div className="flex">
                        <span className="flex items-center px-3 text-xs font-mono flex-shrink-0"
                          style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRight: 'none', borderRadius: '2px 0 0 2px', color: 'var(--purple)' }}>
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
                      Street / Detailed Address <span className="normal-case font-sans opacity-50 text-[10px] tracking-normal">(optional)</span>
                    </label>
                    <input className="input-field" value={addrForm.address} onChange={e => setAddrForm(f => ({ ...f, address: e.target.value }))} placeholder="Street, building, apartment..." />
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button onClick={handleSaveAddress} disabled={savingAddr}
                    className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2 disabled:opacity-60">
                    {savingAddr ? <div className="spinner !w-3.5 !h-3.5" /> : <Check size={14} />}
                    {editingAddress ? 'Update Address' : 'Save Address'}
                  </button>
                  <button onClick={() => setShowAddressForm(false)}
                    className="px-4 py-2.5 text-sm border transition-colors"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', borderRadius: '2px' }}>
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Address list */}
          {loadingAddresses ? (
            <div className="flex justify-center py-6"><div className="spinner" /></div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
              <MapPin size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No saved addresses yet.</p>
              <button onClick={openAddForm} className="mt-3 text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1 mx-auto">
                <Plus size={13} /> Add your first address
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map(addr => (
                <div key={addr._id} className="p-4 border flex items-start gap-3 group transition-colors"
                  style={{ borderColor: addr.isDefault ? 'rgba(124,58,255,0.4)' : 'var(--border)', borderRadius: '2px', background: addr.isDefault ? 'rgba(124,58,255,0.04)' : 'transparent' }}>
                  <MapPin size={16} className="text-purple-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded"
                        style={{ background: 'rgba(124,58,255,0.12)', color: 'var(--purple)' }}>
                        {addr.label}
                      </span>
                      {addr.isDefault && (
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1"
                          style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e' }}>
                          <Star size={9} /> Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{addr.fullname}</p>
                    {addr.phone && <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{addr.phone}</p>}
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {addr.address}, {addr.city} {addr.postalCode}, {addr.governorate}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!addr.isDefault && (
                      <button onClick={() => handleSetDefault(addr._id)} title="Set as default"
                        className="p-1.5 rounded hover:text-yellow-400 transition-colors" style={{ color: 'var(--text-muted)' }}>
                        <Star size={13} />
                      </button>
                    )}
                    <button onClick={() => openEditForm(addr)} title="Edit"
                      className="p-1.5 rounded hover:text-purple-400 transition-colors" style={{ color: 'var(--text-muted)' }}>
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => handleDeleteAddress(addr._id)} title="Delete"
                      className="p-1.5 rounded hover:text-red-400 transition-colors" style={{ color: 'var(--text-muted)' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}
