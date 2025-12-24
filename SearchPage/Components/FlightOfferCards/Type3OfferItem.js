import React from 'react';
import { Plane, MapPin, Clock, Briefcase, RotateCcw } from 'lucide-react';

const Type3OfferItem = (props) => {
    
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

    // segment.aircraft?.name - tofix;

    const slice = flight.slices[0];
    const segment = slice.segments[0];
    const stops = segment.stops?.length || 0;

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    const parseDuration = (duration) => {
        const match = duration.match(/PT(\d+)H(\d+)M/);
        if (match) return `${match[1]}h ${match[2]}m`;
        return duration;
    };

    const handleSelect = (flight) => {
        selectFlightOffer(flight);
    };

    return <div key={flight.id} style={{ marginBottom: 5, padding: "1.5rem", boxShadow: "0 4px 6px rgba(0,0,0,0.07)", transition: "all 0.3s ease", cursor: "pointer", border: "1px solid #e2e8f0" }} onMouseEnter={(e) => { const card = e.currentTarget; card.style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)"; card.style.transform = "translateY(-4px)"; }} onMouseLeave={(e) => { const card = e.currentTarget; card.style.boxShadow = "0 4px 6px rgba(0,0,0,0.07)"; card.style.transform = "translateY(0)"; }}>
        {/* Airline Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            {segment.marketing_carrier.logo_symbol_url && <img src={segment.marketing_carrier.logo_symbol_url} alt={segment.marketing_carrier?.name} style={{ height: "40px", objectFit: "contain" }} onError={(e) => { e.currentTarget.style.display = "none"; }} />}
            <div>
            <div style={{ fontWeight: "600", color: "#1a202c", fontSize: "1rem" }}>{segment.marketing_carrier?.name}</div>
            <div style={{ fontSize: "0.875rem", color: "#718096" }}>{segment.marketing_carrier_flight_number} • {segment.aircraft?.name}</div>
            </div>
        </div>

        {/* Flight Route */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <div style={{ flex: 1 }}>
            <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#0066cc" }}>{formatTime(segment.departing_at)}</div>
            <div style={{ fontSize: "0.875rem", color: "#718096", marginTop: "0.25rem" }}>{segment.origin.iata_code} • {segment.origin.city_name}</div>
            </div>

            <div style={{ textAlign: "center", flex: 0.6 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", color: "#718096", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                <Clock style={{ width: "16px", height: "16px" }} /> {parseDuration(segment.duration)}
            </div>
            <div style={{ width: "100%", height: "2px", backgroundColor: "#cbd5e0", position: "relative" }}>
                <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", backgroundColor: "white", padding: "0 0.5rem", color: "#718096", fontSize: "0.75rem", fontWeight: "600" }}>{stops === 0 ? "Direct" : `${stops} stop${stops > 1 ? "s" : ""}`}</div>
            </div>
            </div>

            <div style={{ flex: 1, textAlign: "right" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#0066cc" }}>{formatTime(segment.arriving_at)}</div>
            <div style={{ fontSize: "0.875rem", color: "#718096", marginTop: "0.25rem" }}>{segment.destination.iata_code} • {segment.destination.city_name}</div>
            </div>
        </div>

        {/* Cabin & Baggage */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <div style={{ padding: "0.5rem 1rem", backgroundColor: "#edf2f7", borderRadius: "0.375rem", fontSize: "0.875rem", color: "#2d3748" }}>{segment.passengers?.[0]?.cabin_class_marketing_name === "premium_economy" ? "Premium Economy" : segment.passengers?.[0]?.cabin_class_marketing_name}</div>
            <div style={{ padding: "0.5rem 1rem", backgroundColor: "#edf2f7", borderRadius: "0.375rem", fontSize: "0.875rem", color: "#2d3748", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Briefcase style={{ width: "16px", height: "16px" }} /> {2} checked, {2} carry-on
            </div>
        </div>

        {/* Policies */}
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <div style={{ padding: "0.375rem 0.75rem", borderRadius: "0.375rem", fontSize: "0.75rem", fontWeight: "600", backgroundColor: flight.conditions.change_before_departure?.allowed ? "#c6f6d5" : "#fed7d7", color: flight.conditions.change_before_departure?.allowed ? "#22543d" : "#742a2a" }}>
            {flight.conditions.change_before_departure?.allowed ? "✓ Changes Allowed" : "✗ No Changes"}
            </div>
            <div style={{ padding: "0.375rem 0.75rem", borderRadius: "0.375rem", fontSize: "0.75rem", fontWeight: "600", backgroundColor: flight.conditions.refund_before_departure?.allowed ? "#c6f6d5" : "#fed7d7", color: flight.conditions.refund_before_departure?.allowed ? "#22543d" : "#742a2a" }}>
            {flight.conditions.refund_before_departure?.allowed ? "✓ Refundable" : `✗ ${flight.refundPenalty || "Non-refundable"}`}
            </div>
        </div>

        {/* Footer: Price and Fare Brand */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingTop: "1rem", borderTop: "1px solid #e2e8f0" }}>
            <div>
            <div style={{ fontSize: "0.875rem", color: "#718096", marginBottom: "0.25rem" }}>{slice.fare_brand_name} • Expires {formatDate(flight.expires_at)}</div>
            <div style={{ fontSize: "0.75rem", color: "#a0aec0" }}>Base: ${flight.base_amount} + Tax: ${flight.tax_amount}</div>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "#0066cc" }}>${flight.total_amount}</div>
            </div>
        </div>

        {/* Select Button */}
        <button onClick={() => handleSelect(flight)} style={{ width: "100%", marginTop: "1rem", padding: "0.75rem", backgroundColor: "#0066cc", color: "white", border: "none", borderRadius: "0.375rem", fontSize: "1rem", fontWeight: "600", cursor: "pointer" }}>
            Select & Book
        </button>
    </div>
}

export default Type3OfferItem;