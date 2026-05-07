'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Lock, Save, LogOut, ShieldCheck, ListOrdered, Heart } from 'lucide-react';
import { useAuthStore } from '@/store';
import { usersApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
export default function ProfilePage() {
  const {t} = useTranslation()
  const router = useRouter();
  const { user, logout, refreshUser, initialized } = useAuthStore();

  const [nameForm, setNameForm] = useState({ name: '' });
  const [passForm, setPassForm] = useState({ currentPassword: '', password: '', confirm: '' });
  const [loadingName, setLoadingName] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);

  // Sync nameForm once user is loaded
  useEffect(() => {
    if (user?.name) setNameForm({ name: user.name });
  }, [user?.name]);

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

      </div>
    </div>
  );
}
