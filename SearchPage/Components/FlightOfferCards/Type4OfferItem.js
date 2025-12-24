import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plane, Luggage, Leaf, Info, ShieldCheck, XCircle, Clock, Zap } from 'lucide-react';

const Type4OfferItem = (props) => {

    const {
        bookingEngine,
        selectFlightOffer,
        flight: offer,
        index,
        hasNewMessageFromParent,
        currentParentMessge,
        rawData,
        data_provider,
    } = props;

    const formatDuration = (isoDuration) => {
    // Simple parser for ISO 8601 duration like "PT7H58M"
    const hoursMatch = isoDuration.match(/(\d+)H/);
    const minsMatch = isoDuration.match(/(\d+)M/);
    
    const hours = hoursMatch ? hoursMatch[1] : '0';
    const mins = minsMatch ? minsMatch[1] : '0';
    
    return `${hours}h ${mins}m`;
    };

    const formatTime = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
    };

    const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });
    };

    const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(parseFloat(amount));
    };

  const [isExpanded, setIsExpanded] = useState(false);
  const mainSlice = offer.slices[0];
  const firstSegment = mainSlice.segments[0];
  const lastSegment = mainSlice.segments[mainSlice.segments.length - 1];

  const styles = {
    card: {
      marginBottom: 5,
      backgroundColor: '#ffffff',
      borderRadius: '1.25rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      border: '1px solid #f1f5f9',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    airlineBox: {
      width: '180px',
    },
    logo: {
      width: '40px',
      height: '40px',
      objectFit: 'contain',
      backgroundColor: '#f8fafc',
      padding: '4px',
      borderRadius: '10px',
    },
    timeText: {
      fontSize: '1.25rem',
      fontWeight: 800,
      color: '#0f172a',
    },
    iataLabel: {
      fontSize: '0.75rem',
      fontWeight: 600,
      color: '#64748b',
      letterSpacing: '0.025em',
    },
    priceTag: {
      fontSize: '1.75rem',
      fontWeight: 800,
      color: '#4f46e5',
      letterSpacing: '-0.025em',
    },
    badge: {
      fontSize: '0.65rem',
      fontWeight: 800,
      padding: '0.35rem 0.75rem',
      borderRadius: '9999px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      textTransform: 'uppercase',
    },
    detailsSection: {
      backgroundColor: '#f8fafc',
      borderTop: '1px solid #f1f5f9',
      overflow: 'hidden',
    }
  };

  return (
    <div 
      style={styles.card} 
      className="group hover:translate-y-[-2px] hover:shadow-xl hover:shadow-indigo-100/40"
    >
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-8">
          {/* Carrier Info */}
          <div style={styles.airlineBox} className="shrink-0 flex items-center gap-4">
            <img src={offer.owner.logo_symbol_url} alt={offer.owner.name} style={styles.logo} />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-800 truncate">{offer.owner.name}</span>
              <span className="text-[10px] font-bold text-slate-400">Flight {firstSegment.marketing_carrier_flight_number}</span>
            </div>
          </div>

          {/* Journey Path */}
          <div className="flex-1 flex items-center justify-between gap-4">
            <div className="flex flex-col items-start min-w-[60px]">
              <span style={styles.timeText}>{formatTime(firstSegment.departing_at)}</span>
              <span style={styles.iataLabel}>{firstSegment.origin.iata_code}</span>
            </div>

            <div className="flex-1 max-w-[200px] flex flex-col items-center relative">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2 flex items-center gap-1">
                <Clock style={{ width: "16px", height: "16px" }} /> {formatDuration(mainSlice.duration)}
              </span>
              <div className="w-full h-px bg-slate-200 relative flex items-center justify-center">
                <div className="absolute left-0 w-2 h-2 rounded-full border-2 border-slate-200 bg-white -ml-1"></div>
                <div className="bg-white px-2 z-10">
                  <Plane style={{ width: "16px", height: "16px" }} className="text-indigo-400 rotate-90" />
                </div>
                <div className="absolute right-0 w-2 h-2 rounded-full border-2 border-slate-200 bg-white -mr-1"></div>
              </div>
              <span className="text-[10px] font-bold text-green-600 mt-2 flex items-center gap-1">
                <Zap style={{ width: "16px", height: "16px" }} fill="currentColor" /> DIRECT
              </span>
            </div>

            <div className="flex flex-col items-end min-w-[60px]">
              <span style={styles.timeText}>{formatTime(lastSegment.arriving_at)}</span>
              <span style={styles.iataLabel}>{lastSegment.destination.iata_code}</span>
            </div>
          </div>

          {/* Pricing & Call to Action */}
          <div className="md:pl-10 md:border-l border-slate-100 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-6 shrink-0">
            <div className="text-left md:text-right">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">Total Price</span>
              <span style={styles.priceTag}>{formatCurrency(offer.total_amount, offer.total_currency)}</span>
              <span className="block text-[10px] font-bold text-slate-400 mt-1 italic">Taxes & fees included</span>
            </div>
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-extrabold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] transition-all">
              Book Now
            </button>
          </div>
        </div>

        {/* Action Bar / Quick Info */}
        <div className="mt-8 pt-6 border-t border-slate-50 flex flex-wrap items-center gap-3">
          <span style={{...styles.badge, backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #dcfce7'}}>
            <Leaf style={{ width: "16px", height: "16px" }} /> {offer.total_emissions_kg}kg CO₂
          </span>
          <span style={{...styles.badge, backgroundColor: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0'}}>
            <Luggage style={{ width: "16px", height: "16px" }} /> {firstSegment.passengers[0].cabin_class_marketing_name}
          </span>
          {offer.conditions.refund_before_departure?.allowed && (
            <span style={{...styles.badge, backgroundColor: '#eef2ff', color: '#3730a3', border: '1px solid #e0e7ff'}}>
              <ShieldCheck style={{ width: "16px", height: "16px" }} /> Flexible Refund
            </span>
          )}
          
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-auto text-xs font-black text-slate-400 hover:text-indigo-600 flex items-center gap-2 transition-colors uppercase tracking-widest"
          >
            {isExpanded ? 'Hide info' : 'Flight info'}
            {isExpanded ? <ChevronUp style={{ width: "16px", height: "16px" }} /> : <ChevronDown style={{ width: "16px", height: "16px" }} />}
          </button>
        </div>
      </div>

      {/* Expanded Drawer */}
      {isExpanded && (
        <div style={styles.detailsSection}>
          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Plane style={{ width: "16px", height: "16px" }} />
                </div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Flight Segments</h4>
              </div>
              
              <div className="space-y-0 relative">
                <div className="absolute left-4 top-1 bottom-1 w-[1.5px] bg-indigo-100"></div>
                {mainSlice.segments.map((segment) => (
                  <div key={segment.id} className="relative pl-12 pb-2">
                    <div className="absolute left-[13px] top-1.5 w-[9px] h-[9px] rounded-full bg-white border-2 border-indigo-600 z-10 shadow-sm"></div>
                    <div className="mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-extrabold text-slate-900">{formatTime(segment.departing_at)}</span>
                        <span className="text-xs font-medium text-slate-500">{segment.origin.city_name} • {segment.origin.name} ({segment.origin.iata_code})</span>
                      </div>
                      <div className="my-6 p-4 bg-white rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-4">
                           <div className="w-8 h-8 bg-slate-50 rounded-lg p-1.5"><img src={segment.marketing_carrier.logo_symbol_url} alt="" /></div>
                           <div>
                             <p className="text-xs font-bold text-slate-800">{segment.marketing_carrier.name}</p>
                             <p className="text-[10px] font-medium text-slate-400">{segment.aircraft.name} • {segment.marketing_carrier_flight_number}</p>
                           </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">{formatDuration(segment.duration)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-extrabold text-slate-900">{formatTime(segment.arriving_at)}</span>
                        <span className="text-xs font-medium text-slate-500">{segment.destination.city_name} • {segment.destination.name} ({segment.destination.iata_code})</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-10">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <ShieldCheck style={{ width: "16px", height: "16px" }} />
                  </div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Policy & Amenities</h4>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-2xl border ${offer.conditions.refund_before_departure.allowed ? 'bg-green-50/40 border-green-100' : 'bg-red-50/40 border-red-100'}`}>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Refund Status</p>
                    <div className="flex items-center gap-2">
                      {offer.conditions.refund_before_departure.allowed ? <ShieldCheck style={{ width: "16px", height: "16px" }} className="text-green-600" /> : <XCircle size={16} className="text-red-500" />}
                      <p className="text-sm font-bold text-slate-800">
                        {offer.conditions.refund_before_departure.allowed ? 'Refundable offer' : 'Non-refundable'}
                      </p>
                    </div>
                    {offer.conditions.refund_before_departure.penalty_amount && (
                      <p className="text-[10px] font-bold text-slate-500 mt-1 ml-6">Fee: {formatCurrency(offer.conditions.refund_before_departure.penalty_amount, offer.conditions.refund_before_departure.penalty_currency || 'USD')}</p>
                    )}
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Baggage Inclusion</p>
                    <div className="flex items-center gap-4">
                      {firstSegment.passengers[0].baggages.map((bag, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Luggage style={{ width: "16px", height: "16px" }} className="text-indigo-600" />
                          <span className="text-xs font-bold text-slate-800">{bag.quantity}x {bag.type.split('_').join(' ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-slate-900 rounded-2xl text-white flex gap-4">
                <Info style={{ width: "16px", height: "16px" }} className="text-indigo-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white mb-1">Duffel Ticket Info</p>
                  <p className="text-[11px] font-medium text-slate-300 leading-relaxed">
                    This is a {mainSlice.fare_brand_name} fare. Seat selection and additional services may be available during the next step of the booking process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Type4OfferItem;
