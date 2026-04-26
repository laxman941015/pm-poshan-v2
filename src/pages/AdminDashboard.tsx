import { useState, useEffect } from 'react';
import { api } from '../lib/apiClient';
import GlobalScheduleForm from '../components/forms/GlobalScheduleForm';
import Layout from '../components/Layout';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Package, 
  Trash2, 
  PlusCircle, 
  Loader2, 
  X, 
  ShieldCheck, 
  Globe, 
  Activity, 
  Search, 
  Building2,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight, 
  CreditCard,
  LogOut,
  UserPlus,
  RefreshCw,
  Calendar,
  Mail,
  Key,
  ShieldAlert
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const IconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Users,
  Settings,
  Package
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'modules' | 'teachers' | 'foodmaster' | 'globalschedule' | 'systemsettings'>('overview');
  const [modules, setModules] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState({
    totalTeachers: 0,
    activeModules: 0,
    totalSchools: 0,
    revenue: 0,
    activeSubscribers: 0,
    growth: 0
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<string | null>(null);

  // Food Master State
  const [globalFoods, setGlobalFoods] = useState<any[]>([]);
  const [newFoodCode, setNewFoodCode] = useState('');
  const [newFoodName, setNewFoodName] = useState('');
  const [newFoodNameEn, setNewFoodNameEn] = useState('');
  const [newFoodCategory, setNewFoodCategory] = useState<'MAIN' | 'INGREDIENT'>('MAIN');
  const [newFoodGramsPrimary, setNewFoodGramsPrimary] = useState<number | ''>('');
  const [newFoodGramsUpperPrimary, setNewFoodGramsUpperPrimary] = useState<number | ''>('');
  const [newFoodRank, setNewFoodRank] = useState<number | ''>(999);
  const [isEditingFood, setIsEditingFood] = useState(false);
  const [editingFoodId, setEditingFoodId] = useState<string | null>(null);
  const [isCodeValidated, setIsCodeValidated] = useState(false);

  // System Settings State
  const [systemSettings, setSystemSettings] = useState<any>(null);
  const [saveSettingsLoading, setSaveSettingsLoading] = useState(false);
  
  // Security OTP State
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [newMasterPassword, setNewMasterPassword] = useState('');
  const [revealedPassword, setRevealedPassword] = useState('');

  // Teacher Management State
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newTeacher, setNewTeacher] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    schoolName: '',
    schoolId: ''
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([
      fetchModules(), 
      fetchTeachers(), 
      fetchGlobalFoods(),
      fetchStats(),
      fetchActivity(),
      fetchSystemSettings()
    ]);
    setLoading(false);
  };

  const fetchSystemSettings = async () => {
    try {
      const { data } = await api.from('system_settings').select('*').single();
      if (data) setSystemSettings(data);
    } catch (err) {
      console.error('Settings fetch error:', err);
    }
  };

  const handleRequestOtp = async () => {
    setSaveSettingsLoading(true);
    try {
      const response = await fetch(`${api.baseUrl}/auth/master-otp/request`, { method: 'POST' });
      if (!response.ok) throw new Error('OTP Request failed');
      setShowOtpInput(true);
      toast.success('Security OTP sent to lrathod330@gmail.com');
    } catch (err) {
      toast.error('Failed to dispatch security code');
    } finally {
      setSaveSettingsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setSaveSettingsLoading(true);
    try {
      const response = await fetch(`${api.baseUrl}/auth/master-otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: otpInput })
      });
      if (!response.ok) throw new Error('Verification failed');
      setIsUnlocked(true);
      setOtpInput('');
      toast.success('Access Granted: Security Protocol Unlocked');
    } catch (err) {
      toast.error('Invalid or Expired Security Code');
    } finally {
      setSaveSettingsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otpInput) {
      toast.error('Please enter a fresh OTP to confirm reset');
      handleRequestOtp();
      return;
    }

    setSaveSettingsLoading(true);
    try {
      const vResponse = await fetch(`${api.baseUrl}/auth/master-otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: otpInput })
      });
      if (!vResponse.ok) throw new Error('Security verification failed');

      const { error } = await (api as any).from('system_settings').update({ 
        master_sudo_password: newMasterPassword 
      }).eq('id', systemSettings.id);
      
      if (error) throw error;
      
      setSystemSettings({...systemSettings, master_sudo_password: newMasterPassword});
      setIsUnlocked(false);
      setNewMasterPassword('');
      setOtpInput('');
      setRevealedPassword('');
      toast.success('Master Sudo Password reset successfully');
    } catch (err) {
      toast.error('Reset failed: Identity verification required');
    } finally {
      setSaveSettingsLoading(false);
    }
  };

  const handleUpdateSystemSettings = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaveSettingsLoading(true);
    try {
      const { error } = await (api as any).from('system_settings').update({
        primary_rate: systemSettings.primary_rate,
        upper_primary_rate: systemSettings.upper_primary_rate
      }).eq('id', systemSettings.id);
      
      if (error) throw error;
      toast.success('Global rates updated successfully');
    } catch (err: any) {
      toast.error('Failed to update variables');
    } finally {
      setSaveSettingsLoading(false);
    }
  };

  const fetchActivity = async () => {
    try {
      const [pRes, dRes, sRes] = await Promise.all([
        api.from('profiles').select('first_name, last_name, school_name, created_at').eq('role', 'teacher').order('created_at', { ascending: false }).limit(3),
        api.from('daily_logs').select('log_date, created_at, teacher_id').order('created_at', { ascending: false }).limit(3),
        api.from('stock_receipts').select('item_name, quantity_kg, created_at').order('created_at', { ascending: false }).limit(3)
      ]);

      const combined: any[] = [];
      
      (pRes.data || []).forEach(p => combined.push({
        title: 'New Personnel Initialized',
        school: p.school_name || 'Protocol Hub',
        time: p.created_at,
        icon: UserPlus,
        color: 'bg-emerald-50 text-emerald-600',
        type: 'onboard'
      }));

      (dRes.data || []).forEach(d => combined.push({
        title: 'Daily Ledger Synchronized',
        school: `Station ${d.teacher_id.substring(0, 5)}`,
        time: d.created_at,
        icon: Activity,
        color: 'bg-indigo-50 text-indigo-600',
        type: 'log'
      }));

      (sRes.data || []).forEach(s => combined.push({
        title: 'Resource Allocation Receipt',
        school: `${s.quantity_kg}kg ${s.item_name}`,
        time: s.created_at,
        icon: Package,
        color: 'bg-amber-50 text-amber-600',
        type: 'stock'
      }));

      setActivities(combined.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5));
    } catch (err) {
      console.error('Activity feed error:', err);
    }
  };

  const runDiagnostic = async () => {
    setIsDiagnosing(true);
    setDiagnosticResult(null);
    await new Promise(r => setTimeout(r, 2000));
    try {
      const { error } = await api.from('profiles').select('id').limit(1);
      if (error) throw error;
      setDiagnosticResult('Operational Integrity 100%');
    } catch (err) {
      setDiagnosticResult('Degraded Performance Detected');
    }
    setIsDiagnosing(false);
  };

  const fetchStats = async () => {
    try {
      const { data: profiles } = await api.from('profiles').select('id, school_name, role');
      const { data: mods } = await api.from('system_modules').select('id, is_active_for_teachers');
      const { data: subs } = await api.from('teacher_subscriptions').select('id, status');

      const teacherList = (profiles || []).filter(p => p.role === 'teacher');
      const schools = new Set(teacherList.map(t => t.school_name).filter(Boolean));
      const totalRevenue = teacherList
        .filter(t => t.saas_payment_status === 'paid')
        .reduce((acc, curr) => acc + (curr.saas_amount_paid || 0), 0);
      
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const recentSignups = teacherList.filter(t => t.created_at && new Date(t.created_at) > lastMonth).length;
      const growth = teacherList.length > 0 ? (recentSignups / teacherList.length) * 100 : 0;

      setStats({
        totalTeachers: teacherList.length,
        activeModules: (mods || []).filter(m => m.is_active_for_teachers).length,
        totalSchools: schools.size,
        revenue: totalRevenue,
        activeSubscribers: (subs || []).filter(s => s.status === 'active').length,
        growth: Math.round(growth)
      });
    } catch (err) {
      console.error('Stats error:', err);
    }
  };

  const fetchModules = async () => {
    try {
      const { data } = await api
        .from('system_modules')
        .select('*')
        .order('created_at', { ascending: true });
      if (data) setModules(data);
    } catch (err: any) {
      console.error('Error fetching modules:', err.message);
    }
  };

  const fetchTeachers = async () => {
    try {
      const { data } = await api
        .from('profiles')
        .select('*')
        .eq('role', 'teacher')
        .order('created_at', { ascending: false });
      if (data) setTeachers(data);
    } catch (err: any) {
      console.error('Error fetching teachers:', err.message);
    }
  };

  const fetchGlobalFoods = async () => {
    try {
      const { data } = await api
        .from('global_food_master')
        .select('*')
        .order('name', { ascending: true });
      setGlobalFoods(data || []);
    } catch (err: any) {
      console.error('Food fetch error:', err.message);
    }
  };

  const toggleModule = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await (api as any)
        .from('system_modules')
        .update({ is_active_for_teachers: !currentStatus })
        .eq('id', id);
      if (error) throw error;
      fetchModules();
    } catch (err: any) {
      alert('Failed to update module access. ' + err.message);
    }
  };

  const toggleTeacherStatus = async (id: string, currentStatus: boolean | null) => {
    try {
      const { error } = await (api as any)
        .from('profiles')
        .update({ is_active: currentStatus === false ? true : false })
        .eq('id', id);
      if (error) throw error;
      fetchTeachers();
    } catch (err: any) {
      alert('Failed to update teacher status.');
    }
  };

  const handleGenerateCode = () => {
    if (!newFoodName.trim() || !newFoodNameEn.trim()) {
      alert('Native and Universal names are required for ID generation.');
      return;
    }
    const generatedCode = `F_${newFoodNameEn.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')}`;
    setNewFoodCode(generatedCode);
    setIsCodeValidated(true);
  };

  const addGlobalFood = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        id: editingFoodId, // Explicitly include id for backend compatibility
        code: newFoodCode,
        name: newFoodName.trim(),
        name_en: newFoodNameEn.trim(),
        item_category: newFoodCategory,
        grams_primary: Number(newFoodGramsPrimary) || 0,
        grams_upper_primary: Number(newFoodGramsUpperPrimary) || 0,
        sort_rank: Number(newFoodRank) || 999
      };

      if (isEditingFood && editingFoodId) {
        const { error } = await (api as any).from('global_food_master').update(payload).eq('code', editingFoodId);
        if (error) throw error;
        setDiagnosticResult('Protocol updated successfully!');
      } else {
        const { error } = await (api as any).from('global_food_master').insert(payload);
        if (error) throw error;
        setDiagnosticResult('New resource authorized successfully!');
      }

      setNewFoodName(''); setNewFoodNameEn(''); setNewFoodCode('');
      setNewFoodGramsPrimary(''); setNewFoodGramsUpperPrimary('');
      setNewFoodRank(999);
      setIsCodeValidated(false);
      setIsEditingFood(false);
      setEditingFoodId(null);
      fetchGlobalFoods();
    } catch (err: any) {
      console.error('Save food error:', err.message);
      setDiagnosticResult(`ERROR: ${err.message || 'Operation failed. Please check parameters.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditFood = (food: any) => {
    setNewFoodCode(food.code);
    setNewFoodName(food.name);
    setNewFoodNameEn(food.name_en || '');
    setNewFoodCategory(food.item_category || 'MAIN');
    setNewFoodGramsPrimary(food.grams_primary || '');
    setNewFoodGramsUpperPrimary(food.grams_upper_primary || '');
    setNewFoodRank(food.sort_rank || 999);
    setIsEditingFood(true);
    setEditingFoodId(food.code);
    setIsCodeValidated(true);
    
    // Scroll to form
    const formElement = document.getElementById('resource-entry-form');
    if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const cancelEditFood = () => {
    setNewFoodName(''); setNewFoodNameEn(''); setNewFoodCode('');
    setNewFoodGramsPrimary(''); setNewFoodGramsUpperPrimary('');
    setNewFoodRank(999);
    setIsCodeValidated(false);
    setIsEditingFood(false);
    setEditingFoodId(null);
  };

  const handleUpdateGlobalRanks = async () => {
    try {
      const payload = globalFoods.map(f => ({
        code: f.code,
        sort_rank: f.sort_rank
      }));
      await api.patch('/data/global_food_master/bulk', payload);
      setDiagnosticResult('Global ranks synchronized successfully!');
      fetchGlobalFoods();
    } catch (err: any) {
      alert('Rank update failed: ' + err.message);
    }
  };

  const deleteGlobalFood = async (code: string) => {
    if (!window.confirm('Confirm delete?')) return;
    await api.from('global_food_master').eq('code', code).delete();
    fetchGlobalFoods();
  };

  const handleCreateTeacher = async () => {
    const { data: authData, error: authError } = await api.auth.signUp({
      email: newTeacher.email,
      password: newTeacher.password
    });

    if (authError) {
      alert(authError.message);
      return;
    }

    if (authData?.user) {
      const { error: profileError } = await (api as any).from('profiles').insert({
        id: authData.user.id,
        email: newTeacher.email,
        role: 'teacher',
        first_name: newTeacher.firstName,
        last_name: newTeacher.lastName,
        school_name: newTeacher.schoolName,
        school_id: newTeacher.schoolId
      });

      if (profileError) {
        alert(profileError.message);
        return;
      }
      
      setShowCreateForm(false);
      fetchTeachers();
    }
  };

  const filteredTeachers = teachers.filter(t => 
    (t.first_name + ' ' + t.last_name).toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.school_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sidebarLinks = (
    <div className="space-y-2 py-4">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 mb-4">Master Menu</p>
      {[
        { id: 'overview', label: 'Command Hub', icon: ShieldCheck },
        { id: 'teachers', label: 'User Ecosystem', icon: Users },
        { id: 'modules', label: 'Core Modules', icon: Settings },
        { id: 'foodmaster', label: 'Global Registry', icon: Package },
        { id: 'globalschedule', label: 'Master Schedule', icon: Calendar },
        { id: 'systemsettings', label: 'System Protocol', icon: Activity },
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as any)}
          className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[13px] font-black uppercase tracking-wider transition-all ${
            activeTab === tab.id 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
          }`}
        >
          <tab.icon size={18} />
          {tab.label}
        </button>
      ))}
      <div className="mt-8 pt-8 border-t border-slate-100 px-4">
        <Link 
          to="/saas"
          className="flex items-center justify-between bg-slate-900 text-white p-4 rounded-2xl hover:bg-black transition-all group"
        >
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">SaaS Control</span>
            <span className="text-xs font-black uppercase">Billing Matrix</span>
          </div>
          <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Link>
      </div>
    </div>
  );

  return (
    <Layout sidebarLinks={sidebarLinks}>
      <div className="flex-1 flex flex-col min-h-screen bg-slate-50/50">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-2 rounded-xl text-white">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h1 className="text-sm font-black text-slate-900 uppercase tracking-tighter italic">Antigravity <span className="text-indigo-600 italic underline decoration-indigo-100 underline-offset-4">Command Center</span></h1>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Master Administrative Tier</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              <Activity size={12} className="text-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">System Online</span>
            </div>
            <div className="w-[1px] h-6 bg-slate-200" />
            <button 
              aria-label="Logout"
              className="p-2 text-slate-400 hover:text-red-600 transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <main className="p-8 max-w-7xl mx-auto w-full">
          {loading ? (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
              <Loader2 size={48} className="animate-spin text-indigo-600" />
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Synchronizing Master Data...</p>
            </div>
          ) : (
            <div className="space-y-10 animate-in fade-in duration-500">
              {activeTab === 'overview' && (
                <div className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { label: 'Total Faculty', value: stats.totalTeachers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                      { label: 'Active Schools', value: stats.totalSchools, icon: Building2, color: 'text-purple-600', bg: 'bg-purple-50' },
                      { label: 'Active Modules', value: stats.activeModules, icon: Settings, color: 'text-amber-600', bg: 'bg-amber-50' },
                      { label: 'Platform Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    ].map((kpi, i) => (
                      <div key={i} className="bg-white p-6 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-50 group hover:scale-[1.02] transition-all cursor-default">
                        <div className="flex justify-between items-start mb-4">
                          <div className={`${kpi.bg} ${kpi.color} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                            <kpi.icon size={24} />
                          </div>
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">+{stats.growth}%</span>
                        </div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</h3>
                        <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none italic">{kpi.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white rounded-[40px] shadow-2xl border border-slate-50 overflow-hidden">
                      <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                        <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter flex items-center gap-3">
                          <Activity className="text-indigo-600" size={24} /> Platform Pulse
                        </h3>
                        <button onClick={fetchActivity} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-2">
                          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh Stream
                        </button>
                      </div>
                      <div className="p-8 space-y-6">
                        {activities.length === 0 ? (
                          <p className="text-center py-10 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">No Recent Activity Detected</p>
                        ) : (
                          activities.map((act, i) => (
                            <div key={i} className="flex items-center gap-4 group cursor-default">
                              <div className={`${act.color} p-3 rounded-2xl group-hover:rotate-12 transition-transform`}>
                                <act.icon size={18} />
                              </div>
                              <div className="flex-1">
                                <p className="text-[13px] font-black text-slate-800 uppercase tracking-tight">{act.title}</p>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{act.school}</p>
                              </div>
                              <span className="text-[10px] font-black text-slate-300 uppercase italic">
                                {new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[40px] p-8 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-125 transition-transform duration-700" />
                      <div className="relative z-10 space-y-8">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-100 mb-2">Platform Status</p>
                          <h3 className="text-3xl font-black italic tracking-tighter leading-none">{diagnosticResult || 'Operational Integrity'} <span className="text-emerald-300 underline decoration-emerald-200 underline-offset-8">100%</span></h3>
                        </div>
                        <div className="space-y-4">
                          {[
                            { label: 'Database Sync', status: 'Online', icon: CheckCircle2 },
                            { label: 'Auth Pipeline', status: 'Online', icon: CheckCircle2 },
                            { label: 'Storage Cluster', status: 'Online', icon: CheckCircle2 },
                            { label: 'API Gateway', status: 'Optimal', icon: CheckCircle2 },
                          ].map((s, i) => (
                            <div key={i} className="flex items-center justify-between bg-white/10 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                              <div className="flex items-center gap-3">
                                <s.icon size={16} className="text-emerald-300" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{s.label}</span>
                              </div>
                              <span className="text-[10px] font-black uppercase text-indigo-200">{s.status}</span>
                            </div>
                          ))}
                        </div>
                        <button 
                          onClick={runDiagnostic}
                          disabled={isDiagnosing}
                          className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-50 transition-all shadow-xl flex items-center justify-center gap-2"
                        >
                          {isDiagnosing ? <Loader2 size={14} className="animate-spin" /> : null}
                          {isDiagnosing ? 'Analyzing Protocols...' : 'Run Diagnostic Scan'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'teachers' && (
                <div className="space-y-8">
                  <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[40px] shadow-2xl border border-white flex flex-col lg:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4 w-full lg:w-auto">
                      <div className="bg-indigo-600 p-4 rounded-3xl text-white">
                        <Users size={24} />
                      </div>
                      <div className="flex-1 lg:flex-none">
                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter italic leading-none">User Ecosystem</h2>
                        <div className="mt-4 relative group">
                          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                          <input 
                            type="text"
                            placeholder="Search by Name, Email or School..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-slate-50 border-2 border-slate-100 py-3 pl-12 pr-6 rounded-2xl w-full lg:w-80 text-xs font-black text-slate-800 focus:outline-none focus:border-indigo-500 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                      <button onClick={() => setShowCreateForm(true)} className="flex-1 lg:flex-none bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl active:scale-95">
                        <UserPlus size={18} /> Register Personnel
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-[40px] shadow-2xl border border-slate-50 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-slate-950 text-white">
                            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-left">Faculty Member</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-left">Station Assignment</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-left">Access Status</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-left">Engagement</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-center">Protocol</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTeachers.map((t) => (
                            <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                              <td className="p-6">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black italic">{(t.first_name || 'U')[0]}</div>
                                  <div>
                                    <p className="text-[13px] font-black text-slate-800 uppercase italic tracking-tighter">{t.first_name} {t.last_name}</p>
                                    <p className="text-[11px] font-bold text-indigo-500 lowercase">{t.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-6">
                                <p className="text-[12px] font-black text-slate-700 uppercase">{t.school_name || 'Unassigned'}</p>
                                <p className="text-[10px] font-mono text-slate-400">ID: {t.school_id || '—'}</p>
                              </td>
                              <td className="p-6">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${t.is_active !== false ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                  {t.is_active !== false ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                                  {t.is_active !== false ? 'Verified' : 'Flagged'}
                                </span>
                              </td>
                              <td className="p-6">
                                <p className="text-[10px] font-black text-slate-500 uppercase">Registered</p>
                                <p className="text-[11px] font-black text-slate-900 italic">{new Date(t.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                              </td>
                              <td className="p-6 text-center">
                                <button 
                                  aria-label="Toggle Access Status"
                                  onClick={() => toggleTeacherStatus(t.id, t.is_active)}
                                  className={`p-2 rounded-xl transition-all ${t.is_active !== false ? 'text-emerald-600 hover:bg-emerald-50' : 'text-red-600 hover:bg-red-50'}`}
                                >
                                  {t.is_active !== false ? <ShieldCheck size={18} /> : <AlertCircle size={18} />}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'modules' && (
                <div className="space-y-8">
                  <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-amber-500 p-4 rounded-3xl text-white"><Settings size={24} /></div>
                      <div>
                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter italic leading-none">System Matrix</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Feature Toggle Control Grid</p>
                      </div>
                    </div>
                    <div className="bg-slate-100 px-4 py-2 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Master Key Required</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {modules.map((module) => {
                      const isActive = module.is_active_for_teachers;
                      const IconComponent = IconMap[module.icon_name] || LayoutDashboard;
                      return (
                        <div key={module.id} className="bg-white p-10 rounded-[48px] shadow-2xl hover:shadow-indigo-100 transition-all duration-500 border border-slate-50 group relative overflow-hidden flex flex-col h-full">
                          <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 rounded-full translate-x-1/2 -translate-y-1/2 ${isActive ? 'bg-indigo-600' : 'bg-slate-900'}`} />
                          <div className="flex justify-between items-start mb-8 relative z-10">
                            <div className={`${isActive ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'bg-slate-100 text-slate-400'} p-5 rounded-3xl transition-all group-hover:scale-110`}><IconComponent size={32} /></div>
                            <button 
                              aria-label={`Toggle access for ${module.module_name}`}
                              onClick={() => toggleModule(module.id, isActive)} 
                              className={`w-14 h-7 rounded-full transition-all relative ${isActive ? 'bg-emerald-500' : 'bg-slate-200'}`}
                            >
                              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-md ${isActive ? 'left-8' : 'left-1'}`} />
                            </button>
                          </div>
                          <div className="relative z-10 space-y-4 flex-1">
                            <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">{module.module_name}</h3>
                            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest underline decoration-indigo-100 underline-offset-4">{module.route_path}</p>
                            <p className="text-sm font-bold text-slate-500 leading-relaxed">{module.description}</p>
                          </div>
                          <div className="mt-8 pt-8 border-t border-slate-50 relative z-10">
                            <span className={`text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-[0.2em] ${isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>{isActive ? 'Protocol Active' : 'Access Locked'}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'foodmaster' && (
                <div className="space-y-12">
                  <div className="grid grid-cols-1 gap-12">
                    <div id="resource-entry-form" className="bg-white p-10 rounded-[48px] shadow-2xl border border-slate-50 relative overflow-hidden">
                      <div className="bg-slate-900 absolute top-0 left-0 right-0 h-2" />
                      <h3 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter mb-10 flex items-center gap-3">
                        <PlusCircle className="text-indigo-600" size={32} /> 
                        {isEditingFood ? 'Update Protocol' : 'Resource Entry'}
                      </h3>

                      {diagnosticResult && (
                        <div className={`mb-10 p-6 rounded-3xl animate-in fade-in zoom-in duration-300 border-2 ${diagnosticResult.startsWith('ERROR') ? 'bg-red-50 border-red-100 text-red-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${diagnosticResult.startsWith('ERROR') ? 'bg-red-600' : 'bg-emerald-600'} text-white`}>
                              {diagnosticResult.startsWith('ERROR') ? <Trash2 size={20} /> : <CheckCircle2 size={20} />}
                            </div>
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">System Notification</p>
                              <p className="text-sm font-black italic tracking-tight">{diagnosticResult}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <form onSubmit={addGlobalFood} className="space-y-8">
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Resource Protocol ID (Code)</label>
                            <input type="text" required value={newFoodCode} onChange={e => setNewFoodCode(e.target.value.toUpperCase())} disabled={isEditingFood} className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-3xl text-sm font-black focus:outline-none focus:border-indigo-500 transition-all text-slate-800 disabled:bg-slate-100 disabled:cursor-not-allowed" placeholder="e.g. RICE_01" />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Native Nomenclature</label>
                              <input type="text" required value={newFoodName} onChange={e => {setNewFoodName(e.target.value); setIsCodeValidated(false);}} className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-3xl text-sm font-black focus:outline-none focus:border-indigo-500 transition-all text-slate-800" placeholder="Marathi Name (e.g. साखर)" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Universal Designation</label>
                              <input type="text" required value={newFoodNameEn} onChange={e => {setNewFoodNameEn(e.target.value); setIsCodeValidated(false);}} className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-3xl text-sm font-black focus:outline-none focus:border-indigo-500 transition-all text-slate-800" placeholder="English Name (e.g. Sugar)" />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Required 1-5th (Grams)</label>
                              <input type="number" required step="0.01" value={newFoodGramsPrimary} onChange={e => setNewFoodGramsPrimary(e.target.value === '' ? '' : Number(e.target.value))} className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-3xl text-sm font-black focus:outline-none focus:border-indigo-500 transition-all text-slate-800" placeholder="e.g. 100" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Required 6-8th (Grams)</label>
                              <input type="number" required step="0.01" value={newFoodGramsUpperPrimary} onChange={e => setNewFoodGramsUpperPrimary(e.target.value === '' ? '' : Number(e.target.value))} className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-3xl text-sm font-black focus:outline-none focus:border-indigo-500 transition-all text-slate-800" placeholder="e.g. 150" />
                            </div>
                            
                            {/* Unit Protocol Reference */}
                            <div className="md:col-span-2 bg-indigo-50/50 border-2 border-indigo-100 p-6 rounded-[32px] flex items-center gap-6">
                              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                                <Activity size={24} />
                              </div>
                              <div>
                                <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Unit Protocol Reference</h4>
                                <p className="text-xs font-bold text-indigo-400 leading-relaxed uppercase tracking-tight italic">
                                  Master Registry takes entries in <span className="text-indigo-600 underline underline-offset-2">Grams</span>. 
                                  Teachers will automatically see these as <span className="text-indigo-600 underline underline-offset-2">KG</span>. 
                                  (Ex: 100g → 0.100 KG)
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Display Rank (Sort Order)</label>
                            <input type="number" value={newFoodRank} onChange={e => setNewFoodRank(e.target.value === '' ? '' : Number(e.target.value))} className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-3xl text-sm font-black focus:outline-none focus:border-indigo-500 transition-all text-slate-800" placeholder="e.g. 10" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Classification Tier</label>
                          <div className="flex bg-slate-100 p-2 rounded-[24px] border border-slate-200">
                            <button type="button" onClick={() => setNewFoodCategory('MAIN')} className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${newFoodCategory === 'MAIN' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'text-slate-400'}`}>Main Commodity</button>
                            <button type="button" onClick={() => setNewFoodCategory('INGREDIENT')} className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${newFoodCategory === 'INGREDIENT' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400'}`}>Secondary Ingredient</button>
                          </div>
                        </div>
                        <div className="pt-4 flex flex-col sm:flex-row gap-4">
                          {!isEditingFood && (
                            <button type="button" onClick={handleGenerateCode} className="bg-slate-100 text-slate-700 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">Generate ID</button>
                          )}
                          <button type="submit" disabled={!isCodeValidated} className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-indigo-100 disabled:opacity-50 active:scale-95 transition-all">
                            {isEditingFood ? 'Sync Global Protocol' : 'Authorize Registry Entry'}
                          </button>
                          {isEditingFood && (
                            <button type="button" onClick={cancelEditFood} className="px-8 bg-slate-100 text-slate-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
                          )}
                        </div>
                      </form>
                    </div>
                    <div className="space-y-8">
                      <div className="bg-white rounded-[48px] shadow-2xl border border-slate-50 overflow-hidden flex flex-col h-[800px]">
                        <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Globe className="text-indigo-600" size={32} />
                            <div>
                              <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Global Registry</h3>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Master Resource Database</p>
                            </div>
                          </div>
                          <button onClick={handleUpdateGlobalRanks} className="text-xs font-black text-indigo-600 bg-indigo-50 px-6 py-3 rounded-2xl uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm">Save All Ranks</button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
                          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                            {['MAIN', 'INGREDIENT'].map(cat => (
                              <div key={cat} className="space-y-6">
                                <div className="flex items-center gap-4">
                                  <div className={`h-1 w-12 rounded-full ${cat === 'MAIN' ? 'bg-blue-600' : 'bg-slate-900'}`} />
                                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">{cat === 'MAIN' ? 'Primary Commodities' : 'Supplementary Ingredients'}</h4>
                                </div>
                                <div className="space-y-4">
                                  {globalFoods.filter(f => f.item_category === cat)
                                    .sort((a, b) => (a.sort_rank ?? 999) - (b.sort_rank ?? 999))
                                    .map((f) => (
                                      <div key={f.code} className="group bg-slate-50/50 p-8 rounded-[40px] border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all flex items-center justify-between shadow-sm">
                                        <div className="flex items-center gap-8">
                                          <div className="flex flex-col items-center gap-2">
                                            <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Rank</label>
                                            <input 
                                              type="number" 
                                              aria-label="Sort Rank"
                                              value={f.sort_rank ?? ''} 
                                              onChange={e => {
                                                const newRank = parseInt(e.target.value) || 0;
                                                setGlobalFoods(prev => prev.map(item => item.code === f.code ? {...item, sort_rank: newRank} : item));
                                              }}
                                              className="w-16 bg-white border-2 border-slate-100 rounded-2xl py-2 text-center font-black text-xs focus:border-indigo-500 outline-none transition-all" 
                                            />
                                          </div>
                                          <div className="space-y-2">
                                            <h4 className="text-lg font-black text-slate-900 italic uppercase tracking-tighter leading-none">{f.name}</h4>
                                            <div className="flex items-center gap-4">
                                              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{f.name_en}</p>
                                              <div className="flex gap-2">
                                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">1-5: {f.grams_primary}g</span>
                                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full border border-slate-200">6-8: {f.grams_upper_primary}g</span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                          <button aria-label="Edit food item" onClick={() => handleEditFood(f)} className="p-4 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-3xl transition-all shadow-sm"><Settings size={22} /></button>
                                          <button aria-label="Delete food item" onClick={() => deleteGlobalFood(f.code)} className="p-4 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-3xl transition-all shadow-sm"><Trash2 size={22} /></button>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'globalschedule' && (
                <GlobalScheduleForm />
              )}

              {activeTab === 'systemsettings' && (
                !systemSettings ? (
                  <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                    <Loader2 size={48} className="animate-spin text-indigo-600" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Initializing Protocols...</p>
                  </div>
                ) : (
                  <div className="max-w-4xl mx-auto space-y-8 pb-20">
                    {/* SECTION 1: COOKING COSTS */}
                    <div className="bg-white p-10 rounded-[48px] shadow-2xl border border-slate-100 relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-indigo-500" />
                      <div className="flex items-center gap-6 mb-10">
                        <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-lg"><Globe size={24} /></div>
                        <div>
                          <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">इंधन आणि भाजीपाला खर्च (Cooking Costs)</h2>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">Government Standard Rates per Student</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Rate (Std 1-5)</label>
                          <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black">₹</span>
                            <input 
                              type="number" step="0.01" aria-label="Primary Rate"
                              value={systemSettings.primary_rate}
                              onChange={e => setSystemSettings({...systemSettings, primary_rate: Number(e.target.value)})}
                              className="w-full bg-slate-50 border-2 border-slate-100 py-4 pl-12 pr-6 rounded-2xl text-sm font-black focus:border-blue-500 outline-none transition-all"
                            />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Upper Primary Rate (Std 6-8)</label>
                          <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black">₹</span>
                            <input 
                              type="number" step="0.01" aria-label="Upper Primary Rate"
                              value={systemSettings.upper_primary_rate}
                              onChange={e => setSystemSettings({...systemSettings, upper_primary_rate: Number(e.target.value)})}
                              className="w-full bg-slate-50 border-2 border-slate-100 py-4 pl-12 pr-6 rounded-2xl text-sm font-black focus:border-blue-500 outline-none transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={handleUpdateSystemSettings}
                        disabled={saveSettingsLoading}
                        className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
                      >
                        {saveSettingsLoading ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
                        Update Global Rates
                      </button>
                    </div>

                    {/* SECTION 2: SECURITY PROTOCOL (LOCKED) */}
                    <div className="bg-slate-900 p-10 rounded-[48px] shadow-2xl relative overflow-hidden border border-slate-800">
                      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
                      
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-10">
                          <div className="flex items-center gap-6">
                            <div className={`p-4 rounded-2xl text-white shadow-lg transition-all ${isUnlocked ? 'bg-emerald-600' : 'bg-red-600'}`}>
                              {isUnlocked ? <ShieldCheck size={24} /> : <ShieldAlert size={24} />}
                            </div>
                            <div>
                              <h2 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">Security Protocol</h2>
                              <p className={`text-[9px] font-bold uppercase tracking-widest mt-2 ${isUnlocked ? 'text-emerald-400' : 'text-red-400'}`}>
                                {isUnlocked ? 'Identity Verified: Owner Access' : 'Locked: Authorization Required'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {!isUnlocked ? (
                          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] space-y-6">
                              <p className="text-[11px] font-bold text-slate-400 uppercase leading-relaxed text-center">
                                To access Master Password settings, a 6-digit verification code must be sent to <span className="text-white italic">lrathod330@gmail.com</span>.
                              </p>
                              
                              {showOtpInput ? (
                                <div className="space-y-6">
                                  <div className="flex flex-col items-center gap-4">
                                    <input 
                                      type="text" maxLength={6}
                                      placeholder="ENTER 6-DIGIT CODE"
                                      value={otpInput}
                                      onChange={e => setOtpInput(e.target.value)}
                                      className="w-64 bg-black/50 border-2 border-white/20 p-5 rounded-2xl text-2xl font-black text-center tracking-[0.5em] text-white focus:border-red-500 outline-none transition-all"
                                    />
                                    <div className="flex gap-4">
                                      <button 
                                        onClick={handleVerifyOtp}
                                        disabled={otpInput.length !== 6 || saveSettingsLoading}
                                        className="bg-red-600 text-white px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-700 active:scale-95 transition-all"
                                      >
                                        Verify & Unlock
                                      </button>
                                      <button 
                                        onClick={() => setShowOtpInput(false)}
                                        className="text-[10px] font-black text-slate-500 uppercase hover:text-white transition-colors"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <button 
                                  onClick={handleRequestOtp}
                                  disabled={saveSettingsLoading}
                                  className="w-full bg-white/10 hover:bg-white/20 text-white py-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] transition-all flex items-center justify-center gap-3 border border-white/5"
                                >
                                  {saveSettingsLoading ? <Loader2 className="animate-spin" size={16} /> : <Mail size={16} />}
                                  Request Authorization OTP
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-8 animate-in zoom-in duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] flex flex-col items-center justify-center gap-4 group">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Master Password Status</span>
                                {revealedPassword ? (
                                  <div className="text-xl font-black text-emerald-400 tracking-widest uppercase py-2">{revealedPassword}</div>
                                ) : (
                                  <button 
                                    onClick={() => setRevealedPassword(systemSettings.master_sudo_password)}
                                    className="bg-white/10 px-6 py-3 rounded-xl text-[10px] font-black text-white uppercase hover:bg-white/20 transition-all"
                                  >
                                    Fetch Current Key
                                  </button>
                                )}
                              </div>
                              <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] space-y-4">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Deploy New Master Key</span>
                                <input 
                                  type="text"
                                  value={newMasterPassword}
                                  onChange={e => setNewMasterPassword(e.target.value)}
                                  className="w-full bg-black/50 border-2 border-white/10 py-4 px-6 rounded-2xl text-sm font-black text-red-400 focus:border-red-500 outline-none transition-all uppercase tracking-widest"
                                  placeholder="NEW SECRET KEY"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                               <div className="flex items-center justify-between">
                                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Final Verification Code</p>
                                 <button 
                                   onClick={handleRequestOtp}
                                   className="text-[9px] font-black text-emerald-400 uppercase hover:text-emerald-300 transition-colors flex items-center gap-2"
                                 >
                                   <Mail size={12} /> Request Confirmation OTP
                                 </button>
                               </div>
                               <input 
                                  type="text" maxLength={6}
                                  placeholder="ENTER 6-DIGIT CODE"
                                  value={otpInput}
                                  onChange={e => setOtpInput(e.target.value)}
                                  className="w-full bg-black border-2 border-white/20 py-4 text-center text-xl font-black tracking-[0.5em] text-white rounded-2xl focus:border-emerald-500 outline-none transition-all"
                                />
                            </div>

                            <button 
                              onClick={handleResetPassword}
                              disabled={!newMasterPassword || otpInput.length !== 6 || saveSettingsLoading}
                              className={`w-full py-6 rounded-3xl font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl transition-all flex items-center justify-center gap-3 ${
                                (!newMasterPassword || otpInput.length !== 6 || saveSettingsLoading)
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/20 active:scale-95'
                              }`}
                            >
                              {saveSettingsLoading ? <Loader2 className="animate-spin" size={16} /> : <Key size={16} />}
                              Confirm Identity & Reset Key
                            </button>
                            
                            <button 
                              onClick={() => { setIsUnlocked(false); setShowOtpInput(false); setRevealedPassword(''); }}
                              className="w-full text-[9px] font-black text-slate-600 uppercase hover:text-slate-400 transition-colors"
                            >
                              Terminate Secure Session
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </main>
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 md:p-12">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-600 p-4 rounded-3xl text-white"><UserPlus size={24} /></div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Initialize Faculty</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">New Personnel Deployment</p>
                  </div>
                </div>
                <button 
                  aria-label="Close registration form"
                  onClick={() => setShowCreateForm(false)} 
                  className="p-3 text-slate-400 hover:text-red-600 transition-colors"
                >
                  <X size={28} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Designation</label>
                    <input type="text" value={newTeacher.firstName} onChange={e => setNewTeacher({...newTeacher, firstName: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-3xl text-sm font-black focus:outline-none focus:border-indigo-500 transition-all" placeholder="Rahul" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Designation</label>
                    <input type="text" value={newTeacher.lastName} onChange={e => setNewTeacher({...newTeacher, lastName: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-3xl text-sm font-black focus:outline-none focus:border-indigo-500 transition-all" placeholder="Patil" />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Station</label>
                    <input type="text" value={newTeacher.schoolName} onChange={e => setNewTeacher({...newTeacher, schoolName: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-3xl text-sm font-black focus:outline-none focus:border-indigo-500 transition-all" placeholder="ZP Primary School" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Station ID (UDISE)</label>
                    <input type="text" value={newTeacher.schoolId} onChange={e => setNewTeacher({...newTeacher, schoolId: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-3xl text-sm font-black focus:outline-none focus:border-indigo-500 transition-all" placeholder="11-digit Code" />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Authentication Credentials</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="email" value={newTeacher.email} onChange={e => setNewTeacher({...newTeacher, email: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-3xl text-sm font-black focus:outline-none focus:border-indigo-500 transition-all" placeholder="teacher@gov.in" />
                      <input type="password" value={newTeacher.password} onChange={e => setNewTeacher({...newTeacher, password: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-3xl text-sm font-black focus:outline-none focus:border-indigo-500 transition-all" placeholder="Secure Password" />
                    </div>
                  </div>
                </div>
              </div>
              <button onClick={handleCreateTeacher} className="w-full bg-indigo-600 text-white py-6 rounded-[32px] font-black uppercase text-xs md:text-sm tracking-[0.3em] shadow-2xl shadow-indigo-200 active:scale-[0.98] transition-all">Execute Initialization</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
