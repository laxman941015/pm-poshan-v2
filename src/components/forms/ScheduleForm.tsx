import { useState, useEffect } from 'react';
import { api } from '../../lib/apiClient';
import {
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  Loader2,
  CalendarCheck,
  Trash2
} from 'lucide-react';

const DAYS = [
  { id: 'Monday', name: 'Monday' },
  { id: 'Tuesday', name: 'Tuesday' },
  { id: 'Wednesday', name: 'Wednesday' },
  { id: 'Thursday', name: 'Thursday' },
  { id: 'Friday', name: 'Friday' },
  { id: 'Saturday', name: 'Saturday' },
  { id: 'Sunday', name: 'Sunday' }
];

interface FoodItem {
  id: string;
  name: string;
  item_category: 'MAIN' | 'INGREDIENT';
}

interface ScheduleRow {
  teacher_id: string;
  week_pattern: 'WEEK_1_3_5' | 'WEEK_2_4';
  day_name: string;
  is_active: boolean;
  main_food_codes: string[];
  menu_items: string[];
}

interface ScheduleFormProps {
  userId: string;
  onSuccess?: () => void;
}

export default function ScheduleForm({ userId, onSuccess }: ScheduleFormProps) {
  const [loading, setLoading] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [mainFoods, setMainFoods] = useState<FoodItem[]>([]);
  const [ingredients, setIngredients] = useState<FoodItem[]>([]);
  const [schedule, setSchedule] = useState<ScheduleRow[]>([]);

  useEffect(() => {
    if (userId) {
      initData();
    }
  }, [userId]);

  const initData = async () => {
    setFetchLoading(true);
    try {
      const { data: menuData } = await api
        .from('menu_master')
        .select('item_code, item_name, item_category')
        .eq('teacher_id', userId)
        .order('item_name');

      const unified: FoodItem[] = (menuData || []).map((m: any) => ({
        id: m.item_code,
        name: m.item_name,
        item_category: m.item_category || 'MAIN'
      }));

      setMainFoods(unified.filter(f => f.item_category === 'MAIN'));
      setIngredients(unified.filter(f => f.item_category === 'INGREDIENT'));

      const { data: scheduleData } = await api
        .from('menu_weekly_schedule')
        .select('*')
        .eq('teacher_id', userId);

      const initialSchedule: ScheduleRow[] = [];
      ['WEEK_1_3_5', 'WEEK_2_4'].forEach((type: any) => {
        DAYS.forEach((day, index) => {
          const existing = (scheduleData as any[])?.find(
            (s) => s.week_pattern === type && s.day_name === day.id
          );
          initialSchedule.push({
            teacher_id: userId,
            week_pattern: type,
            day_name: day.id,
            is_active: existing ? existing.is_active : (index < 5),
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

  const handleClearAll = async () => {
    const msg = "इशारा (WARNING): तुम्ही खात्री बाळगता? यामुळे तुमचे पूर्ण साप्ताहिक वेळापत्रक हटवले जाईल. याचा परिणाम तुमच्या दैनंदिन आहार नोंदींवर होऊ शकतो. तुम्ही पुढे जाऊ इच्छिता?";
    if (!window.confirm(msg)) return;
    setLoading(true);
    try {
      const response = await (api as any).delete('/clear-weekly-schedule');
      if (response && response.success) {
        setMessage({ type: 'success', text: response.message });
        initData();
      } else {
        throw new Error(response?.detail || 'Clear failed');
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: 'हटवणे अयशस्वी: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  const importGlobalSchedule = async () => {
    if (!window.confirm('शासकीय वेळापत्रक आयात करायचे आहे का? (तुमचे जुने वेळापत्रक पुसले जाऊ शकते)')) return;
    setLoading(true);
    try {
      const response = await api.post('/import-global-schedule', {});
      if (response && response.success) {
        setMessage({ type: 'success', text: response.message });
        initData();
      } else {
        throw new Error(response?.detail || 'Import failed');
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: 'आयात करणे अयशस्वी: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  const saveSchedule = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const { error: upsertError } = await (api as any)
        .from('menu_weekly_schedule')
        .upsert(schedule, { onConflict: 'teacher_id,week_pattern,day_name' });
      if (upsertError) throw upsertError;
      setMessage({ type: 'success', text: 'साप्ताहिक वेळापत्रक जतन झाले!' });
      if (onSuccess) onSuccess();
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch (err: any) {
      setMessage({ type: 'error', text: 'अयशस्वी: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <div className="flex flex-col items-center justify-center p-12 space-y-4"><RefreshCw className="animate-spin text-[#474379]" size={32} /><p className="text-slate-500 font-bold text-sm">लोड होत आहे...</p></div>;

  const renderScheduleBlock = (type: 'WEEK_1_3_5' | 'WEEK_2_4') => {
    const blockRows = schedule.filter(s => s.week_pattern === type);
    return (
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm h-full">
        <div className="bg-[#474379] p-4 text-white font-black uppercase text-[13px] tracking-widest">
          {type === 'WEEK_1_3_5' ? 'वेळापत्रक अ (१, ३, ५ आठवडा)' : 'वेळापत्रक ब (२, ४ आठवडा)'}
        </div>
        <div className="divide-y divide-slate-100">
          {blockRows.map(row => (
            <div key={row.day_name} className={`p-4 space-y-3 ${!row.is_active ? 'bg-slate-50 opacity-60' : 'bg-white'}`}>
              <div className="flex items-center gap-3">
                <button onClick={() => handleToggleDay(type, row.day_name)}>
                  {row.is_active ? <ToggleRight size={24} className="text-green-600" /> : <ToggleLeft size={24} className="text-slate-300" />}
                </button>
                <span className="text-xs font-black uppercase text-slate-700">{row.day_name}</span>
              </div>
              <div className="space-y-3">
                <div>
                   <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">मुख्य अन्न</label>
                   <div className="flex flex-wrap gap-1.5">
                     {mainFoods.map(food => (
                       <button key={food.id} onClick={() => toggleMultiSelect(type, row.day_name, 'main_food_codes', food.id)} className={`px-2 py-1 rounded text-[10px] font-bold border transition-all ${row.main_food_codes.includes(food.id) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}>
                         {food.name}
                       </button>
                     ))}
                   </div>
                </div>
                <div>
                   <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">साहित्य</label>
                   <div className="flex flex-wrap gap-1.5">
                     {ingredients.map(item => (
                       <button key={item.id} onClick={() => toggleMultiSelect(type, row.day_name, 'menu_items', item.id)} className={`px-2 py-1 rounded text-[10px] font-bold border transition-all ${row.menu_items.includes(item.id) ? 'bg-indigo-900 border-indigo-900 text-white' : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'}`}>
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
    <div className="space-y-6">
      {message.text && (
        <div className={`p-4 font-bold text-xs uppercase text-center ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-4">
        <button 
          onClick={importGlobalSchedule} 
          disabled={loading} 
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <CalendarCheck size={16} />}
          Import Standard Schedule
        </button>

        <button 
          onClick={saveSchedule} 
          disabled={loading} 
          className="w-full sm:w-auto bg-[#3c8dbc] hover:bg-[#2e7da6] text-white px-8 py-3 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <CalendarCheck size={16} />}
          वेळापत्रक जतन करा
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pb-10">
        {renderScheduleBlock('WEEK_1_3_5')}
        {renderScheduleBlock('WEEK_2_4')}
      </div>
      {/* ⚠️ DANGER ZONE */}
      <div className="mt-12 mb-10 p-6 bg-red-50 border-2 border-red-100 rounded-2xl">
        <h4 className="text-red-700 font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
          <Trash2 size={16} /> Danger Zone (धोकादायक क्षेत्र)
        </h4>
        <p className="text-[12px] font-bold text-red-600 mb-4 leading-relaxed">
          इशारा: ही क्रिया केल्यास तुमचे पूर्ण साप्ताहिक वेळापत्रक हटवले जाईल. 
          याचा परिणाम तुमच्या दैनंदिन आहार नोंदींवर आणि रिपोर्टिंगवर होऊ शकतो. 
          कृपया खात्री असल्यासच पुढे जा.
        </p>
        
        <label className="flex items-start gap-3 cursor-pointer group mb-4">
          <input 
            type="checkbox" 
            checked={confirmClear}
            onChange={(e) => setConfirmClear(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-red-300 text-red-600 focus:ring-red-500"
          />
          <span className="text-[11px] font-black text-red-900 uppercase tracking-tight group-hover:text-red-700 transition-colors">
            मला समजले आहे की ही क्रिया कायमस्वरूपी आहे आणि यामुळे माझे वेळापत्रक हटवले जाईल.
          </span>
        </label>

        <button
          onClick={handleClearAll}
          disabled={loading || !confirmClear}
          className="flex items-center gap-2 px-6 py-3 font-black text-xs uppercase tracking-widest bg-red-600 text-white hover:bg-red-700 transition-all shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Trash2 size={16} /> 🗑️ माझे वेळापत्रक हटवा (CLEAR MY SCHEDULE)
        </button>
      </div>
    </div>
  );
}
