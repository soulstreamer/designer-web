import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { trpc } from '@/providers/trpc';
import {
  ArrowLeft, Users, Mail, MessageSquare, Trash2,
  Shield, UserCheck, Clock
} from 'lucide-react';
import { toast, Toaster } from 'sonner';

export default function Dashboard() {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate('/');
    }
  }, [user, isAdmin, isLoading, navigate]);

  const { data: stats } = trpc.admin.stats.useQuery(undefined, { enabled: isAdmin });
  const { data: contacts } = trpc.contact.list.useQuery(undefined, { enabled: isAdmin });
  const { data: messages } = trpc.message.list.useQuery(undefined, { enabled: isAdmin });
  const { data: usersData } = trpc.admin.users.useQuery(undefined, { enabled: isAdmin });

  const utils = trpc.useUtils();

  const deleteContact = trpc.contact.delete.useMutation({
    onSuccess: () => {
      toast.success('Contact sters');
      utils.contact.list.invalidate();
      utils.admin.stats.invalidate();
    },
  });

  const deleteMessage = trpc.message.delete.useMutation({
    onSuccess: () => {
      toast.success('Mesaj sters');
      utils.message.list.invalidate();
      utils.admin.stats.invalidate();
    },
  });

  const updateRole = trpc.admin.updateRole.useMutation({
    onSuccess: () => {
      toast.success('Rol actualizat');
      utils.admin.users.invalidate();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <p className="text-[#888]">Se incarca...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link
          to="/"
          className="flex items-center gap-2 text-white/60 hover:text-[#9B30FF] text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Inapoi la site
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Shield size={28} className="text-[#9B30FF]" />
          <h1 className="text-white font-bold text-3xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Admin Dashboard
          </h1>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'OAuth Users', value: stats?.totalUsers ?? 0, icon: Users },
            { label: 'Local Users', value: stats?.totalLocalUsers ?? 0, icon: UserCheck },
            { label: 'Contacte', value: stats?.totalContacts ?? 0, icon: Mail },
            { label: 'Mesaje', value: stats?.totalMessages ?? 0, icon: MessageSquare },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white/[0.03] border border-white/[0.1] rounded-xl p-5"
            >
              <stat.icon size={20} className="text-[#9B30FF] mb-3" />
              <p className="text-2xl font-bold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {stat.value}
              </p>
              <p className="text-[#888] text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Contact submissions */}
        <div className="mb-10">
          <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            <Mail size={20} className="text-[#9B30FF]" />
            Cereri Contact ({contacts?.length || 0})
          </h2>
          <div className="bg-white/[0.03] border border-white/[0.1] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.1]">
                    <th className="text-left px-4 py-3 text-[#888] font-medium">Nume</th>
                    <th className="text-left px-4 py-3 text-[#888] font-medium">Telefon</th>
                    <th className="text-left px-4 py-3 text-[#888] font-medium">Serviciu</th>
                    <th className="text-left px-4 py-3 text-[#888] font-medium">Data</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {contacts && contacts.length > 0 ? (
                    contacts.map((c) => (
                      <tr key={c.id} className="border-b border-white/[0.05] hover:bg-white/[0.02]">
                        <td className="px-4 py-3 text-white">{c.name}</td>
                        <td className="px-4 py-3 text-white/70">{c.phone}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-[#9B30FF]/20 text-[#9B30FF] text-xs rounded">
                            {c.service === 'prezentare' ? 'Prezentare' : 'Magazin'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#888] text-xs">
                          <div className="flex items-center gap-1">
                            <Clock size={12} />
                            {c.createdAt ? new Date(c.createdAt).toLocaleDateString('ro-RO') : '-'}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => deleteContact.mutate({ id: c.id })}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-[#888]">
                        Nicio cerere contact
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="mb-10">
          <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            <MessageSquare size={20} className="text-[#9B30FF]" />
            Mesaje Board ({messages?.length || 0})
          </h2>
          <div className="bg-white/[0.03] border border-white/[0.1] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.1]">
                    <th className="text-left px-4 py-3 text-[#888] font-medium">Nume</th>
                    <th className="text-left px-4 py-3 text-[#888] font-medium">Email</th>
                    <th className="text-left px-4 py-3 text-[#888] font-medium">Continut</th>
                    <th className="text-left px-4 py-3 text-[#888] font-medium">Data</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {messages && messages.length > 0 ? (
                    messages.map((m) => (
                      <tr key={m.id} className="border-b border-white/[0.05] hover:bg-white/[0.02]">
                        <td className="px-4 py-3 text-white">{m.name}</td>
                        <td className="px-4 py-3 text-white/70">{m.email}</td>
                        <td className="px-4 py-3 text-white/70 max-w-xs truncate">{m.content}</td>
                        <td className="px-4 py-3 text-[#888] text-xs">
                          {m.createdAt ? new Date(m.createdAt).toLocaleDateString('ro-RO') : '-'}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => deleteMessage.mutate({ id: m.id })}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-[#888]">
                        Niciun mesaj
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Users */}
        <div>
          <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            <Users size={20} className="text-[#9B30FF]" />
            Utilizatori
          </h2>

          {/* OAuth users */}
          <div className="mb-6">
            <h3 className="text-[#888] text-sm mb-3">OAuth Users</h3>
            <div className="bg-white/[0.03] border border-white/[0.1] rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.1]">
                      <th className="text-left px-4 py-3 text-[#888] font-medium">ID</th>
                      <th className="text-left px-4 py-3 text-[#888] font-medium">Nume</th>
                      <th className="text-left px-4 py-3 text-[#888] font-medium">Email</th>
                      <th className="text-left px-4 py-3 text-[#888] font-medium">Rol</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersData?.oauthUsers && usersData.oauthUsers.length > 0 ? (
                      usersData.oauthUsers.map((u) => (
                        <tr key={`oauth-${u.id}`} className="border-b border-white/[0.05] hover:bg-white/[0.02]">
                          <td className="px-4 py-3 text-white/50">{u.id}</td>
                          <td className="px-4 py-3 text-white">{u.name || 'N/A'}</td>
                          <td className="px-4 py-3 text-white/70">{u.email || 'N/A'}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs rounded ${
                              u.role === 'admin' ? 'bg-[#9B30FF]/20 text-[#9B30FF]' : 'bg-white/5 text-[#888]'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() =>
                                updateRole.mutate({
                                  userId: u.id,
                                  userType: 'oauth',
                                  role: u.role === 'admin' ? 'user' : 'admin',
                                })
                              }
                              className="text-xs text-[#9B30FF] hover:text-[#E9D5FF] transition-colors"
                            >
                              {u.role === 'admin' ? 'Demote' : 'Promote'}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-[#888]">
                          Nicio utilizator OAuth
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Local users */}
          <div>
            <h3 className="text-[#888] text-sm mb-3">Local Users</h3>
            <div className="bg-white/[0.03] border border-white/[0.1] rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.1]">
                      <th className="text-left px-4 py-3 text-[#888] font-medium">ID</th>
                      <th className="text-left px-4 py-3 text-[#888] font-medium">Username</th>
                      <th className="text-left px-4 py-3 text-[#888] font-medium">Display Name</th>
                      <th className="text-left px-4 py-3 text-[#888] font-medium">Email</th>
                      <th className="text-left px-4 py-3 text-[#888] font-medium">Rol</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersData?.localUsers && usersData.localUsers.length > 0 ? (
                      usersData.localUsers.map((u) => (
                        <tr key={`local-${u.id}`} className="border-b border-white/[0.05] hover:bg-white/[0.02]">
                          <td className="px-4 py-3 text-white/50">{u.id}</td>
                          <td className="px-4 py-3 text-white">{u.type}</td>
                          <td className="px-4 py-3 text-white">{u.name || 'N/A'}</td>
                          <td className="px-4 py-3 text-white/70">{u.email}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs rounded ${
                              u.role === 'admin' ? 'bg-[#9B30FF]/20 text-[#9B30FF]' : 'bg-white/5 text-[#888]'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() =>
                                updateRole.mutate({
                                  userId: u.id,
                                  userType: 'local',
                                  role: u.role === 'admin' ? 'user' : 'admin',
                                })
                              }
                              className="text-xs text-[#9B30FF] hover:text-[#E9D5FF] transition-colors"
                            >
                              {u.role === 'admin' ? 'Demote' : 'Promote'}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-6 text-center text-[#888]">
                          Nicio utilizator local
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster
        position="bottom-left"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid rgba(155,48,255,0.2)',
          },
        }}
      />
    </div>
  );
}
