import deltaIcon from "../../../deltaIcon.png";
import airplane from "../../../icons/airplane.svg";
import plane_departure from "../../../airplane-departure.svg"
import missing_icon from "../../../missing.svg"
import FlightLoaderCard from "./FlightLoaderCard";
import FlightOfferItem from "./FlightOfferItem";
import { FLIGHT_DATA_ADAPTER } from "../../../helpers/FlightDataAdapter";
import SearchFilters from "./SearchFilters";
import SearchFiltersLoader from "./SearchFiltersLoader";
import MobileItinTopInfo from "./MobileItinTopInfo";
import MobileItinTopInfoLoader from "./MobileItinTopInfoLoader";
import Ads from "./Ads";
import DurationFilter from "./DurationFilter";
import BagsFilter from "./BagsFilter";
import TimesFilter from "./TimesFilter";
import { markup } from "../../../helpers/Prices";
import { 
    get_currency_symbol,
    add_commas_to_number,
} from "../../../helpers/general";
import { fetchAgentPriceMarkupInfo } from "../../../services/agentServices";
import { 
    duffelStopsAndPrices, 
    duffelAirlinesAndPrices, 
    getMinAndMaxPrice, 
    filterByMaxPrice,
    getMinAndMaxDuration,
    filterByMaxDuration,
    duffelTimesAndPrices,
    getMaxBags,
    filterByBags,
} from "../../../helpers/FlightsFilterHelpers";
import { useEffect, useState } from "react";
import { bubbleSort } from "../../../helpers/BubbleSort";

let filtersByStops={};
let filtersByAirlines={};
let filtersByTimes={};
let filtersByPrice={};
let filtersByDuration={};
let filtersByBags={};
let SORT;
if(window.localStorage.getItem("search_page_price_sort"))
    SORT = JSON.parse(window.localStorage.getItem("search_page_price_sort"));
