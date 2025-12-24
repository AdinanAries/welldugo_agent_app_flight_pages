import React, { useState, useEffect } from "react";
import SearchResultSearchForm from "./SearchResultSearchForm";
import ResultsListContainer from "./ResultsListContainer";
import CONSTANTS from "../../../Constants/Constants";
import SelectedTicketPane from "./SelectedTicketPane";
import { fetchFlightOffers } from "../../../services/flightsServices";
import { postLinkVistedTransaction } from "../../../services/agentServices";
import Weather from "../../../helpers/Weather";
import Tourism from "../../../helpers/Tourism";
import { show_prompt_on_Bot_AD_tips_popup } from "../../../components/HPSupport";
import { getDataSummeries } from "../../../helpers/FlightsFilterHelpers";
import { 
    getClient,
    has_data_provider,
} from "../../../helpers/general";
import { FLIGHT_DATA_ADAPTER } from "../../../helpers/FlightDataAdapter";
import LOGO_PLACEHOLDER from "../../../LOGO_PLACEHOLDER.jpg";
import { saveBookedItineraryItem } from "../../../services/agentServices";

// Type 2
import FlightSearchResults from "../Type2/Pages/FlightSearchResults";

const SearchPageMain = (props) => {

    const {
        change_product_type,
        productType,
        agentDetails,
        bookingEngine,
        hasNewMessageFromParent,
        currentParentMessge,
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
    const [ flights, setFlights ] = useState([]);
    const [ adaptedFlights, setAdaptedFlights ] = useState([]);
    const [ data_provider, setDataProvider ] = useState(CONSTANTS?.duffel);
    const [ providerDictionary, setProviderDictionary ] = useState({});
    const [ loading, setLoading ] = useState(true);
    const [ selectedFlightId, setSelectedFlightId ] = useState("");
    const [ selectedFlightData, setSelectedFlightData ] = useState(null);
    // Search object that was sent to the server
    const SEARCH_OBJ=JSON.parse(localStorage.getItem(CONSTANTS.local_storage.flight_search_object));
    
    let searchObjectIncomplete = false;
    if(CONSTANTS.product_types.flights===parseInt(productType)){
        if(
            !SEARCH_OBJ?.type ||
            !SEARCH_OBJ?.itinerary?.departure?.airport ||
            !SEARCH_OBJ?.itinerary?.departure?.date ||
            !SEARCH_OBJ?.itinerary?.arrival?.airport ||
            //!SEARCH_OBJ?.itinerary?.arrival?.date || only for round trip
            !SEARCH_OBJ?.itinerary?.cabin ||
            !SEARCH_OBJ?.itinerary?.travelers?.adults
        ){
            searchObjectIncomplete = true;
        }
    }

    const selectFlightOffer = (id_or_data) => {
        if(typeof id_or_data === "string"){
            setSelectedFlightId(id_or_data);
        }else{
            setSelectedFlightData(id_or_data);
        }
    }

    const unselectFlightOffer = () => {
        setSelectedFlightId("");
        setSelectedFlightData(null);
    }

    useEffect(() => {
       setFlightsResults();
    }, []);

    useEffect(()=>{
        (async()=>{
            if(flights?.length>0){
                let __FLIGHTS = [];
                for(let i=0; i<flights.length; i++){
                    const FLIGHT = await FLIGHT_DATA_ADAPTER.adapt(flights[i], data_provider, providerDictionary);
                    __FLIGHTS?.push(FLIGHT);
                }
                setAdaptedFlights(__FLIGHTS);
            }else{
                setAdaptedFlights([]);
            }
        })();
    }, [flights, providerDictionary, data_provider]);

    useEffect(()=>{
        if(flights){
            if(flights?.length>0 
                && (canShowPrice?.show && 
                    (!canShowPrice?.with_price_bound_profit || PriceMarkupValue?.value))
            )
                runBotPrompt(flights);
            //else
                //runBotPrompt();
        }
    }, [adaptedFlights, /*PriceMarkupValue,*/ canShowPrice])

    const setFlightsResults = async () => {

        if(searchObjectIncomplete){
            setFlights([]);
            setAdaptedFlights([]);
            setLoading(false);
            return;
        }

        // Do the fetch to get the flights from the server
        let res = await fetchFlightOffers();
            //console.log('Flight Offers:', res);

            if(res?.data_provider)
                setDataProvider(res?.data_provider);
            else
                setDataProvider(""); 

            const flights_data = FLIGHT_DATA_ADAPTER?.get_flight_offers_from_response(res, res?.data_provider, setProviderDictionary);
            if(flights_data){
                if(flights_data?.length>0){
                    setFlights(flights_data);
                }else{
                    setFlights([]);
                }
            }else{
                setFlights([]);
                setAdaptedFlights([]);
            }

            setLoading(false);

        // Send back message to oc about sucess status of search link verification
        if(localStorage.getItem("verify_search_link")){
            let __results_data = {};
            if(res?.data?.length>0){
                __results_data = {
                    ...__results_data,
                    status: "success",
                    total_results: res?.data?.length,
                }
            } else {
                __results_data = {
                    ...__results_data,
                    status: "fail",
                    total_results: 0,
                }
            }
            let _msg_to_send = JSON.parse(localStorage.getItem("verify_search_link"));

            const __obj = _msg_to_send?.postBody?.item;
            const agentToKen = __obj?.userToken;
            const __obj_to_save = {
                user_id: __obj?.user_id,
                itinerary_id: __obj?.itinerary_id, 
                booking_id: "",
                confirmation_number: "",
                product_type: __obj?.product_type,
                item_id: __obj?.item_id,
                item_details: __obj?.item_details,
                link_type: "search_link", 
                url_link: __obj?.link, 
                is_booked: false, 
                customer_email: "",
                is_verified: true,
            }
            const booked_itin_item_res = await saveBookedItineraryItem(__obj_to_save, agentToKen);
            if(booked_itin_item_res?._id){
                alert("Link saved to list of search links for this item!!");
            }else{
                alert("Link was verified! However, Error occured during saving to list of links for this item!");
            }
            delete _msg_to_send.from_welldugo_oc;
            _msg_to_send = {
                ..._msg_to_send,
                from_welldugo_agent_app: true,
                search_arams: SEARCH_OBJ,
                results_data: __results_data,
            }
            localStorage.removeItem("verify_search_link");
            window.parent.postMessage(JSON.stringify(_msg_to_send), "*");
        }
    }

    const submitFromSearchPage = async () => {
        window.location.reload();
    }

    if(flights.length>0){
        if(has_data_provider(data_provider)){
            SEARCH_OBJ.origin_city = FLIGHT_DATA_ADAPTER?.adapt(flights?.[0], data_provider, providerDictionary).slices?.[0].segments?.[0].origin?.city_name;
            SEARCH_OBJ.destination_city = FLIGHT_DATA_ADAPTER?.adapt(flights?.[0], data_provider, providerDictionary).slices?.[0].segments?.[0].destination?.city_name;
        }
    }
    useEffect(()=>{
        global.autoSelectAirportForInputField(SEARCH_OBJ.itinerary.departure.airport, "sp_search_forms_from_where_input_fld");
        global.autoSelectAirportForInputField(SEARCH_OBJ.itinerary.arrival.airport, "sp_search_forms_to_where_input_fld");
    }, []);

    useEffect(()=>{
        // Set corresponding product type here
        if(currentParentMessge?.postBody?.item?.product_type){
            if(currentParentMessge?.postBody?.item?.product_type==="flight"){
                change_product_type(0)
            }else if(currentParentMessge?.postBody?.item?.product_type==="hotel"){
                change_product_type(1)
            }else if(currentParentMessge?.postBody?.item?.product_type==="rental_car"){
                change_product_type(2)
            }
        }
    }, [currentParentMessge]);

    useEffect(()=>{
        // Getting Weather

    }, []);

    const runBotPrompt = (flights=null) => {
        if(has_data_provider(data_provider)){
            let lon = parseFloat(SEARCH_OBJ?.itinerary?.arrival?.longitude);
            let lat = parseFloat(SEARCH_OBJ?.itinerary?.arrival?.latitude);
            let iso_date;
            let flightsOffers;
            if(!flights){
                flightsOffers={isError: true}
                iso_date = SEARCH_OBJ?.itinerary?.departure?.date;
            }
            else{
                flightsOffers=flights;
                iso_date=flightsOffers?.[0]?.slices?.[0]?.segments?.[0]?.arriving_at?.split("T")[0];
            }
            Weather.getWeather(lon, lat, iso_date, iso_date, weatherCallback, flightsOffers);
        }
    }

    const weatherCallback = async (weatherData, flightsOffers={isError: true}) => {
        //console.log('Weather', weatherData);
        const PROMPTS=["*", "summaries", "weather", "places"];
        const TO_SHOW=PROMPTS[Math.floor(Math.random() * PROMPTS.length)]
        // Duration of the Prompt
        let duration=150000;

        // Showing places bot prompt
        if(TO_SHOW==="places"){
            let lon = parseFloat(SEARCH_OBJ?.itinerary?.arrival?.longitude);
            let lat = parseFloat(SEARCH_OBJ?.itinerary?.arrival?.latitude);
            Tourism.getTouristAttraction(lon, lat, (touristAttraction) => {
                //console.log("Search Page Attraction", touristAttraction);
                if(touristAttraction?.error || !touristAttraction?.name){
                    // Fall back on Summaries
                    if(flightsOffers?.isError){
                        // Do nothing for now
                    }else{
                        getAndShowBotFlightSummaryPrompt(flightsOffers, duration)
                    }
                    return;
                }
                let place=touristAttraction;
                let prompt_msg = Tourism.getBotPromptMessage(place);
                show_prompt_on_Bot_AD_tips_popup(
                    prompt_msg,
                    CONSTANTS.bot.prompt_types.prompt,
                    duration,
                    {
                        places: place
                    }
                );
            });

            return;
        }

        if(weatherData?.error || TO_SHOW==="summaries"){
            // Error handling
            if(flightsOffers?.isError){
                // Do nothing for now
            }else{
                getAndShowBotFlightSummaryPrompt(flightsOffers, duration)
            }
            return;
        }
        let current_hour=0;
        if(flightsOffers?.isError){
            current_hour = new Date().toString().split(" ")[4].split(":")[0];
        }else{
            current_hour=flightsOffers[0]?.slices[0]?.segments[0]?.arriving_at?.split("T")[1]?.split(":")[0];
        }

        let current_hour_weather = {};
        let i = parseInt(current_hour);
        current_hour_weather.time = weatherData?.hourly?.time?.[i]; //.toISOString();
        current_hour_weather.temperature2m=weatherData?.hourly?.temperature2m?.[i];
        current_hour_weather.relativeHumidity2m=weatherData?.hourly?.relativeHumidity2m?.[i];
        current_hour_weather.dewPoint2m=weatherData?.hourly?.dewPoint2m?.[i];
        current_hour_weather.apparentTemperature=weatherData?.hourly?.apparentTemperature?.[i];
        current_hour_weather.precipitationProbability=weatherData?.hourly?.precipitationProbability?.[i];
        current_hour_weather.precipitation=weatherData?.hourly?.precipitation?.[i];
        current_hour_weather.rain=weatherData?.hourly?.rain?.[i];
        current_hour_weather.showers=weatherData?.hourly?.showers?.[i];
        current_hour_weather.snowfall=weatherData?.hourly?.snowfall?.[i];
        current_hour_weather.snowDepth=weatherData?.hourly?.snowDepth?.[i];
        current_hour_weather.weatherCode=weatherData?.hourly?.weatherCode?.[i];
        current_hour_weather.pressureMsl=weatherData?.hourly?.pressureMsl?.[i];
        current_hour_weather.surfacePressure=weatherData?.hourly?.surfacePressure?.[i];
        current_hour_weather.cloudCover=weatherData?.hourly?.cloudCover?.[i];
        current_hour_weather.cloudCoverLow=weatherData?.hourly?.cloudCoverLow?.[i];
        current_hour_weather.cloudCoverMid=weatherData?.hourly?.cloudCoverMid?.[i];
        current_hour_weather.cloudCoverHigh=weatherData?.hourly?.cloudCoverHigh?.[i];
        current_hour_weather.visibility=weatherData?.hourly?.visibility?.[i];
        current_hour_weather.evapotranspiration=weatherData?.hourly?.evapotranspiration?.[i];
        current_hour_weather.et0FaoEvapotranspiration=weatherData?.hourly?.et0FaoEvapotranspiration?.[i];
        current_hour_weather.vapourPressureDeficit=weatherData?.hourly?.vapourPressureDeficit?.[i];
        current_hour_weather.windSpeed10m=weatherData?.hourly?.windSpeed10m?.[i];
        current_hour_weather.windSpeed80m=weatherData?.hourly?.windSpeed80m?.[i];
        current_hour_weather.windSpeed120m=weatherData?.hourly?.windSpeed120m?.[i];
        current_hour_weather.windSpeed180m=weatherData?.hourly?.windSpeed180m?.[i];
        current_hour_weather.windDirection10m=weatherData?.hourly?.windDirection10m?.[i];
        current_hour_weather.windDirection80m=weatherData?.hourly?.windDirection80m?.[i];
        current_hour_weather.windDirection120m=weatherData?.hourly?.windDirection120m?.[i];
        current_hour_weather.windDirection180m=weatherData?.hourly?.windDirection180m?.[i];
        current_hour_weather.windGusts10m=weatherData?.hourly?.windGusts10m?.[i];
        current_hour_weather.temperature80m=weatherData?.hourly?.temperature80m?.[i];
        current_hour_weather.temperature120m=weatherData?.hourly?.temperature120m?.[i];
        current_hour_weather.temperature180m=weatherData?.hourly?.temperature180m?.[i];
        current_hour_weather.soilTemperature0cm=weatherData?.hourly?.soilTemperature0cm?.[i];
        current_hour_weather.soilTemperature6cm=weatherData?.soilTemperature6cm?.[i];
        current_hour_weather.soilTemperature18cm=weatherData?.hourly?.soilTemperature18cm?.[i];
        current_hour_weather.soilTemperature54cm=weatherData?.hourly?.soilTemperature54cm?.[i];
        current_hour_weather.soilMoisture0To1cm=weatherData?.hourly?.soilMoisture0To1cm?.[i];
        current_hour_weather.soilMoisture1To3cm=weatherData?.hourly?.soilMoisture1To3cm?.[i];
        current_hour_weather.soilMoisture3To9cm=weatherData?.hourly?.soilMoisture3To9cm?.[i];
        current_hour_weather.soilMoisture9To27cm=weatherData?.hourly?.soilMoisture9To27cm?.[i];
        current_hour_weather.soilMoisture27To81cm=weatherData?.hourly?.soilMoisture27To81cm?.[i];
        current_hour_weather.icon=Weather.getCurrentWeatherIcon(current_hour_weather, current_hour);
        current_hour_weather.city=weatherData?.city;
        current_hour_weather.description=Weather.getWeatherCodeDescription(current_hour_weather?.weatherCode);

        if(flightsOffers?.isError || TO_SHOW==="weather"){ // Flight Offers Were Not Available
            let prompt_msg=Weather.getWeatherPromptMsgDestinationCity(current_hour_weather);
            show_prompt_on_Bot_AD_tips_popup(
                prompt_msg,
                CONSTANTS.bot.prompt_types.prompt,
                duration,
                {
                    weather: true,
                    data: current_hour_weather
                }
            );
        }else{ // Both Weather and Summaries
            let summeries = await getDataSummeries(flightsOffers, data_provider, providerDictionary, adaptedFlights);
            //console.log("SUUUUUUUUUUUUUUUUMMMM", summeries)
            let prompt_msg = Weather.getWeatherPromptMsgDestinationCityAndSummeries(current_hour_weather);
            show_prompt_on_Bot_AD_tips_popup(
                prompt_msg,
                CONSTANTS.bot.prompt_types.prompt,
                duration,
                {
                    weather: true,
                    data: current_hour_weather,
                    flight_data_summeries: summeries,
                    Price_markup_value: PriceMarkupValue,
                    can_show_price: canShowPrice,
                }
            );
        }

    }


    const getAndShowBotFlightSummaryPrompt = async (flightsOffers, duration) => {
        let summeries = await getDataSummeries(flightsOffers, data_provider, providerDictionary, adaptedFlights);
        //console.log("SUUUUUUUUUUUUUUUUMMMM", summeries)
        let prompt_msg = Weather.getWeatherPromptMsgSummeries(flightsOffers);
        show_prompt_on_Bot_AD_tips_popup(
            prompt_msg,
            CONSTANTS.bot.prompt_types.prompt,
            duration,
            {
                flight_data_summeries: summeries,
                Price_markup_value: PriceMarkupValue,
                can_show_price: canShowPrice,
            }
        );
    }

    return (
        <main style={{background: "white"}}>
            <div className="wrapper search-page-wrapper">
                <div style={{paddingTop: 90}}>
                    <SearchResultSearchForm 
                        bookingEngine={bookingEngine}
                        agentDetails={agentDetails}
                        submitFromSearchPage={submitFromSearchPage} />
                    {
                        (
                            (hasNewMessageFromParent &&
                            currentParentMessge?.from_welldugo_oc &&
                            currentParentMessge?.type==="engine-parameters") ||
                            (localStorage.getItem("engine_parameters"))
                        ) && <div style={{backgroundColor: "crimson", padding: 20, marginTop: 5, borderRadius: 8}}>
                            <div className="wrapper">
                                <p style={{color: "white", fontSize: 13}}>
                                    <i style={{marginRight: 10, color: "yellow"}}
                                        className="fa-solid fa-exclamation-triangle"></i>
                                    This search is using search rules set from the operational center. These include price-bound type and profit, data supplier, etc. 
                                </p>
                                <div>
                                    <span onClick={()=>{
                                        if(localStorage.getItem("engine_parameters") && !currentParentMessge?.from_welldugo_oc && currentParentMessge?.type!=="engine-parameters"){
                                                const _msg_to_send = {
                                                    from_welldugo_agent_app: true,
                                                    type: "engine-parameters",
                                                    postBody: {} //empty object will reset on Parent (OC)
                                                }
                                                window.parent.postMessage(JSON.stringify(_msg_to_send), "*");
                                            }
                                            localStorage.removeItem("engine_parameters");
                                            window.location.reload();
                                        }}
                                        style={{color: "yellow", cursor: "pointer", fontSize: 13, textDecoration: "underline"}}
                                    >
                                        Click Here To Reset Booking Engine
                                    </span>
                                </div>
                            </div>
                        </div>
                    }
                    {
                        searchObjectIncomplete ?
                        <>
                            {/*<FlightSearchResults />*/}
                            {
                                !bookingEngine?.hideGreetingsCard ?
                                <div style={{paddingBottom: 20}}>
                                    <div style={{padding: "30px 20px", margin: "60px 10px", marginBottom: 50, 
                                            backgroundColor: bookingEngine?.greetingsCardBg, 
                                            borderRadius: bookingEngine?.greetingsCardBorderRadius}}>
                                        <p style={{border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "rgba(255,255,255,0.1)", marginBottom: 30, padding: 20, display: "flex", justifyContent: "center", 
                                            color: bookingEngine?.greetingsCardTextColor}}>
                                            <i style={{marginRight: 10, color: "red"}}
                                                className="fa-solid fa-exclamation-triangle"></i>
                                            Please complete the search form to begin search...
                                        </p>
                                        <div style={{display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column"}}>
                                            {
                                                !bookingEngine?.hideCompanyLogo &&
                                                <div>
                                                    <img style={{width: 60}}
                                                        src={LOGO_PLACEHOLDER}/>
                                                </div>
                                            }
                                            <div style={{marginTop: 5}}>
                                                {
                                                    !bookingEngine?.hideCompanyName &&
                                                    <h1 style={{color: bookingEngine?.greetingsCardTextColor, fontSize: 20, textAlign: "center"}}>
                                                        {
                                                            agentDetails?.company_info?.business_name ||
                                                            "Business Name"
                                                        }
                                                    </h1>
                                                }
                                                <p style={{fontWeight: "bolder", fontSize: 12, color: bookingEngine?.greetingsCardTitleColor, textAlign: "center", marginBottom: 15, marginTop: 20, letterSpacing: 0.5, fontFamily: "Courgette"}}>
                                                        - Agent Details -</p>
                                                <p style={{ display: "flex", justifyContent: "center", 
                                                    color: bookingEngine?.greetingsCardTextColor, marginTop: 10}}>
                                                    <i style={{marginRight: 10, color: bookingEngine?.greetingsCardIconColor}}
                                                        className="fa-solid fa-user-tie"></i>
                                                    {(agentDetails?.first_name)} {(agentDetails?.last_name)}
                                                </p>
                                                <p style={{color: bookingEngine?.greetingsCardSecTextColor, fontSize: 13, textAlign: "center", marginTop: 5}}>
                                                    {agentDetails?.phone}, {agentDetails?.email}</p>
                                                <div className="footer_section_each_flex_section_container" style={{marginTop: 20}}>
                                                    <p style={{fontWeight: "bolder", color: bookingEngine?.greetingsCardTitleColor, fontSize: 12, textAlign: "center", marginBottom: 15, letterSpacing: 0.5, fontFamily: "Courgette"}}>
                                                        - Contact Us -</p>
                                                    <div style={{marginTop: 10}}>
                                                        <p style={{color: bookingEngine?.greetingsCardTextColor, textAlign: "center"}}>
                                                            <i style={{marginRight: 10, color: bookingEngine?.greetingsCardIconColor, marginBottom: 8}} className="fa fa-envelope"></i>
                                                            {
                                                                agentDetails?.company_info?.business_email ||
                                                                "N/A"
                                                            }
                                                        </p>
                                                        <p style={{color: bookingEngine?.greetingsCardTextColor, textAlign: "center"}}>
                                                            <i style={{marginRight: 10, color: bookingEngine?.greetingsCardIconColor, marginBottom: 10}} className="fa fa-phone"></i>
                                                            {
                                                                agentDetails?.company_info?.business_phone ||
                                                                "N/A"
                                                            }
                                                        </p>
                                                        <p style={{color: bookingEngine?.greetingsCardIconColor, textAlign: "center"}}>
                                                            <span style={{padding: "5px", marginRight: 10, borderRadius: 4, cursor: "pointer"}}>
                                                                <i style={{marginBottom: 5, fontSize: 19}} className="fa fa-facebook"></i>
                                                            </span>
                                                            <span style={{padding: "5px", marginRight: 10, borderRadius: 4, cursor: "pointer"}}>
                                                                <i style={{marginBottom: 5, fontSize: 19}} className="fa fa-twitter"></i>
                                                            </span>
                                                            <span style={{padding: "5px", marginRight: 10, borderRadius: 4, cursor: "pointer"}}>
                                                                <i style={{marginBottom: 5, fontSize: 19}} className="fa fa-instagram"></i>
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> : 
                                <div style={{height: 300}}>
                                    <p style={{border: "1px solid rgba(255,0,0,0.1)", backgroundColor: "rgba(255,0,0,0.1)", marginTop: 50, padding: 20, display: "flex", justifyContent: "center"}}>
                                        <i style={{marginRight: 10, color: "red"}}
                                            className="fa-solid fa-exclamation-triangle"></i>
                                        Please complete the search form to begin search...
                                    </p>
                                </div>
                            }
                        </> :
                        <>
                            {
                               has_data_provider(data_provider) ?
                                <ResultsListContainer
                                    PriceMarkupValue={PriceMarkupValue}
                                    setPriceMarkupValue={setPriceMarkupValue}
                                    canShowPrice={canShowPrice}
                                    setCanShowPrice={setCanShowPrice}
                                    data_provider={data_provider}
                                    providerDictionary={providerDictionary}
                                    bookingEngine={bookingEngine}
                                    selectFlightOffer={selectFlightOffer}
                                    flights={flights} loading={loading}
                                    adaptedFlights={adaptedFlights}
                                    SEARCH_OBJ={SEARCH_OBJ}
                                    agentDetails={agentDetails}
                                    hasNewMessageFromParent={hasNewMessageFromParent}
                                    currentParentMessge={currentParentMessge}
                                /> : <div style={{padding: "10px 0"}}>
                                    <div style={{padding: 20, backgroundColor: "crimson", border: "2px dashed red", fontSize: 13}}>
                                        <p style={{fontSize: 13, color: "white"}}>
                                            <i style={{marginRight: 10, color: "yellow"}}
                                                className="fa-solid fa-exclamation-triangle"></i>
                                            Data Source Not Identified.
                                        </p>
                                    </div>
                                </div>
                            }
                        </>
                    }
                    {
                        (selectedFlightId || selectedFlightData) ?
                        <SelectedTicketPane
                            data_provider={data_provider}
                            providerDictionary={providerDictionary}
                            bookingEngine={bookingEngine}
                            selectedFlightId={selectedFlightId}
                            selectedFlightData={selectedFlightData}
                            unselectFlightOffer={unselectFlightOffer}
                            begin_checkout={props.begin_checkout}
                            hasNewMessageFromParent={hasNewMessageFromParent}
                            currentParentMessge={currentParentMessge}
                        />
                        : ""
                    }
                </div>
            </div>
        </main>
    );
}

export default SearchPageMain;
