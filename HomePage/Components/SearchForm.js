import { useEffect, useState } from "react";

import AutoCompleteInit from "../../../helpers/AutoCompleteInit";
import DateChoosersInit, { HotelSearchDatesChooserInit } from '../../../helpers/DateChoosersInit';
import HotelsAutoCompleteInit from "../../../helpers/HotelsAutoCompleteInit";
import { show_search_page, show_home_page } from "../../../helpers/PageRoutingFuncs";
import { toast } from "react-toastify";
import CONSTANTS from "../../../Constants/Constants";
import { show_prompt_on_Bot_AD_tips_popup } from "../../../components/HPSupport";
import getBotResponse from "../../../Constants/BotResponses";

// Hotel search
let hotel_search_obj = {
    checkin_date: "",
    checkout_date: "",
    location: {
      iata: 0,
      long: 0,
      lat: 0,
    },
    flights: {
      included: false,
      origin_airport: {
        iata: 0,
        long: 0,
        lat: 0,
      }
    },
    cars: {
      included: false,
    },
    rooms: [
      {
        total_adults: 1,
        children: []
      }
    ]
}
  
if(localStorage.getItem("hotel_search_obj")){
    hotel_search_obj=JSON.parse(localStorage.getItem("hotel_search_obj"));
}else{
    localStorage.setItem("hotel_search_obj", JSON.stringify(hotel_search_obj));
}

