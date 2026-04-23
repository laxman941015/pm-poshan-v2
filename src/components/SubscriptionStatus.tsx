import React from 'react';
import { useAuth } from '../contexts/AuthProvider';
import { ShieldCheck, Clock, AlertTriangle, CreditCard, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SubscriptionStatus: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const status = user.saas_payment_status?.toLowerCase();
  let plan = user.saas_plan_type;
  if (!plan) {
    plan = (status === 'paid' || status === 'PAID') ? 'Premium' : 'Free';
  }
  const expiryDate = user.saas_expiry_date ? new Date(user.saas_expiry_date) : null;
  
  const isPaid = status === 'paid' || status === 'trial';
  const isTrial = status === 'trial';
  const daysToExpiry = expiryDate 
    ? Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const isExpiringSoon = isPaid && daysToExpiry !== null && daysToExpiry > 0 && daysToExpiry <= 7;
  const isExpired = isPaid && daysToExpiry !== null && daysToExpiry <= 0;

  let badgeColor = "bg-slate-100 text-slate-500";
  let badgeText = "Inactive";
  let Icon = CreditCard;

  if (isPaid) {
    if (isExpired) {
      badgeColor = "bg-red-50 text-red-600 border-red-100";
      badgeText = isTrial ? "Trial Expired" : "Expired";
      Icon = AlertTriangle;
    } else if (isTrial) {
      badgeColor = "bg-purple-50 text-purple-600 border-purple-100";
      badgeText = `Free Trial: ${daysToExpiry} Days Left`;
      Icon = Clock;
    } else if (isExpiringSoon) {
      badgeColor = "bg-amber-50 text-amber-600 border-amber-100";
      badgeText = "Expiring Soon";
      Icon = Clock;
    } else {
      badgeColor = "bg-emerald-50 text-emerald-600 border-emerald-100";
      badgeText = "Active";
      Icon = ShieldCheck;
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl p-5 md:p-5 rounded-[32px] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 group hover:shadow-xl transition-all duration-500 w-full overflow-hidden">
      
      {/* Top Row on Mobile / Left Section on Desktop */}
      <div className="flex items-center justify-between w-full md:w-auto gap-4">
        {/* Icon & Plan Name */}
        <div className="flex items-center gap-3 min-w-max">
          <div className={`p-3 rounded-2xl shadow-lg transition-transform group-hover:scale-110 ${isPaid ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
            <Icon size={20} className="md:w-6 md:h-6" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tighter leading-none">
              {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
            </h3>
            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 leading-none">
              Subscription Status
            </p>
          </div>
        </div>

        {/* Status Badge (Mobile only - right aligned in top row) */}
        <div className="md:hidden">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${badgeColor}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            {badgeText}
          </div>
        </div>
      </div>

      {/* Status Badge (Desktop only) */}
      <div className="hidden md:flex items-center min-w-max">
        <div className="w-px h-10 bg-slate-100 mr-6"></div>
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest border ${badgeColor}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          {badgeText}
        </div>
      </div>

      {/* Valid Till (Left aligned on mobile, centered vertically on desktop) */}
      {expiryDate && (
        <>
          <div className="hidden md:block w-px h-10 bg-slate-100 mx-2"></div>
          <div className="flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center w-full md:w-auto min-w-max px-2 md:px-0 bg-slate-50/50 md:bg-transparent py-2 md:py-0 rounded-xl md:rounded-none">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Valid Till</span>
            <span className="text-[12px] md:text-[13px] font-black text-slate-800 uppercase tracking-tighter">
              {expiryDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </>
      )}

      {/* Button */}
      <div className="w-full md:w-auto md:flex-grow flex justify-end md:ml-auto mt-2 md:mt-0">
        <Link 
          to="/subscription" 
          className="w-full md:w-auto justify-center inline-flex items-center gap-2 px-5 py-3 md:py-2.5 bg-slate-900 text-white rounded-[16px] md:rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 transition-colors shadow-lg shadow-slate-200 active:scale-95"
        >
          {isPaid ? 'Renew / Manage' : 'Pay Subscription'} <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default SubscriptionStatus;
