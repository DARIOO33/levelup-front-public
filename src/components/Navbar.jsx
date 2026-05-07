'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import {
  ShoppingBag, Menu, X, Sun, Moon, Globe,
  LayoutDashboard, LogOut, User, ListOrdered, ChevronDown,
  Headphones, Package, Heart,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore, useCartStore } from '@/store';
import toast from 'react-hot-toast';

// ── Brand / accessory data ───────────────────────────────────────────────────
const IEM_BRANDS = [
  { label: 'KZ', href: '/shop?brand=KZ', desc: 'Budget kings' },
  { label: '7HZ', href: '/shop?brand=7HZ', desc: 'Value flagships' },
  { label: 'Moondrop', href: '/shop?brand=Moondrop', desc: 'Audiophile reference' },
  { label: 'Simgot', href: '/shop?brand=Simgot', desc: 'Hybrid drivers' },
  { label: 'Truthear', href: '/shop?brand=Truthear', desc: 'Creator collab' },
  { label: 'LETSHUOER', href: '/shop?brand=LETSHUOER', desc: 'Planar & EST' },
  { label: 'TinHiFi', href: '/shop?brand=TinHiFi', desc: 'Warm & smooth' },
  { label: 'All IEMs', href: '/shop?cat=iems', desc: 'Browse everything' },
];

const ACCESSORY_LINKS = [
  { label: 'Cables', href: '/shop?cat=accessories&sub=cables', icon: '🔌' },
  { label: 'Ear Tips', href: '/shop?cat=accessories&sub=ear-tips', icon: '👂' },
  { label: 'Carrying Bags', href: '/shop?cat=accessories&sub=bags', icon: '👜' },
  { label: 'Cleaning Kits', href: '/shop?cat=accessories&sub=cleaning', icon: '🧹' },
  { label: 'DAC / Dongles', href: '/shop?cat=accessories&sub=dac', icon: '🔊' },
  { label: 'All Accessories', href: '/shop?cat=accessories', icon: '📦' },
];

// ── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ user, size = 32 }) {
  if (user?.avatar) {
    return (
      <Image src={user.avatar} alt={user.name} width={size} height={size}
        className="rounded-full object-cover ring-2 ring-purple-500/40"
        style={{ width: size, height: size }} />
    );
  }
  return (
    <div className="rounded-full flex items-center justify-center ring-2 ring-purple-500/40 font-mono font-bold text-white flex-shrink-0"
      style={{ width: size, height: size, background: 'var(--purple)', fontSize: size * 0.4 }}>
      {(user?.name?.[0] || 'U').toUpperCase()}
    </div>
  );
}

