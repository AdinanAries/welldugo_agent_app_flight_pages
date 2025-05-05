import { useState } from "react";
import { 
    convert24HTimeToAMPM,
    get_short_date_MMMDD, 
    get_duration_d_h_m, 
    get_short_date_DAYMMMDD, 
    calculateTotalTime, ellipsify,
    get_currency_symbol 
} from "../../../helpers/general";
import SelectedTicketItinSegments from "../../SearchPage/Components/SelectedTicketItinSegments";

const CheckoutInfoSliceCard = (props) => {
    const { slice, index, } = props;
    
    const OPERATED_BY = slice.segments[0].operating_carrier?.name;
    const OPERATOR_LOGO = slice.segments[0].operating_carrier?.logo_symbol_url;
    const SEGMENT_LENGTH = slice.segments.length;
    const TRIP_START = convert24HTimeToAMPM(slice.segments[0].departing_at.split("T")[1]);
    const TRIP_ENDS = convert24HTimeToAMPM(slice.segments[(SEGMENT_LENGTH - 1)].arriving_at.split("T")[1]);
    const STOPS_COUNT = (SEGMENT_LENGTH-1);
    const ORIGIN_CITY = slice.segments[0].origin?.city_name;
    const DESTINATION_CITY = slice.segments[(SEGMENT_LENGTH - 1)].destination?.city_name;
    const CABIN_CLASS = slice.segments[0].passengers[0].cabin?.marketing_name;
    const DEPARTURE_DATE = get_short_date_DAYMMMDD(slice?.segments[0].departing_at.replace("T", " "));
    const ARRIVAL_DATE = get_short_date_DAYMMMDD(slice?.segments[(SEGMENT_LENGTH-1)].arriving_at.replace("T", " "));
    //const CURRENCY_SYMBOL = get_currency_symbol(total_currency);
    const {d: DAYS, h: HOURS, m: MINUTES} = get_duration_d_h_m(slice?.duration);

    let STOPSMARKUP = [];
    if(SEGMENT_LENGTH>1){
        for(let sg=0; sg<SEGMENT_LENGTH-1; sg++){
            let flight_stop_arrival = slice.segments[sg].arriving_at;
            let flight_stop_departure = slice.segments[sg+1].departing_at;
            const {d: ST_DAYS, h: ST_HOURS, m: ST_MINUTES} = calculateTotalTime(flight_stop_arrival.replace("T", " "), flight_stop_departure.replace("T", " "));
            let STOP_DETAILS = (`${ST_DAYS} ${ST_HOURS} ${ST_MINUTES} in ${ellipsify(slice.segments[sg].destination?.city_name)} (${slice.segments[sg].destination?.iata_code})`);
            STOPSMARKUP.push(<p className="tooltip_parent" style={{color: "rgba(0,0,0,0.8)", fontSize: 12}}>
                    {STOP_DETAILS}
                    <div className="tooltip">{`${slice.segments[sg].destination?.city_name} - ${slice.segments[sg].destination?.name}`}</div>
                </p>);
        }
    }

    // Amenities
    // slices[0].segments[0].passengers[0].cabin.amenities.power
    // slices[0].segments[0].passengers[0].cabin.amenities.seat
    //slices[0].segments[0].passengers[0].cabin.amenities.wifi


let all_amenities={};
for(let i=0;i < slice.segments.length; i++){
	for(let j=(slice.segments[i].passengers.length-1);j>=0;j--){
		let amenities = {};
		if(slice.segments[i].passengers[j].cabin)
			if(slice.segments[i].passengers[j].cabin?.amenities)
				amenities=slice.segments[i].passengers[j].cabin?.amenities
		all_amenities={
			...all_amenities,
			...amenities
		}
	}
}

    let is_itin_showing=false;
    function toggle_see_ticket_details_itinerary_details(element_id){
        if(is_itin_showing){
            window.$("#"+element_id).slideUp("fast");
        }else{
            window.$("#"+element_id).slideDown("fast");
        }
        is_itin_showing = !is_itin_showing;
    }

    return (
        <div style={{border: "1px solid rgba(0,0,0,0.1)", borderRadius: 9, padding: 10, margin: 10}}>
            <p style={{fontSize: 14, letterSpacing: 1, fontWeight: "bolder", fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.8)"}}>
                {ORIGIN_CITY} to {DESTINATION_CITY}
            </p>
            <p style={{color: "rgba(0,0,0,0.8)", fontSize: 13, marginTop: 10}}>
                <img src={OPERATOR_LOGO} style={{width: 27, height: "auto", objectFit: "conver", marginRight: 10}} alt={"to do"} />
                {OPERATED_BY} &#8226; {DEPARTURE_DATE}
            </p>
            <div style={{marginTop: 20}}>
                <p style={{fontSize: 15, letterSpacing: 1, fontWeight: "bolder", fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.8)"}}>
                    {TRIP_START} - {TRIP_ENDS}
                </p>
                <p style={{color: "rgba(0,0,0,0.8)", fontSize: 13, marginTop: 5}}>
                    {DAYS} {HOURS} {MINUTES} ({(STOPS_COUNT > 0 ? (STOPS_COUNT + (STOPS_COUNT > 1 ? " stops" : " stop")) : "no stops")} )
                </p>
                <p style={{color: "rgba(0,0,0,0.8)", fontSize: 13, marginTop: 5}}>
                    {CABIN_CLASS}
                </p>
                <p style={{color: "rgba(0,0,0,0.8)", fontSize: 13, marginTop: 5}}>
                    {STOPSMARKUP.map(each=>each)}
                </p>
                <p style={{color: "rgba(0,0,0,0.7)", marginTop: 5}}>
                    {
                        all_amenities?.wifi?.available &&
                        <i style={{fontSize: 13, marginRight: 10}} className="fa-solid fa-wifi"></i>
                    }
                    {
                        all_amenities?.power?.available &&
                        <i style={{fontSize: 13, marginRight: 10}} className="fa-solid fa-plug-circle-bolt"></i>
                    }
                    <i style={{fontSize: 13, marginRight: 10}} className="fa fa-youtube"></i>
                </p>
                <p onClick={()=>toggle_see_ticket_details_itinerary_details(index+"checkout_see_ticket_details_itinerary_details")}
                     style={{cursor: "pointer", marginTop: 15, fontFamily: "'Prompt', Sans-serif", fontSize: 13, color: "#c900b0"}}>
                    Flight Route <i style={{marginLeft: 5}} className="fa fa-angle-down"></i>
                </p>
                <SelectedTicketItinSegments element_id={index+"checkout_see_ticket_details_itinerary_details"} segments={slice.segments}/>
            </div>
        </div>
    )
}

export default CheckoutInfoSliceCard;