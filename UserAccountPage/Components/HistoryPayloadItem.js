import { useState } from "react";
import { 
    get_short_date_DAYMMMDD, 
    convert24HTimeToAMPM,
    get_currency_symbol
} from "../../../helpers/general";
import { markup } from "../../../helpers/Prices";
import SelectedTicketItinSegments from "../../SearchPage/Components/SelectedTicketItinSegments";
import loading_icon from "../../../icons/loading.svg";

const HistoryPayloadItem = (props) => {
    const { 
        completedOrderDetails,
        /*prices,*/
    } = props;

    console.log("Booking History Item:", completedOrderDetails);

    const [isLoading, setIsLoading] = useState(false);


    const FIRST_SLICE_ORIGIN_IATA=(
        completedOrderDetails?.slices 
        && completedOrderDetails?.slices[0].segments 
        && completedOrderDetails?.slices[0].segments[0].origin?.iata_code
    );
    const FIRST_SLICE_CITY_NAME=(
        completedOrderDetails?.slices 
        && completedOrderDetails?.slices[0].segments 
        && completedOrderDetails?.slices[0].segments[0].origin?.city_name
    );
    const LAST_SLICE_DESTINATION_IATA=(
        completedOrderDetails?.slices 
        && completedOrderDetails?.slices[(completedOrderDetails?.slices?.length - 1)].segments 
        && completedOrderDetails?.slices[(completedOrderDetails?.slices?.length - 1)]
        .segments[(completedOrderDetails?.slices[(completedOrderDetails?.slices?.length - 1)]?.segments?.length - 1)].destination?.iata_code
    );
    const LAST_SLICE_CITY_NAME=(
        completedOrderDetails?.slices 
        && completedOrderDetails?.slices[(completedOrderDetails?.slices?.length - 1)].segments 
        && completedOrderDetails?.slices[(completedOrderDetails?.slices?.length - 1)]
        .segments[(completedOrderDetails?.slices[(completedOrderDetails?.slices?.length - 1)]?.segments?.length - 1)].destination?.city_name
    );

    const DESTINATION_IATA=(
        completedOrderDetails?.slices 
        && completedOrderDetails?.slices[0].segments 
        && completedOrderDetails?.slices[0].segments[0].destination?.iata_code
    );
    const DESTINATION_CITY_NAME=(
        completedOrderDetails?.slices 
        && completedOrderDetails?.slices[0].segments 
        && completedOrderDetails?.slices[0].segments[0].destination?.city_name
    );;

    const SLICES_LENGHT = completedOrderDetails?.slices?.length;
    let is_one_way=(SLICES_LENGHT<2);
    let is_round_trip=(
        SLICES_LENGHT===2 
        && (FIRST_SLICE_ORIGIN_IATA===LAST_SLICE_DESTINATION_IATA)
    );

    const _date_time=(
        completedOrderDetails?.slices
        && completedOrderDetails?.slices[0]?.segments
        && completedOrderDetails?.slices[0]?.segments[0]?.departure_datetime
    )
    const FLIGHT_DATE=(get_short_date_DAYMMMDD((_date_time || "")));
    const _time=(
        completedOrderDetails?.slices
        && completedOrderDetails?.slices[0]?.segments
        && completedOrderDetails?.slices[0]?.segments[0]?.departure_datetime.split("T")[1]
    );
    const TAKE_OFF_TIME=convert24HTimeToAMPM((_time || ""));

    const SEGMENTS = [];
    completedOrderDetails?.slices?.forEach((slice, index)=>{

        SEGMENTS.push(<div style={{marginBottom: 10}}>
            <span onClick={()=>global.toggle_see_ticket_details_itinerary_details((index+"_completed_order_details_itinerary_details"))} 
                style={{cursor: "pointer", fontSize: 14, color: "green", fontFamily: "'Prompt', Sans-serif"}}>
                <i style={{marginRight: 10}} className="fa-solid fa-route"></i>
                {slice.origin.city_name} to {slice.destination.city_name}
                <span style={{color: "brown", textDecoration: "underline", fontSize: 14, fontFamily: "'Prompt', Sans-serif", marginLeft: 10}}>
                    show route</span>
            </span>
            <div style={{paddingLeft: 20, paddingTop: 5, paddingBottom: 5, backgroundColor: "rgba(0,0,0,0.1)"}}>
                <SelectedTicketItinSegments element_id={(index+"_completed_order_details_itinerary_details")} segments={slice.segments}/>
            </div>
        </div>);

        slice.segments.forEach(segment=> {

            let seats="";
            let total_checked_baggages=0;
            let total_carry_on_baggages=0;
            segment.passengers.forEach(passenger=>{
                seats+= passenger.seat ? `${passenger.seat}, ` : "_";
                passenger.baggages.forEach(baggage=>{
                    if(baggage.type==="checked"){
                        total_checked_baggages+=parseInt(baggage.quantity);
                    }
                    if(baggage.type==="carry_on"){
                        total_carry_on_baggages+=parseInt(baggage.quantity);
                    }
                });

                completedOrderDetails.passengers.forEach(flight_passenger=>{
                    if(passenger.passenger_id===flight_passenger.id){
                        flight_passenger.extras=passenger;
                    }
                });
            });

            SEGMENTS.push(
                <div style={{display: "flex", paddingBottom: 13, paddingLeft: 20}}>
                    <div>
                        <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 14}}>
                            {segment.origin.iata_code}, {segment.origin.city_name}
                            <span style={{margin: "0 10px", fontFamily: "'Prompt', Sans-serif", fontSize: 14, color: "rgba(0,0,0,0.6)"}}>
                                to
                            </span>
                            {segment.destination.iata_code}, {segment.destination.city_name}
                        </p>
                        <div style={{paddingLeft: 10}}>
                            <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 13, color: "rgba(0,0,0,0.7)"}}>
                                {segment.origin.name}
                                <span style={{margin: "0 10px", fontFamily: "'Prompt', Sans-serif", fontSize: 14, color: "rgba(0,0,0,0.6)"}}>
                                    to
                                </span>
                                {segment.destination.name}
                            </p>
                            <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 13, color: "rgba(0,0,0,0.7)"}}>
                                {get_short_date_DAYMMMDD(segment.departure_datetime) + " ("}
                                {convert24HTimeToAMPM(segment.departure_datetime.split("T")[1]) + ")"}
                                <span style={{margin: "0 10px", fontFamily: "'Prompt', Sans-serif", fontSize: 14, color: "rgba(0,0,0,0.6)"}}>
                                    to
                                </span>
                                {get_short_date_DAYMMMDD(segment.arrival_datetime) + " ("}
                                {convert24HTimeToAMPM(segment.arrival_datetime.split("T")[1]) + ")"}
                            </p>
                            <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 13, color: "rgba(0,0,0,0.7)"}}>
                                This flight is operated by {segment.operating_carrier.name}. {segment.operating_carrier.conditions_of_carriage_url && <a href={segment.operating_carrier.conditions_of_carriage_url} rel="noreferrer" target="_blank">
                                Please click here to learn more about the airline conditions</a>}
                            </p>
                            <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 13, color: "rgba(0,0,0,0.7)"}}>
                                <span style={{fontWeight: "bolder", fontFamily: "'Prompt', Sans-serif", fontSize: 14}}>
                                    Take off: {convert24HTimeToAMPM(segment.departure_datetime.split("T")[1])}
                                </span>, Aircraft: {segment.aircraft.name}, Checked bags: {total_checked_baggages}, Carry-on bags: {total_carry_on_baggages}
                            </p>
                            <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 13, color: "rgba(0,0,0,0.7)"}}>
                                Seats: {seats}
                            </p>
                        </div>
                    </div>
                </div>
            )
        })
    });

    // Generating passengers markup
    const PASSENGERS=[];
    completedOrderDetails?.passengers?.forEach(passenger=>{

        let seat=passenger.extras.seat || "unspecified";
        let total_checked_baggages=0;
        let total_carry_on_baggages=0;
        let cabin_class = passenger.extras.cabin_class;
        let email=passenger.email;
        let phone=passenger.phone_number;
        let name = `${passenger.given_name} ${passenger.family_name}`
        passenger.extras.baggages.forEach(baggage=>{
            if(baggage.type==="checked"){
                total_checked_baggages+=parseInt(baggage.quantity);
            }
            if(baggage.type==="carry_on"){
                total_carry_on_baggages+=parseInt(baggage.quantity);
            }
        });

        PASSENGERS.push(
            <div style={{display: "flex", paddingBottom: 10, marginRight: 25}}>
                <div style={{fontFamily: "'Prompt', Sans-serif", marginRight: 10}}>
                    <i style={{color: "rgba(0,0,0,0.5)"}}
                            className="fa-solid fa-user"></i>
                </div>
                <div>
                    <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 14}}>
                        {name}
                    </p>
                    <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 13, color: "rgba(0,0,0,0.7)"}}>
                        {email}, {phone}
                    </p>
                    <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 13, color: "rgba(0,0,0,0.7)"}}>
                        Seat: {seat}, Cabin: {cabin_class}, Checked bags: {total_checked_baggages}, Carry-on bags: {total_carry_on_baggages}
                    </p>
                </div>
            </div>
        );
    });

    const IMPORTANT_NOTICES=[];
    if(completedOrderDetails?.conditions?.refund_before_departure?.allowed){
        const CURRENCY_SYMBOL=get_currency_symbol(completedOrderDetails?.conditions?.refund_before_departure?.penalty_currency);
        IMPORTANT_NOTICES.push(
            <div style={{display: "flex"}}>
                <div style={{fontFamily: "'Prompt', Sans-serif", marginRight: 10}}>
                    <i style={{color: "green"}}
                            className="fa-solid fa-check"></i>
                </div>
                <div>
                    <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 13}}>
                        Refund allowed with penalty amount of 
                        <span style={{marginLeft: 5, fontFamily: "'Prompt', Sans-serif", fontSize: 13}} 
                            dangerouslySetInnerHTML={{__html: CURRENCY_SYMBOL}}></span>
                            {(markup(completedOrderDetails?.conditions?.refund_before_departure?.penalty_amount).new_price).toFixed(2)}
                    </p>
                </div>
            </div>
        );
    }else{
        IMPORTANT_NOTICES.push(
            <div style={{display: "flex"}}>
                <div style={{fontFamily: "'Prompt', Sans-serif", marginRight: 10}}>
                    <i style={{color: "orange"}}
                            className="fa-solid fa-exclamation-triangle"></i>
                </div>
                <div>
                    <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 13}}>
                        No refunds available for this flight
                    </p>
                </div>
            </div>
        );
    }

    if(completedOrderDetails?.conditions?.change_before_departure?.allowed){
        const CURRENCY_SYMBOL=get_currency_symbol(completedOrderDetails?.conditions?.change_before_departure?.penalty_currency);
        IMPORTANT_NOTICES.push(
            <div style={{display: "flex"}}>
                <div style={{fontFamily: "'Prompt', Sans-serif", marginRight: 10}}>
                    <i style={{color: "green"}}
                            className="fa-solid fa-check"></i>
                </div>
                <div>
                    <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 13}}>
                        Changes allowed with penalty amount of
                        <span style={{marginLeft: 5, fontFamily: "'Prompt', Sans-serif", fontSize: 13}} 
                            dangerouslySetInnerHTML={{__html: CURRENCY_SYMBOL}}></span>
                            {(markup(completedOrderDetails?.conditions?.change_before_departure?.penalty_amount).new_price).toFixed(2)}
                    </p>
                </div>
            </div>
        );
    }else{
        IMPORTANT_NOTICES.push(
            <div style={{display: "flex"}}>
                <div style={{fontFamily: "'Prompt', Sans-serif", marginRight: 10}}>
                    <i style={{color: "orange"}}
                            className="fa-solid fa-exclamation-triangle"></i>
                </div>
                <div>
                    <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 13}}>
                        Changes are not allowed for this flight
                    </p>
                </div>
            </div>
        );
    }

    let overallTotal = parseFloat(completedOrderDetails.total_amount);
    const { services } = completedOrderDetails;
    const EXTRAS_MARKUP = [];
    services.forEach(each=>{
        //overallTotal=(overallTotal+each.total_amount);
        EXTRAS_MARKUP.push(
            <div>
                <p style={{fontSize: 13, letterSpacing: 1, color: "rgba(0,0,0,0.9)"}}>
                    {each.type} ({each.quantity}):
                    <span style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)", marginLeft: 5}} 
                            dangerouslySetInnerHTML={{__html: get_currency_symbol(each.total_currency)}}></span>
                    {(markup(each.total_amount).new_price).toFixed(2)}
                </p>
            </div>
        );
    });

    return (
        <div style={{position: "relative"}}>
            <div style={{paddingBottom: 10}}>
                <div style={{padding: "0 10px"}}>
                    <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 14, fontWeight: "bolder"}}>
                        <i style={{marginRight: 10, color: "orange"}} className="fa-solid fa-ticket"></i>
                        Reference Number:
                        <span style={{fontFamily: "'Prompt', Sans-serif", marginLeft: 5, color: "rgba(0,0,0,0.7)", fontSize: 13}}>
                            {completedOrderDetails.booking_reference}
                        </span>
                    </p>
                </div>
                {
                    isLoading && 
                        <div style={{marginTop: 10, padding: "20px", maxWidth: 250, border: "1px solid rgba(0,0,0,0.1)", borderRadius: 8}}>
                            <div style={{backgroundImage: `url(${loading_icon})`, backgroundSize: "contain", backgroundRepeat: "no-repeat", width: 90, height: 90, margin: "auto"}}></div>
                            <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif", textAlign: "center", marginTop: 20}}>
                                Please wait...</p>
                        </div>
                }
                {
                    (!isLoading && completedOrderDetails) && <div>
                        <div>
                            <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 14, margin: 10}}>
                                See Details Below: <span onClick={window.print} style={{cursor: "pointer", color: "darkslateblue", fontFamily: "'Prompt', Sans-serif", textDecoration: "underline"}}>
                                    Click to Print</span></p>
                                <div className="printable" style={{border: "1px dashed rgba(0,0,0,0.1)", padding: 10}}>
                                    <div style={{marginBottom: 10}}>
                                    <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 14}}>
                                        {FIRST_SLICE_CITY_NAME} - {FIRST_SLICE_ORIGIN_IATA}
                                        {is_one_way && <i style={{margin: "0 10px"}} className="fa-solid fa-arrow-right"></i>}
                                        {is_round_trip && <i style={{margin: "0 10px"}} className="fa-solid fa-rotate"></i>}
                                        {DESTINATION_CITY_NAME} - {DESTINATION_IATA}
                                    </p>
                                    <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 14}}>
                                        <i style={{marginRight: 10, color: "orange"}} className="fa-solid fa-ticket"></i>
                                        Your booking reference is
                                        <span style={{fontWeight: "bolder", fontFamily: "'Prompt', Sans-serif", marginLeft: 5, color: "rgba(0,0,0,0.9)", fontSize: 13}}>
                                            {completedOrderDetails.booking_reference}
                                        </span>
                                    </p>
                                    <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 13, color: "rgba(0,0,0,0.7)"}}>
                                        Please remember your flight is on
                                        <span style={{fontFamily: "'Prompt', Sans-serif", fontSize: 13, margin: "0 10px", color: "black", fontWeight: "bolder"}}>
                                            {FLIGHT_DATE}</span>
                                        and takes off at
                                        <span style={{fontFamily: "'Prompt', Sans-serif", fontSize: 13, margin: "0 10px", color: "black", fontWeight: "bolder"}}>
                                            {TAKE_OFF_TIME}</span>
                                    </p>
                                </div>
                                <h1 style={{fontFamily: "'Prompt', Sans-serif", fontSize: 14, marginBottom: 10, marginTop: 25}}>
                                    Flights</h1>
                                <div>
                                    {SEGMENTS.map(each=>each)}
                                </div>
                                <h1 style={{fontFamily: "'Prompt', Sans-serif", fontSize: 14, marginBottom: 10, marginTop: 15}}>
                                    Passengers</h1>
                                <div>
                                    <div style={{display: "flex", flexWrap: "wrap"}}>
                                        {PASSENGERS.map(each=>each)}
                                    </div>
                                </div>

                                <div>
                                <h1 style={{fontFamily: "'Prompt', Sans-serif", fontSize: 14, marginBottom: 10, marginTop: 15}}>
                                    Sold by</h1>
                                <div>
                                    <div style={{marginBottom: 10}}>
                                        <p style={{color: "rgba(0,0,0,0.8)", fontSize: 12, fontFamily: "'Prompt', Sans-serif", marginTop: 10}}>
                                            <img src={completedOrderDetails?.owner?.logo_symbol_url} alt={"todo"} style={{width: 27, height: "auto", marginRight: 10, objectFit: "cover"}} />
                                            {completedOrderDetails?.owner?.name}
                                        </p>
                                        {
                                            completedOrderDetails?.owner?.conditions_of_carriage_url ?
                                            <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 14}}>
                                                <a href={completedOrderDetails?.owner?.conditions_of_carriage_url}  rel="noreferrer" target="_blank">
                                                    read more at {completedOrderDetails?.owner?.conditions_of_carriage_url}
                                                </a>
                                            </p> : 
                                            <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 13}}>
                                                <i style={{color: "orange", marginRight: 10}} className="fa-solid fa-exclamation-triangle"></i>
                                                Airline website not found
                                            </p>
                                        }
                                    </div>
                                </div>
                                <h1 style={{fontFamily: "'Prompt', Sans-serif", fontSize: 14, marginBottom: 10, marginTop: 25}}>
                                    Payment Details</h1>
                                <div style={{marginBottom: 10, paddingLeft: 10}}>
                                    <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 13}}>
                                        Base Amount: <span style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)"}} 
                                            dangerouslySetInnerHTML={{__html: get_currency_symbol(completedOrderDetails.base_currency)}}></span>
                                            {(markup(completedOrderDetails.base_amount).new_price).toFixed(2)}</p>
                                    <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 13}}>
                                        Tax Amount: <span style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)"}} 
                                            dangerouslySetInnerHTML={{__html: get_currency_symbol(completedOrderDetails.tax_currency)}}></span>
                                            {(markup(completedOrderDetails.tax_amount).new_price).toFixed(2)}</p>
                                    {EXTRAS_MARKUP.map(each=>each)}
                                    <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 14, fontWeight: "bolder"}}>
                                        Total Paid: <span style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)"}} 
                                            dangerouslySetInnerHTML={{__html: get_currency_symbol(completedOrderDetails.total_currency)}}></span>
                                        {(markup(overallTotal).new_price).toFixed(2)}</p>
                                </div>
                                <h1 style={{fontFamily: "'Prompt', Sans-serif", fontSize: 14, marginBottom: 10, marginTop: 25}}>
                                    Important Notices</h1>
                                    <div style={{padding: 10, marginBottom: 10, backgroundColor: "rgba(0,255,0,0.1)", border: "1px solid rgba(0,255,0,0.1)", borderRadius: 4}}>
                                        {IMPORTANT_NOTICES.map(each=>each)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );

}

export default HistoryPayloadItem;