// ── Mega-menu panel ───────────────────────────────────────────────────────────
function MegaMenu({ type, onClose }) {
  const isIem = type === 'iems';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.15 }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-1 card-glass overflow-hidden"
      style={{
        width: isIem ? '620px' : '360px',
        border: '1px solid var(--border)',
        boxShadow: '0 20px 48px rgba(0,0,0,0.3)',
        borderTop: '2px solid var(--purple)',
      }}
    >
      {isIem ? (
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <Headphones size={14} className="text-purple-400" />
            <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Shop by Brand
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {IEM_BRANDS.map(({ label, href, desc }) => (
              <Link key={label} href={href} onClick={onClose}
                className="group p-3 rounded transition-all duration-150 hover:bg-purple-500/8 text-left"
                style={{ borderRadius: '4px' }}>
                <p className="text-sm font-semibold group-hover:text-purple-400 transition-colors" style={{ color: 'var(--text-primary)' }}>
                  {label}
                </p>
                <p className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>{desc}</p>
              </Link>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
            <Link href="/shop?cat=iems" onClick={onClose}
              className="text-xs font-mono text-purple-400 hover:text-purple-300 transition-colors">
              View all IEMs →
            </Link>
          </div>
        </div>
      ) : (
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <Package size={14} className="text-purple-400" />
            <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Accessories
            </span>
          </div>
          <div className="space-y-0.5">
            {ACCESSORY_LINKS.map(({ label, href, icon }) => (
              <Link key={label} href={href} onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded transition-all duration-150 group"
                style={{ borderRadius: '4px' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,255,0.07)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <span className="text-base w-5 text-center flex-shrink-0">{icon}</span>
                <span className="text-sm font-medium group-hover:text-purple-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ── Mobile Accordion Section ──────────────────────────────────────────────────
function MobileAccordion({ icon: Icon, label, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded text-sm font-medium transition-colors"
        style={{ color: 'var(--text-primary)' }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,255,0.06)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <div className="flex items-center gap-2">
          <Icon size={15} className="text-purple-400" />
          <span>{label}</span>
        </div>
        <ChevronDown
          size={14}
          style={{
            color: 'var(--text-muted)',
            transition: 'transform 0.2s',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="pl-4 py-1 space-y-0.5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Navbar ───────────────────────────────────────────────────────────────
export default function Navbar() {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const { user, logout } = useAuthStore();
  const items = useCartStore((s) => s.items);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [megaMenu, setMegaMenu] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  const dropdownRef = useRef(null);
  const megaRef = useRef(null);

  const cartCount = items.reduce((s, i) => s + i.quantity, 0);
  const dark = resolvedTheme === 'dark';
  const isAdmin = user?.role === 'admin' || user?.role === 'owner';

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);
  useEffect(() => { setMobileOpen(false); setDropdownOpen(false); setMegaMenu(null); }, [pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
      if (megaRef.current && !megaRef.current.contains(e.target)) setMegaMenu(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    toast.success('Logged out');
    router.push('/');
  };

  const toggleLang = () => {
    const next = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(next);
    localStorage.setItem('i18nextLng', next);
  };

  const plainLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? (dark ? 'rgba(5,5,8,0.96)' : 'rgba(255,255,255,0.96)') : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : 'none',
      }}
    >
      <div
        className="top-0 left-0 right-0 z-[60] text-center text-xs font-mono py-1.5"
        style={{
          background: 'rgba(124,58,255,0.9)', // purple
          color: 'white',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        🚚 {t('nav.shipping')}
      </div>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <Image
            src={!dark ? `/logo.png` : `/logodark.png`}
            alt="Level Up Logo"
            width={180}
            height={40}
            priority
            className="object-contain"
          />
        </Link>

        {/* ── Desktop navigation ── */}
        <div ref={megaRef} className="hidden md:flex items-center gap-1 relative">
          {plainLinks.map(({ href, label }) => (
            <Link key={href} href={href}
              className="px-3 py-2 text-sm font-medium tracking-wide transition-colors duration-200 relative group rounded"
              style={{ color: pathname === href ? 'var(--purple)' : 'var(--text-secondary)' }}
              suppressHydrationWarning>
              <span suppressHydrationWarning>{mounted ? t(`nav.${label.toLowerCase()}`) : label}</span>
              <span className="absolute bottom-0 left-3 right-3 h-px bg-purple-500 transition-all duration-300"
                style={{ transform: pathname === href ? 'scaleX(1)' : 'scaleX(0)' }} />
            </Link>
          ))}

          <button
            onClick={() => setMegaMenu(m => m === 'iems' ? null : 'iems')}
            className="px-3 py-2 text-sm font-medium tracking-wide transition-colors duration-200 flex items-center gap-1 rounded"
            style={{ color: megaMenu === 'iems' ? 'var(--purple)' : pathname.includes('iems') ? 'var(--purple)' : 'var(--text-secondary)' }}>
            IEMs
            <ChevronDown size={12} style={{ transition: 'transform .2s', transform: megaMenu === 'iems' ? 'rotate(180deg)' : 'rotate(0)' }} />
          </button>

          <button
            onClick={() => setMegaMenu(m => m === 'accessories' ? null : 'accessories')}
            className="px-3 py-2 text-sm font-medium tracking-wide transition-colors duration-200 flex items-center gap-1 rounded"
            style={{ color: megaMenu === 'accessories' ? 'var(--purple)' : 'var(--text-secondary)' }}>
            Accessories
            <ChevronDown size={12} style={{ transition: 'transform .2s', transform: megaMenu === 'accessories' ? 'rotate(180deg)' : 'rotate(0)' }} />
          </button>

          <AnimatePresence>
            {megaMenu && <MegaMenu type={megaMenu} onClose={() => setMegaMenu(null)} />}
          </AnimatePresence>
        </div>

        {/* ── Right actions ── */}
        <div className="flex items-center gap-1">
          <button onClick={toggleLang}
            className="hidden md:flex items-center gap-1 px-2 py-1.5 text-xs font-mono rounded transition-colors hover:text-purple-400"
            style={{ color: 'var(--text-muted)' }}>
            <Globe size={13} />
            <span suppressHydrationWarning>{mounted ? i18n.language?.toUpperCase() : 'EN'}</span>
          </button>

          {mounted && (
            <button onClick={() => setTheme(dark ? 'light' : 'dark')}
              className="p-2 rounded transition-colors hover:text-purple-500"
              style={{ color: 'var(--text-muted)' }}>
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          )}

          <Link href="/cart" className="relative p-2 rounded transition-colors hover:text-purple-500" style={{ color: 'var(--text-secondary)' }}>
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-purple-500 text-white text-[10px] font-mono font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {mounted && (
            <>
              {user ? (
                <div ref={dropdownRef} className="relative hidden md:block ml-1">
                  <button onClick={() => setDropdownOpen(v => !v)}
                    className="flex items-center gap-2 py-1 px-2 rounded-full transition-colors hover:bg-purple-500/10">
                    <Avatar user={user} size={30} />
                    <span className="text-xs font-mono max-w-[80px] truncate" style={{ color: 'var(--text-secondary)' }}>
                      {user.name?.split(' ')[0]}
                    </span>
                    <ChevronDown size={12} style={{ color: 'var(--text-muted)', transition: 'transform .2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 card-glass overflow-hidden"
                        style={{ border: '1px solid var(--border)', borderTop: '2px solid var(--purple)', boxShadow: '0 12px 32px rgba(0,0,0,0.25)' }}>

                        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                          <div className="flex items-center gap-3">
                            <Avatar user={user} size={36} />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
                              <p className="text-[10px] font-mono truncate" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
                            </div>
                          </div>
                          {user.role !== 'user' && (
                            <span className="inline-block mt-2 text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded"
                              style={{ background: 'rgba(124,58,255,0.15)', color: 'var(--purple)' }}>
                              {user.role}
                            </span>
                          )}
                        </div>

                        <div className="py-1">
                          <DropItem href="/profile" icon={User} label="My Profile" onClick={() => setDropdownOpen(false)} />
                          <DropItem href="/orders" icon={ListOrdered} label="My Orders" onClick={() => setDropdownOpen(false)} />
                          <DropItem href="/wishlist" icon={Heart} label="My Wishlist" onClick={() => setDropdownOpen(false)} />
                          {isAdmin && <DropItem href="/admin" icon={LayoutDashboard} label="Admin Panel" onClick={() => setDropdownOpen(false)} accent />}
                        </div>

                        <div className="border-t py-1" style={{ borderColor: 'var(--border)' }}>
                          <button onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                            style={{ color: '#ef4444' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            <LogOut size={14} />
                            <span className="font-medium">Sign out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href="/login" className="hidden md:flex btn-primary text-xs px-4 py-2 ml-1" suppressHydrationWarning>
                  <span suppressHydrationWarning>{t('nav.login')}</span>
                </Link>
              )}
            </>
          )}

          <button className="md:hidden p-2 ml-1" style={{ color: 'var(--text-primary)' }} onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t overflow-hidden"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
            <div className="px-4 py-4 flex flex-col gap-1 max-h-[80vh] overflow-y-auto">

              {/* User info */}
              {user && (
                <div className="flex items-center gap-3 pb-3 mb-2 border-b" style={{ borderColor: 'var(--border)' }}>
                  <Avatar user={user} size={38} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
                    <p className="text-[10px] font-mono truncate" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
                  </div>
                </div>
              )}

              {/* Plain nav links */}
              {plainLinks.map(({ href, label }) => (
                <MobileItem key={href} href={href} label={t(`nav.${label.toLowerCase()}`)} />
              ))}

              {/* IEMs accordion */}
              <MobileAccordion icon={Headphones} label="IEMs">
                {IEM_BRANDS.map(b => <MobileItem key={b.href} href={b.href} label={b.label} sub />)}
              </MobileAccordion>

              {/* Accessories accordion */}
              <MobileAccordion icon={Package} label="Accessories">
                {ACCESSORY_LINKS.map(a => <MobileItem key={a.href} href={a.href} label={`${a.icon} ${a.label}`} sub />)}
              </MobileAccordion>

              <div className="border-t my-2" style={{ borderColor: 'var(--border)' }} />

              {/* Settings */}
              <div className="flex items-center gap-3 px-2 py-1">
                <button onClick={toggleLang} className="flex items-center gap-1.5 text-xs font-mono py-1.5" style={{ color: 'var(--text-muted)' }}>
                  <Globe size={13} />
                  <span suppressHydrationWarning>{mounted ? i18n.language?.toUpperCase() : 'EN'}</span>
                </button>
                {mounted && (
                  <button onClick={() => setTheme(dark ? 'light' : 'dark')} className="flex items-center gap-1.5 text-xs py-1.5" style={{ color: 'var(--text-muted)' }}>
                    {dark ? <Sun size={14} /> : <Moon size={14} />}
                    <span className="font-mono">{dark ? 'Light' : 'Dark'}</span>
                  </button>
                )}
              </div>

              {/* Auth */}
              {user ? (
                <div className="flex flex-col gap-0.5 mt-1">
                  <MobileItem href="/profile" icon={User} label="My Profile" />
                  <MobileItem href="/orders" icon={ListOrdered} label="My Orders" />
                  <MobileItem href="/wishlist" icon={Heart} label="My Wishlist" />
                  {isAdmin && <MobileItem href="/admin" icon={LayoutDashboard} label="Admin Panel" accent />}
                  <button onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium mt-1 w-full text-left"
                    style={{ color: '#ef4444' }}>
                    <LogOut size={15} /> Sign out
                  </button>
                </div>
              ) : (
                <Link href="/login" className="btn-primary text-center text-sm mt-2" suppressHydrationWarning>
                  <span suppressHydrationWarning>{mounted ? t('nav.login') : 'Login'}</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ── Tiny helpers ──────────────────────────────────────────────────────────────
function DropItem({ href, icon: Icon, label, onClick, accent }) {
  return (
    <Link href={href} onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
      style={{ color: accent ? 'var(--purple)' : 'var(--text-secondary)' }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,255,0.07)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      <Icon size={14} style={{ flexShrink: 0 }} />
      <span className="font-medium">{label}</span>
    </Link>
  );
}

function MobileItem({ href, label, icon: Icon, accent, sub }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link href={href}
      className="flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium transition-colors"
      style={{
        color: accent ? 'var(--purple)' : active ? 'var(--purple)' : sub ? 'var(--text-muted)' : 'var(--text-primary)',
        background: active ? 'rgba(124,58,255,0.08)' : 'transparent',
        fontSize: sub ? '0.8rem' : undefined,
      }}>
      {Icon && <Icon size={14} />}
      {label}
    </Link>
  );
}