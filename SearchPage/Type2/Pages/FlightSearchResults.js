import React, { useState, useMemo } from 'react';
import { ArrowUpDown, Search, Plane } from 'lucide-react';
import FlightCard from '../Components/flights/FlightCard';
import FlightFilters from '../Components/flights/FlightFilters';
import Ads from '../../Components/Ads';

export default function FlightSearchResults() {
  // Sample flight data - in production this would come from props or API
  const [flights] = useState([
    {
      "id": "off_001",
      "total_emissions_kg": "643",
      "tax_currency": "USD",
      "base_currency": "USD",
      "base_amount": "232.69",
      "tax_amount": "41.89",
      "total_currency": "USD",
      "total_amount": "274.58",
      "created_at": "2024-01-21T04:05:52.765817Z",
      "slices": [{
        "fare_brand_name": "Basic",
        "segments": [{
          "origin_terminal": "2",
          "destination_terminal": "1",
          "aircraft": {
            "iata_code": "789",
            "name": "Boeing 787-9",
            "id": "arc_001"
          },
          "departing_at": "2024-01-22T16:15:00",
          "arriving_at": "2024-01-23T05:13:00",
          "stops": [],
          "marketing_carrier": {
            "logo_symbol_url": "https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/BA.svg",
            "iata_code": "BA",
            "name": "British Airways",
            "id": "arl_001"
          },
          "marketing_carrier_flight_number": "0109",
          "duration": "PT7H58M",
          "destination": {
            "iata_code": "LHR",
            "city_name": "London",
            "name": "Heathrow Airport"
          },
          "origin": {
            "iata_code": "JFK",
            "city_name": "New York",
            "name": "John F. Kennedy International Airport"
          },
          "passengers": [{
            "cabin_class_marketing_name": "Economy",
            "cabin_class": "economy"
          }]
        }]
      }],
      "conditions": {
        "refund_before_departure": {
          "allowed": true
        },
        "change_before_departure": {
          "allowed": false
        }
      }
    },
    {
      "id": "off_002",
      "total_emissions_kg": "580",
      "tax_currency": "USD",
      "base_currency": "USD",
      "base_amount": "189.99",
      "tax_amount": "38.50",
      "total_currency": "USD",
      "total_amount": "228.49",
      "created_at": "2024-01-21T04:05:52.765817Z",
      "slices": [{
        "fare_brand_name": "Economy",
        "segments": [{
          "origin_terminal": "1",
          "destination_terminal": "5",
          "aircraft": {
            "iata_code": "777",
            "name": "Boeing 777-300ER",
            "id": "arc_002"
          },
          "departing_at": "2024-01-22T20:30:00",
          "arriving_at": "2024-01-23T09:45:00",
          "stops": [],
          "marketing_carrier": {
            "logo_symbol_url": "https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/AA.svg",
            "iata_code": "AA",
            "name": "American Airlines",
            "id": "arl_002"
          },
          "marketing_carrier_flight_number": "0156",
          "duration": "PT7H15M",
          "destination": {
            "iata_code": "LHR",
            "city_name": "London",
            "name": "Heathrow Airport"
          },
          "origin": {
            "iata_code": "JFK",
            "city_name": "New York",
            "name": "John F. Kennedy International Airport"
          },
          "passengers": [{
            "cabin_class_marketing_name": "Economy",
            "cabin_class": "economy"
          }]
        }]
      }],
      "conditions": {
        "refund_before_departure": {
          "allowed": false
        },
        "change_before_departure": {
          "allowed": true
        }
      }
    },
    {
      "id": "off_003",
      "total_emissions_kg": "720",
      "tax_currency": "USD",
      "base_currency": "USD",
      "base_amount": "156.00",
      "tax_amount": "35.20",
      "total_currency": "USD",
      "total_amount": "191.20",
      "created_at": "2024-01-21T04:05:52.765817Z",
      "slices": [{
        "fare_brand_name": "Basic Economy",
        "segments": [{
          "origin_terminal": "4",
          "destination_terminal": "2",
          "aircraft": {
            "iata_code": "321",
            "name": "Airbus A321",
            "id": "arc_003"
          },
          "departing_at": "2024-01-22T10:20:00",
          "arriving_at": "2024-01-22T17:10:00",
          "stops": [{id: "stop_1"}],
          "marketing_carrier": {
            "logo_symbol_url": "https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/DL.svg",
            "iata_code": "DL",
            "name": "Delta Air Lines",
            "id": "arl_003"
          },
          "marketing_carrier_flight_number": "0234",
          "duration": "PT9H50M",
          "destination": {
            "iata_code": "LHR",
            "city_name": "London",
            "name": "Heathrow Airport"
          },
          "origin": {
            "iata_code": "JFK",
            "city_name": "New York",
            "name": "John F. Kennedy International Airport"
          },
          "passengers": [{
            "cabin_class_marketing_name": "Economy",
            "cabin_class": "economy"
          }]
        }]
      }],
      "conditions": {
        "refund_before_departure": {
          "allowed": false
        },
        "change_before_departure": {
          "allowed": false
        }
      }
    }
  ]);

  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    stops: [],
    airlines: [],
    departureTime: null
  });
  
  const [sortBy, setSortBy] = useState('price');

  // Extract unique airlines
  const airlines = useMemo(() => {
    const airlineSet = new Set();
    flights.forEach(flight => {
      flight.slices.forEach(slice => {
        slice.segments.forEach(segment => {
          airlineSet.add(segment.marketing_carrier.name);
        });
      });
    });
    return Array.from(airlineSet);
  }, [flights]);

  // Filter flights
  const filteredFlights = useMemo(() => {
    return flights.filter(flight => {
      const price = parseFloat(flight.total_amount);
      const stops = flight.slices[0].segments[0].stops?.length || 0;
      const airline = flight.slices[0].segments[0].marketing_carrier.name;
      
      // Price filter
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
        return false;
      }
      
      // Stops filter
      if (filters.stops.length > 0) {
        const stopsMatch = filters.stops.some(s => {
          if (s === 2) return stops >= 2;
          return stops === s;
        });
        if (!stopsMatch) return false;
      }
      
      // Airline filter
      if (filters.airlines.length > 0 && !filters.airlines.includes(airline)) {
        return false;
      }
      
      // Departure time filter
      if (filters.departureTime) {
        const departureHour = new Date(flight.slices[0].segments[0].departing_at).getHours();
        const timeRanges = {
          morning: [6, 12],
          afternoon: [12, 18],
          evening: [18, 24],
          night: [0, 6]
        };
        const [start, end] = timeRanges[filters.departureTime];
        if (departureHour < start || departureHour >= end) {
          return false;
        }
      }
      
      return true;
    });
  }, [flights, filters]);

  // Sort flights
  const sortedFlights = useMemo(() => {
    const sorted = [...filteredFlights];
    
    switch (sortBy) {
      case 'price':
        sorted.sort((a, b) => parseFloat(a.total_amount) - parseFloat(b.total_amount));
        break;
      case 'duration':
        sorted.sort((a, b) => {
          const getDuration = (flight) => {
            const duration = flight.slices[0].segments[0].duration;
            const match = duration.match(/PT(\d+)H(\d+)M/);
            return match ? parseInt(match[1]) * 60 + parseInt(match[2]) : 0;
          };
          return getDuration(a) - getDuration(b);
        });
        break;
      case 'departure':
        sorted.sort((a, b) => 
          new Date(a.slices[0].segments[0].departing_at) - 
          new Date(b.slices[0].segments[0].departing_at)
        );
        break;
      default:
        break;
    }
    
    return sorted;
  }, [filteredFlights, sortBy]);

  const handleFlightSelect = (flight) => {
    console.log('Selected flight:', flight);
    // Handle flight selection - navigate to booking page, etc.
  };

  const resetFilters = () => {
    setFilters({
      priceRange: [0, 1000],
      stops: [],
      airlines: [],
      departureTime: null
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #f8fafc, #dbeafe, #f8fafc)' }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(to right, #0f172a, #1e3a8a, #0f172a)', 
        color: 'white', 
        padding: '48px 24px',
        marginTop: 10,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.1)', 
              backdropFilter: 'blur(8px)',
              padding: '12px', 
              borderRadius: '12px' 
            }}>
              <Plane style={{ height: '32px', width: '32px' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '36px', fontWeight: 'bold', letterSpacing: '-0.025em' }}>
                Flight Search Results
              </h1>
              <p style={{ color: '#bfdbfe', marginTop: '4px' }}>New York (JFK) → London (LHR)</p>
            </div>
          </div>
          <p style={{ color: '#cbd5e1', marginTop: '8px' }}>
            {sortedFlights.length} {sortedFlights.length === 1 ? 'flight' : 'flights'} found
          </p>
        </div>
      </div>

      <div className="search_list_main_flex_container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 0' }}>
        <div id="search_list_main__settings_section" className="search_list_main__settings_section" style={{backgroundColor: "white"}}>
          <div id="mobile_sort_and_filter_title_and_sort">
            <div style={{height: 50, display: "flex", flexDirection: "column", justifyContent: "center"}}>
              <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                  <p style={{color: "rgba(0,0,0,0.5)", fontFamily: "'Prompt', Sans-serif", display: "flex", flexDirection: "column", justifyContent: "center", marginTop: 15}}>
                      Filters
                  </p>
                  <p onClick={()=>document.getElementById('search_list_main__settings_section').style.display='none'} id="close_filter_and_sort_btn" style={{color: "rgba(255,0,0,0.6)", fontSize: 33, marginRight: 5}}>
                      &times;
                  </p>
              </div>
            </div>
            <div style={{marginBottom: 35}}>
                
            </div>
          </div>
          <div>
            {/* Sort Bar */}
            <div style={{ 
              marginBottom: '24px', 
              display: 'flex', 
              flexDirection: 'column',
              gap: '16px',
              alignItems: 'flex-start',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ArrowUpDown style={{ height: '20px', width: '20px', color: '#64748b' }} />
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#334155' }}>Sort by:</span>
                <select value={sortBy} onValueChange={setSortBy} style={{ 
                    width: '160px', 
                    border: '1px solid #cbd5e1', 
                    backgroundColor: 'white' 
                  }}>
                    <option value="price">Lowest Price</option>
                    <option value="duration">Shortest Duration</option>
                    <option value="departure">Earliest Departure</option>
                </select>
              </div>

              <div style={{ fontSize: '14px', color: '#475569' }}>
                Showing <span style={{ fontWeight: 600, color: '#0f172a' }}>{sortedFlights.length}</span> of{' '}
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{flights.length}</span> flights
              </div>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'minmax(0, 1fr)',
              gap: '24px'
            }}>
              {/* Filters Sidebar */}
              <div style={{ display: 'none' }}>
                {/* Hidden on mobile - would show on desktop with media queries */}
              </div>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 280px))',
                gap: '24px'
              }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <FlightFilters 
                    filters={filters}
                    onFilterChange={setFilters}
                    airlines={airlines}
                    onReset={resetFilters}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Flight Results */}
        <div className="search_list_main_tickets_section type-2">
          <div style={{ gridColumn: '1 / -1' }}>
            {sortedFlights.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '64px 0' }}>
                <div style={{ 
                  backgroundColor: '#f1f5f9', 
                  borderRadius: '50%', 
                  width: '96px', 
                  height: '96px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 16px' 
                }}>
                  <Search style={{ height: '48px', width: '48px', color: '#94a3b8' }} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>
                  No flights found
                </h3>
                <p style={{ color: '#475569', marginBottom: '24px' }}>
                  Try adjusting your filters to see more results
                </p>
                <button 
                  onClick={resetFilters}
                  style={{
                    border: '1px solid #cbd5e1',
                    backgroundColor: 'white',
                    color: '#334155',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {sortedFlights.map((flight) => (
                  <FlightCard 
                    key={flight.id} 
                    flight={flight}
                    onSelect={handleFlightSelect}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="search_list_main_ads_section">
            <Ads />
        </div>
      </div>
    </div>
  );
}