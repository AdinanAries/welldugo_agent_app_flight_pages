import { useEffect } from "react";

import AutoCompleteInit from "../../../helpers/AutoCompleteInit";
import { SpDateChoosersInit } from "../../../helpers/DateChoosersInit";
import CONSTANTS from "../../../Constants/Constants";

import { show_search_page } from "../../../helpers/PageRoutingFuncs";

function SearchForm( props ){

    const {
        showSearchPageForm,
        bookingEngine,
        agentDetails,
    } = props;

    useEffect(()=>{
        let flight_search_data = JSON.parse(localStorage.getItem("search_obj"));
        SpDateChoosersInit(
            flight_search_data.type.toUpperCase(),
            flight_search_data.itinerary.departure.date,
            flight_search_data.itinerary.arrival.date
        );
        AutoCompleteInit();
        sp_select_trip_round(
            flight_search_data.type,
            flight_search_data.itinerary.departure.date,
            flight_search_data.itinerary.arrival.date
        );
        sp_select_cabin_type(flight_search_data.itinerary.cabin.toLowerCase());
        const travelers={};
        travelers.adults=flight_search_data.itinerary.travelers.adults;
        travelers.children=flight_search_data.itinerary.travelers.children;
        travelers.infants=flight_search_data.itinerary.travelers.infants;
        sp_set_default_travelers(travelers);
        
    }, []);

    const isAllSearchInputsSet = () => {
        if(document.getElementById("sp_search_forms_from_where_input_fld").value===""){
            document.getElementById("sp_search_forms_from_where_input_fld").click();
            return false;
        }else if(document.getElementById("sp_search_forms_to_where_input_fld").value===""){
            document.getElementById("sp_search_forms_to_where_input_fld").click();
            return false;
        }else if(document.getElementById("sp_departure_return_dates_input").value===""){
            document.getElementById("sp_departure_return_dates_input").click();
            return false;
        }

        return true;
    }

    const searchOnSubmit = () => {
        if(isAllSearchInputsSet()){
            show_search_page(); 
            props.submitFromSearchPage();
        }
    }

    let _is_bl_search = false;
    if(localStorage.getItem("booking_link")){
        _is_bl_search = true;
    }

    let show_search_form = false;
    const params = new URLSearchParams(window.location.search);
    if(params.has("show_search_form")){
        show_search_form = JSON.parse(params.get('show_search_form').trim());
    }

    return(
        <div id="search_results_page_search_form" className="main-search-form" style={{display: showSearchPageForm ? "block" : "none", position: "relative"}}>
            {
                (_is_bl_search && !show_search_form) && <div style={{position: "absolute", left: 0, right: 0, zIndex: 100, height: "100%", width: "100%", backgroundColor: "rgba(255,255,255,0.5)"}}>
                    <div style={{backgroundColor: "crimson", padding: 10, position: "absolute", width: "100%", bottom: 0, left: 0}}>
                        <p style={{color: "white", fontSize: 13}}>
                            <i style={{marginRight: 10, color: "yellow"}}
                                className="fa-solid fa-info-circle"></i>
                            You are searching from an agent created link...</p>
                        <div style={{display: "flex", marginTop: 5, marginLeft: 20}}>
                            <p onClick={()=>window.location.reload()}
                                style={{cursor: "pointer", color: "skyblue", fontSize: 14, textDecoration: "underline"}}>
                                Reload Page</p>
                            <p style={{margin: "0 10px", color: "rgba(255,255,255,0.4)"}}>
                                /</p>
                            <p onClick={()=>{
                                    localStorage.removeItem("booking_link");
                                    window.location.href = "/search";
                                }} 
                                style={{cursor: "pointer", color: "lightgreen", fontSize: 14, textDecoration: "underline"}}>
                                Reset page</p>
                        </div>
                    </div>
                </div>
            }
            <div className="two-search-inputs-container" style={{marginBottom: 10}}>
                <div className="each_flex-side first">
                    <div className="forms_class_guests_cabin_settings_container" style={{zIndex: 10}}>
                        <div id="sp_forms_main_class_guests_cabin_settings_pane" className="forms_class_guests_cabin_settings_pane">
                            <p onClick={() => {
                                    if(document.getElementById("sp_forms_main_class_guests_cabin_settings_pane"))
                                        document.getElementById("sp_forms_main_class_guests_cabin_settings_pane").style.display = "none"
                                }
                            } className="airports_auto_complete_close_btn">&times;</p>
                            <div id="sp_add_travelers_settings_pane" style={{padding: 15, display: "none"}}>
                                <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', sans-serif", fontWeight: "bolder", fontSize: 17, marginTop: 10, marginBottom: 20}}>
                                    Add Travelers</p>
                                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 10}}>
                                    <div style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', sans-serif", height: 30, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                        Adults
                                        <p style={{fontSize: 12, color: "rgba(0,0,0,0.6)"}}>18 and above</p>
                                    </div>
                                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                                        <div onClick={()=>sp_remove_traveler("adult")} style={{cursor: "pointer", borderRadius: "100%", border: "1px solid rgba(0,0,0,0.3)", width: 35, height: 35, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                            -</div>
                                        <div id="sp_add_travelers_display_adults_number" style={{color: "rgba(0,0,0,0.7)", width: 40, height: 30, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                            1</div>
                                        <div onClick={()=>sp_add_traveler("adult")} style={{cursor: "pointer", borderRadius: "100%", border: "1px solid rgba(0,0,0,0.3)", width: 35, height: 35, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                            +</div>
                                    </div>
                                </div>
                                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 10}}>
                                    <div style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', sans-serif", height: 30, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                        Children
                                        <p style={{fontSize: 12, color: "rgba(0,0,0,0.6)"}}>Ages 2 to 17</p>
                                        </div>
                                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                                        <div onClick={()=>sp_remove_traveler("child")} style={{cursor: "pointer", borderRadius: "100%", border: "1px solid rgba(0,0,0,0.3)", width: 35, height: 35, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                            -</div>
                                        <div id="sp_add_travelers_display_children_number" style={{color: "rgba(0,0,0,0.7)", width: 40, height: 30, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                            0</div>
                                        <div onClick={()=>sp_add_traveler("child")} style={{cursor: "pointer", borderRadius: "100%", border: "1px solid rgba(0,0,0,0.3)", width: 35, height: 35, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                            +</div>
                                    </div>
                                </div>
                                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 10}}>
                                    <div style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', sans-serif", height: 30, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                        Infants
                                        <p style={{fontSize: 12, color: "rgba(0,0,0,0.6)"}}>Younger than 2</p>
                                    </div>
                                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                                        <div onClick={()=>sp_remove_traveler("infant")} style={{cursor: "pointer", borderRadius: "100%", border: "1px solid rgba(0,0,0,0.3)", width: 35, height: 35, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                            -</div>
                                        <div id="sp_add_travelers_display_infants_number" style={{color: "rgba(0,0,0,0.7)", width: 40, height: 30, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                            0</div>
                                        <div onClick={()=>sp_add_traveler("infant")} style={{cursor: "pointer", borderRadius: "100%", border: "1px solid rgba(0,0,0,0.3)", width: 35, height: 35, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                            +</div>
                                    </div>
                                </div>
                            </div>
                            <div id="sp_select_cabin_settings_pane" style={{padding: 15, display: "none"}}>
                                <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', sans-serif", fontWeight: "bolder", marginTop: 10, marginBottom: 20}}>
                                    Select Cabin</p>
                                <div onClick={()=>{}/*sp_select_cabin_type("cheapest")*/} style={{display: "flex", display: "none", flexDirection: "row", justifyContent: "space-between", marginBottom: 10}}>
                                    <label htmlFor="sp_select_cabin_cheapest_chk"><div style={{cursor: "not-allowed", color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', sans-serif", height: 30, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                        Cheapest</div></label>
                                    <div style={{height: 30, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                        <input id="sp_select_cabin_cheapest_chk" disabled={true} className="sp_select_cabin_type_chk" style={{width: 20, height: 20}} type="radio" defaultChecked={false}/>
                                    </div>
                                </div>
                                <div onClick={()=>sp_select_cabin_type("economy")} style={{cursor: "pointer", display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 10}}>
                                    <label htmlFor="sp_select_cabin_economy_chk"><div style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', sans-serif", height: 30, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                        Economy</div></label>
                                    <div style={{height: 30, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                        <input id="sp_select_cabin_economy_chk" className="sp_select_cabin_type_chk" style={{width: 20, height: 20}} type="radio" />
                                    </div>
                                </div>
                                <div onClick={()=>sp_select_cabin_type("premium")} style={{cursor: "pointer", display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 10}}>
                                    <label htmlFor="sp_select_cabin_premium_chk"><div style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', sans-serif", height: 30, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                        Premium</div></label>
                                    <div style={{height: 30, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                        <input id="sp_select_cabin_premium_chk" className="sp_select_cabin_type_chk" style={{width: 20, height: 20}} type="radio" />
                                    </div>
                                </div>
                                <div onClick={()=>sp_select_cabin_type("business")} style={{cursor: "pointer", display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 10}}>
                                    <label htmlFor="sp_select_cabin_business_chk"><div style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', sans-serif", height: 30, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                        Business</div></label>
                                    <div style={{height: 30, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                        <input id="sp_select_cabin_business_chk" className="sp_select_cabin_type_chk" style={{width: 20, height: 20}} type="radio" />
                                    </div>
                                </div>
                                <div onClick={()=>sp_select_cabin_type("first")} style={{cursor: "pointer", display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 10}}>
                                    <label htmlFor="sp_select_cabin_first_chk"><div style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', sans-serif", height: 30, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                        First</div></label>
                                    <div style={{height: 30, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                        <input id="sp_select_cabin_first_chk" className="sp_select_cabin_type_chk" style={{width: 20, height: 20}} type="radio" />
                                    </div>
                                </div>
                            </div>
                            <div id="sp_select_trip_round_settings_pane" style={{padding: 15, display: "none"}}>
                                <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', sans-serif", fontWeight: "bolder", marginTop: 10, marginBottom: 20}}>
                                    Select Trip Round</p>
                                <div onClick={()=>sp_select_trip_round("round-trip")} style={{cursor: "pointer", display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 10}}>
                                    <label htmlFor="sp_trip_round_round_trip_chk"><div style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', sans-serif", height: 30, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                        Round-trip</div></label>
                                    <div style={{height: 30, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                        <input id="sp_trip_round_round_trip_chk" className="sp_select_trip_round_chk" style={{width: 20, height: 20}} type="radio" />
                                    </div>
                                </div>
                                <div onClick={()=>sp_select_trip_round("one-way")} style={{cursor: "pointer", display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 10}}>
                                    <label htmlFor="sp_trip_round_one_way_chk"><div style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', sans-serif", height: 30, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                        One-way</div></label>
                                    <div style={{height: 30, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                        <input id="sp_trip_round_one_way_chk" className="sp_select_trip_round_chk" style={{width: 20, height: 20}} type="radio" defaultChecked />
                                    </div>
                                </div>
                                <div onClick={()=>{}/*()=>sp_select_trip_round("multi-city")*/} style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 10}}>
                                    <label htmlFor="sp_trip_round_multi_city_chk"><div style={{cursor: "not-allowed", color: "rgba(0,0,0,0.2)", fontFamily: "'Prompt', sans-serif", height: 30, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                        Multi-city</div></label>
                                    <div style={{height: 30, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                        <input id="sp_trip_round_multi_city_chk" className="sp_select_trip_round_chk" disabled={true} style={{width: 20, height: 20}} type="radio" />
                                    </div>
                                </div>
                            </div>
                            <div onClick={()=> {
                                    if(document.getElementById("sp_forms_main_class_guests_cabin_settings_pane"))
                                        document.getElementById("sp_forms_main_class_guests_cabin_settings_pane").style.display = "none"
                                }
                            } style={{cursor: "pointer", padding: 10, margin: 10, marginTop: 0, 
                                backgroundColor: bookingEngine?.actionButtonsBg, 
                                color: bookingEngine?.actionButtonsTxtColor, textAlign: "center", 
                                borderRadius: bookingEngine?.actionButtonBorderRadius, textAlign: "center"}}>
                                Done
                            </div>
                        </div>
                        <div id="sp_select_cabin_type_main_input_display" onClick={sp_show_cabin_settings_pane} style={{cursor: "pointer", fontFamily: "'Prompt', sans-serif", marginRight: 30, fontSize: 14}}>
                            <i style={{fontSize: 15, marginRight: 10}} className="fa fa-level-up"></i>
                            Cheapest
                            <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>
                        </div>
                        <div id="sp_add_travelers_main_input_display" onClick={sp_show_travelers_settings_pane} style={{cursor: "pointer", fontFamily: "'Prompt', sans-serif", marginRight: 30, fontSize: 14}}>
                            <i style={{fontSize: 15, marginRight: 10}} className="fa fa-user"></i>
                            1 Adult
                            <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>
                        </div>
                        <div id="sp_select_trip_round_main_input_display" onClick={sp_show_trip_round_settings_pane} style={{cursor: "pointer", fontFamily: "'Prompt', sans-serif", marginRight: 30, fontSize: 14}}>
                            <i style={{fontSize: 15, marginRight: 10}} className="fa fa-repeat"></i>
                            One-way
                            <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>
                        </div>
                        
                    </div>
                </div>
            </div>
            <div>
                <div className="two-search-inputs-container">
                    <div className="search_page_search_form_origin_destination_inputs_container" 
                        style={{display: "flex", width: "65%"}}>
                        <div style={{position: "relative", width: "calc(50% - 5px)"}} className="search_forms_from_where_input_fld_container">
                            <div id="sp_from_where_airports_auto_complete_input" className="airports_inputs_with_auto_complete" style={{zIndex: 10}}>
                                <p onClick={() => {
                                        if(document.getElementById("sp_from_where_airports_auto_complete_input"))
                                            document.getElementById("sp_from_where_airports_auto_complete_input").style.display = "none"
                                    }
                                } className="airports_auto_complete_close_btn">&times;</p>
                                <input autoComplete="off" id="sp_from_where_airports_auto_complete_input_fld" 
                                    onBlur={() => {
                                        setTimeout(() => {
                                            if(document.getElementById("sp_from_where_airports_auto_complete_input"))
                                                document.getElementById("sp_from_where_airports_auto_complete_input").style.display = "none";
                                        }, 500);
                                    }} className="airports_auto_complete_input" type="text" placeholder="Where are you leaving from?"/>
                                <div className="airports_auto_complete_list_container">
                                    <ul id="sp_flights_auto_complete_from_where_input_list">
                                        <li><div style={{padding: 10, display: "flex", flexDirection: "row", cursor: "pointer"}}>
                                            <div style={{height: 35, marginRight: 10, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                                <i className="fa fa-history" style={{color: "rgba(0,0,0,0.3)", fontSize: 17}}></i>
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
                            <div className="main-search_txt_input search_page_input">
                                <i style={{fontSize: 20, marginRight: 5}} className="fa-solid fa-plane-departure"></i>
                                <input id="sp_search_forms_from_where_input_fld" onClick={sp_open_from_where_auto_complete_pane} type="text" autoComplete="off" placeholder="from where?" />
                            </div>
                        </div>
                        <div id="sp_main_switch_inputs_btn" className="switchinputsBtn"
                            onClick={sp_switch_airports_input_values}>
                            <p style={{textAlign: "center"}}>
                                <i className="fa fa-exchange"></i>
                            </p>
                        </div>
                        <div style={{width: "calc(50% - 5px)"}} className="search_forms_to_where_input_fld_container">
                            <div id="sp_to_where_airports_auto_complete_input" className="airports_inputs_with_auto_complete" style={{zIndex: 10}}>
                                <p onClick={() => {
                                        if(document.getElementById("sp_to_where_airports_auto_complete_input"))
                                            document.getElementById("sp_to_where_airports_auto_complete_input").style.display = "none"
                                    }
                                } className="airports_auto_complete_close_btn">&times;</p>
                                <input autoComplete="off" id="sp_to_where_airports_auto_complete_input_fld" 
                                    onBlur={()=>{
                                        setTimeout(() => {
                                            if(document.getElementById("sp_to_where_airports_auto_complete_input"))
                                                document.getElementById("sp_to_where_airports_auto_complete_input").style.display = "none";
                                        }, 500);
                                    }} className="airports_auto_complete_input" type="text" placeholder="Where are you going to?"/>
                                <div className="airports_auto_complete_list_container">
                                    <ul id="sp_flights_auto_complete_to_where_input_list">
                                        <li><div style={{padding: 10, display: "flex", flexDirection: "row", cursor: "pointer"}}>
                                            <div style={{height: 35, marginRight: 10, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                                                <i className="fa fa-history" style={{color: "rgba(0,0,0,0.3)", fontSize: 17}}></i>
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
                            <div className="main-search_txt_input search_page_input">
                                <i style={{fontSize: 20, marginRight: 5}} className="fa-solid fa-plane-arrival"></i>
                                <input id="sp_search_forms_to_where_input_fld" onClick={sp_open_to_where_auto_complete_pane} type="text" autoComplete="off" placeholder="to where?" />
                            </div>
                        </div>
                    </div>
                    <div className="search_page_form_dates_input_container" style={{width: "40%", marginRight: 10}}>
                        <div style={{width: "100%"}}>
                            <div className="main-search_txt_input search_page_input">
                                <i style={{fontSize: 20, marginRight: 5}} className="fa fa-calendar-o"></i>
                                <input id="sp_departure_return_dates_input" type="text" readOnly="true" placeholder="departure"/>
                            </div>
                        </div>
                    </div>
                    <div className="sp_search_form_submit_btn_flex_container">
                        {
                            bookingEngine?.showSearchFilters ?
                            <div className="display_flex_on_1000px"
                                    onClick={()=>document.getElementById('search_list_main__settings_section').style.display='block'}
                                    style={{display: "none", width: "calc(100% - 50px)", borderRadius: 8, borderTopRightRadius: 8, borderBottomRightRadius: 8,
                                        backgroundColor: "rgba(199, 81, 185, 0.1)",
                                        border: "1px solid rgba(199, 81, 185, 0.1)", padding: 5, paddingRight: 25, marginRight: 10, alignItems: "center", marginTop: 10}}>
                                <p style={{display: "flex", justifyContent: "center", alignItems: "center", width: 40, height: 40,}}>
                                    <i className="fa fa-sliders" aria-hidden="true"></i>
                                </p>
                                <div>
                                    <p style={{fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.8)", fontSize: 13}}>
                                        Stops & Airline Filters & Price Sorting</p>
                                </div>
                            </div> : <div className="display_flex_on_1000px" style={{display: "none", width: "calc(100% - 70px)", marginTop: 10, marginLeft: 20}}>
                                <div>
                                    <p style={{fontSize: 12, color: "rgba(0,0,0,0.8)"}}>
                                        <i style={{fontSize: 12, marginRight: 10, color: "rgba(0, 0, 0, 0.8)"}}
                                            className="fa-solid fa-user-tie"></i>
                                        {(agentDetails?.first_name)} {(agentDetails?.last_name)}
                                    </p>
                                    <p style={{color: "rgba(0,0,0,0.8)", fontSize: 12}}>
                                        <i style={{fontSize: 12, marginRight: 10, color: "rgba(0, 0, 0, 0.8)"}}
                                            className="fa-solid fa-envelope"></i>
                                        {agentDetails?.email}</p>
                                    <p style={{color: "rgba(0,0,0,0.8)", fontSize: 12}}>
                                        <i style={{fontSize: 12, marginRight: 10, color: "rgba(0, 0, 0, 0.8)"}}
                                            className="fa-solid fa-phone"></i>
                                        {agentDetails?.phone}</p>
                                </div>
                            </div>
                        }
                        <div onClick={searchOnSubmit} id="sp_search_form_submit_btn" 
                            style={{borderRadius: `${bookingEngine?.searchButtonBorderRadius}%`,
                                    background: bookingEngine?.actionButtonsBg, width: 55, height: 55, marginTop: -5, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}} className="searchBtn">
                            <i className="fa fa-search" style={{fontSize: 20, 
                                color: bookingEngine?.actionButtonsIconColor}}></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

let sp_switch_btn_switched = false
function sp_switch_input_rotate_func(){

    let INITIAL_ROTATE=0;
    let FINAL_ROTATE=360;
    if(global.$(window).width()<=CONSTANTS.viewport_threshold){
        INITIAL_ROTATE=90;
        FINAL_ROTATE=270;
    }
    
    if(!sp_switch_btn_switched){
        if(document.getElementById("sp_main_switch_inputs_btn"))
            document.getElementById("sp_main_switch_inputs_btn").style.transform = "rotate("+FINAL_ROTATE+"deg)";
        sp_switch_btn_switched = true;
    }else{
        if(document.getElementById("sp_main_switch_inputs_btn"))
            document.getElementById("sp_main_switch_inputs_btn").style.transform = "rotate("+INITIAL_ROTATE+"deg)";
        sp_switch_btn_switched = false;
    }
    
}

function sp_switch_airports_input_values(){
    let from_airport_value = document.getElementById("sp_search_forms_from_where_input_fld").value;
    document.getElementById("sp_search_forms_from_where_input_fld").value = document.getElementById("sp_search_forms_to_where_input_fld").value;
    document.getElementById("sp_search_forms_to_where_input_fld").value = from_airport_value;
    sp_switch_input_rotate_func();

    let flight_search_data = JSON.parse(localStorage.getItem("search_obj"));
    let temp_iata = flight_search_data.itinerary.departure.airport;
    flight_search_data.itinerary.departure.airport = flight_search_data.itinerary.arrival.airport;
    flight_search_data.itinerary.arrival.airport = temp_iata;
    window.localStorage.setItem("search_obj", JSON.stringify(flight_search_data));

}

function sp_open_to_where_auto_complete_pane(){
    document.getElementById("sp_to_where_airports_auto_complete_input").style.display = "block";
    document.getElementById("sp_to_where_airports_auto_complete_input_fld").focus();
}
function sp_open_from_where_auto_complete_pane(){
    document.getElementById("sp_from_where_airports_auto_complete_input").style.display = "block"
    document.getElementById("sp_from_where_airports_auto_complete_input_fld").focus();
}
function sp_show_trip_round_settings_pane(){
    document.getElementById("sp_select_trip_round_settings_pane").style.display = "block";
    document.getElementById("sp_forms_main_class_guests_cabin_settings_pane").style.display = "block";

    document.getElementById("sp_select_cabin_settings_pane").style.display = "none";
    document.getElementById("sp_add_travelers_settings_pane").style.display = "none";
}
function sp_show_cabin_settings_pane(){
    document.getElementById("sp_select_cabin_settings_pane").style.display = "block";
    document.getElementById("sp_forms_main_class_guests_cabin_settings_pane").style.display = "block";

    document.getElementById("sp_select_trip_round_settings_pane").style.display = "none";
    document.getElementById("sp_add_travelers_settings_pane").style.display = "none";
}
function sp_show_travelers_settings_pane(){
    document.getElementById("sp_add_travelers_settings_pane").style.display = "block";
    document.getElementById("sp_forms_main_class_guests_cabin_settings_pane").style.display = "block";

    document.getElementById("sp_select_trip_round_settings_pane").style.display = "none";
    document.getElementById("sp_select_cabin_settings_pane").style.display = "none";
}

//-------------------------------
function sp_select_cabin_type(type="economy"){
    let flight_search_data = JSON.parse(localStorage.getItem("search_obj"));

    Array.from(document.getElementsByClassName("sp_select_cabin_type_chk")).forEach( each=> {
        each.checked = false;
    });
    if(type === "cheapest"){
        document.getElementById("sp_select_cabin_cheapest_chk").checked = true;
        document.getElementById("sp_select_cabin_type_main_input_display").innerHTML = `
            <i style="fontSize: 15px; margin-right: 10px" class="fa fa-level-up"></i>
            Cheapest
            <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>
        `;
        flight_search_data.itinerary.cabin = "LCC";
    }else if(type === "economy"){
        document.getElementById("sp_select_cabin_economy_chk").checked = true;
        document.getElementById("sp_select_cabin_type_main_input_display").innerHTML = `
            <i style="fontSize: 15px; margin-right: 10px" class="fa fa-level-up"></i>
            Economy
            <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>
        `;
        flight_search_data.itinerary.cabin = "ECONOMY";
    }else if(type === "premium"){
        document.getElementById("sp_select_cabin_premium_chk").checked = true;
        document.getElementById("sp_select_cabin_type_main_input_display").innerHTML = `
            <i style="fontSize: 15px; margin-right: 10px" class="fa fa-level-up"></i>
            Premium
            <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>
        `;
        flight_search_data.itinerary.cabin = "PREMIUM";
    }else if(type === "business"){
        document.getElementById("sp_select_cabin_business_chk").checked = true;
        document.getElementById("sp_select_cabin_type_main_input_display").innerHTML = `
            <i style="font-size: 15px; margin-right: 10px" class="fa fa-level-up"></i>
            Business
            <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>
        `;
        flight_search_data.itinerary.cabin = "BUSINESS";
    }else if(type === "first"){
        document.getElementById("sp_select_cabin_first_chk").checked = true;
        document.getElementById("sp_select_cabin_type_main_input_display").innerHTML = `
            <i style="fontSize: 15px; margin-right: 10px" class="fa fa-level-up"></i>
            First
            <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>
        `;
        flight_search_data.itinerary.cabin = "FIRST";
    }
    window.localStorage.setItem("search_obj", JSON.stringify(flight_search_data));
}

function sp_select_trip_round(type="one-way", start_date="", end_date=""){
    let flight_search_data = JSON.parse(localStorage.getItem("search_obj"));

    Array.from(document.getElementsByClassName("sp_select_trip_round_chk")).forEach( each=> {
        each.checked = false;
    });
    if(type === "round-trip"){
        document.getElementById("sp_trip_round_round_trip_chk").checked = true;
        document.getElementById("sp_select_trip_round_main_input_display").innerHTML = `
            <i style="fontSize: 15px; margin-right: 10px" class="fa fa-repeat"></i>
            Round-trip
            <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>
        `;
        flight_search_data.type = "round-trip";
        SpDateChoosersInit(CONSTANTS.round_trip, start_date, end_date);
        if(document.getElementById("sp_departure_return_dates_input"))
            document.getElementById("sp_departure_return_dates_input").placeholder="departure - return";
    }else if(type === "one-way"){
        document.getElementById("sp_trip_round_one_way_chk").checked = true;
        document.getElementById("sp_select_trip_round_main_input_display").innerHTML = `
            <i style="font-size: 15px; margin-right: 10px" class="fa fa-repeat"></i>
            One-way
            <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>
        `;
        flight_search_data.type = "one-way";
        SpDateChoosersInit(CONSTANTS.one_way, start_date, end_date);
        if(document.getElementById("sp_departure_return_dates_input"))
            document.getElementById("sp_departure_return_dates_input").placeholder="departure";
    }else if(type === "multi-city"){
        document.getElementById("sp_trip_round_multi_city_chk").checked = true;
        document.getElementById("sp_select_trip_round_main_input_display").innerHTML = `
            <i style="fontSize: 15px; margin-right: 10px" class="fa fa-repeat"></i>
            Multi-city
            <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>
        `;
        flight_search_data.type = "multi-city";
    }
    window.localStorage.setItem("search_obj", JSON.stringify(flight_search_data));
}

let travelers = {
    adults: 0,
    children: 0,
    infants: 0,
}
function sp_add_traveler(type="adult"){
    
    if((travelers.adults + travelers.children + travelers.infants) > 14){
        alert("only maximum of 15 travelers allowed")
        return;
    }

    if(type === "adult"){
        travelers.adults += 1;

        if(travelers.adults > 1 && travelers.infants == 0 && travelers.children == 0){
            document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                ${travelers.adults} Adults
                <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>`;
        }else{
            (travelers.adults + travelers.children + travelers.infants) > 1 ?
                document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                    <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                    ${travelers.adults + travelers.children + travelers.infants} Travelers
                ` : document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                        <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                        ${travelers.adults} Adult
                        <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>
                    `
        }

        document.getElementById("sp_add_travelers_display_adults_number").innerHTML = travelers.adults;
    }else if(type === "child"){
        travelers.children += 1;

        if(travelers.children > 1 && travelers.infants == 0 && travelers.adults == 0){
            document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                ${travelers.children} Children
                <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>`;
        }else{
            (travelers.adults + travelers.children + travelers.infants) > 1 ?
                document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                    <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                    ${travelers.adults + travelers.children + travelers.infants} Travelers
                `: document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                        <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                        ${travelers.children} Child
                        <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>
                    `
        }
            document.getElementById("sp_add_travelers_display_children_number").innerHTML = travelers.children;
    }else if(type === "infant"){
        travelers.infants += 1;

        if(travelers.infants > 1 && travelers.children == 0 && travelers.adults == 0){
            document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                ${travelers.infants} Infants
                <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>`;
        }else{
            (travelers.adults + travelers.children + travelers.infants) > 1 ?
                document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                    <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                    ${travelers.adults + travelers.children + travelers.infants} Travelers
                `: document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                    <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                    ${travelers.infants} Infant
                    <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>
            `
        }
        
        document.getElementById("sp_add_travelers_display_infants_number").innerHTML = travelers.infants;
    }

    //adding current travelers setting to local storage
    let flight_search_data = JSON.parse(localStorage.getItem("search_obj"));
    flight_search_data.itinerary.travelers.adults = travelers.adults;
    flight_search_data.itinerary.travelers.children = travelers.children;
    flight_search_data.itinerary.travelers.infants = travelers.infants;
    window.localStorage.setItem("search_obj", JSON.stringify(flight_search_data));
}

function sp_remove_traveler(type="adult"){

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
            document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                ${travelers.adults} Adults
                <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>`;
        }else if(travelers.adults < 1 && travelers.infants > 0 && travelers.children == 0){
            if(travelers.infants > 1 && travelers.children == 0 && travelers.adults == 0){
                document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                    <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                    ${travelers.infants} Infants`;
            }else{
                (travelers.adults + travelers.children + travelers.infants) > 1 ?
                    document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                        <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                        ${travelers.adults + travelers.children + travelers.infants} Travelers
                    `: document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                        <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                        ${travelers.infants} Infant
                        <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>
                `
            }
        }else if(travelers.adults < 1 && travelers.infants == 0 && travelers.children > 0){
            if(travelers.children > 1 && travelers.infants == 0 && travelers.adults == 0){
                document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                    <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                    ${travelers.children} Children
                    <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>`;
            }else{
                (travelers.adults + travelers.children + travelers.infants) > 1 ?
                    document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                        <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                        ${travelers.adults + travelers.children + travelers.infants} Travelers
                    `: document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                            <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                            ${travelers.children} Child
                            <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>
                        `
            }
        }else{
            (travelers.adults + travelers.children + travelers.infants) > 1 ?
                document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                    <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                    ${travelers.adults + travelers.children + travelers.infants} Travelers
                    <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>
                ` : document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                        <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                        ${travelers.adults} Adult
                        <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>
                    `
        }

        document.getElementById("sp_add_travelers_display_adults_number").innerHTML = travelers.adults;
    }else if(type === "child"){
        if((travelers.children-1)<0){
            return;
        }
        travelers.children -= 1;
        if(travelers.children > 1 && travelers.infants == 0 && travelers.adults == 0){
            document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                ${travelers.children} Children
                <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>`;
        }else if(travelers.adults == 0 && travelers.infants > 0 && travelers.children < 1){
            if(travelers.infants > 1 && travelers.children == 0 && travelers.adults == 0){
                document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                    <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                    ${travelers.infants} Infants
                    <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>`;
            }else{
                (travelers.adults + travelers.children + travelers.infants) > 1 ?
                    document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                        <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                        ${travelers.adults + travelers.children + travelers.infants} Travelers
                        <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>
                    `: document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                        <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                        ${travelers.infants} Infant
                        <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>
                `
            }
        }else if(travelers.adults > 0 && travelers.infants == 0 && travelers.children < 1){
            if(travelers.adults > 1 && travelers.infants == 0 && travelers.children == 0){
                document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                    <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                    ${travelers.adults} Adults
                    <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>`;
            }else{
                (travelers.adults + travelers.children + travelers.infants) > 1 ?
                    document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                        <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                        ${travelers.adults + travelers.children + travelers.infants} Travelers
                        <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>
                    ` : document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                            <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                            ${travelers.adults} Adult
                            <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>
                        `
            }
        }else{
            (travelers.adults + travelers.children + travelers.infants) > 1 ?
                document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                    <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                    ${travelers.adults + travelers.children + travelers.infants} Travelers
                `: document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                        <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                        ${travelers.children} Child
                        <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>
                    `
        }

        document.getElementById("sp_add_travelers_display_children_number").innerHTML = travelers.children;
    }else if(type === "infant"){
        if((travelers.infants-1)<0){
            return;
        }
        travelers.infants -= 1;
        if(travelers.infants > 1 && travelers.children == 0 && travelers.adults == 0){
            document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                ${travelers.infants} Infants
                <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>`;
        }else if(travelers.adults == 0 && travelers.infants < 1 && travelers.children > 0){
            if(travelers.infants > 1 && travelers.children == 0 && travelers.adults == 0){
                document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                    <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                    ${travelers.infants} Infants
                    <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>`;
            }else{
                (travelers.adults + travelers.children + travelers.infants) > 1 ?
                    document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                        <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                        ${travelers.adults + travelers.children + travelers.infants} Travelers
                    `: document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                        <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                        ${travelers.infants} Infant
                        <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>
                `
            }
        }else if(travelers.adults > 0 && travelers.infants < 1 && travelers.children == 0){
            if(travelers.adults > 1 && travelers.infants == 0 && travelers.children == 0){
                document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                    <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                    ${travelers.adults} Adults
                    <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>`;
            }else{
                (travelers.adults + travelers.children + travelers.infants) > 1 ?
                    document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                        <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                        ${travelers.adults + travelers.children + travelers.infants} Travelers
                    ` : document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                            <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                            ${travelers.adults} Adult
                            <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>
                        `
            }
        }else{
            (travelers.adults + travelers.children + travelers.infants) > 1 ?
                document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                    <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                    ${travelers.adults + travelers.children + travelers.infants} Travelers
                    <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>
                `: document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                    <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                    ${travelers.infants} Infant
                    <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>
            `
        }
        
        document.getElementById("sp_add_travelers_display_infants_number").innerHTML = travelers.infants;
    }

    //adding current travelers setting to local storage
    let flight_search_data = JSON.parse(localStorage.getItem("search_obj"));
    flight_search_data.itinerary.travelers.adults = travelers.adults;
    flight_search_data.itinerary.travelers.children = travelers.children;
    flight_search_data.itinerary.travelers.infants = travelers.infants;
    window.localStorage.setItem("search_obj", JSON.stringify(flight_search_data));
}

function sp_set_default_travelers(travelers_p){

    document.getElementById("sp_add_travelers_display_adults_number").innerHTML="0";
    document.getElementById("sp_add_travelers_display_children_number").innerHTML="0";
    document.getElementById("sp_add_travelers_display_infants_number").innerHTML="0";

    travelers=travelers_p;

    if((travelers_p.adults + travelers_p.children + travelers_p.infants) > 14){
        alert("only maximum of 15 travelers allowed")
        return;
    }

    if(travelers_p?.adults>0){
        if(travelers_p.adults > 1 && travelers_p.infants === 0 && travelers_p.children === 0){
            document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                ${travelers_p.adults} Adults
                <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>`;
        }else{
            (travelers_p.adults + travelers_p.children + travelers_p.infants) > 1 ?
                document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                    <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                    ${travelers_p.adults + travelers_p.children + travelers_p.infants} Travelers
                ` : document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                        <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                        ${travelers_p.adults} Adult
                        <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>
                    `
        }

        document.getElementById("sp_add_travelers_display_adults_number").innerHTML = travelers_p.adults;
    }
    if(travelers_p?.children>0){
        if(travelers_p.children > 1 && travelers_p.infants === 0 && travelers_p.adults === 0){
            document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                ${travelers_p.children} Children
                <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>`;
        }else{
            (travelers_p.adults + travelers_p.children + travelers_p.infants) > 1 ?
                document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                    <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                    ${travelers_p.adults + travelers_p.children + travelers_p.infants} Travelers
                `: document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                        <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                        ${travelers_p.children} Child
                        <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>
                    `
        }
        document.getElementById("sp_add_travelers_display_children_number").innerHTML = travelers_p.children;
    }
    if(travelers_p?.infants>0){
        if(travelers_p.infants > 1 && travelers_p.children === 0 && travelers_p.adults === 0){
            document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                ${travelers_p.infants} Infants
                <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>`;
        }else{
            (travelers_p.adults + travelers_p.children + travelers_p.infants) > 1 ?
                document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                    <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                    ${travelers_p.adults + travelers_p.children + travelers_p.infants} Travelers
                `: document.getElementById("sp_add_travelers_main_input_display").innerHTML = `
                    <i style="fontSize: 15px; margin-right: 10px" class="fa fa-user"></i>
                    ${travelers_p.infants} Infant
                    <i style={{marginLeft: 10, color: "rgb(43, 52, 61)"}} className="fa fa-angle-down"></i>
            `
        }
        
        document.getElementById("sp_add_travelers_display_infants_number").innerHTML = travelers_p.infants;
    }

    //adding current travelers setting to local storage
    let flight_search_data = JSON.parse(localStorage.getItem("search_obj"));
    flight_search_data.itinerary.travelers.adults = travelers_p.adults;
    flight_search_data.itinerary.travelers.children = travelers_p.children;
    flight_search_data.itinerary.travelers.infants = travelers_p.infants;
    window.localStorage.setItem("search_obj", JSON.stringify(flight_search_data));
}

export default SearchForm;