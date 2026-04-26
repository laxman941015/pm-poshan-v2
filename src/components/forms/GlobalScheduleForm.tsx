import { useState, useEffect } from 'react';
import { api } from '../../lib/apiClient';
import {
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  Loader2,
  CalendarCheck,
  Globe
} from 'lucide-react';

const DAYS = [
  { id: 'Monday', name: 'Monday' },
  { id: 'Tuesday', name: 'Tuesday' },
  { id: 'Wednesday', name: 'Wednesday' },
  { id: 'Thursday', name: 'Thursday' },
  { id: 'Friday', name: 'Friday' },
  { id: 'Saturday', name: 'Saturday' }
];

interface FoodItem {
  id: string;
  name: string;
  item_category: 'MAIN' | 'INGREDIENT';
}

interface ScheduleRow {
  week_pattern: 'WEEK_1_3_5' | 'WEEK_2_4';
  day_name: string;
  is_active: boolean;
  main_food_codes: string[];
  menu_items: string[];
}

export default function GlobalScheduleForm() {
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [mainFoods, setMainFoods] = useState<FoodItem[]>([]);
  const [ingredients, setIngredients] = useState<FoodItem[]>([]);
  const [schedule, setSchedule] = useState<ScheduleRow[]>([]);

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    setFetchLoading(true);
    try {
      // 1. Fetch Global Foods
      const { data: foodData } = await api
        .from('global_food_master')
        .select('code, name, item_category')
        .order('name');

      const unified: FoodItem[] = (foodData || []).map((m: any) => ({
        id: m.code,
        name: m.name,
        item_category: m.item_category || 'MAIN'
      }));

      setMainFoods(unified.filter(f => f.item_category === 'MAIN'));
      setIngredients(unified.filter(f => f.item_category === 'INGREDIENT'));

      // 2. Fetch Global Schedule
      const { data: scheduleData } = await api.from('global_schedule').select('*');

      const initialSchedule: ScheduleRow[] = [];
      ['WEEK_1_3_5', 'WEEK_2_4'].forEach((type: any) => {
        DAYS.forEach((day) => {
          const existing = (scheduleData as any[])?.find(
            (s) => s.week_pattern === type && s.day_name === day.id
          );
          initialSchedule.push({
            week_pattern: type,
            day_name: day.id,
            is_active: existing ? existing.is_active : true,
            main_food_codes: existing ? (existing.main_food_codes || []) : [],
            menu_items: existing ? (existing.menu_items || []) : []
          });
        });
      });
      setSchedule(initialSchedule);
    } catch (err: any) {
      console.error('Data Init Error:', err.message);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleToggleDay = (type: 'WEEK_1_3_5' | 'WEEK_2_4', dayId: string) => {
    setSchedule(prev => prev.map(row =>
      (row.week_pattern === type && row.day_name === dayId)
        ? { ...row, is_active: !row.is_active }
        : row
    ));
  };

  const toggleMultiSelect = (type: 'WEEK_1_3_5' | 'WEEK_2_4', dayId: string, field: 'main_food_codes' | 'menu_items', code: string) => {
    setSchedule(prev => prev.map(row => {
      if (row.week_pattern === type && row.day_name === dayId) {
        const currentList = row[field] || [];
        const newList = currentList.includes(code)
          ? currentList.filter(c => c !== code)
          : [...currentList, code];
        return { ...row, [field]: newList };
      }
      return row;
    }));
  };

  const saveSchedule = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      // Delete existing and bulk insert
      // Or use a more robust upsert if the backend supports it for global_schedule
      await api.from('global_schedule').delete().neq('day_name', 'None'); // Hack to delete all
      const { error } = await api.from('global_schedule').insert(schedule);
      
      if (error) throw error;
      setMessage({ type: 'success', text: 'शासकीय साप्ताहिक वेळापत्रक (Global) यशस्वीरित्या जतन झाले!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch (err: any) {
      setMessage({ type: 'error', text: 'अयशस्वी: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <div className="flex flex-col items-center justify-center p-12 space-y-4"><RefreshCw className="animate-spin text-indigo-600" size={32} /><p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Loading Master Protocol...</p></div>;

  const renderScheduleBlock = (type: 'WEEK_1_3_5' | 'WEEK_2_4') => {
    const blockRows = schedule.filter(s => s.week_pattern === type);
    return (
      <div className="bg-white border-2 border-slate-100 rounded-[32px] overflow-hidden shadow-xl shadow-slate-200/50">
        <div className="bg-slate-900 p-6 text-white font-black uppercase text-[11px] tracking-[0.2em] flex items-center justify-between">
          <span>{type === 'WEEK_1_3_5' ? 'Protocol A (Week 1, 3, 5)' : 'Protocol B (Week 2, 4)'}</span>
          <Globe size={14} className="text-indigo-400" />
        </div>
        <div className="divide-y divide-slate-50">
          {blockRows.map(row => (
            <div key={row.day_name} className={`p-6 space-y-4 transition-all ${!row.is_active ? 'bg-slate-50/50 opacity-40 grayscale' : 'bg-white hover:bg-slate-50/30'}`}>
              <div className="flex items-center gap-4">
                <button onClick={() => handleToggleDay(type, row.day_name)} className="transition-transform active:scale-90">
                  {row.is_active ? <ToggleRight size={28} className="text-indigo-600" /> : <ToggleLeft size={28} className="text-slate-300" />}
                </button>
                <span className="text-[13px] font-black uppercase italic tracking-tighter text-slate-800">{row.day_name}</span>
              </div>
              <div className="space-y-4">
                <div>
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Primary Commodity (Global)</label>
                   <div className="flex flex-wrap gap-2">
                     {mainFoods.map(food => (
                       <button 
                        key={food.id} 
                        onClick={() => toggleMultiSelect(type, row.day_name, 'main_food_codes', food.id)} 
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight border-2 transition-all ${row.main_food_codes.includes(food.id) ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200 hover:text-indigo-600'}`}
                       >
                         {food.name}
                       </button>
                     ))}
                   </div>
                </div>
                <div>
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Ingredients Cluster</label>
                   <div className="flex flex-wrap gap-2">
                     {ingredients.map(item => (
                       <button 
                        key={item.id} 
                        onClick={() => toggleMultiSelect(type, row.day_name, 'menu_items', item.id)} 
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight border-2 transition-all ${row.menu_items.includes(item.id) ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300 hover:text-slate-900'}`}
                       >
                         {item.name}
                       </button>
                     ))}
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-5">
            <div className="bg-indigo-600 p-4 rounded-3xl text-white shadow-xl shadow-indigo-100">
                <CalendarCheck size={24} />
            </div>
            <div>
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter italic leading-none">Government Norms Protocol</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Master Weekly Schedule Configuration</p>
            </div>
        </div>
        <button 
            onClick={saveSchedule} 
            disabled={loading} 
            className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-indigo-200 flex items-center justify-center gap-3 active:scale-95 transition-all"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <CalendarCheck size={18} />}
          Authorize & Save Protocol
        </button>
      </div>

      {message.text && (
        <div className={`p-6 rounded-3xl font-black text-[11px] uppercase tracking-widest text-center border-2 animate-in slide-in-from-top duration-300 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {renderScheduleBlock('WEEK_1_3_5')}
        {renderScheduleBlock('WEEK_2_4')}
      </div>
      
      <div className="bg-indigo-50 border-2 border-indigo-100/50 p-8 rounded-[40px] flex items-start gap-4">
          <div className="bg-white p-2 rounded-full text-indigo-600"><Globe size={16} /></div>
          <div>
              <p className="text-[11px] font-black text-indigo-900 uppercase tracking-widest mb-1">Administrative Note</p>
              <p className="text-xs font-bold text-indigo-700 leading-relaxed">This configuration sets the default weekly lunch pattern for all schools. Teachers can import this protocol and further customize it to meet local requirements or emergency menu changes.</p>
          </div>
      </div>
    </div>
  );
}
