import { useEffect, useState } from "react";
import { markup } from "../../../../helpers/Prices";
import { 
    convert24HTimeToAMPM, 
    calculateTotalTime, 
    ellipsify, 
    get_currency_symbol, 
    get_short_date_DAYMMMDD,
    get_duration_d_h_m,
    add_commas_to_number,
} from "../../../../helpers/general";
import { fetchAgentPriceMarkupInfo } from "../../../../services/agentServices";
import SelectedTicketItinSegments from "../SelectedTicketItinSegments";
import CONSTANTS from "../../../../Constants/Constants";

const OfferItem = (props) => {

    const {
        bookingEngine,
        hasNewMessageFromParent,
        currentParentMessge,
        data_provider,
        rawData,
    } = props;

    const [ PriceMarkupValue, setPriceMarkupValue ] = useState({
        type: "",
        value: 0,
    });
    const [ canShowPrice, setCanShowPrice ] = useState({
        profit_type: "",
        with_price_bound_profit: false,
        show: false,
    });

    useEffect(()=>{
        (async()=>{
            let _pm_obj = {
                type: "",
                value: 0,
            }
            let _can_show_obj = {
                profit_type: "",
                with_price_bound_profit: false,
                show: false,
            }
            setCanShowPrice(_can_show_obj);
            setPriceMarkupValue(_pm_obj);
            if(
                hasNewMessageFromParent &&
                currentParentMessge?.from_welldugo_oc &&
                currentParentMessge?.type==="engine-parameters"
            ){
                if(currentParentMessge?.postBody?.apply_price_bound_profile){
                    _pm_obj.type = currentParentMessge?.postBody?.current_price_bound_profit_type;
                    _pm_obj.value = currentParentMessge?.postBody?.current_price_bound_profit_value;
                    _can_show_obj.with_price_bound_profit = true;
                    _can_show_obj.show = true;
                }else{
                    _can_show_obj.with_price_bound_profit = false;
                    _can_show_obj.show = true;
                }
                //currentParentMessge?.postBody?.current_price_bound_supplier: "duffel",
            }else if(localStorage.getItem("engine_parameters")){
                const engine_parameters = JSON.parse(localStorage.getItem("engine_parameters"));
                if(engine_parameters?.postBody?.apply_price_bound_profile){
                    _pm_obj.type = engine_parameters?.postBody?.current_price_bound_profit_type;
                    _pm_obj.value = engine_parameters?.postBody?.current_price_bound_profit_value;
                    _can_show_obj.with_price_bound_profit = true;
                    _can_show_obj.show = true;
                    console.log(engine_parameters);
                }else{
                    _can_show_obj.with_price_bound_profit = false;
                    _can_show_obj.show = true;
                }
            }else {
                if(localStorage.getItem("agent")){
                    const agent_id = localStorage.getItem("agent");
                    if(agent_id || agent_id!=="undefined"){
                        let _pm_res = await fetchAgentPriceMarkupInfo(agent_id);
                        _pm_obj.type = _pm_res?.type;
                        _pm_obj.value = _pm_res?.value;
                        _can_show_obj.with_price_bound_profit = true;
                        _can_show_obj.show = true;
                    }
                }
            }

            // Update State Here
            setPriceMarkupValue({
                type: _pm_obj?.type,
                value: parseFloat(_pm_obj?.value),
            });
            setCanShowPrice({
                ...canShowPrice,
                with_price_bound_profit: _can_show_obj?.with_price_bound_profit,
                show: _can_show_obj?.show,
            });
        })();
    }, [currentParentMessge]);

    const index = props?.index;
    const {
        total_amount, 
        total_currency, 
        id, 
        owner, 
        slices, 
        passengers 
    } = props?.flight;

    const selectFlightOfferOnClick = () => {
        if(CONSTANTS?.duffel===data_provider?.toUpperCase()){
            props?.selectFlightOffer(id);
        }else if(CONSTANTS?.amadeus===data_provider?.toUpperCase()){
            props?.selectFlightOffer(rawData);
        }
    }

    const EMISSIONS = props?.flight?.total_emissions_kg
    //console.log(props.flight);
    
    const CURRENCY_SYMBOL = get_currency_symbol(total_currency);
    const AIRCRAFT_NAME = slices[0]?.segments[0]?.aircraft?.name;
    const OPERATED_BY = slices[0]?.segments[0]?.operating_carrier?.name;
    const SEGMENT_LENGTH = slices[0]?.segments?.length;
    const TRIP_START = convert24HTimeToAMPM(slices[0]?.segments[0]?.departing_at?.split("T")[1]);
    const TRIP_ENDS = convert24HTimeToAMPM(slices[0]?.segments[(SEGMENT_LENGTH - 1)]?.arriving_at?.split("T")[1]);
    const STOPS_COUNT = (SEGMENT_LENGTH-1);
    const ORIGIN_AIRPORT = `${slices[0]?.segments[0]?.origin.name} (${slices[0]?.segments[0]?.origin?.iata_code})`;
    const DESTINATION_AIRPORT = `${slices[0]?.segments[(SEGMENT_LENGTH - 1)]?.destination.name} (${slices[0]?.segments[(SEGMENT_LENGTH - 1)]?.destination?.iata_code})`;
    const ORIGIN_IATA=slices[0]?.segments[0]?.origin?.iata_code;
    const DESTINATION_IATA=slices[0]?.segments[(SEGMENT_LENGTH - 1)]?.destination?.iata_code;
    const ORIGIN_CITY = slices[0]?.segments[0]?.origin?.city_name;

    let is_more_details_shown = false;
    const toggle_show_more_details = () =>{
        
        if(is_more_details_shown){
            window.$(`#each_ticket_item_more_details_container_${index}`).slideUp("fast");
            document.getElementById(`each_ticket_item_more_details_btn_${index}`).style.transform = "rotate(0deg)";
        }else{
            window.$(`#each_ticket_item_more_details_container_${index}`).slideDown("fast");
            document.getElementById(`each_ticket_item_more_details_btn_${index}`).style.transform = "rotate(180deg)";
        }
        is_more_details_shown = !is_more_details_shown;

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
                    element_id={index+"search_result_see_ticket_details_itinerary_details"} 
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

    let is_one_way=true;
    if(slices?.length>1){
        const LAST_SLICE_SEG_LENGTH=slices[(slices?.length-1)]?.segments?.length;
        if(ORIGIN_CITY===slices[(slices?.length-1)]?.segments[LAST_SLICE_SEG_LENGTH-1]?.destination?.city_name){
            is_one_way=false;
        }
    }
    let STOPSMARKUP = [];
    if(SEGMENT_LENGTH>1){
        for(let sg=0; sg<SEGMENT_LENGTH-1; sg++){
            let flight_stop_arrival = slices[0]?.segments[sg]?.arriving_at;
            let flight_stop_departure = slices[0]?.segments[sg+1]?.departing_at;
            const {d: DAYS, h: HOURS, m: MINUTES} = calculateTotalTime(flight_stop_arrival.replace("T", " "), flight_stop_departure?.replace("T", " "));
            let STOP_DETAILS = (`${DAYS} ${HOURS} ${MINUTES} in ${ellipsify(slices[0]?.segments[sg]?.destination?.city_name)} (${slices[0]?.segments[sg]?.destination?.iata_code})`);
            STOPSMARKUP?.push(<p className="tooltip_parent" style={{color: "rgba(0,0,0,0.8)", fontSize: 12, zIndex: 1, textAlign: "center"}}>
                    {STOP_DETAILS}
                    <div className="tooltip">{`${slices[0]?.segments[sg]?.destination?.city_name} - ${slices[0]?.segments[sg]?.destination?.name}`}</div>
                </p>);
        }
    }
    if(STOPSMARKUP.length<1){
        STOPSMARKUP.push(<p style={{color: "rgba(0,0,0,0.8)", textAlign: "center", fontSize: 11, marginBottom: 5}}>
        {AIRCRAFT_NAME}</p>)
    }

    const {d: DAYS, h: HOURS, m: MINUTES} = get_duration_d_h_m(slices[0]?.duration)

    return (
        <>
            <div className="each_ticket_item_container"
                style={{cursor: "pointer", padding: 15, borderTop: "1px solid rgba(0,0,0,0.1)", display: "flex", justifyContent: "space-between"}}>
                <div onClick={()=>{global.show_selected_ticket_details_pane(); selectFlightOfferOnClick()}}
                    className="mobile_content_display_block_container" 
                    style={{width: "calc(100% - 110px)", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <div>
                        <div style={{color: "rgba(0,0,0,0.8)", fontSize: 14, fontWeight: "bolder", marginBottom: 5}}>
                            <img src={owner?.logo_symbol_url/*"./deltaIcon.png"*/} alt="" style={{width: 30, height: "auto", objectFit: "cover", marginRight: 7}} />
                            {TRIP_START} - {TRIP_ENDS}
                        </div>
                        <p style={{marginLeft: 40, color: "rgba(0,0,0,0.8)", fontSize: 12, marginBottom: 5}}>
                            {owner?.name}
                        </p>
                        <p style={{marginLeft: 40, color: "rgba(0,0,0,0.7)", marginTop: 5}}>
                            {
                                
                                all_amenities?.wifi?.available &&
                                <span className="tooltip_parent">
                                    <i style={{fontSize: 13, marginRight: 10}} className="fa-solid fa-wifi"></i>
                                    <span className="tooltip">
                                        Wifi
                                    </span>
                                </span>
                            }
                            {
                                all_amenities?.power?.available &&
                                <span className="tooltip_parent">
                                    <i style={{fontSize: 13, marginRight: 10}} className="fa-solid fa-plug-circle-bolt"></i>
                                    <span className="tooltip">
                                        Power
                                    </span>
                                </span>
                            }
                            {
                                all_amenities?.baggage?.available &&
                                <span className="tooltip_parent">
                                    <i style={{fontSize: 13, marginRight: 10}} className="fa-solid fa-suitcase-rolling"></i>
                                    <span className="tooltip">
                                        Checked Bag
                                    </span>
                                </span>
                            }
                            {
                                all_amenities?.seat?.available &&
                                <span className="tooltip_parent">
                                    <i style={{fontSize: 13, marginRight: 10}} className="fa-solid fa-tag"></i>
                                    <span className="tooltip">
                                        Pre-Reserved Seat
                                    </span>
                                </span>
                            }
                            {
                                all_amenities?.meal?.available &&
                                <span className="tooltip_parent">
                                    <i style={{fontSize: 13, marginRight: 10}} className="fa-solid fa-utensils"></i>
                                    <span className="tooltip">
                                        Meal
                                    </span>
                                </span>
                            }
                        </p>
                    </div>
                    <div>
                        <p style={{color: "rgba(0,0,0,0.8)", fontSize: 12, textAlign: "center", marginBottom: 5}}>
                            {DAYS} {HOURS} {MINUTES} ({(STOPS_COUNT > 0 ? (STOPS_COUNT + ((STOPS_COUNT > 1) ? " stops" : " stop")) : "nonstop")})
                        </p>
                        {STOPSMARKUP?.map(each=>each)}
                        {
                            EMISSIONS && <p style={{textAlign: "center", color: "rgba(0,0,0,0.7)", fontSize: 11, marginTop: 5}}>
                                Emisions: {EMISSIONS} kg CO<sub style={{fontSize: 11}}>2</sub>
                            </p>
                        }
                    </div>
                    <div className="each_ticket_price_display_container">
                        <p className="each_ticket_price_display" style={{textAlign: "center", color: "rgba(0,0,0,0.8)", fontWeight: 1000, fontSize: 18, fontFamily: "'Prompt', Sans-serif", marginBottom: 2}}>
                            {
                                (canShowPrice?.show && (!canShowPrice?.with_price_bound_profit || PriceMarkupValue?.value)) ?
                                <span style={{fontSize: 18, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)", fontWeight: "bolder"}} 
                                dangerouslySetInnerHTML={{__html: CURRENCY_SYMBOL}}></span> : ""
                            }
                            { 
                                canShowPrice?.show ?
                                    <> 
                                        {
                                            !canShowPrice?.with_price_bound_profit ?
                                            add_commas_to_number(parseFloat(total_amount)?.toFixed(0)) :
                                            <>
                                                {
                                                    PriceMarkupValue?.value ?
                                                    (add_commas_to_number((markup(total_amount, PriceMarkupValue?.value, PriceMarkupValue?.type)?.new_price)?.toFixed(0)))
                                                    : "N/A"
                                                }
                                            </>
                                        }
                                    </>
                                : <span style={{color: "rgba(0,0,0,0.8)"}}>
                                    <i className="fa-solid fa-filter-circle-dollar"></i>
                                </span>
                            }
                        </p>
                        <p style={{color: "rgba(0,0,0,0.8)", fontSize: 12, marginBottom: 10, textAlign: "center"}}>
                            {passengers.length>1?(`${passengers.length} passengers`):"1 passenger"}
                        </p>
                    </div>
                </div>
                <div style={{borderLeft: "1px dashed rgba(0,0,0,0.1)", paddingLeft: 15}}>
                    <div style={{fontFamily: "'Prompt', Sans-serif", marginLeft: 0, color: "rgba(0,0,0,0.7)", fontWeight: "bolder", fontSize: 11}}>
                        {ORIGIN_IATA}
                        <span style={{margin: "0 10px", color: "rgba(0,0,0,0.4)"}}>
                            <i style={{fontSize: 11}}
                            className={is_one_way ? "fa-solid fa-arrow-right" : "fa-solid fa-exchange"}></i></span>
                        {DESTINATION_IATA}
                    </div>
                    <div style={{color: "rgba(0,0,0,0.8)", fontSize: 12, textAlign: "center", marginBottom: 5}}>
                            <span style={{fontSize: 12}}>
                                {is_one_way?"one way":"round trip"}</span>
                    </div>
                    <div onClick={toggle_show_more_details}
                            id={"each_ticket_item_more_details_btn_"+index}
                            style={{display: "flex", margin: "auto", 
                                backgroundColor: bookingEngine?.actionButtonsBg, 
                                color: bookingEngine?.actionButtonsIconColor, transition: "all 0.2s ease-out", alignItems: "center", justifyContent: "center", 
                                borderRadius: `${bookingEngine?.searchButtonBorderRadius}%`, fontSize: 13, width: 30, height: 30, boxShadow: "1px 2px 3px rgba(0,0,0,0.3)"}}>
                            <i className="fa-solid fa-angle-down"></i>
                    </div>
                    <p style={{marginTop: 10, textAlign: 'center', borderTop: "1px dashed rgba(0,0,0,0.1)"}}>
                            <span style={{color: "rgba(0,0,0,0.7)", fontSize: 11}}>
                                <i style={{marginRight: 10, fontSize: 11, color: "rgba(0,0,0,0.5)"}} className="fa-solid fa-share-alt"></i>
                                {data_provider}
                            </span>
                        </p>
                </div>
            </div>
            <div id={"each_ticket_item_more_details_container_"+index} 
                className="each_ticket_item_more_details_container speech-bubble-top" 
                style={{ borderRadius: 9, marginBottom: 10, display: "none", boxShadow: "1px 2px 3px rgba(0,0,0,0.3)"}}>
                <div style={{borderTopLeftRadius: 9, borderTopRightRadius: 9,fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)", backgroundColor: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", padding: 10, textAlign: "center", fontWeight: "bolder", fontSize: 11}}>
                    {ORIGIN_IATA}
                    <span style={{margin: "0 10px", color: "rgba(0,0,0,0.4)"}}>
                        <i style={{fontSize: 11}}
                        className={is_one_way ? "fa-solid fa-arrow-right" : "fa-solid fa-exchange"}></i></span>
                    {DESTINATION_IATA}
                    <span style={{fontFamily: "'Prompt', Sans-serif", margin: "0 10px", color: "rgba(0,0,0,0.7)", fontSize: 11}}>
                        &#8226;
                    </span>
                    <span style={{fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)", fontWeight: "initial", fontSize: 11}}>
                        {owner?.name}
                    </span>
                    <span style={{fontFamily: "'Prompt', Sans-serif", margin: "0 10px", color: "rgba(0,0,0,0.7)", fontSize: 11}}>
                        &#8226;
                    </span>
                    <span style={{fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)", fontWeight: "initial", fontSize: 11}}>
                        {is_one_way?"one way":"round trip"}
                    </span>
                </div>
                <div style={{padding: 15}}>
                    <div className="mobile_content_display_block_container"
                        style={{display: "flex", justifyContent: "space-between", marginTop: 15}}>
                        {ITIN_SEGMENTS?.map(each=>each)}
                    </div>
                    <div style={{display: "flex", justifyContent: "space-between", marginTop: 15,}}>
                        <div onClick={()=>{global?.show_selected_ticket_details_pane(); selectFlightOfferOnClick(); toggle_show_more_details();}}
                            style={{width: "calc(100% - 45px)", 
                                borderRadius: bookingEngine?.actionButtonBorderRadius, boxShadow: "1px 2px 3px rgba(0,0,0,0.3)", fontFamily: "'Prompt', Sans-serif", textAlign: "center", 
                                color: bookingEngine?.actionButtonsTxtColor, 
                                backgroundColor: bookingEngine?.actionButtonsBg, fontSize: 14, padding: 10, cursor: "pointer"}}>
                            select
                        </div>
                        <div onClick={toggle_show_more_details} style={{cursor: "pointer", width: 40, height: 40, boxShadow: "1px 2px 3px rgba(0,0,0,0.3)", 
                                borderRadius: `${bookingEngine?.closeButtonBorderRadius}%`, 
                                background: bookingEngine?.closeButtonBgColor, display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <i style={{color: bookingEngine?.closeButtonIconColor, fontSize: 13}} className="fa-solid fa-times"></i>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OfferItem;