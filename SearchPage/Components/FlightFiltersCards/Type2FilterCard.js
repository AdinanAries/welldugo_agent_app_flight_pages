import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function Type2FilterCard({ filters, onFilterChange, airlines = [], onReset }) {

  const [priceRange, setPriceRange] = useState(filters?.priceRange || [0, 1000]);
  
  const handlePriceChange = (value) => {
    setPriceRange(value);
    onFilterChange({ ...filters, priceRange: value });
  };
  
  const handleStopsChange = (stops) => {
    const currentStops = filters?.stops || [];
    const newStops = currentStops.includes(stops)
      ? currentStops.filter(s => s !== stops)
      : [...currentStops, stops];
    onFilterChange({ ...filters, stops: newStops });
  };
  
  const handleAirlineChange = (airline) => {
    const currentAirlines = filters?.airlines || [];
    const newAirlines = currentAirlines.includes(airline)
      ? currentAirlines.filter(a => a !== airline)
      : [...currentAirlines, airline];
    onFilterChange({ ...filters, airlines: newAirlines });
  };
  
  return (
    <>
      <div style={{
        padding: '24px',
        border: '1px solid #e2e8f0',
        backgroundColor: 'white',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a' }}>Filters</h2>
          <button 
            variant="ghost" 
            size="sm" 
            onClick={onReset}
            style={{
              color: '#64748b',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#334155'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
          >
            <X style={{ height: '16px', width: '16px', marginRight: '4px' }} />
            Reset
          </button>
        </div>
        
        {/* Price Range */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{ fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '12px', display: 'block' }}>
            Price Range
          </label>
          <input
            value={priceRange}
            onValueChange={handlePriceChange}
            max={2000}
            min={0}
            step={50}
            style={{ marginBottom: '12px', width: "100%" }}
            type="range"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#475569' }}>
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
        
        {/* Stops */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{ fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '12px', display: 'block' }}>
            Stops
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { value: 0, label: 'Direct' },
              { value: 1, label: '1 Stop' },
              { value: 2, label: '2+ Stops' }
            ].map((stop) => (
              <div key={stop?.value} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  id={`stop-${stop?.value}`}
                  checked={filters?.stops?.includes(stop.value)}
                  onCheckedChange={() => handleStopsChange(stop.value)}
                  type="checkbox"
                />
                <label 
                  htmlFor={`stop-${stop?.value}`}
                  style={{ fontSize: '14px', color: '#475569', cursor: 'pointer' }}
                >
                  {stop?.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Airlines */}
        {airlines?.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '12px', display: 'block' }}>
              Airlines
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '256px', overflowY: 'auto' }}>
              {airlines.map((airline) => (
                <div key={airline} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                    id={`airline-${airline}`}
                    checked={filters?.airlines?.includes(airline)}
                    onCheckedChange={() => handleAirlineChange(airline)}
                    type="checkbox"
                  />
                  <label 
                    htmlFor={`airline-${airline}`}
                    style={{ fontSize: '14px', color: '#475569', cursor: 'pointer' }}
                  >
                    {airline}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Departure Time */}
        <div>
          <label style={{ fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '12px', display: 'block' }}>
            Departure Time
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[
              { value: 'morning', label: 'Morning', time: '6AM-12PM' },
              { value: 'afternoon', label: 'Afternoon', time: '12PM-6PM' },
              { value: 'evening', label: 'Evening', time: '6PM-12AM' },
              { value: 'night', label: 'Night', time: '12AM-6AM' }
            ].map((time) => (
              <button
                key={time.value}
                variant={filters?.departureTime === time.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => onFilterChange({ ...filters, departureTime: time.value })}
                style={{
                  backgroundColor: filters?.departureTime === time.value ? '#2563eb' : 'white',
                  color: filters?.departureTime === time.value ? 'white' : '#334155',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '6px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (filters?.departureTime !== time.value) {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  } else {
                    e.currentTarget.style.backgroundColor = '#1d4ed8';
                  }
                }}
                onMouseLeave={(e) => {
                  if (filters?.departureTime !== time.value) {
                    e.currentTarget.style.backgroundColor = 'white';
                  } else {
                    e.currentTarget.style.backgroundColor = '#2563eb';
                  }
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600 }}>{time?.label}</div>
                  <div style={{ fontSize: '10px', opacity: 0.7 }}>{time?.time}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}