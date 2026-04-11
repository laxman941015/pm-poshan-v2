import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Layout from '../components/Layout';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Package, 
  FileText,
  Trash2,
  PlusCircle,
  Loader2,
  X
} from 'lucide-react';

const IconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  ClipboardList,
  Package,
  FileText
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'modules' | 'teachers' | 'foodmaster'>('modules');
  const [modules, setModules] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Food Master State
  const [globalFoods, setGlobalFoods] = useState<any[]>([]);
  const [foodLoading, setFoodLoading] = useState(false);
  const [newFoodCode, setNewFoodCode] = useState('');
  const [newFoodName, setNewFoodName] = useState('');
  const [newFoodNameEn, setNewFoodNameEn] = useState('');
  const [newFoodCategory, setNewFoodCategory] = useState<'MAIN' | 'INGREDIENT'>('MAIN');
  const [foodMsg, setFoodMsg] = useState({ type: '', text: '' });
  const [isCodeValidated, setIsCodeValidated] = useState(false);

  // New Teacher Management State
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    schoolName: '',
    schoolId: ''
  });
  const [createMsg, setCreateMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
    fetchGlobalFoods();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchModules(), fetchTeachers()]);
    setLoading(false);
  };

  const fetchModules = async () => {
    try {
      const { data, error } = await supabase
        .from('system_modules')
        .select('*')
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      if (data) setModules(data);
    } catch (err: any) {
      console.error('Error fetching modules:', err.message);
    }
  };

  const fetchTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'teacher')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      if (data) setTeachers(data);
    } catch (err: any) {
      console.error('Error fetching teachers:', err.message);
    }
  };

  const toggleModule = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await (supabase as any)
        .from('system_modules')
        .update({ is_active_for_teachers: !currentStatus })
        .eq('id', id);
        
      if (error) throw error;
      await fetchModules();
    } catch (err: any) {
      alert('Failed to update module access. ' + err.message);
    }
  };

  // ── Global Food Master CRUD ─────────────────────────────────────
  const fetchGlobalFoods = async () => {
    setFoodLoading(true);
    try {
      const { data, error } = await supabase
        .from('global_food_master')
        .select('*')
        .order('name', { ascending: true });
      if (error) throw error;
      setGlobalFoods(data || []);
    } catch (err: any) {
      console.error('Food fetch error:', err.message);
    } finally {
      setFoodLoading(false);
    }
  };

  const handleNameChange = (val: string, lang: 'mr' | 'en') => {
    if (lang === 'mr') setNewFoodName(val);
    else setNewFoodNameEn(val);
    
    // Reset validation state whenever names change
    setNewFoodCode('');
    setIsCodeValidated(false);
    setFoodMsg({ type: '', text: '' });
  };

  const handleGenerateCode = () => {
    if (!newFoodName.trim() || !newFoodNameEn.trim()) {
      setFoodMsg({ type: 'error', text: 'Please enter both Marathi and English names to generate the code.' });
      return;
    }

    // Generate unique code based on English name
    const baseCode = newFoodNameEn.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    const generatedCode = `F_${baseCode}`;

    // Check for duplicates in local state
    const isCodeDuplicate = globalFoods.some(f => f.code === generatedCode);
    const isNameDuplicate = globalFoods.some(f => 
      f.name === newFoodName.trim() || 
      (f.name_en && f.name_en.toLowerCase() === newFoodNameEn.trim().toLowerCase())
    );

    if (isCodeDuplicate) {
      setFoodMsg({ type: 'error', text: `Duplicate Code: The code '${generatedCode}' already exists.` });
      setNewFoodCode(generatedCode);
      setIsCodeValidated(false);
    } else if (isNameDuplicate) {
      setFoodMsg({ type: 'error', text: `Duplicate Item: The food name already exists in the Government List.` });
      setNewFoodCode('');
      setIsCodeValidated(false);
    } else {
      setNewFoodCode(generatedCode);
      setIsCodeValidated(true);
      setFoodMsg({ type: 'success', text: `Code '${generatedCode}' generated and validated. Ready to add.` });
    }
  };

  const addGlobalFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCodeValidated) {
      setFoodMsg({ type: 'error', text: 'Please generate and validate the Food Code first.' });
      return;
    }
    setFoodMsg({ type: '', text: '' });
    try {
      const { error } = await (supabase as any).from('global_food_master').insert({
        code: newFoodCode,
        name: newFoodName.trim(),
        name_en: newFoodNameEn.trim(),
        item_category: newFoodCategory,
      });
      if (error) throw error;
      setFoodMsg({ type: 'success', text: `"${newFoodName}" added to the Government List.` });
      setNewFoodCode('');
      setNewFoodName('');
      setNewFoodNameEn('');
      setIsCodeValidated(false);
      fetchGlobalFoods();
      setTimeout(() => setFoodMsg({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setFoodMsg({ type: 'error', text: 'Failed to add: ' + err.message });
    }
  };

  const deleteGlobalFood = async (code: string, name: string) => {
    if (!window.confirm(`Remove "${name}" from the Government List?`)) return;
    try {
      const { error } = await supabase
        .from('global_food_master')
        .delete()
        .eq('code', code);
      if (error) throw error;
      fetchGlobalFoods();
    } catch (err: any) {
      setFoodMsg({ type: 'error', text: 'Failed to delete: ' + err.message });
    }
  };



  const handleCreateTeacher = async () => {
    setCreateMsg({ type: '', text: '' });
    
    // Validate inputs
    if (!newTeacher.email || !newTeacher.password || !newTeacher.firstName) {
      setCreateMsg({ type: 'error', text: 'Email, Password, and First Name are required fields.' });
      return;
    }

    // Step 1: Create Auth User
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: newTeacher.email,
      password: newTeacher.password
    });

    if (authError) {
      setCreateMsg({ type: 'error', text: authError.message });
      return;
    }

    if (authData?.user) {
      // Step 2: Insert into Profiles specifically passing the new fields via raw cast
      const { error: profileError } = await (supabase as any).from('profiles').insert({
        id: authData.user.id,
        email: newTeacher.email,
        role: 'teacher',
        first_name: newTeacher.firstName,
        last_name: newTeacher.lastName,
        school_name: newTeacher.schoolName,
        school_id: newTeacher.schoolId
      });

      if (profileError) {
        setCreateMsg({ type: 'error', text: `Auth created but profile save failed: ${profileError.message}` });
        return;
      }
      
      setCreateMsg({ type: 'success', text: 'Success! New teaching personnel has been registered to the network.' });
      setNewTeacher({ email: '', password: '', firstName: '', lastName: '', schoolName: '', schoolId: '' });
      setShowCreateForm(false);
      fetchTeachers(); // Refresh the list
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4 bg-white/60 p-10 rounded-3xl backdrop-blur-md shadow-xl border border-white/50">
            <svg className="animate-spin h-10 w-10 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-xl font-bold text-slate-800 tracking-tight">Syncing Database...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Sidebar Menu mapping
  const adminSidebar = (
    <>
      <li>
        <button 
          onClick={() => setActiveTab('modules')} 
          className={`w-full text-left p-3.5 rounded-xl text-[14px] font-extrabold transition-all shadow-sm border ${
            activeTab === 'modules' 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-blue-500/30 border-blue-600' 
              : 'bg-white/80 text-slate-700 hover:border-blue-200 hover:text-blue-700 border-white/60'
          }`}
        >
          Manage Modules
        </button>
      </li>
      <li>
        <button 
          onClick={() => setActiveTab('teachers')} 
          className={`w-full text-left p-3.5 rounded-xl text-[14px] font-extrabold transition-all shadow-sm border ${
            activeTab === 'teachers' 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-blue-500/30 border-blue-600' 
              : 'bg-white/80 text-slate-700 hover:border-blue-200 hover:text-blue-700 border-white/60'
          }`}
        >
          Manage Teachers
        </button>
      </li>
      <li>
        <button 
          onClick={() => setActiveTab('foodmaster')} 
          className={`w-full text-left p-3.5 rounded-xl text-[14px] font-extrabold transition-all shadow-sm border ${
            activeTab === 'foodmaster' 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-blue-500/30 border-blue-600' 
              : 'bg-white/80 text-slate-700 hover:border-blue-200 hover:text-blue-700 border-white/60'
          }`}
        >
          🏛 Global Food Master
        </button>
      </li>
    </>
  );

  return (
    <Layout sidebarLinks={adminSidebar}>
      <div className="w-full max-w-[1400px] mx-auto z-10 relative px-4 md:px-6">
        
        {/* Superior Mobile-Scrollable Navigation */}
        <div className="mb-8 overflow-x-auto no-scrollbar -mx-4 px-4 sticky top-16 z-20 md:hidden pb-2">
          <div className="flex bg-white/70 backdrop-blur-xl p-1.5 rounded-2xl border border-white min-w-max shadow-sm">
            {[
              { id: 'modules', label: 'Feature Access', icon: LayoutDashboard },
              { id: 'teachers', label: 'Personnel Roster', icon: ClipboardList },
              { id: 'foodmaster', label: 'Government List', icon: Package }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${activeTab === tab.id ? 'bg-[#474379] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-10 text-left">
          <h1 className="text-3xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase italic leading-none mb-3">
            {activeTab === 'modules' ? 'System <span className="text-blue-600 underline decoration-blue-200">Matrix</span>' 
              : activeTab === 'teachers' ? 'Official <span className="text-blue-600 underline decoration-blue-200">Roster</span>'
              : 'Global <span className="text-blue-600 underline decoration-blue-200">Registry</span>'}
          </h1>
          <p className="text-[10px] md:text-sm font-black text-slate-400 uppercase tracking-[0.4em]">Enterprise Administrative Control Hub</p>
        </div>

        {/* Modules Tab */}
        {activeTab === 'modules' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {modules.map((module) => {
              const isActive = module.is_active_for_teachers;
              const IconComponent = IconMap[module.icon_name] || LayoutDashboard;

              return (
                <div key={module.id} className="bg-white p-8 md:p-10 rounded-[40px] shadow-2xl hover:shadow-blue-100 transition-all duration-500 border border-slate-50 flex flex-col group relative overflow-hidden">
                  <div className="flex justify-between items-start mb-8">
                    <div className={`p-5 rounded-3xl transition-all duration-500 ${isActive ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'bg-slate-100 text-slate-400'}`}>
                      <IconComponent size={32} />
                    </div>
                    <button
                      title={isActive ? "Deactivate Module" : "Activate Module"}
                      onClick={() => toggleModule(module.id, isActive)}
                      className={`w-14 h-7 rounded-full transition-all relative ${isActive ? 'bg-green-500 shadow-inner' : 'bg-slate-200'}`}
                    >
                      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-md ${isActive ? 'left-8' : 'left-1'}`} />
                    </button>
                  </div>

                  <h3 className="text-2xl font-black text-slate-800 mb-2 uppercase tracking-tighter italic leading-none">{module.module_name}</h3>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-6">ROUTE: {module.route_path}</p>
                  
                  <p className="text-sm font-bold text-slate-500 leading-relaxed mb-8">
                    {module.description}
                  </p>

                  <div className="mt-auto pt-6 border-t border-slate-50 flex items-center">
                    <span className={`text-[10px] font-black px-4 py-2 rounded-2xl uppercase tracking-widest ${isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {isActive ? 'Active Node' : 'Access Restricted'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* STRICT CET ENTERPRISE TAB - TEACHERS */}
        {activeTab === 'teachers' && (
          <div className="w-full">
            
            {createMsg.text && (
              <div className={`mb-6 p-4 rounded text-sm font-bold border ${createMsg.type === 'success' ? 'bg-[#00a65a]/10 text-[#00a65a] border-[#00a65a]/30' : 'bg-red-50 text-red-600 border-red-200'}`}>
                {createMsg.text}
              </div>
            )}

            {/* Top Action Bar */}
            <div className="bg-white/80 backdrop-blur-xl p-5 md:p-10 rounded-[40px] shadow-xl border border-white flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-600 p-4 rounded-3xl text-white shadow-lg shadow-blue-200">
                   <ClipboardList size={24} />
                </div>
                <div>
                   <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter leading-none italic">Personnel Roster</h2>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Active Teaching Faculty Registry</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white px-10 py-5 rounded-3xl font-black shadow-2xl transition-all text-xs flex items-center justify-center gap-4 uppercase tracking-[0.2em] active:scale-95"
              >
                <PlusCircle size={24} /> Register New Member
              </button>
            </div>

            {/* CET Creation Form Modal */}
            {showCreateForm && (
              <div className="bg-white p-6 md:p-12 mb-10 shadow-2xl rounded-[40px] border border-slate-100 relative animate-in slide-in-from-top-10 duration-500">
                <button 
                  title="Close Form"
                  onClick={() => setShowCreateForm(false)}
                  className="absolute top-6 right-6 md:top-10 md:right-10 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 p-3 rounded-2xl transition-all"
                >
                  <X size={24} />
                </button>

                <h3 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-3 uppercase italic tracking-tighter">
                   <PlusCircle className="text-blue-600" size={32} /> Deployment Form
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-10">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest block ml-1">Official Credentials</label>
                      <input 
                        type="text" 
                        value={newTeacher.firstName}
                        onChange={e => setNewTeacher({...newTeacher, firstName: e.target.value})}
                        className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl text-sm font-black focus:outline-none focus:border-blue-500 transition-all text-slate-800" 
                        placeholder="First Name (e.g. Rahul)"
                      />

                      <input 
                        type="text" 
                        value={newTeacher.lastName}
                        onChange={e => setNewTeacher({...newTeacher, lastName: e.target.value})}
                        className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl text-sm font-black focus:outline-none focus:border-blue-500 transition-all text-slate-800" 
                        placeholder="Last Name (e.g. Patil)"
                      />

                      <input 
                        type="email" 
                        value={newTeacher.email}
                        onChange={e => setNewTeacher({...newTeacher, email: e.target.value})}
                        className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl text-sm font-black focus:outline-none focus:border-blue-500 transition-all text-slate-800" 
                        placeholder="teacher@gov.in"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest block ml-1">Workplace & Security</label>
                      <input 
                        type="text" 
                        value={newTeacher.schoolName}
                        onChange={e => setNewTeacher({...newTeacher, schoolName: e.target.value})}
                        className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl text-sm font-black focus:outline-none focus:border-blue-500 transition-all text-slate-800" 
                        placeholder="School Name (ZP Primary)"
                      />

                      <input 
                        type="text" 
                        value={newTeacher.schoolId}
                        onChange={e => setNewTeacher({...newTeacher, schoolId: e.target.value})}
                        className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl text-sm font-black focus:outline-none focus:border-blue-500 transition-all text-slate-800" 
                        placeholder="11-digit UDISE Code"
                      />

                      <input 
                        type="password" 
                        value={newTeacher.password}
                        onChange={e => setNewTeacher({...newTeacher, password: e.target.value})}
                        className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl text-sm font-black focus:outline-none focus:border-blue-500 transition-all text-slate-800" 
                        placeholder="Secure Password"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-8 border-t border-slate-50">
                   <button 
                     onClick={handleCreateTeacher} 
                     className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 rounded-3xl font-black transition-all shadow-2xl text-xs uppercase tracking-[0.3em] active:scale-[0.98]"
                   >
                     Initialize Credentials
                   </button>
                </div>
              </div>
            )}

            {/* Adaptive Personnel Roster */}
            <div className="hidden md:block bg-white/50 backdrop-blur-xl border border-white rounded-[40px] shadow-2xl overflow-hidden mb-10">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-900 border-b border-white/10">
                      <th className="p-6 text-xs font-black text-white uppercase tracking-widest text-left">Personnel Information</th>
                      <th className="p-6 text-xs font-black text-white uppercase tracking-widest text-left">Workplace Station</th>
                      <th className="p-6 text-xs font-black text-white uppercase tracking-widest text-left">Station ID</th>
                      <th className="p-6 text-xs font-black text-white uppercase tracking-widest text-left">Official Email</th>
                      <th className="p-6 text-xs font-black text-white uppercase tracking-widest text-left">Since</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachers.map((t) => {
                      const name = `${t.first_name || ''} ${t.last_name || ''}`.trim() || 'Data Incomplete';
                      return (
                        <tr key={t.id} className="border-b border-slate-50 hover:bg-white transition-colors group">
                          <td className="p-6 font-black text-slate-800 uppercase italic text-[13px]">{name}</td>
                          <td className="p-6 font-bold text-slate-500 text-[12px] uppercase">{t.school_name || 'Unassigned'}</td>
                          <td className="p-6 font-mono text-slate-400 text-[11px]">{t.school_id || '—'}</td>
                          <td className="p-6 font-bold text-blue-600 text-[12px]">{t.email}</td>
                          <td className="p-6 font-black text-slate-400 text-[10px] uppercase">
                            {new Date(t.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                          </td>
                        </tr>
                      );
                    })}

                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards fallback */}
            <div className="md:hidden space-y-4 mb-10">
               {teachers.map(t => (
                 <div key={t.id} className="bg-white p-6 rounded-[30px] border border-slate-100 shadow-xl shadow-slate-900/5">
                    <div className="flex justify-between items-start mb-4">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">School: {t.school_id || 'N/A'}</span>
                       <span className="text-[9px] font-black text-blue-500 uppercase">{new Date(t.created_at).toLocaleDateString('en-GB')}</span>
                    </div>
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter italic mb-1">{t.first_name} {t.last_name}</h3>
                    <p className="text-sm font-bold text-slate-500 uppercase mb-4">{t.school_name}</p>
                    <div className="pt-4 border-t border-slate-50 flex items-center gap-3">
                       <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><ClipboardList size={16} /></div>
                       <span className="text-xs font-black text-blue-600 truncate">{t.email}</span>
                    </div>
                 </div>
               ))}
               {teachers.length === 0 && <p className="text-center p-10 font-black text-slate-400 uppercase tracking-[0.2em] italic">No active personnel found.</p>}
            </div>
          </div>
        )}

        {/* ── GLOBAL FOOD MASTER TAB ─────────────────────────── */}
        {activeTab === 'foodmaster' && (
          <div className="w-full">

            {foodMsg.text && (
              <div className={`mb-6 p-4 text-sm font-bold border ${
                foodMsg.type === 'success'
                  ? 'bg-[#00a65a]/10 text-[#00a65a] border-[#00a65a]/30'
                  : 'bg-red-50 text-red-600 border-red-200'
              }`}>
                {foodMsg.type === 'success' ? '✓ ' : '✕ '}{foodMsg.text}
              </div>
            )}

            {/* Global Food Master Panel */}
            <div className="bg-white/90 backdrop-blur-xl p-5 md:p-10 rounded-[40px] shadow-2xl border border-white mb-10 overflow-hidden relative">
               <div className="bg-slate-900 absolute top-0 left-0 right-0 h-2" />
               <h3 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter mb-8 flex items-center gap-3">
                  <PlusCircle className="text-blue-600" size={32} /> Government Food Repository
               </h3>
               
               <form onSubmit={addGlobalFood} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Marathi Designation</label>
                    <input
                      type="text" required value={newFoodName}
                      onChange={e => handleNameChange(e.target.value, 'mr')}
                      className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl text-sm font-black focus:outline-none focus:border-blue-500 transition-all text-slate-800"
                      placeholder="उदा. मुगाची डाळ"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">English Designation</label>
                    <input
                      type="text" required value={newFoodNameEn}
                      onChange={e => handleNameChange(e.target.value, 'en')}
                      className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl text-sm font-black focus:outline-none focus:border-blue-500 transition-all text-slate-800"
                      placeholder="e.g. Moong Dal"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
                  <div className="lg:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">System Serial Identification</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text" readOnly value={newFoodCode}
                        className="flex-1 bg-slate-100 border-2 border-slate-100 p-5 rounded-2xl text-sm font-mono font-black text-slate-400 uppercase"
                        placeholder="Click Generate to Validatate..."
                      />
                      <button
                        type="button" onClick={handleGenerateCode}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95"
                      >
                        Generate & Verify
                      </button>
                    </div>
                  </div>

                  <div className="w-full">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Stock Category</label>
                     <div className="flex bg-slate-50 p-1.5 rounded-2xl border-2 border-slate-100">
                        <button 
                          type="button" onClick={() => setNewFoodCategory('MAIN')}
                          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${newFoodCategory === 'MAIN' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400'}`}
                        >MAIN</button>
                        <button 
                          type="button" onClick={() => setNewFoodCategory('INGREDIENT')}
                          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${newFoodCategory === 'INGREDIENT' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-400'}`}
                        >INGREDIENT</button>
                     </div>
                  </div>

                </div>
                
                <button
                  type="submit" disabled={!isCodeValidated}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-6 rounded-3xl font-black text-xs md:text-sm uppercase tracking-[0.3em] transition-all shadow-2xl shadow-blue-200 disabled:opacity-50 active:scale-[0.98]"
                >
                  Confirm Deployment to Roster
                </button>
               </form>
            </div>

            {/* Adaptive Food Master Registry */}
            <div className="hidden md:block bg-white border border-slate-200 shadow-2xl rounded-[40px] overflow-hidden mb-10">
              <div className="bg-slate-900 p-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white/10 rounded-lg text-white"><Package size={20} /></div>
                   <span className="font-black text-white uppercase tracking-widest text-sm italic">🏛 Official Government Register</span>
                </div>
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/10">
                  {globalFoods.length} Nodes Online
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="p-6 text-[11px] font-black text-slate-500 uppercase tracking-widest text-left w-48">System Identifier</th>
                      <th className="p-6 text-[11px] font-black text-slate-500 uppercase tracking-widest text-left">Nomenclature & Designation</th>
                      <th className="p-6 text-[11px] font-black text-slate-500 uppercase tracking-widest text-left">International Ref</th>
                      <th className="p-6 text-[11px] font-black text-slate-500 uppercase tracking-widest text-center w-32">Action Matrix</th>
                    </tr>
                  </thead>
                  <tbody>
                    {foodLoading ? (
                      <tr>
                        <td colSpan={4} className="p-10 text-center">
                          <Loader2 className="animate-spin text-blue-600 mx-auto" size={32} />
                        </td>
                      </tr>
                    ) : (
                      globalFoods.map((food) => (
                        <tr key={food.code} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                          <td className="p-6 font-mono font-black text-blue-600 text-[12px] uppercase">{food.code}</td>
                          <td className="p-6">
                             <div className="flex flex-col gap-1.5">
                                <span className="text-[15px] font-black text-slate-800 italic uppercase tracking-tighter">{food.name}</span>
                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md w-fit shadow-sm border ${food.item_category === 'MAIN' ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-800 text-white border-slate-700'}`}>
                                   {food.item_category === 'MAIN' ? 'Primary Commodity' : 'Utility Ingredient'}
                                </span>
                             </div>
                          </td>
                          <td className="p-6 font-bold text-slate-400 text-[13px] uppercase tracking-tight">{food.name_en || '—'}</td>
                          <td className="p-4 text-center">
                            <button
                              title={`Delete ${food.name}`}
                              onClick={() => deleteGlobalFood(food.code, food.name)}
                              className="text-slate-300 hover:text-red-600 transition-all transform hover:scale-110"
                            >
                              <Trash2 size={20} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards fallback for Food Master */}
            <div className="md:hidden space-y-4 mb-10">
               {globalFoods.map(food => (
                 <div key={food.code} className="bg-white p-6 rounded-[30px] border border-slate-100 shadow-xl relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl opacity-10 rounded-full ${food.item_category === 'MAIN' ? 'bg-blue-600' : 'bg-slate-800'}`}></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                       <span className="text-[10px] font-mono font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">{food.code}</span>
                       <button 
                         title={`Delete ${food.name}`}
                         onClick={() => deleteGlobalFood(food.code, food.name)} 
                         className="text-slate-300 active:text-red-500 p-1"
                       ><Trash2 size={18} /></button>
                    </div>
                    <h3 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter mb-1 relative z-10">{food.name}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-4 relative z-10">{food.name_en}</p>
                    <div className="pt-4 border-t border-slate-50 flex items-center justify-between relative z-10">
                       <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${food.item_category === 'MAIN' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white'}`}>
                          {food.item_category === 'MAIN' ? 'Main Food' : 'Ingredient'}
                       </span>
                    </div>
                 </div>
               ))}
               {!foodLoading && globalFoods.length === 0 && <p className="text-center p-10 font-black text-slate-400 uppercase tracking-widest italic">Global list is empty.</p>}
            </div>

          </div>
        )}

      </div>
    </Layout>
  );
}
