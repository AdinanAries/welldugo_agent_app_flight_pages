import React from 'react';
import { SlidersHorizontal, Plane, Check, ArrowDownToLine, Zap } from 'lucide-react';

const Type4FilterCard = () => {

  const styles = {
    aside: {
      width: "100%",
      flexShrink: 0,
    },
    filterBox: {
      background: '#ffffff',
      borderRadius: '1.25rem',
      padding: '1.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      border: '1px solid #f1f5f9',
    },
    label: {
      fontSize: '0.75rem',
      fontWeight: 900,
      color: '#1e293b',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      marginBottom: '1rem',
      display: 'block',
    },
    checkboxLabel: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: '#475569',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      cursor: 'pointer',
      padding: '0.5rem 0',
    },
    promoCard: {
      background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)',
      borderRadius: '1.5rem',
      padding: '2rem',
      color: '#ffffff',
      position: 'relative',
      overflow: 'hidden',
      marginTop: '2rem',
      boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.2)',
    }
  };

  return (
    <aside style={styles.aside} className="hidden lg:block">
      <div style={styles.filterBox}>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <SlidersHorizontal style={{ width: "16px", height: "16px" }} className="text-indigo-600" />
            FILTER RESULTS
          </h3>
          <button className="text-[10px] font-black text-indigo-600 hover:underline uppercase tracking-tighter">Reset</button>
        </div>

        {/* Stops */}
        <div className="mb-10">
          <span style={styles.label}>Stops</span>
          <div className="space-y-1">
            <label style={styles.checkboxLabel} className="group transition-colors hover:text-indigo-600">
              <div className="w-5 h-5 rounded-md border-2 border-indigo-600 flex items-center justify-center bg-indigo-600 text-white shadow-sm">
                <Check style={{ width: "16px", height: "16px" }} strokeWidth={4} />
              </div>
              <span className="text-sm" >Direct only</span>
            </label>
            <label style={styles.checkboxLabel} className="group transition-colors hover:text-indigo-600">
              <div className="w-5 h-5 rounded-md border-2 border-slate-200 group-hover:border-indigo-600 transition-colors bg-white"></div>
              <span className="text-sm">1 stop</span>
            </label>
            <label style={styles.checkboxLabel} className="group transition-colors hover:text-indigo-600">
              <div className="w-5 h-5 rounded-md border-2 border-slate-200 group-hover:border-indigo-600 transition-colors bg-white"></div>
              <span className="text-sm">2+ stops</span>
            </label>
          </div>
        </div>

        {/* Airlines */}
        <div className="mb-10">
          <span style={styles.label}>Preferred Airlines</span>
          <div className="space-y-1">
            {['British Airways', 'Virgin Atlantic', 'Delta', 'Lufthansa'].map((airline) => (
              <label key={airline} style={styles.checkboxLabel} className="group transition-colors hover:text-indigo-600">
                <div className="w-5 h-5 rounded-md border-2 border-indigo-600 flex items-center justify-center bg-indigo-600 text-white shadow-sm">
                  <Check style={{ width: "16px", height: "16px" }} strokeWidth={4} />
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <span  className="text-sm">{airline}</span>
                  <span className="text-[10px] font-bold text-slate-300 text-sm">$274</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Departure Time */}
        <div className="mb-10">
          <span style={styles.label}>Departure Time</span>
          <div className="space-y-3">
             <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
               <span  className="text-sm">12:00 AM</span>
               <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden relative">
                 <div className="absolute left-[20%] right-[30%] h-full bg-indigo-600"></div>
                 <div className="absolute left-[20%] top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-indigo-600 rounded-full shadow-sm"></div>
                 <div className="absolute right-[30%] top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-indigo-600 rounded-full shadow-sm"></div>
               </div>
               <span className="text-sm">11:59 PM</span>
             </div>
          </div>
        </div>

        {/* Cabin Class */}
        <div>
          <span style={styles.label}>Cabin Class</span>
          <div className="flex flex-col gap-2">
            <button className="w-full py-2 px-3 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-black text-left border border-indigo-100">Economy</button>
            <button className="w-full py-2 px-3 bg-slate-50 text-slate-500 rounded-lg text-xs font-bold text-left hover:bg-slate-100 transition-colors">Premium Economy</button>
            <button className="w-full py-2 px-3 bg-slate-50 text-slate-500 rounded-lg text-xs font-bold text-left hover:bg-slate-100 transition-colors">Business</button>
          </div>
        </div>
      </div>

      {/* Promotion */}
      <div style={styles.promoCard}>
        <div className="relative z-10">
          <div className="w-10 h-10 bg-indigo-500/30 rounded-xl flex items-center justify-center mb-6 border border-white/10">
            <Zap style={{ width: "16px", height: "16px" }} className="text-indigo-200" fill="currentColor" />
          </div>
          <h4 className="text-xl font-black mb-2 leading-tight">Price Protection</h4>
          <p className="text-sm text-indigo-100 mb-6 font-medium leading-relaxed opacity-80">Book now and we'll refund the difference if the price drops within 24 hours.</p>
          <button className="w-full bg-white text-indigo-900 py-3 rounded-xl text-xs font-black hover:bg-indigo-50 transition-all shadow-xl shadow-indigo-950/20">
            Learn More
          </button>
        </div>
        <Plane style={{ width: "16px", height: "16px" }} className="absolute -right-20 -top-10 text-white/5 -rotate-12 pointer-events-none" />
        <ArrowDownToLine style={{ width: "16px", height: "16px" }} className="absolute -left-5 -bottom-5 text-white/5 pointer-events-none" />
      </div>
    </aside>
  );
};

export default Type4FilterCard;
