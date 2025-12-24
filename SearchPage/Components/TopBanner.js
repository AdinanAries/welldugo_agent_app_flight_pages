import { Plane } from 'lucide-react';

const TopBanner = (props) => {

    const {
        flights,
        filteredFlights,
    } = props;

    return <div style={{ 
            background: 'linear-gradient(to right, #0f172a, #1e3a8a, #0f172a)', 
            color: 'white', 
            padding: '48px 24px',
            marginTop: 10,
            marginBottom: 10,
            /*boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'*/
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
            {(filteredFlights?.length || flights.length)} {
                (filteredFlights?.length) ?
                    ((filteredFlights.length === 1) ? 'flight' : 'flights') :
                    ((flights.length === 1) ? 'flight' : 'flights')
            } found
            </p>
        </div>
    </div>
}

export default TopBanner;