'use client';
import { useState, useEffect } from 'react';
import { Shield, User, Crown, Search } from 'lucide-react';
import { usersApi } from '@/lib/api';
import { useAuthStore } from '@/store';
import toast from 'react-hot-toast';

const ROLES      = ['user', 'admin', 'owner'];
const ROLE_ICONS = { owner: Crown, admin: Shield, user: User };
const ROLE_COLORS = { owner: '#f59e0b', admin: '#7c3aff', user: 'var(--text-muted)' };

export default function UsersTab() {
  const { user: me } = useAuthStore();
  const [users,    setUsers]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [updating, setUpdating] = useState(null); // id of row being saved
  const [search,   setSearch]   = useState('');

  useEffect(() => {
    usersApi.getAll()
      .then(r => setUsers(r.data.users || []))
      .catch(() => toast.error('Could not load users'))
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    // Prevent changing own role or targeting an owner (unless current user is also owner)
    const target = users.find(u => u._id === userId);
    if (!target) return;
    if (target._id === me?._id) { toast.error("You can't change your own role"); return; }
    if (target.role === 'owner' && me?.role !== 'owner') { toast.error('Only an owner can modify another owner'); return; }

    setUpdating(userId);
    try {
      await usersApi.updateRole(userId, newRole);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
      toast.success(`Role updated to ${newRole}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    } finally {
      setUpdating(null);
    }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center py-20"><div className="spinner" /></div>;

  return (
    <div>
      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full pl-8 pr-3 py-2 text-xs outline-none transition-all"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '2px' }}
          onFocus={e => (e.target.style.borderColor = '#7c3aff')}
          onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
        />
      </div>

      <div className="card-glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                {['User', 'Email', 'Phone', 'Joined', 'Role', 'Change Role'].map(h => (
                  <th key={h} className="px-4 py-3 text-left uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => {
                const RoleIcon = ROLE_ICONS[u.role] || User;
                const isSelf   = u._id === me?._id;
                const cantEdit = isSelf || (u.role === 'owner' && me?.role !== 'owner');
                return (
                  <tr key={u._id} className="border-b transition-colors hover:bg-purple-500/5" style={{ borderColor: 'var(--border)' }}>
                    {/* Name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                          style={{ background: 'rgba(124,58,255,0.15)', color: '#7c3aff' }}>
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ color: 'var(--text-primary)' }}>
                          {u.name}
                          {isSelf && <span className="ml-1 text-purple-400">(you)</span>}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3" style={{ color: 'var(--text-muted)' }}>{u.email}</td>

                    {/* Phone */}
                    <td className="px-4 py-3" style={{ color: 'var(--text-muted)' }}>{u.phoneNumber || '—'}</td>

                    {/* Joined */}
                    <td className="px-4 py-3" style={{ color: 'var(--text-muted)' }}>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                    </td>

                    {/* Current role badge */}
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] uppercase tracking-wider"
                        style={{ background: `${ROLE_COLORS[u.role]}18`, color: ROLE_COLORS[u.role], borderRadius: '2px', border: `1px solid ${ROLE_COLORS[u.role]}35` }}>
                        <RoleIcon size={9} /> {u.role}
                      </span>
                    </td>

                    {/* Role selector */}
                    <td className="px-4 py-3">
                      {cantEdit ? (
                        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                          {isSelf ? 'Cannot edit self' : 'No permission'}
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <select
                            value={u.role}
                            disabled={updating === u._id}
                            onChange={e => handleRoleChange(u._id, e.target.value)}
                            className="text-[10px] px-2 py-1 outline-none cursor-pointer transition-all"
                            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '2px' }}
                          >
                            {ROLES.map(r => (
                              /* Only owner can assign 'owner' role */
                              r === 'owner' && me?.role !== 'owner' ? null : (
                                <option key={r} value={r}>{r}</option>
                              )
                            ))}
                          </select>
                          {updating === u._id && <div className="spinner !w-3 !h-3" />}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
              <p className="font-mono text-xs">No users found</p>
            </div>
          )}
        </div>
      </div>

      <p className="mt-3 text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
        {filtered.length} of {users.length} users shown
        {me?.role === 'owner' && ' · As owner you can assign any role including owner'}
        {me?.role === 'admin' && ' · As admin you can promote users to admin only'}
      </p>
    </div>
  );
}
