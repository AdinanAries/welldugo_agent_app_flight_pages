import PriceSummary from "./PriceSummary";
import CheckoutInfoSliceCard from "./CheckoutInfoSliceCard";
import { markup } from "../../../helpers/Prices";
import { 
    get_currency_symbol, 
    convert24HTimeToAMPM, 
    get_short_date_MMMDD, 
    return_passenger_by_id, 
    return_segment_by_id,
    add_commas_to_number
} from "../../../helpers/general";
import { useEffect, useState } from "react";
import refund from "../../../refund.jpg";
import { getPriceMarkupPercentage } from "../../../services/flightsServices";

const CheckoutInfo = (props) => {

    const [ PriceMarkupPercentage, setPriceMarkupPercentage ] = useState(0);

    useEffect(()=>{
        (async()=>{
            let perc = await getPriceMarkupPercentage();
            setPriceMarkupPercentage(parseInt(perc));
        })();
    }, []);

    const { 
        flight, 
        prices, 
        adapted_available_services, 
        addServiceToPrices, 
        resetPriceExtras, 
        includeBookingAncillaries,
        removeAllBookingAncillaries,
        includedCheckedBagsTotal,
        setIncludedCheckedBagsTotal,
        includedCheckedBagsNumber, 
        setIncludedCheckedBagsNumber,
        servicesForPost, 
        setServicesForPost,
        includedCB, 
        setIncludedCB,
        saveAncillaries,
        INCLUDED_CHECKED_BAGS_EACH_PSNGR_QUANTITY,
        paymentIntent,  
        setPaymentIntent, 
        bookingIntent,  
        setBookingIntent,
        cancel_checkout,
    } = props;

    /*console.log("Checkout Infor", flight);
    console.log("Available Services", adapted_available_services);*/

    const { total_amount, total_currency, 
            slices, owner, conditions, 
            available_services, passengers 
    } = flight;

    useEffect(()=>{
        // Reset Payment Intent
        setPaymentIntent(null);
        setBookingIntent(null);
    },[]);

    const SEGMENT_LENGTH = slices[0].segments.length;
    const TRIP_START = convert24HTimeToAMPM(slices[0].segments[0].departing_at.split("T")[1]);
    const TRIP_ENDS = convert24HTimeToAMPM(slices[0].segments[(SEGMENT_LENGTH - 1)].arriving_at.split("T")[1]);
    const STOPS_COUNT = (SEGMENT_LENGTH-1);
    const CABIN_CLASS = slices[0].segments[0].passengers[0].cabin?.marketing_name;
    const ORIGIN_CITY = slices[0].segments[0].origin.city_name;
    const DESTINATION_CITY = slices[0].segments[(SEGMENT_LENGTH - 1)].destination?.city_name;
    const ORIGIN_AIRPORT = `${slices[0].segments[0].origin.iata_code}`;
    const DESTINATION_AIRPORT = `${slices[0].segments[(SEGMENT_LENGTH - 1)].destination.iata_code}`;
    
    const DEPARTURE_DATE = get_short_date_MMMDD(slices[0].segments[0].departing_at.replace("T", " "));
    const ARRIVAL_DATE = get_short_date_MMMDD(slices[0].segments[(SEGMENT_LENGTH-1)].arriving_at.replace("T", " "));
    
    let BAGGAGES_MARKUP=[];
    let carry_on_bags_count=0;
    let free_checked_bags_count=0;
    //for(let sl=0;sl<slices.length;sl++){
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
    //}

    if(carry_on_bags_count>0){
        BAGGAGES_MARKUP.push(
            <p style={{color: "rgba(0,0,0,0.8)", fontFamily: "'Prompt', Sans-serif", fontSize: 13, marginTop: 10}}>
                <i className="fa fa-check" style={{marginRight: 10, fontSize: 16, color: "rgba(0,0,0,0.5)"}}></i>
                {carry_on_bags_count} Carry-on {(carry_on_bags_count>1)?"bags":"bag"} included
            </p>
        )
    }
    if(free_checked_bags_count>0){
        BAGGAGES_MARKUP.push(
            <p style={{color: "rgba(0,0,0,0.8)", fontFamily: "'Prompt', Sans-serif", fontSize: 13, marginTop: 10}}>
                <i className="fa fa-check" style={{marginRight: 10, fontSize: 16, color: "rgba(0,0,0,0.5)"}}></i>
                {free_checked_bags_count} free checked {(free_checked_bags_count>1)?"bags":"bag"} included
            </p>
        )
    }
    if(free_checked_bags_count===0 && carry_on_bags_count===0){
        BAGGAGES_MARKUP.push(
            <p style={{color: "rgba(0,0,0,0.8)", fontFamily: "'Prompt', Sans-serif", fontSize: 13, marginTop: 10}}>
                <i className="fa fa-times" style={{marginRight: 10, fontSize: 16, color: "rgba(0,0,0,0.5)"}}></i>
                no bags included
            </p>
        )
    }

    let CANCELLATION_INFO=<div style={{position: "relative", display: "flex", alignItems: "center", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 9, padding: 10, margin: 10}}>
            <img style={{width: 70, height: "auto"}}
                src={refund} 
                alt="refund image" />
            <div style={{marginLeft: 20}}>
                <p style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.8)", fontWeight: "bolder"}}>
                    Refund Policy
                </p>
                <p style={{color: "crimson", fontSize: 13, fontFamily: "'Prompt', Sans-serif"}}>
                    Cancellation is NOT allowed for this flight
                </p>
            </div>
        </div>;

    if(conditions?.refund_before_departure?.allowed){
        let curr=get_currency_symbol(conditions?.refund_before_departure?.penalty_currency);
        CANCELLATION_INFO=<div style={{position: "relative", display: "flex", alignItems: "center", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 9, padding: 10, margin: 10}}>
                <img style={{width: 70, height: "auto"}}
                    src={refund} 
                    alt="refund image" />
                <div style={{marginLeft: 20}}>
                    <p style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.8)", fontWeight: "bolder"}}>
                        Refund Policy
                    </p>
                    <p style={{color: "green", fontSize: 13, fontFamily: "'Prompt', Sans-serif"}}>
                        Cancellation allowed with <span dangerouslySetInnerHTML={{__html: curr}}></span>
                        {conditions.refund_before_departure.penalty_amount} penalty amount
                    </p>
                </div>
            </div>
    }

    let CHANGES_INFO=<p style={{color: "rgba(0,0,0,0.8)", fontSize: 13, fontFamily: "'Prompt', Sans-serif", marginTop: 10}}>
            <i class="fa fa-times" style={{marginRight: 10, fontSize: 16, color: "rgba(0,0,0,0.5)"}}></i>
            Changes not allowed
        </p>;

    if(conditions.change_before_departure?.allowed){
        let curr=get_currency_symbol(conditions.change_before_departure.penalty_currency);
        CHANGES_INFO=<>
            <p style={{color: "rgba(0,0,0,0.8)", fontSize: 13, fontFamily: "'Prompt', Sans-serif", marginTop: 10}}>
                <i class="fa fa-check" style={{marginRight: 10, fontSize: 16, color: "rgba(0,0,0,0.5)"}}></i>
                Changes allowed with <span dangerouslySetInnerHTML={{__html: curr}}></span>
                {conditions.change_before_departure.penalty_amount} penalty amount
            </p>
        </>
    }

    let SEATS_SELECTION=[];
    let CHECKED_BAGS=[];
    let additional_checked_bags_count=[];
    let seat_selection_count=[];
    if(available_services.length > 0){
        for(let ss=0;ss<available_services.length;ss++){
            if(available_services[ss].type==="baggage"){
                additional_checked_bags_count.push({
                    total_currency: available_services[ss].total_currency,
                    total_amount: available_services[ss].total_amount
                });
            }
            if(available_services[ss].type==="seat"){
                seat_selection_count.push({
                    item: ""
                });
            }
        }
    }

    if(additional_checked_bags_count.length>0){
        let curr=get_currency_symbol(additional_checked_bags_count[0].total_currency);
        CHECKED_BAGS.push(
            <p style={{marginTop: 10, display: "flex", flexDirection: "row"}}>
                <span style={{color: "rgba(0,0,0,0.8)", fontFamily: "'Prompt', Sans-serif", fontSize: 13}}>
                    <i className="fa fa-money" style={{marginRight: 10, fontSize: 16, color: "rgba(0,0,0,0.5)"}}></i>
                    {additional_checked_bags_count.length}
                    {" Purchasable checked "}
                    {additional_checked_bags_count.length>1 ? "bags" : "bag"}:
                    <span style={{color: "rgba(0,0,0,0.8)", fontFamily: "'Prompt', Sans-serif", fontSize: 13, marginLeft: 15}}>
                        <span dangerouslySetInnerHTML={{__html: curr}}></span>
                        {additional_checked_bags_count[0].total_amount} each
                    </span>
                </span>              
            </p>
        )
    }

    if(seat_selection_count.length>0){
        SEATS_SELECTION.push(
            <p style={{color: "rgba(0,0,0,0.8)", fontSize: 13, fontFamily: "'Prompt', Sans-serif", marginTop: 10}}>
                <i className="fa fa-check" style={{marginRight: 10, fontSize: 16, color: "rgba(0,0,0,0.5)"}}></i>
                Seat choice included 
                <span style={{color: "rgba(0,0,0,0.5)", fontSize: 13, fontFamily: "'Prompt', Sans-serif"}}>
                    {` (${seat_selection_count.length} `}{
                        seat_selection_count.length>1 ? "seats)" : "seat)"
                    }
                </span>
            </p>
        )
    }

    if(CHECKED_BAGS.length===0){
        CHECKED_BAGS.push(
            <p style={{color: "rgba(0,0,0,0.8)", fontSize: 13, fontFamily: "'Prompt', Sans-serif", marginTop: 10}}>
                <i class="fa fa-times" style={{marginRight: 10, fontSize: 16, color: "rgba(0,0,0,0.5)"}}></i>
                can't purchase additional checked bags
            </p>
        );
    }
    if(SEATS_SELECTION.length===0){
        SEATS_SELECTION.push(
            <p style={{color: "rgba(0,0,0,0.8)", fontSize: 13, fontFamily: "'Prompt', Sans-serif", marginTop: 10}}>
                <i className="fa fa-times" style={{marginRight: 10, fontSize: 16, color: "rgba(0,0,0,0.5)"}}></i>
                Seat choice not included
            </p>
        );
    }

    let is_one_way=true;
    if(slices.length>1){
        const LAST_SLICE_SEG_LENGTH=slices[(slices.length-1)].segments.length;
        if(ORIGIN_CITY===slices[(slices.length-1)].segments[LAST_SLICE_SEG_LENGTH-1].destination.city_name){
            is_one_way=false;
        }
    }

    const SLICES = slices.map((each, i)=><CheckoutInfoSliceCard index={i} slice={each} />);

    const addCheckedBag = (eachPrice=0, pass_id="", total_quantity=0, service=null) => {

        const allTotal = includedCheckedBagsNumber+1;
        if(includedCheckedBagsNumber > total_quantity){
            return;
        }

        let curr_qntty = includedCB[service?.id][pass_id].included;
        const incremented = (curr_qntty+1);
        let max_numer = includedCB[service?.id][pass_id].quantity; // This has the quantity for the current passenger
        if(curr_qntty<max_numer){

            includedCB[service?.id][pass_id].included=incremented;
            setIncludedCB({...includedCB});

            setIncludedCheckedBagsNumber(allTotal);
            // Setting Total Price For All Passengers Here
            let allTotalPrice=0;
            for (let value of Object.values(includedCB)){
                for (let vvalue of Object.values(value)){
                    console.log(vvalue);
                    allTotalPrice+=(vvalue?.included * vvalue?.total_amount)
                }
            }
            setIncludedCheckedBagsTotal(allTotalPrice);

        }
        
        // Include object in services
        if(service){
            setServicesForPost(prevState=>{
                let object = prevState.find(each=>each.id===service.id);
                if(object && curr_qntty<max_numer){
                    object.quantity=(incremented);
                    let objIndex = prevState.findIndex(each=>each.id===service.id);
                    prevState[objIndex]=object;
                }else if(!object){
                    object = {
                        quantity: 1,
                        id: service.id
                    };
                    prevState.push(object);
                }
                return prevState;
            });
        }
        console.log("Selected Services", servicesForPost);
    }

    const removeCheckedBag = (eachPrice=0, pass_id="", service=null) => {

        let curr_qntty = includedCB[service?.id][pass_id].included;
        const decremented = (curr_qntty-1);
        const allTotal = includedCheckedBagsNumber-1;
        if(includedCheckedBagsNumber < 1 || curr_qntty < 1){
            return;
        }

        includedCB[service?.id][pass_id].included=decremented;
        setIncludedCB({...includedCB});

        setIncludedCheckedBagsNumber(allTotal);
        // Setting Total Price For All Passengers Here
        let allTotalPrice=0;
        for (let value of Object.values(includedCB)){
            for (let vvalue of Object.values(value)){
                console.log(vvalue);
                allTotalPrice+=(vvalue?.included * vvalue?.total_amount)
            }
        }
        setIncludedCheckedBagsTotal(allTotalPrice);

        // Removing object from services
        if(servicesForPost.length>0){
            setServicesForPost(prevState => {
                let object = prevState.find(each=>each.id===service.id);
                if(object){
                    let objIndex = prevState.findIndex(each=>each.id===service.id);
                    if(decremented<1){
                        if (objIndex !== -1) {
                            prevState.splice(objIndex, 1);
                        }
                    }else{
                        object.quantity=(decremented);
                        prevState[objIndex]=object;
                    }
                }
                return prevState;
            });
        }
        console.log("Selected Services", servicesForPost);
    }
    
    const resetAncillaries = () => {
        resetPriceExtras();
        // Reset all local state
        setIncludedCheckedBagsTotal(0);
        setIncludedCheckedBagsNumber(0);
        setServicesForPost([]);
        setIncludedCB(INCLUDED_CHECKED_BAGS_EACH_PSNGR_QUANTITY);
        // Reset actual checkout payload
        removeAllBookingAncillaries();
        global.hide_add_ancillaries_container();
    }


    const saveAncillariesOnclick = () => {
        saveAncillaries();
        global.hide_add_ancillaries_container();
    }
    window.__saveAncillariesOnclick__=saveAncillariesOnclick;

    const BAGGAGES=[];
    let INCLUDE_CHECKED_BAGS_TOTAL_QUANTITY=0;
    for(let i=0; i<adapted_available_services.length; i++){
        if(adapted_available_services[i]?.type==="baggage")
            INCLUDE_CHECKED_BAGS_TOTAL_QUANTITY+=adapted_available_services[i]?.maximum_quantity;
    }
    const TEMP_PSNGR_NAMES={};
    let psngr_no=0;
    for(let i=0; i<adapted_available_services.length; i++){
        /**
         * {
                "type": "baggage",
                "total_currency": "USD",
                "total_amount": "25.40",
                "segment_ids": [
                    "seg_0000AcP2kwhhlQXyvF3U1I"
                ],
                "passenger_ids": [
                    "pas_0000AcP2kwXQNeK8PMFGzq"
                ],
                "metadata": {
                    "type": "checked",
                    "maximum_weight_kg": 23,
                    "maximum_length_cm": null,
                    "maximum_height_cm": null,
                    "maximum_depth_cm": null
                },
                "maximum_quantity": 1,
                "id": "ase_0000AcP2qTyZUEqLYsaIQj"
            }
         */

        // Getting and Setting Passengers
        const PASSENGERS = [];
        INCLUDED_CHECKED_BAGS_EACH_PSNGR_QUANTITY[
            adapted_available_services[i].id
        ]={};
        for(let p=0; p<adapted_available_services[i].passenger_ids.length; p++){
            let psngr = return_passenger_by_id(flight, adapted_available_services[i].passenger_ids[p]);
            INCLUDED_CHECKED_BAGS_EACH_PSNGR_QUANTITY[
                adapted_available_services[i].id
            ][
                adapted_available_services[i].passenger_ids[p]
            ] = {
                included: 0,
                quantity: adapted_available_services[i].maximum_quantity,
                total_amount: parseFloat(adapted_available_services[i].total_amount),
            }
            if(!TEMP_PSNGR_NAMES[adapted_available_services[i].passenger_ids[p]])
                TEMP_PSNGR_NAMES[adapted_available_services[i].passenger_ids[p]]=`Passenger ${(++psngr_no)}`
            PASSENGERS.push(psngr);
        }

        // Getting and Setting Segments
        const SEGMENTS=[];
        for(let p=0; p<adapted_available_services[i].segment_ids.length; p++){
            let segment = return_segment_by_id(flight, adapted_available_services[i].segment_ids[p]);
            SEGMENTS.push(segment);
        }
        if(adapted_available_services[i].type==="baggage"){
            const SERVICE = adapted_available_services[i];
            const CURRENCY_SYMBOL = get_currency_symbol(SERVICE.total_currency);
            const TOTAL_AMOUNT = SERVICE.total_amount;
            const QUANTITY = SERVICE?.maximum_quantity || 0;
            
            const MAX_WEIGHT_KG = (SERVICE?.metadata && SERVICE?.metadata?.maximum_weight_kg);
            BAGGAGES.push(
                <div style={{padding: 10, marginBotton: 10, cursor: "pointer", borderBottom: "1px solid rgba(0,0,0,0.1)"}}>
                    <div style={{paddingBottom: 1, display: "flex"}}>
                        <p style={{marginRight: 5, color: "red", fontSize: 10}}>
                            FLIGHT(S):
                        </p>
                        {
                            SEGMENTS.map( (each, index) => (
                                <>
                                    {
                                        (index > 0) && <p style={{margin: "0 10px", fontSize: 12, color: "red"}}>
                                        &</p>

                                    }
                                    <p key={each.id} style={{fontSize: 10, fontFamily: "'Prompt', Sans-serif", color: "rgb(201, 0, 176)"}}>
                                        {each.origin.iata_city_code}
                                        <i style={{margin: "0 5px", fontSize: 10, color: "rgba(0,0,0,0.5)"}}
                                            className="fa-solid fa-arrow-right"></i>
                                        {each.destination.iata_city_code}
                                    </p>
                                </>)
                            )
                        }
                    </div>
                    <div style={{paddingBottom: 10, display: "flex"}}>
                        <p style={{marginRight: 5, color: "red", fontSize: 10}}>
                            FOR:
                        </p>
                        {
                            PASSENGERS.map( (each, index) => (
                                <>
                                    {
                                        (index > 0) && <p style={{margin: "0 10px", fontSize: 12, color: "red"}}>
                                        &</p>

                                    }
                                    <p key={each.id} style={{fontSize: 10, fontFamily: "'Prompt', Sans-serif", color: "rgb(201, 0, 176)"}}>
                                        {TEMP_PSNGR_NAMES[(each.id)]}
                                    </p>
                                </>)
                            )
                        }
                    </div>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <div>
                            <p style={{color: "rgba(0,0,0,0.8)", fontSize: 14, fontFamily: "'Prompt', Sans-serif"}}>
                                {
                                    QUANTITY && ("Quantity: "+QUANTITY)
                                }
                            </p>
                            <p style={{color: "rgba(0,0,0,0.8)", fontSize: 14, fontFamily: "'Prompt', Sans-serif", marginBottom: 5}}>
                                {
                                    MAX_WEIGHT_KG && ("Maximum weight: "+MAX_WEIGHT_KG+"kg")
                                }
                            </p>
                            <p style={{color: "rgba(0,0,0,0.8)", fontWeight: 1000, fontSize: 14, fontFamily: "'Prompt', Sans-serif", marginBottom: 2}}>
                                <span style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", fontWeight: "initial"}}>Each price:</span> <span style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)", fontWeight: "bolder"}} 
                                    dangerouslySetInnerHTML={{__html: CURRENCY_SYMBOL}}></span>
                                {(add_commas_to_number((markup(TOTAL_AMOUNT, PriceMarkupPercentage).new_price).toFixed(0)))}</p>
                        </div>
                        <div style={{marginLeft: 10, display: "flex", flexDirection: "column", justifyContent: "flex-end"}}>
                                <p style={{color: "rgba(0,0,0,0.8)", fontSize: 14, fontFamily: "'Prompt', Sans-serif", marginBottom: 10, textAlign: "right"}}>
                                    Total: <span style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)", fontWeight: "bolder"}} 
                                        dangerouslySetInnerHTML={{__html: CURRENCY_SYMBOL}}></span>
                                    {(add_commas_to_number((markup((TOTAL_AMOUNT*(includedCB?.[SERVICE?.id]?.[PASSENGERS[0]?.id].included || 0)), PriceMarkupPercentage).new_price).toFixed(0)))}
                                </p>
                                <div style={{display: "flex"}}>
                                    <p onClick={()=>removeCheckedBag(
                                        TOTAL_AMOUNT, 
                                        PASSENGERS[0].id, 
                                        SERVICE)
                                    } style={{backgroundColor: "white", fontSize: 20, width: 35, height: 35, borderRadius: "100%", border: "1px solid rgba(0,0,0,0.1)", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center"}}>
                                        -
                                    </p>
                                    <p style={{fontSize: 14, width: 30, height: 35, borderRadius: "100%", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center"}}>
                                        {(includedCB?.[SERVICE?.id]?.[PASSENGERS[0]?.id].included || 0)}
                                    </p>
                                    <p onClick={()=>addCheckedBag(
                                        TOTAL_AMOUNT, 
                                        PASSENGERS[0].id,
                                        INCLUDE_CHECKED_BAGS_TOTAL_QUANTITY,
                                        SERVICE
                                    )} style={{backgroundColor: "white", fontSize: 16, width: 35, height: 35, borderRadius: "100%", border: "1px solid rgba(0,0,0,0.1)", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center"}}>
                                        +
                                    </p>
                                </div>
                        </div>
                    </div>
                </div>
            );
        }
    }

    if(BAGGAGES.length<1){
        BAGGAGES.push(
            <div style={{padding: 10, border: "1px solid rgba(0,0,0,0.1)", display: "flex", backgroundColor: "rgba(255,0,0,0.1)", justifyContent: "center"}}>
                <span style={{fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.8)", fontSize: 14, marginRight: 10}}>
                    <i style={{color: "orange"}} className="fa-solid fa-exclamation-triangle"></i>
                </span>
                <span style={{fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.8)", fontSize: 14}}>
                    No purchasable checked bags for this flight
                </span>
            </div>
        );
    }

    return (
        <div className="checkout_page_all_info_flex_container">
            <div className="checkout_page_all_info_flex_left">
                <div style={{margin: 10, marginBottom: 0}}>
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                        <div>
                            <p style={{fontSize: 13, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.9)"}}>
                                {ORIGIN_CITY} {">"} {ORIGIN_AIRPORT} 
                                <span style={{margin: "0 15px", color: "rgba(0,0,0,0.5)"}}>
                                    <i className={is_one_way ? "fa-solid fa-arrow-right" : "fa-solid fa-exchange"}></i></span>
                                {DESTINATION_CITY} {">"} {DESTINATION_AIRPORT}
                            </p>
                            <div style={{display: "flex"}}>
                                <p style={{color: "rgba(0,0,0,0.7)", fontSize: 12, fontFamily: "'Prompt', Sans-serif"}}>
                                    {owner.name}
                                </p>
                                <p style={{margin: "0 5px", marginTop: -6.5, fontSize: 18, color: "rgba(0,0,0,0.5)"}}>
                                    .</p>
                                <p style={{color: "rgba(0,0,0,0.7)", fontSize: 12, fontFamily: "'Prompt', Sans-serif"}}>
                                    {is_one_way ? "one way" : "round trip"}
                                </p>
                                <p style={{margin: "0 5px", marginTop: -6.5, fontSize: 18, color: "rgba(0,0,0,0.5)"}}>
                                    .</p>
                                <p style={{color: "rgba(0,0,0,0.7)", fontSize: 12, fontFamily: "'Prompt', Sans-serif"}}>
                                    {passengers.length>1?(`${passengers.length} travelers`):"1 traveler"}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div>
                            
                        </div>
                    </div>
                </div>
                <div className="checkout-page-ancillary-container" style={{marginTop: 10}}>
                    <div onClick={global.start_add_luggage_ancillary} className="checkout-page-each-ancillary">
                        <p><img src={"./luggage_icon.png"} alt={"to do"}/></p>
                        <p>Add Luggage</p>
                    </div>
                    <div onClick={global.start_select_seat_ancillary} className="checkout-page-each-ancillary">
                        <p><img src={"./flight_seat.png"} alt={"to do"} /></p>
                        <p>Select Seat</p>
                    </div>
                    <div onClick={global.start_add_meal_ancillary} className="checkout-page-each-ancillary">
                        <p><img src={"./meal-icon.png"} alt={"to do"}/></p>
                        <p>Add Meal</p>
                    </div>
                </div>
                <div id="add_ancillaries_container">
                    <div onClick={global.hide_add_ancillaries_container} style={{backgroundColor: "white", cursor: "pointer", fontSize: 14, textAlign: "center", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 8, padding: 10, position: "absolute", zIndex: 1, top: 0, right: 10, color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif"}}>
                        <i style={{marginRight: 10, color: "orangered"}} className="fa fa-times"></i>Close
                    </div>
                    <div id="seat_ancillary_settings_container" className="each_ancillary_setting_container">
                        <p style={{fontSize: 14, letterSpacing: 1, fontWeight: "bolder", fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.8)"}}>
                            Seat Choice:
                        </p>
                        <div style={{padding: "10px 0"}}>
                            <div style={{padding: 10, margin: "10px 0", border: "1px solid rgba(0,0,0,0.1)", display: "flex", backgroundColor: "rgba(255,0,0,0.1)", justifyContent: "center"}}>
                                <span style={{fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.8)", fontSize: 14, marginRight: 10}}>
                                    <i style={{color: "orange"}} className="fa-solid fa-exclamation-triangle"></i>
                                </span>
                                <span style={{fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.8)", fontSize: 14}}>
                                    Seat choice not available at this time
                                </span>
                            </div>
                        </div>
                    </div>
                    <div id="meal_ancillary_settings_container" className="each_ancillary_setting_container">
                        <p style={{fontSize: 14, letterSpacing: 1, fontWeight: "bolder", fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.8)"}}>
                            Flight Meals:
                        </p>
                        <div style={{padding: "10px 0"}}>
                            <div style={{padding: 10, margin: "10px 0", border: "1px solid rgba(0,0,0,0.1)", display: "flex", backgroundColor: "rgba(255,0,0,0.1)", justifyContent: "center"}}>
                                <span style={{fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.8)", fontSize: 14, marginRight: 10}}>
                                    <i style={{color: "orange"}} className="fa-solid fa-exclamation-triangle"></i>
                                </span>
                                <span style={{fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.8)", fontSize: 14}}>
                                    Meals not available at this time
                                </span>
                            </div>
                        </div>
                    </div>
                    <div id="luggage_ancillary_settings_container" className="each_ancillary_setting_container">
                        <p style={{fontSize: 14, letterSpacing: 1, fontWeight: "bolder", fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.8)"}}>
                            Checked Bags:
                        </p>
                        <div style={{padding: "10px 0"}}>
                            {BAGGAGES.map(each=>each)}
                        </div>
                    </div>
                    <div style={{margin: "10px 0"}}>
                        <p style={{display: "flex"}}>
                            <span style={{color: "rgba(0,0,0,0.7)", fontSize: 13, fontFamily: "'Prompt', Sans-serif", marginRight: 10}}>
                                <i style={{marginRight: 5, color: "green"}} className="fa-solid fa-info"></i>
                            </span>
                            <span style={{color: "rgba(0,0,0,0.7)", fontSize: 13, fontFamily: "'Prompt', Sans-serif",}}>
                                FYI, the ancillary services you include here are unbound with the base price. Therefore adding them will cost 
                                extra money.
                            </span>
                        </p>
                    </div>
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 20, padding: "10px 0", borderTop: "1px solid rgba(0,0,0,0.1)"}}>
                        <div onClick={resetAncillaries} style={{fontFamily: "'Prompt', Sans-serif", backgroundColor: "white", padding: "10px 15px", border: "1px solid rgba(0,0,0,0.1)", fontSize: 14, borderRadius: 50, cursor: "pointer"}}>
                            <i style={{marginRight: 10, color: "orangered"}} className="fa-solid fa-arrow-rotate-left"></i>
                            Undo all
                        </div>
                        <div onClick={saveAncillariesOnclick} style={{fontFamily: "'Prompt', Sans-serif", backgroundColor: "white", padding: "10px 15px", border: "1px solid rgba(0,0,0,0.1)", fontSize: 14, borderRadius: 50, cursor: "pointer"}}>
                            <i style={{marginRight: 10, color: "green"}} className="fa fa-check"></i>
                            Save ancillaries
                        </div>
                    </div>
                </div>
                {CANCELLATION_INFO}
                {SLICES}
                <div style={{border: "1px solid rgba(0,0,0,0.1)", borderRadius: 9, padding: 10, margin: 10}}>
                    <p style={{fontSize: 14, letterSpacing: 1, fontWeight: "bolder", fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.8)"}}>
                        Flight Details
                    </p>
                    <p style={{fontSize: 12, marginTop: 10, fontFamily: "'Prompt', sans-serif", color: "green"}}>
                        Main Cabin
                    </p>
                    <p style={{color: "rgba(0,0,0,0.8)", fontFamily: "'Prompt', Sans-serif", fontSize: 13, marginTop: 5}}>
                        {CABIN_CLASS}
                    </p>
                    <p style={{fontSize: 12, marginTop: 15, fontFamily: "'Prompt', Sans-serif", color: "green"}}>
                        Seat
                    </p>
                    {SEATS_SELECTION.map(each=>each)}
                    <p style={{fontSize: 12, marginTop: 15, fontFamily: "'Prompt', Sans-serif", color: "green"}}>
                        Bags
                    </p>
                    {BAGGAGES_MARKUP.map(each=>each)}
                    {CHECKED_BAGS.map(each=>each)}
                    <p style={{fontSize: 12, marginTop: 15, fontFamily: "'Prompt', Sans-serif", color: "green"}}>
                        Flexibility
                    </p>
                    {CHANGES_INFO}
                </div>
            </div>
            <div className="checkout_page_all_info_flex_right">
                <PriceSummary 
                    buttonFunction={props.showPNRPage}
                    backButtonFunction={cancel_checkout}
                    buttonText="Passengers" 
                    prices={prices}
                    total_travelers={flight.passengers.length}
                />
            </div>
        </div>
    );
}

export default CheckoutInfo;