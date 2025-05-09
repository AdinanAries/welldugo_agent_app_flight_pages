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
import { getClient } from "../../../helpers/general";
import LOGO_PLACEHOLDER from "../../../LOGO_PLACEHOLDER.jpg";

const SearchPageMain = (props) => {

    const {
        productType,
        agentDetails,
        bookingEngine,
    } = props;
    
    let [ flights, setFlights ] = useState([]);
    let [ loading, setLoading ] = useState(true);
    let [ selectedFlightId, setSelectedFlightId] = useState("");

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

    const selectFlightOffer = (id) => {
        setSelectedFlightId(id);
    }

    const unselectFlightOffer = () => {
        setSelectedFlightId("");
    }

    useEffect(() => {
       setFlightsResults();
    }, [])

    const setFlightsResults = async () => {

        if(searchObjectIncomplete){
            setFlights([]);
            setLoading(false);
            return;
        }

        // Do the fetch to get the flights from the server
        let res = await fetchFlightOffers();
            console.log('Flight Offers:', res);
            if(res?.data)
                (res?.data?.length>0) ? setFlights(res?.data) : setFlights([]);
            else
                setFlights([]);
            setLoading(false);

        if(res?.data)
            if(res?.data?.length>0)
                runBotPrompt(res?.data);
            else
                runBotPrompt();
        else
            runBotPrompt();
    }

    const submitFromSearchPage = async () => {
        window.location.reload();
    }

    if(flights.length>0){
        SEARCH_OBJ.origin_city = flights[0].slices[0].segments[0].origin.city_name;
        SEARCH_OBJ.destination_city = flights[0].slices[0].segments[0].destination.city_name;
    }
    useEffect(()=>{
        global.autoSelectAirportForInputField(SEARCH_OBJ.itinerary.departure.airport, "sp_search_forms_from_where_input_fld");
        global.autoSelectAirportForInputField(SEARCH_OBJ.itinerary.arrival.airport, "sp_search_forms_to_where_input_fld");
    }, []);

    useEffect(()=>{
        // Getting Weather

    }, []);

    const runBotPrompt = (flights=null) => {
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
            iso_date=flightsOffers[0]?.slices[0]?.segments[0]?.arriving_at?.split("T")[0];
        }
        Weather.getWeather(lon, lat, iso_date, iso_date, weatherCallback, flightsOffers);
    }

    const weatherCallback = (weatherData, flightsOffers={isError: true}) => {
        console.log('Weather', weatherData);
        const PROMPTS=["*", "summaries", "weather", "places"];
        const TO_SHOW=PROMPTS[Math.floor(Math.random() * PROMPTS.length)]
        // Duration of the Prompt
        let duration=150000;

        // Showing places bot prompt
        if(TO_SHOW==="places"){
            let lon = parseFloat(SEARCH_OBJ?.itinerary?.arrival?.longitude);
            let lat = parseFloat(SEARCH_OBJ?.itinerary?.arrival?.latitude);
            Tourism.getTouristAttraction(lon, lat, (touristAttraction) => {
                console.log("Search Page Attraction", touristAttraction);
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
            let summeries = getDataSummeries(flightsOffers);
            let prompt_msg = Weather.getWeatherPromptMsgDestinationCityAndSummeries(current_hour_weather);
            show_prompt_on_Bot_AD_tips_popup(
                prompt_msg,
                CONSTANTS.bot.prompt_types.prompt,
                duration,
                {
                    weather: true,
                    data: current_hour_weather,
                    flight_data_summeries: summeries
                }
            );
        }

    }


    const getAndShowBotFlightSummaryPrompt = (flightsOffers, duration) => {
        let summeries = getDataSummeries(flightsOffers);
        let prompt_msg = Weather.getWeatherPromptMsgSummeries(flightsOffers);
        show_prompt_on_Bot_AD_tips_popup(
            prompt_msg,
            CONSTANTS.bot.prompt_types.prompt,
            duration,
            {
                flight_data_summeries: summeries
            }
        );
    }

    return (
        <main style={{background: "white"}}>
            <div className="wrapper search-page-wrapper">
                <div style={{paddingTop: 90}}>
                    <SearchResultSearchForm 
                        bookingEngine={bookingEngine}
                        submitFromSearchPage={submitFromSearchPage} />
                    {
                        searchObjectIncomplete ?
                        <div style={{paddingBottom: 20}}>
                            <div style={{padding: "30px 20px", margin: "60px 10px", marginBottom: 50, 
                                    backgroundColor: bookingEngine?.headerBg, borderRadius: 10}}>
                                <p style={{border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "rgba(255,255,255,0.1)", marginBottom: 30, paddingTop: 20, paddingBottom: 20, display: "flex", justifyContent: "center", color: "white"}}>
                                    <i style={{marginRight: 10, color: "red"}}
                                        className="fa-solid fa-exclamation-triangle"></i>
                                    Please complete the search form to begin search...
                                </p>
                                <div style={{display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column"}}>
                                    <div>
                                        <img style={{width: 60}}
                                            src={LOGO_PLACEHOLDER}/>
                                    </div>
                                    <div style={{marginTop: 5}}>
                                        <h1 style={{color: bookingEngine?.headerCompanyTxtColor, fontSize: 20, textAlign: "center"}}>
                                            Business Name</h1>
                                        <p style={{fontWeight: "bolder", fontSize: 12, color: "#c751b9", textAlign: "center", marginBottom: 15, marginTop: 20, letterSpacing: 0.5, fontFamily: "Courgette"}}>
                                                - Agent Details -</p>
                                        <p style={{ display: "flex", justifyContent: "center", color: "white", marginTop: 10}}>
                                            <i style={{marginRight: 10, color: "rgba(255,255,255,0.8)"}}
                                                className="fa-solid fa-user-tie"></i>
                                            {(agentDetails?.first_name)} {(agentDetails?.last_name)}
                                        </p>
                                        <p style={{color: "rgba(255,255,255,0.8)", fontSize: 13, textAlign: "center", marginTop: 5}}>
                                            {agentDetails?.phone}, {agentDetails?.email}</p>
                                        <div className="footer_section_each_flex_section_container" style={{marginTop: 20}}>
                                            <p style={{fontWeight: "bolder", color: "#c751b9", fontSize: 12, textAlign: "center", marginBottom: 15, letterSpacing: 0.5, fontFamily: "Courgette"}}>
                                                - Contact Us -</p>
                                            <div style={{marginTop: 10}}>
                                                <p style={{color: "white", textAlign: "center"}}>
                                                    <i style={{marginRight: 10, opacity: 0.4, marginBottom: 8}} className="fa fa-envelope"></i>
                                                    business@email.com
                                                </p>
                                                <p style={{color: "white", textAlign: "center"}}>
                                                    <i style={{marginRight: 10, opacity: 0.4, marginBottom: 10}} className="fa fa-phone"></i>
                                                    +1 123-123-123
                                                </p>
                                                <p style={{color: "white", textAlign: "center"}}>
                                                    <span style={{padding: "5px", marginRight: 10, borderRadius: 4, cursor: "pointer"}}>
                                                        <i style={{opacity: 0.5, marginBottom: 5, fontSize: 19}} className="fa fa-facebook"></i>
                                                    </span>
                                                    <span style={{padding: "5px", marginRight: 10, borderRadius: 4, cursor: "pointer"}}>
                                                        <i style={{opacity: 0.5, marginBottom: 5, fontSize: 19}} className="fa fa-twitter"></i>
                                                    </span>
                                                    <span style={{padding: "5px", marginRight: 10, borderRadius: 4, cursor: "pointer"}}>
                                                        <i style={{opacity: 0.5, marginBottom: 5, fontSize: 19}} className="fa fa-instagram"></i>
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> :
                        <ResultsListContainer
                            selectFlightOffer={selectFlightOffer}
                            flights={flights} loading={loading}
                            SEARCH_OBJ={SEARCH_OBJ}
                        />
                        }
                    {
                        selectedFlightId ?
                        <SelectedTicketPane
                            selectedFlightId={selectedFlightId}
                            unselectFlightOffer={unselectFlightOffer}
                            begin_checkout={props.begin_checkout}
                        />
                        : ""
                    }
                </div>
            </div>
        </main>
    );
}

export default SearchPageMain;
