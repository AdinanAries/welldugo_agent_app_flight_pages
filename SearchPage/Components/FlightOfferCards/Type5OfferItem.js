import { Plane, Clock, Leaf } from 'lucide-react';

export default function Type5OfferItem(props) {

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
  const firstSegment = slice.segments[0];
  const lastSegment = slice.segments[slice.segments.length - 1];
  const stops = slice.segments.length - 1;

  const departTime = new Date(firstSegment.departing_at).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const arriveTime = new Date(lastSegment.arriving_at).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const departDate = new Date(firstSegment.departing_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const duration = formatDuration(slice.duration);

  return (
    <div style={{marginBottom: 5}} className="bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all p-6">
      <div className="flex items-start justify-between gap-6">
        {/* Airline Logo and Info */}
        <div className="gap-4 min-w-[120px]">
          <div>
            <img
              src={flight.owner.logo_symbol_url}
              alt={flight.owner.name}
              className="w-12 h-12 object-contain"
            />
          </div>
          <div>
            <div className="text-gray-900">
              {flight.owner.name} - {flight.owner.iata_code}</div>
            {/* Emissions */}
            <div className="flex items-center gap-1 mt-3 text-sm text-gray-500">
                <Leaf style={{ width: "16px", height: "16px" }} className="text-green-600" />
                <span className="text-sm">{flight.total_emissions_kg} kg CO₂</span>
              </div>
          </div>
        </div>

        {/* Flight Route */}
        <div className="flex-1">
          <div className="flex items-center gap-4">
            {/* Departure */}
            <div className="text-center">
              <div className="text-sm text-gray-900">{departTime}</div>
              <div className="text-sm text-gray-600">{slice.origin.iata_code}</div>
              <div className="text-sm text-gray-500">{departDate}</div>
            </div>

            {/* Flight Path */}
            <div className="flex-1 relative">
              <div className="flex items-center justify-center">
                <div className="flex-1 border-t-2 border-gray-300"></div>
                <Plane className="mx-2 text-gray-400 rotate-90" style={{ width: "16px", height: "16px" }} />
                <div className="flex-1 border-t-2 border-gray-300"></div>
              </div>
              <div className="text-center mt-1">
                <div className="text-sm text-gray-600">{duration}</div>
                <div className="text-sm text-gray-500">
                  {stops === 0 ? 'Nonstop' : `${stops} stop${stops > 1 ? 's' : ''}`}
                </div>
              </div>
            </div>

            {/* Arrival */}
            <div className="text-center">
              <div className="text-sm text-gray-900">{arriveTime}</div>
              <div className="text-sm text-gray-600">{slice.destination.iata_code}</div>
              <div className="text-sm text-gray-500">
                {new Date(lastSegment.arriving_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
            </div>
          </div>

          {/* Segment Details */}
          {stops > 0 && (
            <div className="mt-4 pt-4">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Clock style={{ width: "16px", height: "16px" }} />
                <span>
                  {slice.segments.map((seg, idx) => (
                    <span className="text-sm" key={seg.origin.iata_code + seg.destination.iata_code}>
                      {seg.origin.iata_code} → {seg.destination.iata_code}
                      {idx < slice.segments.length - 1 && ' • '}
                    </span>
                  ))}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Price and Book */}
        <div className="text-right">
          <div className="text-2xl text-gray-900 mb-1">
            ${parseFloat(flight.total_amount).toFixed(0)}
          </div>
          <div className="text-sm text-gray-500 mb-4">per person</div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm">
            Select
          </button>
        </div>
      </div>

      {/* Additional Details */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center text-sm">
        <div className="flex items-center gap-6 text-gray-600">
          {firstSegment.aircraft && (
            <div className="text-sm">
              <span className="text-gray-400 text-sm">Aircraft: </span>
              {firstSegment.aircraft.name}
            </div>
          )}
        </div>
        <span style={{color: "rgba(0,0,0,0.2)", margin: "0 20px"}}>|</span>
        <div className="text-sm">
          <span className="text-gray-400 text-sm">Flight: </span>
          {firstSegment.operating_carrier.iata_code} {firstSegment.operating_carrier_flight_number}
        </div>
        <span style={{color: "rgba(0,0,0,0.2)", margin: "0 20px"}}>|</span>
        <div className="text-sm flex items-center gap-4 text-gray-600">
          {flight.conditions.refund_before_departure?.allowed ? (
            <span className="text-sm text-green-600">✓ Refundable</span>
          ) : ""}
          {flight.conditions.change_before_departure?.allowed && (
            <span className="text-sm text-green-600">✓ Changeable</span>
          )}
        </div>
      </div>
    </div>
  );
}

function formatDuration(duration) {
  const match = duration.match(/PT(\d+)H(\d+)M/);
  if (match) {
    return `${match[1]}h ${match[2]}m`;
  }
  const hourMatch = duration.match(/PT(\d+)H/);
  if (hourMatch) {
    return `${hourMatch[1]}h`;
  }
  return duration;
}
