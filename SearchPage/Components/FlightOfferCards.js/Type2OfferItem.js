import React from 'react';
import { Plane, Clock, AlertCircle, Leaf } from 'lucide-react';

export default function Type2OfferItem(props) {
  
  const {
    bookingEngine,
    selectFlightOffer,
    flight,
    index,
    hasNewMessageFromParent,
    currentParentMessge,
    rawData,
    data_provider,
  } = props;

  const slice = flight.slices[0];
  const segment = slice.segments[0];
  
  const formatTime = (dateString) => {
    return dateString.split("T")[1].substring(0,5);
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toString().substring(4,11);
  };
  
  const parseDuration = (duration) => {
    const match = duration.match(/PT(\d+)H(\d+)M/);
    if (match) {
      return `${match[1]}h ${match[2]}m`;
    }
    return duration;
  };
  
  const stops = segment.stops?.length || 0;
  
  return (
    <div style={{
      border: '1px solid #e2e8f0',
      backgroundColor: 'white',
      overflow: 'hidden',
      transition: 'all 0.5s',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
      e.currentTarget.style.borderColor = '#93c5fd';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = '';
      e.currentTarget.style.borderColor = '#e2e8f0';
    }}>
      <div style={{ padding: '24px' }}>
        {/* Airline Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {segment.marketing_carrier.logo_symbol_url && (
              <img 
                src={segment.marketing_carrier.logo_symbol_url} 
                alt={segment.marketing_carrier.name}
                style={{ height: '32px', width: '32px', objectFit: 'contain' }}
              />
            )}
            <div>
              <p style={{ fontWeight: 600, color: '#1e293b' }}>{segment.marketing_carrier.name}</p>
              <p style={{ fontSize: '12px', color: '#64748b' }}>{segment.marketing_carrier.iata_code} {segment.marketing_carrier_flight_number}</p>
            </div>
          </div>
          
          {flight.fare_brand_name && (
            <div style={{ 
              fontSize: '12px', 
              backgroundColor: '#dbeafe', 
              color: '#1d4ed8',
              border: '1px solid #bfdbfe',
              padding: '4px 12px'
            }}>
              {slice.fare_brand_name}
            </div>
          )}
        </div>
        
        {/* Flight Route */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr auto 1fr', 
          gap: '16px', 
          alignItems: 'center', 
          marginBottom: '24px' 
        }}>
          {/* Departure */}
          <div>
            <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#0f172a' }}>{formatTime(segment.departing_at)}</p>
            <p style={{ fontSize: '14px', fontWeight: 500, color: '#334155', marginTop: '4px' }}>{segment.origin.iata_code}</p>
            <p style={{ fontSize: '12px', color: '#64748b' }}>{segment.origin.city_name}</p>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{formatDate(segment.departing_at)}</p>
          </div>
          
          {/* Duration & Stops */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            padding: '0 16px',
            flexGrow: 1,
            minWidth: '140px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', marginBottom: '8px' }}>
              <Clock style={{ height: '16px', width: '16px' }} />
              <span style={{ fontSize: '14px', fontWeight: 500 }}>{parseDuration(segment.duration)}</span>
            </div>
            
            <div style={{ position: 'relative', width: '100%' }}>
              <div style={{ height: '2px', backgroundColor: '#cbd5e1', width: '100%' }}></div>
              <Plane style={{ 
                height: '16px', 
                width: '16px', 
                color: '#94a3b8', 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%) rotate(90deg)' 
              }} />
            </div>
            
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
              {stops === 0 ? 'Direct' : `${stops} stop${stops > 1 ? 's' : ''}`}
            </p>
          </div>
          
          {/* Arrival */}
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#0f172a' }}>{formatTime(segment.arriving_at)}</p>
            <p style={{ fontSize: '14px', fontWeight: 500, color: '#334155', marginTop: '4px' }}>{segment.destination.iata_code}</p>
            <p style={{ fontSize: '12px', color: '#64748b' }}>{segment.destination.city_name}</p>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{formatDate(segment.arriving_at)}</p>
          </div>
        </div>
        
        {/* Additional Info */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
          {segment.aircraft && (
            <div style={{ 
              fontSize: '12px', 
              backgroundColor: '#f1f5f9', 
              color: '#475569',
              padding: '4px 12px'
            }}>
              {segment.aircraft.name}
            </div>
          )}
          
          {segment.passengers?.[0]?.cabin_class_marketing_name && (
            <div style={{ 
              fontSize: '12px', 
              backgroundColor: '#f1f5f9', 
              color: '#475569',
              padding: '4px 12px'
            }}>
              {segment.passengers[0].cabin_class_marketing_name}
            </div>
          )}
          
          {flight.total_emissions_kg && (
            <div style={{ 
              fontSize: '12px', 
              backgroundColor: '#f0fdf4', 
              color: '#15803d',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 12px'
            }}>
              <Leaf style={{ height: '12px', width: '12px' }} />
              {Math.round(flight.total_emissions_kg)} kg CO₂
            </div>
          )}
        </div>
        
        {/* Conditions */}
        {flight.conditions && (
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            fontSize: '12px', 
            color: '#475569', 
            marginBottom: '24px',
            paddingBottom: '24px',
            borderBottom: '1px solid #f1f5f9'
          }}>
            {flight.conditions.refund_before_departure?.allowed && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ color: '#16a34a' }}>✓</span>
                <span>Refundable</span>
              </div>
            )}
            {!flight.conditions.change_before_departure?.allowed && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle style={{ height: '12px', width: '12px', color: '#f59e0b' }} />
                <span>Non-changeable</span>
              </div>
            )}
          </div>
        )}
        
        {/* Price & CTA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '12px', color: '#64748b' }}>Total price</p>
            <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#0f172a' }}>
              {flight.total_currency} {parseFloat(flight.total_amount).toFixed(2)}
            </p>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              Includes {flight.tax_currency} {parseFloat(flight.tax_amount).toFixed(2)} taxes
            </p>
          </div>
          
          <button 
            onClick={() => selectFlightOffer(flight)}
            style={{
              background: 'linear-gradient(to right, #f97316, #ea580c)',
              color: 'white',
              padding: '24px 32px',
              fontSize: '16px',
              fontWeight: 600,
              boxShadow: '0 10px 15px -3px rgba(249, 115, 22, 0.3)',
              transition: 'all 0.3s',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to right, #ea580c, #c2410c)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(249, 115, 22, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to right, #f97316, #ea580c)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(249, 115, 22, 0.3)';
            }}
          >
            Select Flight
          </button>
        </div>
      </div>
    </div>
  );
}