else {
    SORT = 0;
}
export default function ResultsListContainer(props){

    const { 
        SEARCH_OBJ,
        bookingEngine,
        agentDetails,
        hasNewMessageFromParent,
        currentParentMessge,
        data_provider,
        providerDictionary,
        adaptedFlights,
        PriceMarkupValue,
        setPriceMarkupValue,
        canShowPrice,
        setCanShowPrice
    } = props;

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
                    //console.log(engine_parameters);
                }else{
                    _can_show_obj.with_price_bound_profit = false;
                    _can_show_obj.show = true;
                }
            }else{
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
    
    const [filterStops, setFilterStops] = useState([]);
    const [filterAirlines, setFilterAirlines] = useState([]);
    const [filterTimes, setFilterTimes] = useState([]);

    const [ filteredFlights, setFilteredFlights ] = useState([]);
    const [ priceSlider, setPriceSlider ] = useState(101);
    const [ isFiltersApplied, setIsFiltersApplied ] = useState(false);
    const [ flightsMinPrice, setFlightsMinPrice ] = useState(0);
    const [ flightsMaxPrice, setFlightsMaxPrice ] = useState(0);
    const [ flightsSliderMaxPrice, setFlightsSliderMaxPrice ] = useState(0);
    const [ SLIDER_MIN_PERCENT, setSliderMinPercent ] = useState(0);
    const [ isShowPriceGrid, setIsShowPriceGrid ] = useState(false);
    const [ isShowBagsFilter, setIsShowBagsFilter ] = useState(false);
    const [ isShowDurationFilter, setIsShowDurationFilter ] = useState(false);
    const [ isShowTimesFilter, setIsShowTimesFilter ] = useState(false);
    const [ flightsMinDuration, setFlightsMinDuration ] = useState(0);
    const [ flightsMaxDuration, setFlightsMaxDuration ] = useState(0);
    const [ flightsSliderMaxDuration, setFlightsSliderMaxDuration ] = useState(0);
    const [ durationSlider, setDurationSlider ] = useState(101);
    const [ D_SLIDER_MIN_PERCENT, setDSliderMinPercent ] = useState(0);
    const [ checkedBagsFilterQuantity, setCheckedBagsFilterQuantity] = useState(0);
    const [ carryOnBagsFilterQuantity, setCarryOnBagsFilterQuantity] = useState(0);
    const [ maxCheckedBagsFilter, setMaxCheckedBagsFilter ] = useState(0);
    const [ maxCarryOnBagsFilter, setMaxCarryOnBagsFilter ] = useState(0);
    const [ priceHighLowSort, setPriceHighLowSort] = useState(SORT); // [0 => Lowest, 1 => Highest]
    const [ FLIGHTS, SET_FLIGHTS ] = useState([]);

    const CURRENCY_SYMBOL = get_currency_symbol("usd");

    const hidePricesGrid = () => {
        setIsShowPriceGrid(false);
    }

    const showBagsFilter = () => {
        if(isShowBagsFilter)
            setIsShowBagsFilter(false);
        else
            setIsShowBagsFilter(true);
    }

    const hideBagsFilter = () => {
        setIsShowBagsFilter(false);
    }

    const showDurationFilter = () => {
        if(isShowDurationFilter)
            setIsShowDurationFilter(false);
        else
            setIsShowDurationFilter(true);
    }

    const hideTimesFilter = () => {
        setIsShowTimesFilter(false);
    }

    const showTimesFilter = () => {
        if(isShowTimesFilter)
            setIsShowTimesFilter(false);
        else
            setIsShowTimesFilter(true);
    }

    const hideDurationFilter = () => {
        setIsShowDurationFilter(false);
    }

    useEffect(()=>{

        (async()=>{
            if(adaptedFlights?.length>0){
                // Price
                const PRICE_RANGE = await getMinAndMaxPrice(props.flights, data_provider, providerDictionary, adaptedFlights);
                setFlightsMaxPrice(PRICE_RANGE.max_price);
                setFlightsMinPrice(PRICE_RANGE.min_price);
                setSliderMinPercent((PRICE_RANGE.min_price*100)/PRICE_RANGE.max_price);

                // Duration
                const DURATION_RANGE = await getMinAndMaxDuration(props.flights, data_provider, providerDictionary, adaptedFlights);
                setFlightsMaxDuration(DURATION_RANGE.max_duration);
                setFlightsMinDuration(DURATION_RANGE.min_duration);
                setDSliderMinPercent((DURATION_RANGE.min_duration*100)/DURATION_RANGE.max_duration);

                // Bags
                const MAX_BAGS = await getMaxBags(props.flights, data_provider, providerDictionary, adaptedFlights);
                setMaxCheckedBagsFilter(MAX_BAGS.maxCheckedBags); 
                setMaxCarryOnBagsFilter(MAX_BAGS.maxCarryOnBags);
            }
        })()
        
    }, [ props.flights, adaptedFlights ]);

    useEffect(()=>{

        (async ()=>{

            // Getting Filter - Flight Stops - Creates Filter Toggles
            let filter_stops = await duffelStopsAndPrices(props.flights, data_provider, providerDictionary, adaptedFlights);
            let filter_airlines = await duffelAirlinesAndPrices(props.flights, data_provider, providerDictionary, adaptedFlights);
            let filter_times = await duffelTimesAndPrices(props.flights, data_provider, providerDictionary, adaptedFlights);
            setFilterStops(filter_stops);
            // Getting Filter - Airlines - Creates Filter Toggles
            setFilterAirlines(filter_airlines);
            // Getting Filter - Take-off Times - Creates Filter Toggles
            setFilterTimes(filter_times);

            let _FLIGHTS=[];
            if((props.flights.length>0 && adaptedFlights.length>0) && filteredFlights?.length<1){

                // Sorting takes place here
                let _adapted_flights = bubbleSort(adaptedFlights, priceHighLowSort);
                let _flights = bubbleSort(props.flights, priceHighLowSort);

                for(let index=0; index<_flights?.length; index++){
                    const each = _adapted_flights[index]; // Equivalent Arrays
                    const raw = _flights[index]; // Equivalent Arrays
                    //const __Flight = await FLIGHT_DATA_ADAPTER?.adapt(each, data_provider, providerDictionary);
                    _FLIGHTS.push(<FlightOfferItem 
                        data_provider={data_provider}
                        bookingEngine={bookingEngine}
                        selectFlightOffer={props.selectFlightOffer}
                        key={index} 
                        index={index}
                        flight={each}
                        rawData={raw}
                        hasNewMessageFromParent={hasNewMessageFromParent}
                        currentParentMessge={currentParentMessge}
                    />);
                }

                SET_FLIGHTS(_FLIGHTS);
                
            }else if(Array.isArray(filteredFlights) && filteredFlights.length>0){

                for(let index=0; index<filteredFlights?.length; index++){
                    const each = filteredFlights[index];
                    const raw_data = await props.flights.find(raw=>raw.id===each.id); //to do //await FLIGHT_DATA_ADAPTER?.adapt(each, data_provider, providerDictionary);
                    _FLIGHTS.push(<FlightOfferItem 
                        data_provider={data_provider}
                        bookingEngine={bookingEngine}
                        selectFlightOffer={props.selectFlightOffer}
                        key={index} 
                        index={index}
                        flight={each}
                        rawData={raw_data}
                        hasNewMessageFromParent={hasNewMessageFromParent}
                        currentParentMessge={currentParentMessge}
                    />);
                }

                SET_FLIGHTS(_FLIGHTS);

            }else{

                SET_FLIGHTS(<div style={{padding: "10px", maxWidth: 250, margin: "auto", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                    <div style={{backgroundImage: `url('${missing_icon}')`, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center", width: "100%", height: "100%", position: "absolute", left: 10, top: -5,  zIndex: 1, opacity: 0.1}}></div>
                    <p style={{textAlign: "center"}}>
                        <img src={plane_departure}  style={{width: "100%", height: "auto", opacity: 0.4}} alt="plane departure"/>
                    </p>
                    <p style={{fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)", fontSize: 14, textAlign: "center", marginTop: 20}}>
                        <i style={{marginRight: 10, color: "goldenrod"}}
                            className="fa-solid fa-exclamation-triangle"></i>
                        Oops! Nothing to show</p>
                </div>);
                
            }
        })();

    }, [ props.flights, filteredFlights, adaptedFlights ]);

    const slidePriceFilter = async (e) => {
        let _value=e.target.value;
        setPriceSlider(_value);
        const _price = Math.ceil((_value/100)*flightsMaxPrice);
        setFlightsSliderMaxPrice(_price);
        //setFilteredFlights(filterByMaxPrice(props.flights, _price));
        if(_value>99){
            filtersByPrice["_by_price_range"]=[];
        }else{
            //filtersByPrice["_by_price_range"]=filterByMaxPrice(props.flights, _price);
            filtersByPrice["_by_price_range"] = await filterByMaxPrice(adaptedFlights, _price);
        }
        filterFlights();
    }

    const slideDurationFilter = async (e) => {
        let _value=e.target.value;
        setDurationSlider(_value);
        const _duration = (_value/100)*flightsMaxDuration;
        setFlightsSliderMaxDuration(_duration);
        //setFilteredFlights(filterByMaxDuration(props.flights, _duration));
        if(_value>99){
            filtersByDuration["_by_duration_range"]=[];
        }else{
            filtersByDuration["_by_duration_range"] = await filterByMaxDuration(props.flights, _duration, data_provider, providerDictionary, adaptedFlights);
        }
        filterFlights();
    }

    const filterBags = async (maxChecked, maxCarryOn) => {
        if(!maxCarryOn && !maxChecked){
            filtersByBags["_by_bags_count"]=[];
        }else{
            filtersByBags["_by_bags_count"] = await filterByBags(props.flights, maxChecked, maxCarryOn, data_provider, providerDictionary, adaptedFlights); 
        }  
        filterFlights();
    } 

    const filterFlights = () => {
        setFilteredFlights([]);
        let filtered=[];
        let cross_filtered=[];

        // Step 1: Merging all
        Object.values(filtersByPrice).forEach(each=>{
            each.forEach(inner=>{
                if(!filtered.find(f_each=>f_each.id===inner.id))
                    filtered.push(inner)
            });     
        });
        Object.values(filtersByDuration).forEach(each=>{
            each.forEach(inner=>{
                if(!filtered.find(f_each=>f_each.id===inner.id))
                    filtered.push(inner)
            });     
        });
        Object.values(filtersByStops).forEach(each=>{
            each.forEach(inner=>{
                if(!filtered.find(f_each=>f_each.id===inner.id))
                    filtered.push(inner)
            }); 
        });
        Object.values(filtersByAirlines).forEach(each=>{
            each.forEach(inner=>{
                if(!filtered.find(f_each=>f_each.id===inner.id))
                    filtered.push(inner)
            });     
        });
        Object.values(filtersByTimes).forEach(each=>{
            each.forEach(inner=>{
                if(!filtered.find(f_each=>f_each.id===inner.id))
                    filtered.push(inner)
            });     
        });
        Object.values(filtersByBags).forEach(each=>{
            each.forEach(inner=>{
                if(!filtered.find(f_each=>f_each.id===inner.id))
                    filtered.push(inner)
            });     
        });

        
        // Step 2: Finding the Cross Items (like && operator does)
        /*filtered.forEach( item => {
            let take=true;
            let found=false;
            let has_price_filters=false;
            Object.values(filtersByPrice).forEach(each=>{
                has_price_filters=true;
                each.forEach(inner=>{
                    if(item.id===inner.id){
                        found=true;
                    }
                });     
            });
            if(has_price_filters && !found)
                take=false;

            let has_duration_filters=false;
            found=false;
            Object.values(filtersByDuration).forEach(each=>{
                has_duration_filters=true;
                each.forEach(inner=>{
                    if(item.id===inner.id){
                        found=true;
                    }
                });     
            });
            if(has_duration_filters && !found)
                take=false;
            
            let has_stops_filters=false;
            found=false;
            Object.values(filtersByStops).forEach(each=>{
                has_stops_filters=true;
                each.forEach(inner=>{
                    if(item.id===inner.id){
                        found=true;
                    }
                });
            });
            if(has_stops_filters && !found)
                take=false;

            let has_airline_filters=false;
            found=false;
            Object.values(filtersByAirlines).forEach(each=>{
                has_airline_filters=true;
                each.forEach(inner=>{
                    if(item.id===inner.id){
                        found=true;
                    }
                });     
            });
            if(has_airline_filters && !found)
                take=false;

            let has_time_filters=false;
            found=false;
            Object.values(filtersByTimes).forEach(each=>{
                has_time_filters=true;
                each.forEach(inner=>{
                    if(item.id===inner.id){
                        found=true;
                    }
                });     
            });
            if(has_time_filters && !found)
                take=false;
            
            if(take)
                cross_filtered.push(item);
        });*/
        
        // Sorting takes place here
        let _flights = bubbleSort(filtered, priceHighLowSort);
        setFilteredFlights(_flights);
        setIsFiltersApplied(true);
    }

    const resetSearchFilters = () => {
        setFilteredFlights([]);
    }

    const sortByHighestOrLowestPrice = (e) => {
        let val=e.target.value;
        setPriceHighLowSort(val);
        window.localStorage.setItem("search_page_price_sort", val);
        window.location.reload();
    }

    const resetSortByHighestOrLowestPrice = () => {
        setPriceHighLowSort(0);
        window.localStorage.setItem("search_page_price_sort", 0);
    }


    return (
        <div style={{marginTop: 10, minHeight: "calc(100vh - 300px)", padding: 0}}>
            
            <div style={{display: "none"}} 
                id={"not_using_id"+"search_results_mobile_top_itin_display"}>
                { 
                    !props.loading ? 
                    props.flights.length > 0 && <MobileItinTopInfo SEARCH_OBJ={SEARCH_OBJ} />
                    : <MobileItinTopInfoLoader />
                }
            </div>
            <div className="search_list_main_flex_container">
                <div id="search_list_main__settings_section" className="search_list_main__settings_section">
                    { 
                        !props.loading ? 
                        ((props.flights.length > 0) && bookingEngine?.showSearchFilters) &&
                            <SearchFilters 
                                bookingEngine={bookingEngine}
                                sortByHighestOrLowestPrice={sortByHighestOrLowestPrice}
                                priceHighLowSort={priceHighLowSort}
                                filterStops={filterStops}
                                filterAirlines={filterAirlines}
                                filterFlights={filterFlights}
                                filtersByStops={filtersByStops}
                                filtersByAirlines={filtersByAirlines}
                                hasNewMessageFromParent={hasNewMessageFromParent}
                                currentParentMessge={currentParentMessge}
                            /> :
                            <SearchFiltersLoader />
                    }
                    <div style={{padding: "30px 20px", borderRadius: 8, backgroundColor: "rgba(0,0,0,0.07)", marginTop: 30, border: "1px solid rgba(0, 0, 0, 0.1)"}}>
                        <h3 style={{marginBottom: 10}}>
                            <i style={{marginRight: 10}} className="fa-solid fa-building"></i>
                            {agentDetails?.company_info?.business_name}</h3>
                        <p style={{fontSize: 13}}>
                            <i style={{marginRight: 10, color: "rgba(0,0,0,0.5)"}}
                                className="fa-solid fa-user-tie"></i>
                            {agentDetails?.first_name} {agentDetails?.last_name}
                        </p>
                        <p style={{fontSize: 13}}>
                            <i style={{marginRight: 10, color: "rgba(0,0,0,0.5)"}}
                                className="fa-solid fa-envelope"></i>
                            {agentDetails?.email}
                        </p>
                        <p style={{fontSize: 13}}>
                            <i style={{marginRight: 10, color: "rgba(0,0,0,0.5)"}}
                                className="fa-solid fa-phone"></i>
                            {agentDetails?.phone}
                        </p>
                        <p style={{marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(0,0,0,0.1)"}}>
                            <span style={{padding: "5px", marginRight: 10, borderRadius: 4, cursor: "pointer"}}>
                                <i style={{opacity: 0.5, fontSize: 19}} className="fa fa-facebook"></i>
                            </span>
                            <span style={{padding: "5px", marginRight: 10, borderRadius: 4, cursor: "pointer"}}>
                                <i style={{opacity: 0.5, fontSize: 19}} className="fa fa-twitter"></i>
                            </span>
                            <span style={{padding: "5px", borderRadius: 4, cursor: "pointer"}}>
                                <i style={{opacity: 0.5, fontSize: 19}} className="fa fa-instagram"></i>
                            </span>
                        </p>
                    </div>
                </div>
                <div className="search_list_main_tickets_section">

                    <div id="search_result_important_notice">
                        {
                            props.loading ? 
                                <div style={{animation: "item_slide_down 0.5s ease-in", marginBottom: 5}} className="search_result_inportant_notice_container">
                                    <div>
                                        <p  className="info_item_loader" style={{color: "rgba(0,0,0,0)", fontSize: 16, fontFamily: "'Prompt', Sans-serif", width: "fit-content", fontWeight: "bolder", marginBottom: 10}}>
                                            <i className="fa fa-info-circle" style={{fontSize: 15, marginRight: 5}}></i>Important Notice
                                        </p>
                                        <p className="info_item_loader" style={{color: "rgba(0,0,0,0)", fontSize: 14}}>
                                            Prices displayed include taxes and may change based on availability. 
                                            You can review any additional fees before checkout. 
                                            Prices are not final until you complete your purchase.
                                        </p>
                                    </div>
                                </div>
                            : props.flights.length > 0 && <div className="search_result_inportant_notice_container">
                                <div>
                                    {
                                        bookingEngine?.showSearchFilters &&
                                        <div style={{padding: 10, marginTop: 10}}>
                                            <div style={{display: "flex", justifyContent: "space-between"}}>
                                                <div>
                                                    <div style={{display: "flex", justifyContent: "space-between"}}>
                                                        <p style={{color: "rgba(0,0,0,0.8)", fontSize: 10, fontFamily: "'Prompt', Sans-serif"}}>
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
                                                                            add_commas_to_number(parseFloat(flightsMinPrice)?.toFixed(0)) :
                                                                            <>
                                                                                {
                                                                                    PriceMarkupValue?.value ?
                                                                                    (add_commas_to_number((markup(flightsMinPrice, PriceMarkupValue?.value, PriceMarkupValue?.type)?.new_price)?.toFixed(0)))
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
                                                        <p style={{color: "crimson", fontSize: 10, fontWeight: "bolder", fontFamily: "'Prompt', Sans-serif"}}>
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
                                                                            add_commas_to_number(parseFloat(flightsSliderMaxPrice)?.toFixed(0)) :
                                                                            <>
                                                                                {
                                                                                    PriceMarkupValue?.value ?
                                                                                    (add_commas_to_number((markup(flightsSliderMaxPrice, PriceMarkupValue?.value, PriceMarkupValue?.type)?.new_price)?.toFixed(0)))
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
                                                        <p style={{color: "rgba(0,0,0,0.8)", fontSize: 10, fontFamily: "'Prompt', Sans-serif"}}>
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
                                                                            add_commas_to_number(parseFloat(flightsMaxPrice)?.toFixed(0)) :
                                                                            <>
                                                                                {
                                                                                    PriceMarkupValue?.value ?
                                                                                    (add_commas_to_number((markup(flightsMaxPrice, PriceMarkupValue?.value, PriceMarkupValue?.type)?.new_price)?.toFixed(0)))
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
                                                    </div>
                                                    <input 
                                                        onInput={slidePriceFilter}
                                                        className="styled-slider slider-progress" 
                                                        min={SLIDER_MIN_PERCENT} max="101" 
                                                        value={priceSlider} type="range" />
                                                </div>
                                                <div style={{marginLeft: 20, display: "flex"}}>
                                                    <div style={{position: "relative"}}>
                                                        {
                                                            isShowTimesFilter &&
                                                            <TimesFilter 
                                                                filterTimes={filterTimes}
                                                                filtersByTimes={filtersByTimes}
                                                                filterFlights={filterFlights}
                                                                hideTimesFilter={hideTimesFilter}
                                                                hasNewMessageFromParent={hasNewMessageFromParent}
                                                                currentParentMessge={currentParentMessge}
                                                            />
                                                        }
                                                        <div onClick={showTimesFilter}
                                                            className="hover_bg-grey show_only_mobile_flex" 
                                                                style={{display: "none", cursor: "pointer", borderRadius: "100%", height: 40, width: 40, justifyContent: "center", alignItems: "center"}}>
                                                            <i style={{color: bookingEngine?.searchFiltersIconColor, fontSize: 17}} 
                                                                className="fa-solid fa-clock"></i>    
                                                        </div>
                                                        <div onClick={showTimesFilter}
                                                            className="mobile_hidden hover_bg-grey" style={{cursor: "pointer", padding: "7px 13px", borderRadius: 8, display: "flex", alignItems: "center"}}>
                                                            <i style={{marginRight: 10, color: bookingEngine?.searchFiltersIconColor, fontSize: 13.5}} 
                                                                className="fa-solid fa-clock"></i>
                                                            <p style={{color: bookingEngine?.searchFiltersTxtColor, fontSize: 13, fontWeight: "bolder", fontFamily: "'Prompt', Sans-serif"}}>
                                                                Time
                                                            </p>
                                                            <i style={{marginLeft: 15, color: bookingEngine?.searchFiltersIndicatorColor, fontSize: 13}} 
                                                                className="fa-solid fa-angle-down"></i>
                                                        </div>
                                                    </div>
                                                    <div style={{position: "relative"}}>
                                                        {
                                                            isShowBagsFilter && 
                                                            <BagsFilter 
                                                                checkedBagsFilterQuantity={checkedBagsFilterQuantity}
                                                                carryOnBagsFilterQuantity={carryOnBagsFilterQuantity}
                                                                setCheckedBagsFilterQuantity={setCheckedBagsFilterQuantity}
                                                                setCarryOnBagsFilterQuantity={setCarryOnBagsFilterQuantity}
                                                                hideBagsFilter={hideBagsFilter} 
                                                                maxCheckedBagsFilter={maxCheckedBagsFilter}
                                                                maxCarryOnBagsFilter={maxCarryOnBagsFilter}
                                                                filterBags={filterBags}
                                                                hasNewMessageFromParent={hasNewMessageFromParent}
                                                                currentParentMessge={currentParentMessge}
                                                            />
                                                        }
                                                        <div onClick={showBagsFilter}
                                                            className="hover_bg-grey show_only_mobile_flex" style={{display: "none", cursor: "pointer", borderRadius: "100%", height: 40, width: 40, justifyContent: "center", alignItems: "center"}}>
                                                            <i style={{color: bookingEngine?.searchFiltersIconColor, fontSize: 19}} 
                                                                className="fa-solid fa-cart-flatbed-suitcase"></i>    
                                                        </div>
                                                        <div onClick={showBagsFilter}
                                                            className="mobile_hidden hover_bg-grey" style={{cursor: "pointer", padding: "7px 13px", borderRadius: 8, display: "flex", alignItems: "center"}}>
                                                            <i style={{marginRight: 10, color: bookingEngine?.searchFiltersIconColor, fontSize: 15}} 
                                                                className="fa-solid fa-cart-flatbed-suitcase"></i>
                                                            <p style={{color: bookingEngine?.searchFiltersTxtColor, fontSize: 13, fontWeight: "bolder", fontFamily: "'Prompt', Sans-serif"}}>
                                                                Bags
                                                            </p>
                                                            <i style={{marginLeft: 15, color: bookingEngine?.searchFiltersIndicatorColor, fontSize: 13}} 
                                                                className="fa-solid fa-angle-down"></i>
                                                        </div>
                                                    </div>
                                                    <div style={{position: "relative"}}>
                                                        {
                                                            isShowDurationFilter && 
                                                            <DurationFilter 
                                                                flightsMinDuration={flightsMinDuration}
                                                                flightsMaxDuration={flightsMaxDuration}
                                                                SLIDER_MIN_PERCENT={D_SLIDER_MIN_PERCENT}
                                                                slideDurationFilter={slideDurationFilter}
                                                                durationSlider={durationSlider}
                                                                flightsSliderMaxDuration={flightsSliderMaxDuration}
                                                                hideDurationFilter={hideDurationFilter} 
                                                                hasNewMessageFromParent={hasNewMessageFromParent}
                                                                currentParentMessge={currentParentMessge}
                                                            />
                                                        }
                                                        <div onClick={showDurationFilter}
                                                            className="hover_bg-grey show_only_mobile_flex" style={{display: "none", cursor: "pointer", borderRadius: "100%", height: 40, width: 40, justifyContent: "center", alignItems: "center"}}>
                                                            <i style={{color: bookingEngine?.searchFiltersIconColor, fontSize: 17}} 
                                                                className="fa-solid fa-hourglass-half"></i>    
                                                        </div>
                                                        <div onClick={showDurationFilter}
                                                            className="mobile_hidden hover_bg-grey" style={{marginLeft: 5, cursor: "pointer", padding: "7px 13px", borderRadius: 8, display: "flex", alignItems: "center"}}>
                                                            <i style={{marginRight: 10, color: bookingEngine?.searchFiltersIconColor, fontSize: 13}} 
                                                                className="fa-solid fa-hourglass-half"></i>
                                                            <p style={{color: bookingEngine?.searchFiltersTxtColor, fontSize: 13, fontWeight: "bolder", fontFamily: "'Prompt', Sans-serif"}}>
                                                                Duration
                                                            </p>
                                                            <i style={{marginLeft: 15, color: bookingEngine?.searchFiltersIndicatorColor, fontSize: 13}} 
                                                                className="fa-solid fa-angle-down"></i>
                                                        </div>
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        }
                    </div>
                    {
                        // Highest to Lowest Price Prompt
                        (!props.loading && priceHighLowSort===1) &&
                            <div style={{borderRadius: 8, padding: 10, margin: 10, marginTop: 0, background: "crimson",}}>
                                <div style={{display: "flex"}}>
                                    <p><i style={{color: "yellow", marginRight: 10}} 
                                        className="fa-solid fa-exclamation-triangle"></i></p>
                                    <p style={{fontSize: 13, color: "white", fontFamily: "'Prompt', Sans-serif"}}>
                                        You have applied sorting by highest to lowest prices. To see the 
                                        <span style={{fontWeight: "bolder", fontFamily: "'Prompt', Sans-serif", fontSize: 13}}> Best Prices first</span>, please click on the button below.
                                    </p>
                                </div>
                                <div onClick={resetSortByHighestOrLowestPrice}
                                    style={{boxShadow: "1px 2px 3px rgba(0,0,0,0.3)", width: 180, marginTop: 5, borderRadius: 50, padding: 5, paddingToP: 7, cursor: "pointer", textAlign: "center", backgroundColor: "orange", fontSize: 12, color: "white", fontFamily: "'Prompt', Sans-serif"}}>
                                        <i style={{marginRight: 10, fontSize: 12}}
                                            className="fa-solid fa-rotate"></i>
                                        Reset price sorting
                                </div>
                            </div>
                    }
                    {
                        // Filters Prompt
                        (!props.loading && isFiltersApplied) && 
                            <div style={{borderRadius: 8, padding: 10, margin: 10, marginTop: 0,}}>
                                <div style={{display: "flex"}}>
                                    <p><i style={{color: "green", marginRight: 10}} 
                                        className="fa-solid fa-info"></i></p>
                                    <p style={{fontSize: 13, color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif"}}>
                                        You have applied some filters to the search results. Use the buttons below to toggle in-between all flights and filtered flights.
                                    </p>
                                </div>
                                <div style={{marginTop: 10, display: "flex", justifyContent: "space-between"}}>
                                    <div style={{display: "flex"}}>
                                        <div onClick={resetSearchFilters}
                                            style={{boxShadow: (Array.isArray(filteredFlights) && filteredFlights.length>0) ? 
                                                "1px 2px 3px rgba(0,0,0,0.3)" : "none", width: 110, borderRadius: 50, padding: 5, paddingTop: 7, cursor: "pointer", textAlign: "center", 
                                                backgroundColor: (Array.isArray(filteredFlights) && filteredFlights.length>0) ? "orange" : "rgba(0,0,0,0.1)",
                                                fontSize: 12, color: (Array.isArray(filteredFlights) && filteredFlights.length>0) ?
                                                "white" : "rgba(0,0,0,0.3)", fontFamily: "'Prompt', Sans-serif"}}>
                                                <i style={{marginRight: 10, fontSize: 13}}
                                                    className="fa-solid fa-rotate"></i>
                                                See All
                                        </div>
                                        <div onClick={filterFlights}
                                            style={{marginLeft: 5, boxShadow: (Array.isArray(filteredFlights) && filteredFlights.length>0) ?
                                            "none": "1px 2px 3px rgba(0,0,0,0.3)", width: 120, borderRadius: 50, padding: 5, paddingTop: 7, cursor: "pointer", textAlign: "center", 
                                            backgroundColor: (Array.isArray(filteredFlights) && filteredFlights.length>0)? "rgba(0,0,0,0.1)" : "orange",
                                            fontSize: 12, color: (Array.isArray(filteredFlights) && filteredFlights.length>0) ?
                                            "rgba(0,0,0,0.3)" : "white", fontFamily: "'Prompt', Sans-serif"}}>
                                            <i style={{marginRight: 10, fontSize: 13}}
                                                className="fa-solid fa-sliders-h"></i>
                                            See Filtered
                                        </div>
                                    </div>
                                    <div onClick={()=>setIsFiltersApplied(false)} style={{marginLeft: 5, cursor: "pointer", width: 30, height: 30, boxShadow: "1px 2px 3px rgba(0,0,0,0.3)", borderRadius: "100%", background: "crimson", display: "flex", justifyContent: "center", alignItems: "center"}}>
                                        <i style={{color: "white", fontSize: 13}} className="fa-solid fa-times"></i>
                                    </div>
                                </div>
                            </div>
                    }
                    <div id="search_results_list_items">

                        { !props.loading ? FLIGHTS : "" }

                        { props.loading ? <FlightLoaderCard /> : "" }
                        { props.loading ? <FlightLoaderCard /> : "" }
                        { props.loading ? <FlightLoaderCard /> : "" }
                        { props.loading ? <FlightLoaderCard /> : "" }
                        { props.loading ? <FlightLoaderCard /> : "" }
                        
                    </div>
                </div>
                <div className="search_list_main_ads_section">
                    <Ads />
                </div>
            </div>
        </div>
    );
}
