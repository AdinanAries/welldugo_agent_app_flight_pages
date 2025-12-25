import { MapPin, Calendar, Users } from 'lucide-react';

const Type4TopBanner = (props) => {

    const {
        flights,
        filteredFlights
    } = props;

    const styles = {
      container: {
        backgroundColor: '#f8fafc',
        fontFamily: "'Inter', sans-serif",
        display: 'flex',
        flexDirection: 'column',
      },
      searchContainer: {
        background: '#ffffff',
        /*borderBottom: '1px solid #e2e8f0',*/
        padding: '2rem 0',
      },
      searchBar: {
        background: '#f1f5f9',
        padding: '0.5rem',
        borderRadius: '1.25rem',
        border: '1px solid #e2e8f0',
      },
      searchItem: {
        background: '#ffffff',
        padding: '0.75rem 1rem',
        borderRadius: '0.85rem',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      }
    };

    const formatDate = (isoDate) => {
    const date = new Date(isoDate);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });
    };

    return <div style={styles.searchContainer}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">New York to London</h1>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase rounded-full border border-indigo-100">Round trip</span>
                </div>
                <button className="text-sm font-bold text-indigo-600 bg-white border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                Modify Search
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3" style={styles.searchBar}>
                <div style={styles.searchItem} className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><MapPin style={{ width: "16px", height: "16px" }} /></div>
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Origin</p>
                    <p className="text-sm font-bold text-slate-900">NYC • JFK</p>
                </div>
                </div>
                <div style={styles.searchItem} className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><MapPin style={{ width: "16px", height: "16px" }} /></div>
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Destination</p>
                    <p className="text-sm font-bold text-slate-900">London • LHR</p>
                </div>
                </div>
                <div style={styles.searchItem} className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Calendar style={{ width: "16px", height: "16px" }} /></div>
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Dates</p>
                    <p className="text-sm font-bold text-slate-900">{formatDate(flights[0].slices[0].segments[0].departing_at)}</p>
                </div>
                </div>
                <div style={styles.searchItem} className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Users style={{ width: "16px", height: "16px" }} /></div>
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Travelers</p>
                    <p className="text-sm font-bold text-slate-900">1 Adult • Economy</p>
                </div>
                </div>
            </div>
            </div>
        </div>
    </div>
}

export default Type4TopBanner;