function SearchForm(props){

    const {
        productType,
        change_product_type,
    } = props

    // Hotel search form functions
    const [ hotel_search_data, set_hotel_search_data ] = useState(hotel_search_obj);

    const returnHotelSearchTotalGuests = () => {
        let g = 0;
        hotel_search_data.rooms.forEach(each=>{
            g+=each?.total_adults;
            g+=each?.children.length;
        });
        return {
            rooms: hotel_search_data.rooms.length,
            guests: g
        }
    }

    const MAX_HOTEL_SEARCH_GUESTS=15;
    const addAdultGuestToHotelSearch = (i) => {
        if(returnHotelSearchTotalGuests().guests>(MAX_HOTEL_SEARCH_GUESTS-1)){
            alert(`Only a total of ${MAX_HOTEL_SEARCH_GUESTS} guests allowed`)
            return;
        }
        if(hotel_search_data.rooms[i].total_adults<5){
            hotel_search_data.rooms[i].total_adults+=1;
            localStorage.setItem("hotel_search_obj", JSON.stringify(hotel_search_data));
            set_hotel_search_data({...hotel_search_data});
        }
    }

    const removeAdultGuestToHotelSearch = (i) => {
        if(hotel_search_data.rooms[i].total_adults>1){
            hotel_search_data.rooms[i].total_adults-=1;
            localStorage.setItem("hotel_search_obj", JSON.stringify(hotel_search_data));
            set_hotel_search_data({...hotel_search_data});
        }
    }

    const addChildGuestToHotelSearch = (i) => {
        if(returnHotelSearchTotalGuests().guests>(MAX_HOTEL_SEARCH_GUESTS-1)){
            alert(`Only a total of ${MAX_HOTEL_SEARCH_GUESTS} guests allowed`)
            return;
        }
        if(hotel_search_data.rooms[i].children.length<4){
            hotel_search_data.rooms[i].children.push({age: 0});
            localStorage.setItem("hotel_search_obj", JSON.stringify(hotel_search_data));
            set_hotel_search_data({...hotel_search_data});
        }
    }

    const removeChildGuestToHotelSearch = (i) => {
        if(hotel_search_data.rooms[i].children.length>0){
            hotel_search_data.rooms[i].children.pop();
            localStorage.setItem("hotel_search_obj", JSON.stringify(hotel_search_data));
            set_hotel_search_data({...hotel_search_data});
        }
    }

    const removeRoomFromHotelSearch = (i) => {
        if(hotel_search_data.rooms.length > 1){
            hotel_search_data.rooms.splice(i,1);
            localStorage.setItem("hotel_search_obj", JSON.stringify(hotel_search_data));
            set_hotel_search_data({...hotel_search_data});
        }
    }

    const addRoomToHotelSearch = () => {
        if(returnHotelSearchTotalGuests().guests>(MAX_HOTEL_SEARCH_GUESTS-1)){
            alert(`Only a total of ${MAX_HOTEL_SEARCH_GUESTS} guests allowed`)
            return;
        }
        if(hotel_search_data.rooms.length < 4){
            hotel_search_data.rooms.push({
                total_adults: 1,
                children: []
            });
            localStorage.setItem("hotel_search_obj", JSON.stringify(hotel_search_data));
            set_hotel_search_data({...hotel_search_data});
        }
    }

    const changeChildAge = (e, i, j) => {
        if(e.target.value>17){
            return;
        }
        hotel_search_data.rooms[i].children[j].age=e.target.value;
        localStorage.setItem("hotel_search_obj", JSON.stringify(hotel_search_data));
        set_hotel_search_data({...hotel_search_data});
    }

    const toggleIncludeFlightsInHotelSearch = () => {
        hotel_search_data.flights.included=!hotel_search_data?.flights?.included;
        localStorage.setItem("hotel_search_obj", JSON.stringify(hotel_search_data));
        set_hotel_search_data({...hotel_search_data});
    }

    const toggleIncludeCarsInHotelSearch = () => {
        hotel_search_data.cars.included=!hotel_search_data?.cars?.included;
        localStorage.setItem("hotel_search_obj", JSON.stringify(hotel_search_data));
        set_hotel_search_data({...hotel_search_data});
    }

    const HOTEL_SEARCH_FORM_ROOMS_MARKUP = hotel_search_data.rooms.map((each, i) => {
        return (
            <>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 10}}>
                    <div style={{color: "rgba(0,0,0,0.7)", height: 30, fontFamily: "'Prompt', sans-serif", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                        Adults
                        <p style={{fontSize: 12, color: "rgba(0,0,0,0.6)"}}>18 and above</p>
                    </div>
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                        <div onClick={()=>removeAdultGuestToHotelSearch(i)} style={{cursor: "pointer", borderRadius: "100%", border: "1px solid rgba(0,0,0,0.3)", width: 35, height: 35, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                            -</div>
                        <div id="add_travelers_display_adults_number" style={{color: "rgba(0,0,0,0.7)", width: 40, height: 30, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                            {each?.total_adults}</div>
                        <div onClick={()=>addAdultGuestToHotelSearch(i)} style={{cursor: "pointer", borderRadius: "100%", border: "1px solid rgba(0,0,0,0.3)", width: 35, height: 35, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                            +</div>
                    </div>
                </div>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 10, borderRadius: 30}}>
                    <div style={{color: "rgba(0,0,0,0.7)", height: 30, fontFamily: "'Prompt', sans-serif", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                        Children
                        <p style={{fontSize: 12, color: "rgba(0,0,0,0.6)"}}>Ages 0 to 17</p>
                        </div>
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                        <div onClick={()=>removeChildGuestToHotelSearch(i)} style={{cursor: "pointer", borderRadius: "100%", border: "1px solid rgba(0,0,0,0.3)", width: 35, height: 35, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                            -</div>
                        <div id="add_travelers_display_children_number" style={{color: "rgba(0,0,0,0.7)", width: 40, height: 30, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                            {each?.children.length}</div>
                        <div onClick={()=>addChildGuestToHotelSearch(i)} style={{cursor: "pointer", borderRadius: "100%", border: "1px solid rgba(0,0,0,0.3)", width: 35, height: 35, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                            +</div>
                    </div>
                </div>
                <div style={{display: "flex", flexWrap: "wrap"}}>
                    {
                        each?.children?.map((child, j) => {
                            return <div style={{marginRight: 10}} key={(`ch_${i+j}`)}>
                                    <p style={{fontSize: 11, color: "rgba(0,0,0,0.8)", fontFamily: "'Prompt', Sans-serif"}}>
                                        Child {(j+1)} age:</p>
                                    <input 
                                        onChange={(e)=>changeChildAge(e, i, j)} 
                                        style={{padding: 5, width: 70, borderRadius: 8, fontSize: 11, border: "1px solid rgba(0,0,0,0.1)", fontFamily: "'Prompt', Sans-serif"}}
                                        value={child?.age} 
                                        type="number"
                                    />
                            </div>
                        })
                    }
                </div>
                {
                    (hotel_search_data.rooms.length > 1) &&
                    <p onClick={()=>removeRoomFromHotelSearch(i)} style={{cursor: "pointer", fontSize: 13, fontFamily: "'Prompt', Sans-serif", marginBottom: 20, marginTop: 10}}>
                        <i style={{color: "crimson", marginRight: 10}} 
                        className="far fa-trash-alt"></i>
                        Remove room
                    </p>
                }
            </>
        );
    });

    useEffect(()=>{
        let flight_search_data = JSON.parse(localStorage.getItem("search_obj"));
        DateChoosersInit(flight_search_data.type.toUpperCase());
        AutoCompleteInit();
        select_cabin_type(flight_search_data.itinerary.cabin.toLowerCase());
        select_trip_round(flight_search_data.type);
        // Setting travelers
        const travelers={};
        travelers.adults=flight_search_data.itinerary.travelers.adults;
        travelers.children=flight_search_data.itinerary.travelers.children;
        travelers.infants=flight_search_data.itinerary.travelers.infants;
        set_default_travelers(travelers);
        /*flight_search_data.itinerary.travelers.adults=1;
        flight_search_data.itinerary.travelers.children=0;
        flight_search_data.itinerary.travelers.infants=0;
        window.localStorage.setItem("search_obj", JSON.stringify(flight_search_data));*/

        // Hotel Search Form
        HotelSearchDatesChooserInit();
        HotelsAutoCompleteInit();

        // Setting current product type
        const PRODUCT_TYPE = localStorage.getItem(CONSTANTS.local_storage.product_type) || CONSTANTS.product_types.flights;
        change_product_type(parseInt(PRODUCT_TYPE));
        
    },[]);

    //const show_search_page=props.show_search_page;

    const isAllSearchInputsSet = () => {
        if(document.getElementById("search_forms_from_where_input_fld").value===""){
            document.getElementById("search_forms_from_where_input_fld").click();
            return false;
        }else if(document.getElementById("search_forms_to_where_input_fld").value===""){
            document.getElementById("search_forms_to_where_input_fld").click();
            return false;
        }else if(document.getElementById("departure_return_dates_input").value===""){
            document.getElementById("departure_return_dates_input").click();
            return false;
        }

        return true;
    }

    const searchOnSubmit = () => {
        if(isAllSearchInputsSet()){
            show_search_page();
            props.show_search_page();
        }
    }

    // Hotel Search On Submit
    const hotelSearchOnSubmit = () => {
        if(/*isAllSearchInputsSet()*/true){
            show_search_page();
            props.show_search_page();
        }
    }

    // Car Search On Submit
    const carSearchOnSubmit = () => {
        if(/*isAllSearchInputsSet()*/true){
            show_search_page();
            props.show_search_page();
        }
    }

    return(
        <div className="main-search-form">
            
            <div className="main_search_from_overall_container">
                <p style={{display: "none", margin: 15, fontFamily: "'Prompt', Sans-serif", fontWeight: 1000, color: "rgba(0,0,0,0.7)"}}>
                    Search Flights
                </p>
                <div>
                    <div style={{display: "flex", marginBottom: 10}}>
                        <div className="flights_hero_menu_item main" 
                            onClick={()=>{
                                change_product_type(CONSTANTS.product_types.flights);
                            }}
                            style={{cursor: "pointer", textAlign: "center", borderRadius: 50, border: "1px solid rgba(0,0,0,0.1)", 
                            background: ((productType===CONSTANTS.product_types.flights) ? "rgb(43, 52, 61)": "none"),
                            color: ((productType===CONSTANTS.product_types.flights) ? "rgb(169, 221, 255)" : "rgba(0,0,0,0.4)"), 
                            fontSize: 14, padding: "10px 25px", fontFamily: "'Prompt', Sans-serif"}}>
                            <i style={{marginRight: 10, fontSize: 12, 
                                color: ((productType===CONSTANTS.product_types.flights) ? "rgb(214, 106, 202)" : "rgba(0,0,0,0.4)")}} 
                                className="fa-solid fa-plane-departure"></i>
                            Flights</div>
                        <div className="stays_hero_menu_item main" 
                                onClick={()=>{
                                    change_product_type(CONSTANTS.product_types.stays);
                                    (CONSTANTS.disabled_features.stays_search) && show_prompt_on_Bot_AD_tips_popup(
                                        getBotResponse(CONSTANTS.bot.responses.no_hotel_booking), 
                                        CONSTANTS.bot.prompt_types.warn);
                                }}
                                style={{cursor: ((CONSTANTS.disabled_features.stays_search) ? "not-allowed" : "pointer"), textAlign: "center",
                                background: ((productType===CONSTANTS.product_types.stays) ? "rgb(43, 52, 61)": "none"),
                            color: ((productType===CONSTANTS.product_types.stays) ? "rgb(169, 221, 255)" : "rgba(0,0,0,0.4)"), 
                                marginLeft: 5, fontSize: 14, borderRadius: 50, border: "1px solid rgba(0,0,0,0.1)", padding: "10px 25px", fontFamily: "'Prompt', Sans-serif"}}>
                            <i style={{marginRight: 10, fontSize: 12,
                            color: ((productType===CONSTANTS.product_types.stays) ? "rgb(214, 106, 202)" : "rgba(0,0,0,0.4)")}} 
                            className="fa-solid fa-hotel"></i>
                            Stays</div>
                        <div className="cars_hero_menu_item main" 
                                onClick={()=>{
                                    change_product_type(CONSTANTS.product_types.rental_cars);
                                    (CONSTANTS.disabled_features.rental_car_search) && show_prompt_on_Bot_AD_tips_popup(
                                        getBotResponse(CONSTANTS.bot.responses.no_cars_renting),
                                        CONSTANTS.bot.prompt_types.warn);
                                }}
                                style={{cursor: ((CONSTANTS.disabled_features.rental_car_search) ? "not-allowed" : "pointer"), textAlign: "center", display: "block",
                                background: ((productType===CONSTANTS.product_types.rental_cars) ? "rgb(43, 52, 61)": "none"),
                                color: ((productType===CONSTANTS.product_types.rental_cars) ? "rgb(169, 221, 255)" : "rgba(0,0,0,0.4)"), 
                                marginLeft: 5, fontSize: 14, borderRadius: 50, border: "1px solid rgba(0,0,0,0.1)", padding: "10px 25px", fontFamily: "'Prompt', Sans-serif"}}>
                            <i style={{marginRight: 10, fontSize: 12,
                            color: ((productType===CONSTANTS.product_types.rental_cars) ? "rgb(214, 106, 202)" : "rgba(0,0,0,0.4)")}} 
                            className="fa-solid fa-car"></i>
                            Cars</div>
                    </div>
                </div>
                {/** Flight Search Forms */}
                <div style={{display: (productType===CONSTANTS.product_types.flights) ? "block" : "none"}}>
                    <div className="two-search-inputs-container">
                        <div className="each_flex-side first">
                            <div className="forms_class_guests_cabin_settings_container">
                                <div id="forms_main_class_guests_cabin_settings_pane" className="forms_class_guests_cabin_settings_pane"  style={{borderRadius: 8}}>
                                    <p onClick={()=>document.getElementById("forms_main_class_guests_cabin_settings_pane").style.display = "none"} className="airports_auto_complete_close_btn">&times;</p>
                                    <div id="add_travelers_settings_pane" style={{padding: 15, display: "none"}}>
                                        <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', sans-serif", fontWeight: "bolder", fontSize: 17, marginTop: 10, marginBottom: 20}}>
                                            Add Travelers</p>
                                        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 10}}>
                                            <div style={{color: "rgba(0,0,0,0.7)", height: 30, fontFamily: "'Prompt', sans-serif", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                                Adults
                                                <p style={{fontSize: 12, color: "rgba(0,0,0,0.6)"}}>18 and above</p>
                                            </div>
                                            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                                                <div onClick={()=>remove_traveler("adult")} style={{cursor: "pointer", borderRadius: "100%", border: "1px solid rgba(0,0,0,0.3)", width: 35, height: 35, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                                    -</div>
                                                <div id="add_travelers_display_adults_number" style={{color: "rgba(0,0,0,0.7)", width: 40, height: 30, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                                    1</div>
                                                <div onClick={()=>add_traveler("adult")} style={{cursor: "pointer", borderRadius: "100%", border: "1px solid rgba(0,0,0,0.3)", width: 35, height: 35, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                                    +</div>
                                            </div>
                                        </div>
                                        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 10, borderRadius: 30}}>
                                            <div style={{color: "rgba(0,0,0,0.7)", height: 30, fontFamily: "'Prompt', sans-serif", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                                Children
                                                <p style={{fontSize: 12, color: "rgba(0,0,0,0.6)"}}>Ages 2 to 17</p>
                                                </div>
                                            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                                                <div onClick={()=>remove_traveler("child")} style={{cursor: "pointer", borderRadius: "100%", border: "1px solid rgba(0,0,0,0.3)", width: 35, height: 35, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                                    -</div>
                                                <div id="add_travelers_display_children_number" style={{color: "rgba(0,0,0,0.7)", width: 40, height: 30, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                                    0</div>
                                                <div onClick={()=>add_traveler("child")} style={{cursor: "pointer", borderRadius: "100%", border: "1px solid rgba(0,0,0,0.3)", width: 35, height: 35, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                                    +</div>
                                            </div>
                                        </div>
                                        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 10, borderRadius: 30}}>
                                            <div style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', sans-serif", height: 30, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                                Infants
                                                <p style={{fontSize: 12, color: "rgba(0,0,0,0.6)"}}>Younger than 2</p>
                                            </div>
                                            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                                                <div onClick={()=>remove_traveler("infant")} style={{cursor: "pointer", borderRadius: "100%", border: "1px solid rgba(0,0,0,0.3)", width: 35, height: 35, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                                    -</div>
                                                <div id="add_travelers_display_infants_number" style={{color: "rgba(0,0,0,0.7)", width: 40, height: 30, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                                    0</div>
                                                <div onClick={()=>add_traveler("infant")} style={{cursor: "pointer", borderRadius: "100%", border: "1px solid rgba(0,0,0,0.3)", width: 35, height: 35, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                                    +</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="select_cabin_settings_pane" style={{padding: 15, display: "none"}}>
                                        <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', sans-serif", fontWeight: "bolder", marginTop: 10, marginBottom: 20}}>
                                            Select Cabin</p>
                                        <div onClick={()=>{}/*select_cabin_type("cheapest")*/} style={{display: "flex", display: "none", flexDirection: "row", justifyContent: "space-between", marginBottom: 10}}>
                                            <label htmlFor="select_cabin_cheapest_chk"><div style={{cursor: "not-allowed", color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', sans-serif", height: 30, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                                Cheapest</div></label>
                                            <div style={{height: 30, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                                <input className="select_cabin_type_chk" disabled={true} id="select_cabin_cheapest_chk" style={{width: 20, height: 20}} type="radio" defaultChecked/>
                                            </div>
                                        </div>
                                        <div onClick={()=>select_cabin_type("economy")} style={{cursor: "pointer", display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 10}}>
                                            <label htmlFor="select_cabin_economy_chk"><div style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', sans-serif", height: 30, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                                Economy</div></label>
                                            <div style={{height: 30, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                                <input className="select_cabin_type_chk" id="select_cabin_economy_chk" style={{width: 20, height: 20}} type="radio"/>
                                            </div>
                                        </div>
                                        <div onClick={()=>select_cabin_type("premium")} style={{cursor: "pointer", display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 10}}>
                                            <label htmlFor="select_cabin_premium_chk"><div style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', sans-serif", height: 30, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                                Premium</div></label>
                                            <div style={{height: 30, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                                <input className="select_cabin_type_chk" id="select_cabin_premium_chk" style={{width: 20, height: 20}} type="radio"/>
                                            </div>
                                        </div>
                                        <div onClick={()=>select_cabin_type("business")} style={{cursor: "pointer", display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 10}}>
                                            <label htmlFor="select_cabin_business_chk"><div style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', sans-serif", height: 30, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                                Business</div></label>
                                            <div style={{height: 30, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                                <input className="select_cabin_type_chk" id="select_cabin_business_chk" style={{width: 20, height: 20}} type="radio" />
                                            </div>
                                        </div>
                                        <div onClick={()=>select_cabin_type("first")} style={{cursor: "pointer", display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 10}}>
                                            <label htmlFor="select_cabin_first_chk"><div style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', sans-serif", height: 30, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                                First</div></label>
                                            <div style={{height: 30, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                                <input className="select_cabin_type_chk" id="select_cabin_first_chk" style={{width: 20, height: 20}} type="radio" />
                                            </div>
                                        </div>
                                    </div>
                                    <div id="select_trip_round_settings_pane" style={{padding: 15, display: "none"}}>
                                        <p style={{color: "rgba(0,0,0,0.7)", fontWeight: "bolder", marginTop: 10, marginBottom: 20, fontFamily: "'Prompt', sans-serif"}}>
                                            Select Trip Round</p>
                                        <div onClick={()=>select_trip_round("round-trip")} style={{cursor: "pointer", display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 10}}>
                                            <label htmlFor="trip_round_round_trip_chk"><div style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', sans-serif", height: 30, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                                Round-trip</div></label>
                                            <div style={{height: 30, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                                <input className="select_trip_round_chk" id="trip_round_round_trip_chk" style={{width: 20, height: 20}} type="radio" />
                                            </div>
                                        </div>
                                        <div onClick={()=>select_trip_round("one-way")} style={{cursor: "pointer", display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 10}}>
                                            <label htmlFor="trip_round_one_way_chk"><div style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', sans-serif", height: 30, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                                One-way</div></label>
                                            <div style={{height: 30, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                                <input className="select_trip_round_chk" id="trip_round_one_way_chk" style={{width: 20, height: 20}} type="radio" defaultChecked />
                                            </div>
                                        </div>
                                        <div onClick={()=>{}/*()=>select_trip_round("multi-city")*/} style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 10}}>
                                            <label htmlFor="trip_round_multi_city_chk"><div style={{cursor: "not-allowed", color: "rgba(0,0,0,0.2)", fontFamily: "'Prompt', sans-serif", height: 30, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                                Multi-city</div></label>
                                            <div style={{height: 30, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                                <input className="select_trip_round_chk" id="trip_round_multi_city_chk" disabled={true} style={{width: 20, height: 20}} type="radio" />
                                            </div>
                                        </div>
                                    </div>
                                    <div onClick={()=>document.getElementById("forms_main_class_guests_cabin_settings_pane").style.display = "none"} style={{cursor: "pointer", padding: 10, margin: 10, marginTop: 0, backgroundColor: "rgb(23, 87, 148)", color: "white", textAlign: "center", borderRadius: 50, textAlign: "center"}}>
                                        Done
                                    </div>
                                </div>
                                <div id="select_cabin_type_main_input_display" onClick={show_cabin_settings_pane} className="searchFormChkInputLbl" style={{marginRight: 5, border: "none", backgroundColor: "rgba(0,0,0,0.07)", borderRadius: 8}}>
                                    <i style={{fontSize: 15, marginRight: 10}} className="fa fa-level-up"></i>
                                    Cheapest
                                </div>
                                <div id="add_travelers_main_input_display" onClick={show_travelers_settings_pane} className="searchFormChkInputLbl" style={{marginRight: 5, border: "none", backgroundColor: "rgba(0,0,0,0.07)", borderRadius: 8}}>
                                    <i style={{fontSize: 15, marginRight: 10}} className="fa fa-user"></i>
                                    1 Adult
                                </div>
                                <div id="select_trip_round_main_input_display" onClick={show_trip_round_settings_pane} className="searchFormChkInputLbl" style={{border: "none", backgroundColor: "rgba(0,0,0,0.07)", borderRadius: 8}}>
                                    <i style={{fontSize: 15, marginRight: 10}} className="fa fa-repeat"></i>
                                    One-way
                                </div>
                                {/*<i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>*/}
                            </div>
                        </div>
                        <div className="each_flex-side">
                            <div style={{width: "100%"}}>
                                <div className="main-search_txt_input" style={{border: "none", position: "relative", backgroundColor: "rgba(0,0,0,0.07)", borderRadius: 8, marginBottom: 5}}>
                                    <i style={{fontSize: 20, marginRight: 5}} className="fa-solid fa-calendar-days"></i>
                                    <input id="departure_return_dates_input" type="text" readOnly="true" placeholder="departure - return"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="two-search-inputs-container">
                            <div style={{position: "relative"}} className="search_forms_from_where_input_fld_container each_flex-side">
                                <div id="from_where_airports_auto_complete_input" className="airports_inputs_with_auto_complete" style={{borderRadius: 30}}>
                                    <p onClick={()=>document.getElementById("from_where_airports_auto_complete_input").style.display = "none"} className="airports_auto_complete_close_btn">&times;</p>
                                    <input autoComplete="off" id="from_where_airports_auto_complete_input_fld" 
                                        onBlur={()=>{
                                            setTimeout(()=>document.getElementById("from_where_airports_auto_complete_input").style.display = "none",
                                                200);
                                        }} className="airports_auto_complete_input" type="text" placeholder="Where are you leaving from?"/>
                                    <div className="airports_auto_complete_list_container">
                                        <ul id="flights_auto_complete_from_where_input_list">
                                            
                                        </ul>
                                    </div>
                                </div>
                                <div className="main-search_txt_input" style={{border: "none"}}>
                                    <i style={{fontSize: 20, marginRight: 5}} className="fa-solid fa-plane-departure"></i>
                                    <input id="search_forms_from_where_input_fld" onClick={open_from_where_auto_complete_pane} type="text" readOnly autoComplete="off" placeholder="from where?" />
                                </div>
                            </div>
                            <div id="main_switch_inputs_btn" className="switchinputsBtn"
                                onClick={switch_airports_input_values}>
                                <p style={{textAlign: "center"}}>
                                    <i className="fa fa-exchange"></i>
                                </p>
                            </div>
                            <div className="search_forms_to_where_input_fld_container each_flex-side">
                                <div id="to_where_airports_auto_complete_input" className="airports_inputs_with_auto_complete" style={{borderRadius: 30}}>
                                    <p onClick={()=>document.getElementById("to_where_airports_auto_complete_input").style.display = "none"} className="airports_auto_complete_close_btn">&times;</p>
                                    <input autoComplete="off" id="to_where_airports_auto_complete_input_fld" 
                                        onBlur={()=>{
                                            setTimeout(()=>document.getElementById("to_where_airports_auto_complete_input").style.display = "none",
                                                200);
                                        }} className="airports_auto_complete_input" type="text" placeholder="Where are you going to?"/>
                                    <div className="airports_auto_complete_list_container">
                                        <ul id="flights_auto_complete_to_where_input_list">
                                            <li><div style={{padding: 10, display: "flex", flexDirection: "row", cursor: "pointer"}}>
                                                <div style={{height: 35, marginRight: 15, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                                    <i className="fa fa-history" style={{color: "rgba(0,0,0,0.3)", fontSize: 22}}></i>
                                                </div>
                                                <div>
                                                    <div>
                                                        <p style={{fontSize: 14, fontWeight: "bolder", color: "rgba(0,0,0,0.8)"}}>
                                                            New York (LGA - Laguardia)
                                                        </p>
                                                        <p style={{fontSize: 14, color: "rgba(0,0,0,0.8)"}}>
                                                            United States
                                                        </p>
                                                    </div>
                                                </div>
                                            </div></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="main-search_txt_input" style={{border: "none", backgroundColor: "rgba(0,0,0,0.07)", borderRadius: 8}}>
                                    <i style={{fontSize: 20, marginRight: 5}} className="fa-solid fa-plane-arrival"></i>
                                    <input id="search_forms_to_where_input_fld" onClick={open_to_where_auto_complete_pane} type="text" readOnly autoComplete="off" placeholder="to where?" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 10}}>
                        <div onClick={()=>show_home_page(true)} className="searchBtn" style={{backgroundColor: "crimson", boxShadow: "0 0 5px rgba(0,0,0,0.3)", border: "none", borderRadius: 50}}>
                            <i className="fa fa-times" style={{marginRight: 5, color: "rgba(255,255,255,0.5)"}}></i>Close
                        </div>
                        <div onClick={searchOnSubmit} id="home_search_form_submit_btn" className="searchBtn" style={{boxShadow: "0 0 5px rgba(0,0,0,0.3)", border: "none", borderRadius: 50}}>
                            <i className="fa fa-search" style={{marginRight: 5, color: "rgba(255,255,255,0.4)"}}></i>Search
                        </div>
                    </div>
                </div>

                {/** Hotel Search Forms */}
                <div style={{display: (productType===CONSTANTS.product_types.stays) ? "block" : "none"}}>
                    {
                       (CONSTANTS.disabled_features.stays_search) && <div style={{padding: "50px 10px", background: "rgba(0,0,0,0.07)", borderRadius: 8}}>
                            <p style={{marginBottom: 5, fontFamily: "'Prompt', Sans-serif", fontWeight: 1000, color: "rgba(0,0,0,0.7)"}}>
                                <i style={{color: "green", marginRight: 10}} className="fa-solid fa-check"></i>
                                Your favorite hotels are in the pipeline:
                            </p>
                            <div style={{display: "flex"}}>
                                <p style={{marginRight: 10, fontFamily: "'Prompt', Sans-serif", fontSize: 13, color: "rgba(0,0,0,0.7)"}}>
                                    <i style={{color: "red"}} className="fa-solid fa-exclamation-triangle"></i>
                                </p>
                                <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 13, color: "rgba(0,0,0,0.7)"}}>
                                    We are still working to enable hotel booking. We apologize for this inconvenience
                                </p>
                            </div>
                        </div>
                    }
                    {
                        (!CONSTANTS.disabled_features.stays_search) && <> 
                            <div className="two-search-inputs-container">
                                <div className="search_forms_from_where_input_fld_container each_flex-side">
                                    <div style={{padding: 18, display: "flex", alignItems: "center", borderRadius: 8, marginBottom: 5, background: "rgba(0,0,0,0.07)"}}>
                                        <div id="hotel_forms_main_class_guests_cabin_settings_pane" className="forms_class_guests_cabin_settings_pane"  style={{borderRadius: 8, maxWidth: 600}}>
                                            <p onClick={()=>document.getElementById("hotel_forms_main_class_guests_cabin_settings_pane").style.display = "none"} className="airports_auto_complete_close_btn">&times;</p>
                                            <div style={{padding: 15}}>
                                                <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', sans-serif", fontWeight: "bolder", fontSize: 17, marginTop: 10, marginBottom: 20}}>
                                                    Add Rooms and Guests</p>
                                                <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 13, paddingBottom: 20, color: "green"}}>
                                                    {returnHotelSearchTotalGuests().guests}
                                                    {(returnHotelSearchTotalGuests().guests>1) ? " Guests, " : " Guest, "}
                                                    {returnHotelSearchTotalGuests().rooms}
                                                    {(returnHotelSearchTotalGuests().rooms>1) ? " Rooms" : " Room"}
                                                </p>
                                                {HOTEL_SEARCH_FORM_ROOMS_MARKUP.map(each=>each)}
                                                <p onClick={addRoomToHotelSearch} style={{fontFamily: "'Prompt', Sans-serif", fontSize: 14, textAlign: "right", padding: "10px 0", cursor: "pointer", color: "rgb(23, 87, 148)", fontWeight: "bolder"}}>
                                                    <i style={{color: "green", marginRight: 10}} className="fa-solid fa-plus"></i>
                                                    Add room</p>
                                            </div>
                                            <div onClick={()=>document.getElementById("hotel_forms_main_class_guests_cabin_settings_pane").style.display = "none"} style={{cursor: "pointer", padding: 10, margin: 10, marginTop: 0, backgroundColor: "rgb(23, 87, 148)", color: "white", textAlign: "center", borderRadius: 50, textAlign: "center"}}>
                                                    Done
                                                </div>
                                        </div>
                                        <div onClick={()=>document.getElementById("hotel_forms_main_class_guests_cabin_settings_pane").style.display="block"} style={{display: "flex", cursor: "pointer", marginRight: 20}}>
                                            <div style={{marginRight: 10}}>
                                                <i style={{color: "rgb(23, 87, 148)", fontSize: 20}} className="fa-solid fa-user"></i>
                                            </div>
                                            <div>
                                                <p style={{color: "rgba(0,0,0,0.8)", fontFamily: "'Prompt', Sans-serif", fontSize: 12}}>
                                                    {returnHotelSearchTotalGuests().guests}
                                                    {(returnHotelSearchTotalGuests().guests>1) ? " Guests" : " Guest"}
                                                </p>
                                            </div>
                                        </div>
                                        <div style={{display: "flex", flexDirection: "row"}}>
                                            <input 
                                                checked={hotel_search_data.flights.included}
                                                id="hotel_search_form_add_flight_toggle" 
                                                className="cm-toggle hotel_search_form_toggle" 
                                                onChange={toggleIncludeFlightsInHotelSearch} style={{marginRight: 10}} type="checkbox" />
                                            <label htmlFor="hotel_search_form_add_flight_toggle">
                                                <p style={{color: "rgba(0,0,0,0.8)", fontFamily: "'Prompt', Sans-serif", fontSize: 12}}>
                                                    Add Flight    
                                                </p>
                                            </label>
                                        </div>
                                        <div style={{display: "flex", flexDirection: "row", marginLeft: 20}}>
                                            <input 
                                                checked={hotel_search_data.cars.included}
                                                id="hotel_search_form_add_car_toggle" 
                                                className="cm-toggle hotel_search_form_toggle" 
                                                onChange={toggleIncludeCarsInHotelSearch} style={{marginRight: 10}} 
                                                type="checkbox" 
                                            />
                                            <label htmlFor="hotel_search_form_add_car_toggle">
                                                <p style={{color: "rgba(0,0,0,0.8)", fontFamily: "'Prompt', Sans-serif", fontSize: 12}}>
                                                    Add Car    
                                                </p>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="search_forms_to_where_input_fld_container each_flex-side">
                                    {
                                        (!hotel_search_data.flights.included) && <div style={{position: "absolute", height: "100%", width: "100%", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center"}}>
                                        </div>
                                    }
                                    <div id="hotel_from_where_city_auto_complete_input" className="airports_inputs_with_auto_complete" style={{borderRadius: 30}}>
                                        <p onClick={()=>document.getElementById("hotel_from_where_city_auto_complete_input").style.display = "none"} className="airports_auto_complete_close_btn">&times;</p>
                                        <input autoComplete="off" id="hotel_from_where_city_auto_complete_input_fld" 
                                            onBlur={()=>{
                                                setTimeout(()=>document.getElementById("hotel_from_where_city_auto_complete_input").style.display = "none",
                                                    200);
                                            }} className="airports_auto_complete_input" type="text" placeholder="Where are you leaving from?"/>
                                        <div className="airports_auto_complete_list_container">
                                            <ul id="hotels_auto_complete_from_where_input_list">
                                                <li><div style={{padding: 10, display: "flex", flexDirection: "row", cursor: "pointer"}}>
                                                    <div style={{height: 35, marginRight: 15, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                                        <i className="fa fa-history" style={{color: "rgba(0,0,0,0.3)", fontSize: 22}}></i>
                                                    </div>
                                                    <div>
                                                        <div>
                                                            <p style={{fontSize: 14, fontWeight: "bolder", color: "rgba(0,0,0,0.8)"}}>
                                                                New York (LGA - Laguardia)
                                                            </p>
                                                            <p style={{fontSize: 14, color: "rgba(0,0,0,0.8)"}}>
                                                                United States
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="main-search_txt_input" style={{border: "none", 
                                        backgroundColor: (!hotel_search_data.flights.included) ? "rgba(0,255,0,0.2)" : "rgba(0,0,0,0.07)", borderRadius: 8}}>
                                        <i style={{fontSize: 20, marginRight: 5}} 
                                            className={(!hotel_search_data.flights.included) ? "fa-solid fa-info-circle" : "fa fa-map-marker"}></i>
                                        <input id="hotel_search_forms_from_where_input_fld" onClick={open_hotels_from_where_auto_complete_pane} type="text" readOnly autoComplete="off" 
                                            placeholder="Where are you leaving from?" value={(!hotel_search_data.flights.included) ? "Flight not included..." : ""} />
                                    </div>
                                </div>
                            </div>
                            <div className="two-search-inputs-container">
                                <div className="search_forms_from_where_input_fld_container each_flex-side">
                                    <div id="hotel_to_where_city_auto_complete_input" className="airports_inputs_with_auto_complete" style={{borderRadius: 30}}>
                                        <p onClick={()=>document.getElementById("hotel_to_where_city_auto_complete_input").style.display = "none"} className="airports_auto_complete_close_btn">&times;</p>
                                        <input autoComplete="off" id="hotel_to_where_city_auto_complete_input_fld" 
                                            onBlur={()=>{
                                                setTimeout(()=>document.getElementById("hotel_to_where_city_auto_complete_input").style.display = "none",
                                                    200);
                                            }} className="airports_auto_complete_input" type="text" placeholder="Where are you traveling to?"/>
                                        <div className="airports_auto_complete_list_container">
                                            <ul id="hotels_auto_complete_to_where_input_list">
                                                <li><div style={{padding: 10, display: "flex", flexDirection: "row", cursor: "pointer"}}>
                                                    <div style={{height: 35, marginRight: 15, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                                        <i className="fa fa-history" style={{color: "rgba(0,0,0,0.3)", fontSize: 22}}></i>
                                                    </div>
                                                    <div>
                                                        <div>
                                                            <p style={{fontSize: 14, fontWeight: "bolder", color: "rgba(0,0,0,0.8)"}}>
                                                                New York (LGA - Laguardia)
                                                            </p>
                                                            <p style={{fontSize: 14, color: "rgba(0,0,0,0.8)"}}>
                                                                United States
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="main-search_txt_input" style={{border: "none", backgroundColor: "rgba(0,0,0,0.07)", borderRadius: 8}}>
                                        <i style={{fontSize: 20, marginRight: 5}} className="fa fa-map-marker"></i>
                                        <input id="hotel_search_forms_to_where_input_fld" onClick={open_hotels_to_where_auto_complete_pane} type="text" readOnly autoComplete="off" 
                                        placeholder="Where are you traveling to?" />
                                    </div>
                                </div>
                                <div style={{position: "relative"}} className="search_forms_to_where_input_fld_container each_flex-side">
                                    <div className="main-search_txt_input" style={{border: "none", position: "relative", backgroundColor: "rgba(0,0,0,0.07)", borderRadius: 8, marginBottom: 5}}>
                                        <i style={{fontSize: 20, marginRight: 5}} className="fa-solid fa-calendar-days"></i>
                                        <input id="checkin_checkout_dates_input" type="text" readOnly="true" 
                                            placeholder="checkin - checkout dates"/>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 10}}>
                        <div onClick={()=>show_home_page(true)} className="searchBtn" style={{backgroundColor: "crimson", boxShadow: "0 0 5px rgba(0,0,0,0.3)", border: "none", borderRadius: 50}}>
                            <i className="fa fa-times" style={{marginRight: 5, color: "rgba(255,255,255,0.5)"}}></i>Close
                        </div>
                        {
                            (!CONSTANTS.disabled_features.stays_search) &&
                                <div onClick={hotelSearchOnSubmit} id="home_search_form_submit_btn" className="searchBtn" style={{boxShadow: "0 0 5px rgba(0,0,0,0.3)", border: "none", borderRadius: 50}}>
                                    <i className="fa fa-search" style={{marginRight: 5, color: "rgba(255,255,255,0.4)"}}></i>Search
                                </div>
                        }
                    </div>
                </div>

                {/** Rental Cars Search Forms */}
                <div style={{display: (productType===CONSTANTS.product_types.rental_cars) ? "block" : "none"}}>
                    {
                        (CONSTANTS.disabled_features.rental_car_search) && <div style={{padding: "50px 10px", background: "rgba(0,0,0,0.07)", borderRadius: 8}}>
                            <p style={{marginBottom: 5, fontFamily: "'Prompt', Sans-serif", fontWeight: 1000, color: "rgba(0,0,0,0.7)"}}>
                                <i style={{color: "green", marginRight: 10}} className="fa-solid fa-check"></i>
                                Your favorite rental cars in pipeline:
                            </p>
                            <div style={{display: "flex"}}>
                                <p style={{marginRight: 10, fontFamily: "'Prompt', Sans-serif", fontSize: 13, color: "rgba(0,0,0,0.7)"}}>
                                    <i style={{color: "red"}} className="fa-solid fa-exclamation-triangle"></i>
                                </p>
                                <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 13, color: "rgba(0,0,0,0.7)"}}>
                                    We are still working to enable rental cars. We apologize for this inconvenience
                                </p>
                            </div>
                        </div>
                    }
                    {
                        (!CONSTANTS.disabled_features.rental_car_search) && <>
                            <div className="two-search-inputs-container">
                                <div className="search_forms_from_where_input_fld_container each_flex-side">
                                    <div style={{padding: 18, display: "flex", alignItems: "center", borderRadius: 8, marginBottom: 5, background: "rgba(0,0,0,0.07)"}}>
                                        <div id="test_hotel_forms_main_class_guests_cabin_settings_pane" className="forms_class_guests_cabin_settings_pane"  style={{borderRadius: 8, maxWidth: 600}}>
                                            <p onClick={()=>document.getElementById("test_hotel_forms_main_class_guests_cabin_settings_pane").style.display = "none"} className="airports_auto_complete_close_btn">&times;</p>
                                            <div style={{padding: 15}}>
                                                <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', sans-serif", fontWeight: "bolder", fontSize: 17, marginTop: 10, marginBottom: 20}}>
                                                    Test Title</p>
                                            </div>
                                            <div onClick={()=>document.getElementById("test_hotel_forms_main_class_guests_cabin_settings_pane").style.display = "none"} style={{cursor: "pointer", padding: 10, margin: 10, marginTop: 0, backgroundColor: "rgb(23, 87, 148)", color: "white", textAlign: "center", borderRadius: 50, textAlign: "center"}}>
                                                Done
                                            </div>
                                        </div>
                                        <div onClick={()=>document.getElementById("test_hotel_forms_main_class_guests_cabin_settings_pane").style.display="block"} style={{display: "flex", cursor: "pointer", marginRight: 20}}>
                                            <div style={{marginRight: 10}}>
                                                <i style={{color: "rgb(23, 87, 148)", fontSize: 20}} className="fa-solid fa-user"></i>
                                            </div>
                                            <div>
                                                <p style={{color: "rgba(0,0,0,0.8)", fontFamily: "'Prompt', Sans-serif", fontSize: 12}}>
                                                    Discount Codes
                                                </p>
                                            </div>
                                        </div>
                                        <div style={{display: "flex", flexDirection: "row", marginLeft: 20}}>
                                            <input 
                                                checked={hotel_search_data.cars.included}
                                                id="hotel_search_form_add_car_toggle" 
                                                className="cm-toggle hotel_search_form_toggle" 
                                                onChange={toggleIncludeCarsInHotelSearch} style={{marginRight: 10}} 
                                                type="checkbox" 
                                            />
                                            <label htmlFor="hotel_search_form_add_car_toggle">
                                                <p style={{color: "rgba(0,0,0,0.8)", fontFamily: "'Prompt', Sans-serif", fontSize: 12}}>
                                                    Show AARP Rates
                                                </p>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div style={{position: "relative"}} className="search_forms_to_where_input_fld_container each_flex-side">
                                    <div className="main-search_txt_input" style={{border: "none", position: "relative", backgroundColor: "rgba(0,0,0,0.07)", borderRadius: 8, marginBottom: 5}}>
                                        <i style={{fontSize: 20, marginRight: 5}} className="fa-solid fa-calendar-days"></i>
                                        <input id="test_checkin_checkout_dates_input" type="text" readOnly="true" 
                                            placeholder="Dates"/>
                                    </div>
                                </div>
                            </div>
                            <div className="two-search-inputs-container">
                                <div className="search_forms_from_where_input_fld_container each_flex-side">
                                    <div id="rental_car_pickup_auto_complete_input" className="airports_inputs_with_auto_complete" style={{borderRadius: 30}}>
                                        <p onClick={()=>document.getElementById("rental_car_pickup_auto_complete_input").style.display = "none"} className="airports_auto_complete_close_btn">&times;</p>
                                        <input autoComplete="off" id="rental_car_pickup_auto_complete_input_fld" 
                                            onBlur={()=>{
                                                setTimeout(()=>document.getElementById("rental_car_pickup_auto_complete_input").style.display = "none",
                                                    200);
                                            }} className="airports_auto_complete_input" type="text" placeholder="Pick Up?"/>
                                        <div className="airports_auto_complete_list_container">
                                            <ul id="rental_car_pickup_auto_complete_pickup_location_input_list">
                                                <li><div style={{padding: 10, display: "flex", flexDirection: "row", cursor: "pointer"}}>
                                                    <div style={{height: 35, marginRight: 15, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                                        <i className="fa fa-history" style={{color: "rgba(0,0,0,0.3)", fontSize: 22}}></i>
                                                    </div>
                                                    <div>
                                                        <div>
                                                            <p style={{fontSize: 14, fontWeight: "bolder", color: "rgba(0,0,0,0.8)"}}>
                                                                New York (LGA - Laguardia)
                                                            </p>
                                                            <p style={{fontSize: 14, color: "rgba(0,0,0,0.8)"}}>
                                                                United States
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="main-search_txt_input" style={{border: "none", backgroundColor: "rgba(0,0,0,0.07)", borderRadius: 8}}>
                                        <i style={{fontSize: 20, marginRight: 5}} className="fa fa-map-marker"></i>
                                        <input id="rental_car_search_forms_pickup_input_fld" onClick={open_cars_pickup_auto_complete_pane} type="text" readOnly autoComplete="off" 
                                        placeholder="Pick Up?" />
                                    </div>
                                </div>
                                <div className="search_forms_to_where_input_fld_container each_flex-side">
                                    <div id="rental_car_drop_off_auto_complete_input" className="airports_inputs_with_auto_complete" style={{borderRadius: 30}}>
                                        <p onClick={()=>document.getElementById("rental_car_drop_off_auto_complete_input").style.display = "none"} className="airports_auto_complete_close_btn">&times;</p>
                                        <input autoComplete="off" id="rental_car_drop_off_auto_complete_input_fld" 
                                            onBlur={()=>{
                                                setTimeout(()=>document.getElementById("rental_car_drop_off_auto_complete_input").style.display = "none",
                                                    200);
                                            }} className="airports_auto_complete_input" type="text" placeholder="Drop Off?"/>
                                        <div className="airports_auto_complete_list_container">
                                            <ul id="rental_car_drop_off_auto_complete_from_where_input_list">
                                                <li><div style={{padding: 10, display: "flex", flexDirection: "row", cursor: "pointer"}}>
                                                    <div style={{height: 35, marginRight: 15, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                                        <i className="fa fa-history" style={{color: "rgba(0,0,0,0.3)", fontSize: 22}}></i>
                                                    </div>
                                                    <div>
                                                        <div>
                                                            <p style={{fontSize: 14, fontWeight: "bolder", color: "rgba(0,0,0,0.8)"}}>
                                                                New York (LGA - Laguardia)
                                                            </p>
                                                            <p style={{fontSize: 14, color: "rgba(0,0,0,0.8)"}}>
                                                                United States
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="main-search_txt_input" style={{border: "none", 
                                        backgroundColor: "rgba(0,0,0,0.07)", borderRadius: 8}}>
                                        <i style={{fontSize: 20, marginRight: 5}} 
                                            className="fa fa-map-marker"></i>
                                        <input id="rental_car_search_forms_drop_off_input_fld" onClick={open_cars_drop_off_auto_complete_pane} type="text" readOnly autoComplete="off" 
                                            placeholder="Drop Off?" value="" />
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 10}}>
                        <div onClick={()=>show_home_page(true)} className="searchBtn" style={{backgroundColor: "crimson", boxShadow: "0 0 5px rgba(0,0,0,0.3)", border: "none", borderRadius: 50}}>
                            <i className="fa fa-times" style={{marginRight: 5, color: "rgba(255,255,255,0.5)"}}></i>Close
                        </div>
                        {
                            (!CONSTANTS.disabled_features.rental_car_search) &&
                                <div onClick={carSearchOnSubmit} id="home_search_form_submit_btn" className="searchBtn" style={{boxShadow: "0 0 5px rgba(0,0,0,0.3)", border: "none", borderRadius: 50}}>
                                    <i className="fa fa-search" style={{marginRight: 5, color: "rgba(255,255,255,0.4)"}}></i>Search
                                </div>
                        }
                    </div>
                </div>
                
            </div>
            
        </div>
    );
}

let switch_btn_switched = false
function switch_input_rotate_func(){
    //let currentRotateValue=document.getElementById("main_switch_inputs_btn").style.transform.replace( /\D+/g, '');
    let INITIAL_ROTATE=0;
    let FINAL_ROTATE=360;
    if(global.$(window).width()<=CONSTANTS.viewport_threshold){
        INITIAL_ROTATE=90;
        FINAL_ROTATE=270;
    }
    if(!switch_btn_switched){
        document.getElementById("main_switch_inputs_btn").style.transform = "rotate("+FINAL_ROTATE+"deg)";
        switch_btn_switched = true;
    }else{
        document.getElementById("main_switch_inputs_btn").style.transform = "rotate("+INITIAL_ROTATE+"deg)";
        switch_btn_switched = false;
    }
    
}
function switch_airports_input_values(){
    let from_airport_value = document.getElementById("search_forms_from_where_input_fld").value;
    document.getElementById("search_forms_from_where_input_fld").value = document.getElementById("search_forms_to_where_input_fld").value;
    document.getElementById("search_forms_to_where_input_fld").value = from_airport_value;
    switch_input_rotate_func();

    let flight_search_data = JSON.parse(localStorage.getItem("search_obj"));
    let temp_iata = flight_search_data.itinerary.departure.airport;
    flight_search_data.itinerary.departure.airport = flight_search_data.itinerary.arrival.airport;
    flight_search_data.itinerary.arrival.airport = temp_iata;
    window.localStorage.setItem("search_obj", JSON.stringify(flight_search_data));

}

function open_to_where_auto_complete_pane(){
    document.getElementById("to_where_airports_auto_complete_input").style.display = "block";
    document.getElementById("to_where_airports_auto_complete_input_fld").focus();
}
function open_hotels_to_where_auto_complete_pane(){
    document.getElementById("hotel_to_where_city_auto_complete_input").style.display = "block";
    document.getElementById("hotel_to_where_city_auto_complete_input_fld").focus();
}
function open_cars_drop_off_auto_complete_pane(){
    document.getElementById("rental_car_drop_off_auto_complete_input").style.display = "block";
    document.getElementById("rental_car_drop_off_auto_complete_input_fld").focus();
}
function open_from_where_auto_complete_pane(){
    document.getElementById("from_where_airports_auto_complete_input").style.display = "block"
    document.getElementById("from_where_airports_auto_complete_input_fld").focus();
}
function open_hotels_from_where_auto_complete_pane(){
    document.getElementById("hotel_from_where_city_auto_complete_input").style.display = "block";
    document.getElementById("hotel_from_where_city_auto_complete_input_fld").focus();
}
function open_cars_pickup_auto_complete_pane(){
    document.getElementById("rental_car_pickup_auto_complete_input").style.display = "block";
    document.getElementById("rental_car_pickup_auto_complete_input_fld").focus();
}
function show_trip_round_settings_pane(){
    document.getElementById("select_trip_round_settings_pane").style.display = "block";
    document.getElementById("forms_main_class_guests_cabin_settings_pane").style.display = "block";

    document.getElementById("select_cabin_settings_pane").style.display = "none";
    document.getElementById("add_travelers_settings_pane").style.display = "none";
}
function show_cabin_settings_pane(){
    document.getElementById("select_cabin_settings_pane").style.display = "block";
    document.getElementById("forms_main_class_guests_cabin_settings_pane").style.display = "block";

    document.getElementById("select_trip_round_settings_pane").style.display = "none";
    document.getElementById("add_travelers_settings_pane").style.display = "none";
}
function show_travelers_settings_pane(){
    document.getElementById("add_travelers_settings_pane").style.display = "block";
    document.getElementById("forms_main_class_guests_cabin_settings_pane").style.display = "block";

    document.getElementById("select_trip_round_settings_pane").style.display = "none";
    document.getElementById("select_cabin_settings_pane").style.display = "none";
}

function select_cabin_type(type="economy"){

    let flight_search_data = JSON.parse(localStorage.getItem("search_obj"));
    
    Array.from(document.getElementsByClassName("select_cabin_type_chk")).forEach( each=> {
        each.checked = false;
    });
    if(type === "cheapest"){
        document.getElementById("select_cabin_cheapest_chk").checked = true;
        document.getElementById("select_cabin_type_main_input_display").innerHTML = `
            <i style="fontSize: 15px; margin-right: 10px" class="fa fa-level-up"></i>
            Cheapest
        `;
        flight_search_data.itinerary.cabin = "LCC";
    }else if(type === "economy"){
        document.getElementById("select_cabin_economy_chk").checked = true;
        document.getElementById("select_cabin_type_main_input_display").innerHTML = `
            <i style="fontSize: 15px; margin-right: 10px" class="fa fa-level-up"></i>
            Economy
        `;
        flight_search_data.itinerary.cabin = "ECONOMY";
    }else if(type === "premium"){
        document.getElementById("select_cabin_premium_chk").checked = true;
        document.getElementById("select_cabin_type_main_input_display").innerHTML = `
            <i style="fontSize: 15px; margin-right: 10px" class="fa fa-level-up"></i>
            Premium
        `;
        flight_search_data.itinerary.cabin = "PREMIUM";
    }else if(type === "business"){
        document.getElementById("select_cabin_business_chk").checked = true;
        document.getElementById("select_cabin_type_main_input_display").innerHTML = `
            <i style="font-size: 15px; margin-right: 10px" class="fa fa-level-up"></i>
            Business
        `;
        flight_search_data.itinerary.cabin = "BUSINESS";
    }else if(type === "first"){
        document.getElementById("select_cabin_first_chk").checked = true;
        document.getElementById("select_cabin_type_main_input_display").innerHTML = `
            <i style="fontSize: 15px; margin-right: 10px" class="fa fa-level-up"></i>
            First
        `;
        flight_search_data.itinerary.cabin = "FIRST";
    }
    window.localStorage.setItem("search_obj", JSON.stringify(flight_search_data));
}

function select_trip_round(type="round-trip"){

    let flight_search_data = JSON.parse(localStorage.getItem("search_obj"));

    Array.from(document.getElementsByClassName("select_trip_round_chk")).forEach( each=> {
        each.checked = false;
    });
    if(type === "round-trip"){
        document.getElementById("trip_round_round_trip_chk").checked = true;
        document.getElementById("select_trip_round_main_input_display").innerHTML = `
            <i style="fontSize: 15px; margin-right: 10px" class="fa fa-repeat"></i>
            Round-trip
        `;
        flight_search_data.type = "round-trip";
        DateChoosersInit(CONSTANTS.round_trip);
        if(document.getElementById("departure_return_dates_input"))
            document.getElementById("departure_return_dates_input").placeholder="departure - return";
    }else if(type === "one-way"){
        document.getElementById("trip_round_one_way_chk").checked = true;
        document.getElementById("select_trip_round_main_input_display").innerHTML = `
            <i style="font-size: 15px; margin-right: 10px" class="fa fa-repeat"></i>
            One-way
        `;
        flight_search_data.type = "one-way";
        DateChoosersInit(CONSTANTS.one_way);
        if(document.getElementById("departure_return_dates_input"))
            document.getElementById("departure_return_dates_input").placeholder="departure";
    }else if(type === "multi-city"){
        document.getElementById("trip_round_multi_city_chk").checked = true;
        document.getElementById("select_trip_round_main_input_display").innerHTML = `
            <i style="fontSize: 15px; margin-right: 10px" class="fa fa-repeat"></i>
            Multi-city
        `;
        flight_search_data.type = "multi-city";
    }
    window.localStorage.setItem("search_obj", JSON.stringify(flight_search_data));
}

let travelers = {
    adults: 1,
    children: 0,
    infants: 0,
}
function add_traveler(type="adult"){

    if((travelers.adults + travelers.children + travelers.infants) > 14){
        toast("maximum of 15 travelers allowed")
        return;
    }

    if(type === "adult"){
        travelers.adults += 1;

        if(travelers.adults > 1 && travelers.infants === 0 && travelers.children === 0){
            document.getElementById("add_travelers_main_input_display").innerHTML = `
                <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                ${travelers.adults} Adults`;
        }else{
            (travelers.adults + travelers.children + travelers.infants) > 1 ?
                document.getElementById("add_travelers_main_input_display").innerHTML = `
                    <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                    ${travelers.adults + travelers.children + travelers.infants} Travelers
                ` : document.getElementById("add_travelers_main_input_display").innerHTML = `
                        <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                        ${travelers.adults} Adult
                    `
        }

        document.getElementById("add_travelers_display_adults_number").innerHTML = travelers.adults;
    }else if(type === "child"){
        travelers.children += 1;

        if(travelers.children > 1 && travelers.infants === 0 && travelers.adults === 0){
            document.getElementById("add_travelers_main_input_display").innerHTML = `
                <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                ${travelers.children} Children`;
        }else{
            (travelers.adults + travelers.children + travelers.infants) > 1 ?
                document.getElementById("add_travelers_main_input_display").innerHTML = `
                    <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                    ${travelers.adults + travelers.children + travelers.infants} Travelers
                `: document.getElementById("add_travelers_main_input_display").innerHTML = `
                        <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                        ${travelers.children} Child
                    `
        }
            document.getElementById("add_travelers_display_children_number").innerHTML = travelers.children;
    }else if(type === "infant"){
        travelers.infants += 1;

        if(travelers.infants > 1 && travelers.children === 0 && travelers.adults === 0){
            document.getElementById("add_travelers_main_input_display").innerHTML = `
                <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                ${travelers.infants} Infants`;
        }else{
            (travelers.adults + travelers.children + travelers.infants) > 1 ?
                document.getElementById("add_travelers_main_input_display").innerHTML = `
                    <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                    ${travelers.adults + travelers.children + travelers.infants} Travelers
                `: document.getElementById("add_travelers_main_input_display").innerHTML = `
                    <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                    ${travelers.infants} Infant
            `
        }
        
        document.getElementById("add_travelers_display_infants_number").innerHTML = travelers.infants;
    }

    //adding current travelers setting to local storage
    let flight_search_data = JSON.parse(localStorage.getItem("search_obj"));
    flight_search_data.itinerary.travelers.adults = travelers.adults;
    flight_search_data.itinerary.travelers.children = travelers.children;
    flight_search_data.itinerary.travelers.infants = travelers.infants;
    window.localStorage.setItem("search_obj", JSON.stringify(flight_search_data));
}

function remove_traveler(type="adult"){

    if((travelers.adults + travelers.children + travelers.infants) < 2){
        alert("at least one(1) adult or child traveler required")
        return;
    }

    if(type === "adult"){
        if((travelers.adults-1)<0){
            return;
        }
        travelers.adults -= 1;
        if(travelers.adults > 1 && travelers.infants == 0 && travelers.children == 0){
            document.getElementById("add_travelers_main_input_display").innerHTML = `
                <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                ${travelers.adults} Adults`;
        }else if(travelers.adults < 1 && travelers.infants > 0 && travelers.children == 0){
            if(travelers.infants > 1 && travelers.children == 0 && travelers.adults == 0){
                document.getElementById("add_travelers_main_input_display").innerHTML = `
                    <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                    ${travelers.infants} Infants`;
            }else{
                (travelers.adults + travelers.children + travelers.infants) > 1 ?
                    document.getElementById("add_travelers_main_input_display").innerHTML = `
                        <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                        ${travelers.adults + travelers.children + travelers.infants} Travelers
                    `: document.getElementById("add_travelers_main_input_display").innerHTML = `
                        <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                        ${travelers.infants} Infant
                `
            }
        }else if(travelers.adults < 1 && travelers.infants == 0 && travelers.children > 0){
            if(travelers.children > 1 && travelers.infants == 0 && travelers.adults == 0){
                document.getElementById("add_travelers_main_input_display").innerHTML = `
                    <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                    ${travelers.children} Children`;
            }else{
                (travelers.adults + travelers.children + travelers.infants) > 1 ?
                    document.getElementById("add_travelers_main_input_display").innerHTML = `
                        <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                        ${travelers.adults + travelers.children + travelers.infants} Travelers
                    `: document.getElementById("add_travelers_main_input_display").innerHTML = `
                            <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                            ${travelers.children} Child
                        `
            }
        }else{
            (travelers.adults + travelers.children + travelers.infants) > 1 ?
                document.getElementById("add_travelers_main_input_display").innerHTML = `
                    <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                    ${travelers.adults + travelers.children + travelers.infants} Travelers
                ` : document.getElementById("add_travelers_main_input_display").innerHTML = `
                        <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                        ${travelers.adults} Adult
                    `
        }

        document.getElementById("add_travelers_display_adults_number").innerHTML = travelers.adults;
    }else if(type === "child"){
        if((travelers.children-1)<0){
            return;
        }
        travelers.children -= 1;
        if(travelers.children > 1 && travelers.infants == 0 && travelers.adults == 0){
            document.getElementById("add_travelers_main_input_display").innerHTML = `
                <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                ${travelers.children} Children`;
        }else if(travelers.adults == 0 && travelers.infants > 0 && travelers.children < 1){
            if(travelers.infants > 1 && travelers.children == 0 && travelers.adults == 0){
                document.getElementById("add_travelers_main_input_display").innerHTML = `
                    <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                    ${travelers.infants} Infants`;
            }else{
                (travelers.adults + travelers.children + travelers.infants) > 1 ?
                    document.getElementById("add_travelers_main_input_display").innerHTML = `
                        <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                        ${travelers.adults + travelers.children + travelers.infants} Travelers
                    `: document.getElementById("add_travelers_main_input_display").innerHTML = `
                        <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                        ${travelers.infants} Infant
                `
            }
        }else if(travelers.adults > 0 && travelers.infants == 0 && travelers.children < 1){
            if(travelers.adults > 1 && travelers.infants == 0 && travelers.children == 0){
                document.getElementById("add_travelers_main_input_display").innerHTML = `
                    <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                    ${travelers.adults} Adults`;
            }else{
                (travelers.adults + travelers.children + travelers.infants) > 1 ?
                    document.getElementById("add_travelers_main_input_display").innerHTML = `
                        <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                        ${travelers.adults + travelers.children + travelers.infants} Travelers
                    ` : document.getElementById("add_travelers_main_input_display").innerHTML = `
                            <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                            ${travelers.adults} Adult
                        `
            }
        }else{
            (travelers.adults + travelers.children + travelers.infants) > 1 ?
                document.getElementById("add_travelers_main_input_display").innerHTML = `
                    <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                    ${travelers.adults + travelers.children + travelers.infants} Travelers
                `: document.getElementById("add_travelers_main_input_display").innerHTML = `
                        <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                        ${travelers.children} Child
                    `
        }

        document.getElementById("add_travelers_display_children_number").innerHTML = travelers.children;
    }else if(type === "infant"){
        if((travelers.infants-1)<0){
            return;
        }
        travelers.infants -= 1;
        if(travelers.infants > 1 && travelers.children == 0 && travelers.adults == 0){
            document.getElementById("add_travelers_main_input_display").innerHTML = `
                <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                ${travelers.infants} Infants`;
        }else if(travelers.adults == 0 && travelers.infants < 1 && travelers.children > 0){
            if(travelers.infants > 1 && travelers.children == 0 && travelers.adults == 0){
                document.getElementById("add_travelers_main_input_display").innerHTML = `
                    <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                    ${travelers.infants} Infants`;
            }else{
                (travelers.adults + travelers.children + travelers.infants) > 1 ?
                    document.getElementById("add_travelers_main_input_display").innerHTML = `
                        <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                        ${travelers.adults + travelers.children + travelers.infants} Travelers
                    `: document.getElementById("add_travelers_main_input_display").innerHTML = `
                        <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                        ${travelers.infants} Infant
                `
            }
        }else if(travelers.adults > 0 && travelers.infants < 1 && travelers.children == 0){
            if(travelers.adults > 1 && travelers.infants == 0 && travelers.children == 0){
                document.getElementById("add_travelers_main_input_display").innerHTML = `
                    <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                    ${travelers.adults} Adults`;
            }else{
                (travelers.adults + travelers.children + travelers.infants) > 1 ?
                    document.getElementById("add_travelers_main_input_display").innerHTML = `
                        <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                        ${travelers.adults + travelers.children + travelers.infants} Travelers
                    ` : document.getElementById("add_travelers_main_input_display").innerHTML = `
                            <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                            ${travelers.adults} Adult
                        `
            }
        }else{
            (travelers.adults + travelers.children + travelers.infants) > 1 ?
                document.getElementById("add_travelers_main_input_display").innerHTML = `
                    <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                    ${travelers.adults + travelers.children + travelers.infants} Travelers
                `: document.getElementById("add_travelers_main_input_display").innerHTML = `
                    <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                    ${travelers.infants} Infant
            `
        }
        
        document.getElementById("add_travelers_display_infants_number").innerHTML = travelers.infants;
    }

    //adding current travelers setting to local storage
    let flight_search_data = JSON.parse(localStorage.getItem("search_obj"));
    flight_search_data.itinerary.travelers.adults = travelers.adults;
    flight_search_data.itinerary.travelers.children = travelers.children;
    flight_search_data.itinerary.travelers.infants = travelers.infants;
    window.localStorage.setItem("search_obj", JSON.stringify(flight_search_data));
}

function set_default_travelers(travelers_p){

    document.getElementById("add_travelers_display_adults_number").innerHTML="0";
    document.getElementById("add_travelers_display_children_number").innerHTML="0";
    document.getElementById("add_travelers_display_infants_number").innerHTML="0";

    travelers=travelers_p;

    if((travelers_p.adults + travelers_p.children + travelers_p.infants) > 14){
        alert("only maximum of 15 travelers allowed")
        return;
    }

    if(travelers_p?.adults>0){
        if(travelers_p.adults > 1 && travelers_p.infants === 0 && travelers_p.children === 0){
            document.getElementById("add_travelers_main_input_display").innerHTML = `
                <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                ${travelers_p.adults} Adults
                <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>`;
        }else{
            (travelers_p.adults + travelers_p.children + travelers_p.infants) > 1 ?
                document.getElementById("add_travelers_main_input_display").innerHTML = `
                    <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                    ${travelers_p.adults + travelers_p.children + travelers_p.infants} Travelers
                ` : document.getElementById("add_travelers_main_input_display").innerHTML = `
                        <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                        ${travelers_p.adults} Adult
                        <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>
                    `
        }

        document.getElementById("add_travelers_display_adults_number").innerHTML = travelers_p.adults;
    }
    if(travelers_p?.children>0){
        if(travelers_p.children > 1 && travelers_p.infants === 0 && travelers_p.adults === 0){
            document.getElementById("add_travelers_main_input_display").innerHTML = `
                <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                ${travelers_p.children} Children
                <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>`;
        }else{
            (travelers_p.adults + travelers_p.children + travelers_p.infants) > 1 ?
                document.getElementById("add_travelers_main_input_display").innerHTML = `
                    <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                    ${travelers_p.adults + travelers_p.children + travelers_p.infants} Travelers
                `: document.getElementById("add_travelers_main_input_display").innerHTML = `
                        <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                        ${travelers_p.children} Child
                        <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>
                    `
        }
        document.getElementById("add_travelers_display_children_number").innerHTML = travelers_p.children;
    }
    if(travelers_p?.infants>0){
        if(travelers_p.infants > 1 && travelers_p.children === 0 && travelers_p.adults === 0){
            document.getElementById("add_travelers_main_input_display").innerHTML = `
                <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                ${travelers_p.infants} Infants
                <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>`;
        }else{
            (travelers_p.adults + travelers_p.children + travelers_p.infants) > 1 ?
                document.getElementById("add_travelers_main_input_display").innerHTML = `
                    <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                    ${travelers_p.adults + travelers_p.children + travelers_p.infants} Travelers
                `: document.getElementById("add_travelers_main_input_display").innerHTML = `
                    <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                    ${travelers_p.infants} Infant
                    <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>
            `
        }
        
        document.getElementById("add_travelers_display_infants_number").innerHTML = travelers_p.infants;
    }

    //adding current travelers setting to local storage
    let flight_search_data = JSON.parse(localStorage.getItem("search_obj"));
    flight_search_data.itinerary.travelers.adults = travelers_p.adults;
    flight_search_data.itinerary.travelers.children = travelers_p.children;
    flight_search_data.itinerary.travelers.infants = travelers_p.infants;
    window.localStorage.setItem("search_obj", JSON.stringify(flight_search_data));
}

export default SearchForm;