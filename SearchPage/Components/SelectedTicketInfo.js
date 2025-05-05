import airplane_seat from "../../../icons/airplane_seat.png"
import { markup } from "../../../helpers/Prices";
import { 
    convert24HTimeToAMPM, 
    get_short_date_MMMDD, 
    get_currency_symbol, 
    get_short_date_DAYMMMDD,
    add_commas_to_number
} from "../../../helpers/general";
import { getTotalBags } from "../../../helpers/FlightsFilterHelpers";
import { useState, useEffect } from "react";

import SelectedTicketItinSegments from "./SelectedTicketItinSegments";
import { getPriceMarkupPercentage } from "../../../services/flightsServices";

const SelectedTicketInfo = (props) => {

    const [ PriceMarkupPercentage, setPriceMarkupPercentage ] = useState(0);
    
        useEffect(()=>{
            (async()=>{
                let perc = await getPriceMarkupPercentage();
                setPriceMarkupPercentage(parseInt(perc));
            })();
        },[]);

    const { data } = props?.flight;
    const { total_amount, total_currency, 
            slices, owner, conditions, 
            available_services, passengers 
    } = data;

    const book_item_onclick = () => {
        props?.begin_checkout(data);
        setTimeout(()=>{
            global?.__unselectFlightOffer();
            global?.hide_selected_ticket_details_pane();
        },300);
    }
    window.__Selected_Ticket_Book_Item_Onclick = book_item_onclick;

    const SEGMENT_LENGTH = slices[0]?.segments?.length;
    const TRIP_START = convert24HTimeToAMPM(slices[0]?.segments[0]?.departing_at?.split("T")[1]);
    const TRIP_ENDS = convert24HTimeToAMPM(slices[0]?.segments[(SEGMENT_LENGTH - 1)]?.arriving_at?.split("T")[1]);
    const STOPS_COUNT = (SEGMENT_LENGTH-1);
    const ORIGIN_CITY = slices[0].segments[0]?.origin?.city_name;
    const DESTINATION_CITY = slices[0]?.segments[(SEGMENT_LENGTH - 1)]?.destination?.city_name;
    const CABIN_CLASS = slices[0]?.segments[0]?.passengers[0]?.cabin?.marketing_name;
    const DEPARTURE_DATE = get_short_date_MMMDD(slices[0]?.segments[0]?.departing_at?.replace("T", " "));
    const ARRIVAL_DATE = get_short_date_MMMDD(slices[(slices.length-1)]?.segments[(SEGMENT_LENGTH-1)]?.arriving_at.replace("T", " "));
    const CURRENCY_SYMBOL = get_currency_symbol(total_currency);

    let is_one_way=true;
    if(slices.length>1){
        const LAST_SLICE_SEG_LENGTH=slices[(slices.length-1)]?.segments?.length;
        if(ORIGIN_CITY===slices[(slices.length-1)]?.segments[LAST_SLICE_SEG_LENGTH-1]?.destination?.city_name){
            is_one_way=false;
        }
    }

    let BAGGAGES=[];
    const TOTAL_BAGS = getTotalBags(data);
    let carry_on_bags_count=TOTAL_BAGS?.totalCarryOnBags;
    let free_checked_bags_count=TOTAL_BAGS?.totalCheckedBags;
    /*for(let sl=0;sl<slices.length;sl++){
        for(let sg=0;sg<slices[0].segments.length;sg++){
            for(let ps=0; ps<slices[0].segments[sg].passengers.length;ps++){
                for(let bb=0; bb<slices[0].segments[sg].passengers[ps].baggages.length; bb++){
                    if(slices[0].segments[sg].passengers[ps].baggages[bb].type==="carry_on"){
                        carry_on_bags_count+=slices[0].segments[sg].passengers[ps].baggages[bb].quantity;
                    }
                    if(slices[0].segments[sg].passengers[ps].baggages[bb].type==="checked"){
                        free_checked_bags_count+=slices[0].segments[sg].passengers[ps].baggages[bb].quantity;
                    }
                }
            }
        }  
    }*/
    if(carry_on_bags_count>0){
        BAGGAGES.push(
            <p style={{color: "rgba(0,0,0,0.8)", fontFamily: "'Prompt', Sans-serif", fontSize: 13, marginTop: 10}}>
                <i className="fa fa-check" style={{marginRight: 10, fontSize: 16, color: "rgba(0,0,0,0.5)"}}></i>
                {carry_on_bags_count} Carry-on {(carry_on_bags_count>1)?"bags":"bag"} included
            </p>
        )
    }
    if(free_checked_bags_count>0){
        BAGGAGES.push(
            <p style={{color: "rgba(0,0,0,0.8)", fontFamily: "'Prompt', Sans-serif", fontSize: 13, marginTop: 10}}>
                <i className="fa fa-check" style={{marginRight: 10, fontSize: 16, color: "rgba(0,0,0,0.5)"}}></i>
                {free_checked_bags_count} free checked {(free_checked_bags_count>1)?"bags":"bag"} included
            </p>
        )
    }
    if(free_checked_bags_count===0 && carry_on_bags_count===0){
        BAGGAGES.push(
            <p style={{color: "rgba(0,0,0,0.8)", fontFamily: "'Prompt', Sans-serif", fontSize: 13, marginTop: 10}}>
                <i className="fa fa-times" style={{marginRight: 10, fontSize: 16, color: "rgba(0,0,0,0.5)"}}></i>
                no bags included
            </p>
        )
    }

    let CANCELLATION_INFO=<p style={{color: "rgba(0,0,0,0.8)", fontSize: 13, fontFamily: "'Prompt', Sans-serif", marginTop: 10}}>
            <i class="fa fa-times" style={{marginRight: 10, fontSize: 16, color: "rgba(0,0,0,0.5)"}}></i>
            Cancellation not allowed
        </p>;

    if(conditions.refund_before_departure?.allowed){
        let curr=get_currency_symbol(conditions?.refund_before_departure?.penalty_currency);
        CANCELLATION_INFO=<>
            <p style={{color: "rgba(0,0,0,0.8)", fontSize: 13, fontFamily: "'Prompt', Sans-serif", marginTop: 10}}>
                <i class="fa fa-check" style={{marginRight: 10, fontSize: 16, color: "rgba(0,0,0,0.5)"}}></i>
                Cancellation allowed with <span dangerouslySetInnerHTML={{__html: curr}}></span>
                {conditions?.refund_before_departure?.penalty_amount} penalty amount
            </p>
        </>
    }

    let CHANGES_INFO=<p style={{color: "rgba(0,0,0,0.8)", fontSize: 13, fontFamily: "'Prompt', Sans-serif", marginTop: 10}}>
            <i class="fa fa-times" style={{marginRight: 10, fontSize: 16, color: "rgba(0,0,0,0.5)"}}></i>
            Changes not allowed
        </p>;

    if(conditions.change_before_departure?.allowed){
        let curr=get_currency_symbol(conditions?.change_before_departure?.penalty_currency);
        CHANGES_INFO=<>
            <p style={{color: "rgba(0,0,0,0.8)", fontSize: 13, fontFamily: "'Prompt', Sans-serif", marginTop: 10}}>
                <i class="fa fa-check" style={{marginRight: 10, fontSize: 16, color: "rgba(0,0,0,0.5)"}}></i>
                Changes allowed with <span dangerouslySetInnerHTML={{__html: curr}}></span>
                {conditions?.change_before_departure?.penalty_amount} penalty amount
            </p>
        </>
    }

    let SEATS_SELECTION=[];
    let CHECKED_BAGS=[];
    let additional_checked_bags_count=[];
    let seat_selection_count=[];
    if(available_services?.length > 0){
        for(let ss=0;ss<available_services?.length;ss++){
            if(available_services[ss]?.type==="baggage"){
                additional_checked_bags_count?.push({
                    total_currency: available_services[ss]?.total_currency,
                    total_amount: available_services[ss]?.total_amount
                });
            }
            if(available_services[ss]?.type==="seat"){
                seat_selection_count.push({
                    item: ""
                });
            }
        }
    }

    if(additional_checked_bags_count?.length>0){
        let curr=get_currency_symbol(additional_checked_bags_count[0]?.total_currency);
        CHECKED_BAGS.push(
            <p style={{marginTop: 10, display: "flex", flexDirection: "row"}}>
                <span style={{color: "rgba(0,0,0,0.8)", fontFamily: "'Prompt', Sans-serif", fontSize: 13}}>
                    <i className="fa-solid fa-suitcase-rolling" style={{marginRight: 10, fontSize: 16, color: "rgba(0,0,0,0.5)"}}></i>
                    {additional_checked_bags_count?.length}
                    {" Purchasable checked "}
                    {additional_checked_bags_count?.length>1 ? "bags" : "bag"}:
                    <span style={{color: "rgba(0,0,0,0.8)", fontFamily: "'Prompt', Sans-serif", fontSize: 13, marginLeft: 15}}>
                        <span dangerouslySetInnerHTML={{__html: curr}}></span>
                        {additional_checked_bags_count[0]?.total_amount} each
                    </span>
                </span>
            </p>
        )
    }

    if(seat_selection_count?.length>0){
        SEATS_SELECTION.push(
            <p style={{color: "rgba(0,0,0,0.8)", fontSize: 13, fontFamily: "'Prompt', Sans-serif", marginTop: 10}}>
                <i className="fa fa-check" style={{marginRight: 10, fontSize: 16, color: "rgba(0,0,0,0.5)"}}></i>
                Seat choice included 
                <span style={{color: "rgba(0,0,0,0.5)", fontSize: 13, fontFamily: "'Prompt', Sans-serif"}}>
                    {` (${seat_selection_count?.length} `}{
                        seat_selection_count?.length>1 ? "seats)" : "seat)"
                    }
                </span>
            </p>
        )
    }

    if(CHECKED_BAGS?.length===0){
        CHECKED_BAGS.push(
            <p style={{color: "rgba(0,0,0,0.8)", fontSize: 13, fontFamily: "'Prompt', Sans-serif", marginTop: 10}}>
                <i class="fa fa-times" style={{marginRight: 10, fontSize: 16, color: "rgba(0,0,0,0.5)"}}></i>
                can't purchase additional checked bags
            </p>
        );
    }
    if(SEATS_SELECTION?.length===0){
        SEATS_SELECTION.push(
            <p style={{color: "rgba(0,0,0,0.8)", fontSize: 13, fontFamily: "'Prompt', Sans-serif", marginTop: 10}}>
                <i className="fa fa-times" style={{marginRight: 10, fontSize: 16, color: "rgba(0,0,0,0.5)"}}></i>
                Seat choice not included
            </p>
        );
    }

    let all_amenities={};
    const ITIN_SEGMENTS=[];
    slices.forEach((slice, index)=>{
        const DEPARTURE_DATE = get_short_date_DAYMMMDD(slice?.segments[0]?.departing_at?.replace("T", " "));
        const TRIP=( index ? "Return" : "Take-Off");
        const ARRIVAL_DATE = get_short_date_DAYMMMDD(slice?.segments[(slice?.segments?.length - 1)]?.arriving_at?.replace("T", " "));
        ITIN_SEGMENTS.push(
            <div>
                <p style={{color: "rgba(0,0,0,0.8)", fontSize: 12, fontFamily: "'Prompt', Sans-serif"}}>
                    <i style={{marginRight: 10, fontSize: 11}}
                        className="fa-solid fa-plane-departure"></i>
                    {TRIP}
                    <span style={{fontFamily: "'Prompt', Sans-serif", margin: "0 10px", color: "rgba(0,0,0,0.7)", fontSize: 11}}>
                        &#8226;
                    </span>
                    {DEPARTURE_DATE}
                </p>
                <SelectedTicketItinSegments 
                    element_id={index+"see_ticket_details_itinerary_details"} 
                    segments={slice?.segments}
                    display="block"
                />
                <p style={{color: "rgba(0,0,0,0.8)", fontSize: 12, fontFamily: "'Prompt', Sans-serif", marginTop: -10, marginBottom: 20}}>
                    <i style={{marginRight: 10, fontSize: 11}}
                        className="fa-solid fa-plane-arrival"></i>
                    Arrival
                    <span style={{fontFamily: "'Prompt', Sans-serif", margin: "0 10px", color: "rgba(0,0,0,0.7)", fontSize: 11}}>
                        &#8226;
                    </span>
                    {ARRIVAL_DATE}
                </p>
                {/*<SelectedTicketItinSegments element_id="see_ticket_details_itinerary_details" segments={slices[0].segments}/>*/}
            </div>
        );

        // Amenities
        for(let i=0;i < slice?.segments?.length; i++){
            for(let j=(slice?.segments[i]?.passengers?.length-1);j>=0;j--){
                let amenities = {};
                if(slice?.segments[i]?.passengers[j]?.cabin)
                    if(slice?.segments[i]?.passengers[j]?.cabin?.amenities)
                        amenities=slice?.segments[i]?.passengers[j]?.cabin?.amenities
                all_amenities={
                    ...all_amenities,
                    ...amenities
                }
            }
        }
    });
     
    let is_flight_route_shown = false;
    const toggle_show_flight_route = () =>{
        
        if(is_flight_route_shown){
            window.$(`#ticket_flight_route_details_container`).slideUp("fast");
            document.getElementById(`show_flight_route_details_caret`).style.transform = "rotate(0deg)";
        }else{
            window.$(`#ticket_flight_route_details_container`).slideDown("fast");
            document.getElementById(`show_flight_route_details_caret`).style.transform = "rotate(180deg)";
        }
        is_flight_route_shown = !is_flight_route_shown;

    }

    return (
        <div id="selected_ticket_main_details_pane">
                <div style={{padding: 10, borderBottom: "1px solid rgba(0,0,0,0.1)"}}>
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                        <div>
                            <p style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)", fontWeight: "bolder", marginBottom: 10}}>
                                {TRIP_START} - {TRIP_ENDS} ({(STOPS_COUNT > 0 ? (STOPS_COUNT + (STOPS_COUNT > 1 ? " stops" : " stop")) : "no stops")} )
                            </p>
                            <p style={{fontSize: 13, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)"}}>
                                {ORIGIN_CITY}
                                <span style={{margin: "0 10px", color: "rgba(0,0,0,0.4)"}}>
                                    <i className={is_one_way ? "fa-solid fa-arrow-right" : "fa-solid fa-exchange"}></i></span>
                                {DESTINATION_CITY}
                            </p>
                            <p style={{fontSize: 13, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)", marginTop: 2}}>
                                {DEPARTURE_DATE} - {ARRIVAL_DATE}</p>
                            <p style={{color: "rgba(0,0,0,0.8)", fontSize: 12, fontFamily: "'Prompt', Sans-serif", marginTop: 10}}>
                                <img src={owner.logo_symbol_url} alt={"todo"} style={{width: 27, height: "auto", marginRight: 10, objectFit: "cover"}} />
                                {owner?.name}
                                <span onClick={()=>toggle_show_flight_route()/*global.toggle_see_ticket_details_itinerary_details("see_ticket_details_itinerary_details")*/} 
                                    style={{cursor: "pointer", marginLeft: 15, fontSize: 12, color: "green", fontFamily: "'Prompt', Sans-serif"}}>
                                    Flight Route 
                                    <i id="show_flight_route_details_caret" 
                                        style={{marginLeft: 10, color: "rgba(0,0,0,0.6)"}} className="fa fa-angle-down"></i>
                                </span>
                            </p>
                            <div id="ticket_flight_route_details_container" style={{display: "none", marginTop: 20}}>
                                {
                                    ITIN_SEGMENTS?.map(each=>each)
                                }
                            </div>
                        </div>
                        <p className="pop-up-close-btn" onClick={()=>{global?.hide_selected_ticket_details_pane(); props?.unselectFlightOffer();}} 
                            style={{cursor: "pointer", color: "rgba(0,0,0,0.6)", border: "1px solid rgba(0,0,0,0.1)", width: 40, height: 40, borderRadius: "100%", fontSize: 22, marginRight: 5, display: "flex", justifyContent: "center", alignItems: "center"}}>
                            &times;
                        </p>
                    </div>
                </div>
                <div style={{padding: 10}}>
                    <p style={{fontSize: 22, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)", fontWeight: "bolder"}}>
                        {
                            PriceMarkupPercentage ?
                            <span style={{fontSize: 22, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)", fontWeight: "bolder"}} 
                            dangerouslySetInnerHTML={{__html: CURRENCY_SYMBOL}}></span> : ""
                        }
                        {   
                            PriceMarkupPercentage ?
                            (add_commas_to_number((markup(total_amount, PriceMarkupPercentage)?.new_price)?.toFixed(2)))
                            : <span style={{color: "rgba(0,0,0,0.8)"}}>
                                <i className="fa-solid fa-filter-circle-dollar"></i>
                            </span>
                        }
                    </p>
                    <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif", fontSize: 12}}>
                        {is_one_way ? "one way":"roun trip"}
                        <span style={{fontFamily: "'Prompt', Sans-serif", margin: "0 5px", color: "rgba(0,0,0,0.7)", fontSize: 11}}>
                            &#8226;
                        </span>
                        {passengers.length>1?(`${passengers.length} passengers`):"1 passenger"}
                    </p>
                    <p style={{fontSize: 12, marginTop: 20, fontFamily: "'Prompt', sans-serif", color: "green"}}>
                        Amenities & Extras
                    </p>
                    <div style={{marginTop: 5}}>
                                {
                                    all_amenities?.wifi?.available &&
                                    <p style={{color: "rgba(0,0,0,0.9)", fontFamily: "'Prompt', Sans-serif", fontSize: 11}}>
                                        <i style={{fontSize: 11, marginRight: 5}} className="fa-solid fa-wifi"></i>
                                        Wifi
                                    </p>
                                }
                                {
                                    all_amenities?.power?.available &&
                                    <p style={{color: "rgba(0,0,0,0.9)", fontFamily: "'Prompt', Sans-serif", fontSize: 11}}>
                                        <i style={{fontSize: 11, marginRight: 5}} className="fa-solid fa-plug-circle-bolt"></i>
                                        Power
                                    </p>
                                }
                                {/*<p style={{color: "rgba(0,0,0,0.9)", fontFamily: "'Prompt', Sans-serif", fontSize: 11}}>
                                    <i style={{fontSize: 11, marginRight: 5}} className="fa fa-youtube"></i>
                                    Entertainment
                                </p>*/}
                                {
                                    (free_checked_bags_count>0) && 
                                    <p style={{color: "rgba(0,0,0,0.9)", fontFamily: "'Prompt', Sans-serif", fontSize: 11}}>
                                        <i style={{fontSize: 13, marginRight: 5}} className="fa-solid fa-suitcase-rolling"></i>
                                        checked bags
                                    </p>
                                }
                            </div>
                    <p style={{fontSize: 12, marginTop: 20, fontFamily: "'Prompt', sans-serif", color: "green"}}>
                        Main Cabin
                    </p>
                    <p style={{color: "rgba(0,0,0,0.8)", fontFamily: "'Prompt', Sans-serif", fontSize: 13, marginTop: 5}}>
                        {CABIN_CLASS}
                    </p>
                    <p style={{fontSize: 12, marginTop: 25, fontFamily: "'Prompt', Sans-serif", color: "green"}}>
                        Seat
                    </p>
                    {SEATS_SELECTION?.map(each=>each)}
                    {
                        all_amenities?.seat && 
                        <div style={{backgroundColor: "rgba(0,0,255,0.1)", position: "relative", maxWidth: 180, marginTop: 15, borderTop: "4px solid rgba(0,0,255,0.3)", borderBottomLeftRadius: 10, borderBottomRightRadius: 10, padding: 10}}>
                            <p style={{fontFamily: "'Prompt', Sans-serif", marginTop: 5,fontSize: 11, fontWeight: "bolder", color: "rgba(0,0,0,0.9)"}}>
                                Seat Info
                            </p>
                            <div style={{fontFamily: "'Prompt', Sans-serif", fontSize: 11, marginTop: 5, color: "rgba(0,0,0,0.9)"}}>
                                <p style={{ width: 30, height: 30, borderRadius: "100%", display: "flex", justifyContent: "center", alignItems: "center",
                                        position: "absolute", top: -55, left: 0, background: "white", boxShadow: "1px 2px 3px rgba(0,0,0,0.3)"}}>
                                    <img src={airplane_seat} 
                                        style={{width: 22, height: "auto"}}/>
                                </p>
                                {`Pitch: ${all_amenities?.seat?.pitch}, Legroom: ${all_amenities?.seat?.legroom}`}
                            </div>
                        </div>
                    }
                    <p style={{fontSize: 12, marginTop: 25, fontFamily: "'Prompt', Sans-serif", color: "green"}}>
                        Bags
                    </p>
                    {BAGGAGES?.map(each=>each)}
                    {CHECKED_BAGS?.map(each=>each)}
                    <p style={{fontSize: 12, marginTop: 25, fontFamily: "'Prompt', Sans-serif", color: "green"}}>
                        Flexibility
                    </p>
                    {CANCELLATION_INFO}
                    {CHANGES_INFO}
                </div>
                <div className="selected_ticket_book_btn_container">
                    <div onClick={
                            ()=>{book_item_onclick()}
                            /*()=>global.show_start_checkout_page(`${global.stringify_obj_for_template_strings(global.checkout_obj)}`)*/
                        } className="selected_ticket_book_btn">
                        <i style={{marginRight: 10, color: "rgba(255,255,255,0.5)", fontSize: 19}} className="fa fa-check-square-o" aria-hidden="true"></i>
                        Book
                    </div>
                </div>
            </div>
    )
}

export default SelectedTicketInfo;