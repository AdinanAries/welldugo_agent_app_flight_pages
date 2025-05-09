import deltaIcon from "../../../deltaIcon.png";
import airplane from "../../../icons/airplane.svg";
import plane_departure from "../../../airplane-departure.svg"
import missing_icon from "../../../missing.svg"
import FlightLoaderCard from "./FlightLoaderCard";
import FlightOfferItem from "./FlightOfferItem";
import SearchFilters from "./SearchFilters";
import SearchFiltersLoader from "./SearchFiltersLoader";
import MobileItinTopInfo from "./MobileItinTopInfo";
import MobileItinTopInfoLoader from "./MobileItinTopInfoLoader";
import Ads from "./Ads";
import FlightPricesGrid from "./FlightPricesGrid";
import DurationFilter from "./DurationFilter";
import BagsFilter from "./BagsFilter";
import TimesFilter from "./TimesFilter";
import { markup } from "../../../helpers/Prices";
import { 
    get_currency_symbol,
    add_commas_to_number,
} from "../../../helpers/general";
import { getPriceMarkupPercentage } from "../../../services/flightsServices";
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

function add_clouds_to_animated_loader(){
    if(document.getElementById("animated_loader")){
        document.getElementById("animated_loader").innerHTML += `
            <div class="preloader" style="opacity: 1; ">
            <svg version="1.1" id="sun" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="10px" height="10px" viewBox="0 0 10 10" enable-background="new 0 0 10 10" xml:space="preserve" style="opacity: 1; margin-left: 0px; margin-top: 0px;">
                <g>
                <path fill="none" d="M6.942,3.876c-0.4-0.692-1.146-1.123-1.946-1.123c-0.392,0-0.779,0.104-1.121,0.301c-1.072,0.619-1.44,1.994-0.821,3.067C3.454,6.815,4.2,7.245,5,7.245c0.392,0,0.779-0.104,1.121-0.301C6.64,6.644,7.013,6.159,7.167,5.581C7.321,5,7.243,4.396,6.942,3.876z M6.88,5.505C6.745,6.007,6.423,6.427,5.973,6.688C5.676,6.858,5.34,6.948,5,6.948c-0.695,0-1.343-0.373-1.69-0.975C2.774,5.043,3.093,3.849,4.024,3.312C4.32,3.14,4.656,3.05,4.996,3.05c0.695,0,1.342,0.374,1.69,0.975C6.946,4.476,7.015,5,6.88,5.505z"></path>
                <path fill="none" d="M8.759,2.828C8.718,2.757,8.626,2.732,8.556,2.774L7.345,3.473c-0.07,0.041-0.094,0.132-0.053,0.202C7.319,3.723,7.368,3.75,7.419,3.75c0.025,0,0.053-0.007,0.074-0.02l1.211-0.699C8.774,2.989,8.8,2.899,8.759,2.828z"></path>
                <path fill="none" d="M1.238,7.171c0.027,0.047,0.077,0.074,0.128,0.074c0.025,0,0.051-0.008,0.074-0.02l1.211-0.699c0.071-0.041,0.095-0.133,0.054-0.203S2.574,6.228,2.503,6.269l-1.21,0.699C1.221,7.009,1.197,7.101,1.238,7.171z"></path>
                <path fill="none" d="M6.396,2.726c0.052,0,0.102-0.026,0.13-0.075l0.349-0.605C6.915,1.976,6.89,1.885,6.819,1.844c-0.07-0.042-0.162-0.017-0.202,0.054L6.269,2.503C6.228,2.574,6.251,2.666,6.322,2.706C6.346,2.719,6.371,2.726,6.396,2.726z"></path>
                    <path fill="none" d="M3.472,7.347L3.123,7.952c-0.041,0.07-0.017,0.162,0.054,0.203C3.2,8.169,3.226,8.175,3.25,8.175c0.052,0,0.102-0.027,0.129-0.074l0.349-0.605c0.041-0.07,0.017-0.16-0.054-0.203C3.603,7.251,3.513,7.276,3.472,7.347z"></path>
                    <path fill="none" d="M3.601,2.726c0.025,0,0.051-0.007,0.074-0.02C3.746,2.666,3.77,2.574,3.729,2.503l-0.35-0.604C3.338,1.828,3.248,1.804,3.177,1.844C3.106,1.886,3.082,1.976,3.123,2.047l0.35,0.604C3.5,2.7,3.549,2.726,3.601,2.726z"></path>
                    <path fill="none" d="M6.321,7.292c-0.07,0.043-0.094,0.133-0.054,0.203l0.351,0.605c0.026,0.047,0.076,0.074,0.127,0.074c0.025,0,0.051-0.006,0.074-0.02c0.072-0.041,0.096-0.133,0.055-0.203l-0.35-0.605C6.483,7.276,6.393,7.253,6.321,7.292z"></path>
                    <path fill="none" d="M2.202,5.146c0.082,0,0.149-0.065,0.149-0.147S2.284,4.851,2.202,4.851H1.503c-0.082,0-0.148,0.066-0.148,0.148s0.066,0.147,0.148,0.147H2.202z"></path>
                    <path fill="none" d="M8.493,4.851H7.794c-0.082,0-0.148,0.066-0.148,0.148s0.066,0.147,0.148,0.147l0,0h0.699c0.082,0,0.148-0.065,0.148-0.147S8.575,4.851,8.493,4.851L8.493,4.851z"></path>
                    <path fill="none" d="M5.146,2.203V0.805c0-0.082-0.066-0.148-0.148-0.148c-0.082,0-0.148,0.066-0.148,0.148v1.398c0,0.082,0.066,0.149,0.148,0.149C5.08,2.352,5.146,2.285,5.146,2.203z"></path>
                    <path fill="none" d="M4.85,7.796v1.396c0,0.082,0.066,0.15,0.148,0.15c0.082,0,0.148-0.068,0.148-0.15V7.796c0-0.082-0.066-0.148-0.148-0.148C4.917,7.647,4.85,7.714,4.85,7.796z"></path>
                    <path fill="none" d="M2.651,3.473L1.44,2.774C1.369,2.732,1.279,2.757,1.238,2.828C1.197,2.899,1.221,2.989,1.292,3.031l1.21,0.699c0.023,0.013,0.049,0.02,0.074,0.02c0.051,0,0.101-0.026,0.129-0.075C2.747,3.604,2.722,3.514,2.651,3.473z"></path>
                    <path fill="none" d="M8.704,6.968L7.493,6.269c-0.07-0.041-0.162-0.016-0.201,0.055c-0.041,0.07-0.018,0.162,0.053,0.203l1.211,0.699c0.023,0.012,0.049,0.02,0.074,0.02c0.051,0,0.102-0.027,0.129-0.074C8.8,7.101,8.776,7.009,8.704,6.968z"></path>
                </g>
            </svg>

            <svg version="1.1" id="cloud" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="10px" height="10px" viewBox="0 0 10 10" enable-background="new 0 0 10 10" xml:space="preserve">
                <path fill="none" d="M8.528,5.624H8.247c-0.085,0-0.156-0.068-0.156-0.154c0-0.694-0.563-1.257-1.257-1.257c-0.098,0-0.197,0.013-0.3,0.038C6.493,4.259,6.45,4.252,6.415,4.229C6.38,4.208,6.356,4.172,6.348,4.131C6.117,3.032,5.135,2.235,4.01,2.235c-1.252,0-2.297,0.979-2.379,2.23c-0.004,0.056-0.039,0.108-0.093,0.13C1.076,4.793,0.776,5.249,0.776,5.752c0,0.693,0.564,1.257,1.257,1.257h6.495c0.383,0,0.695-0.31,0.695-0.692S8.911,5.624,8.528,5.624z"></path>
            </svg>
            <svg version="1.1" id="cloud2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="10px" height="10px" viewBox="0 0 10 10" enable-background="new 0 0 10 10" xml:space="preserve">
                <path fill="none" d="M8.528,5.624H8.247c-0.085,0-0.156-0.068-0.156-0.154c0-0.694-0.563-1.257-1.257-1.257c-0.098,0-0.197,0.013-0.3,0.038C6.493,4.259,6.45,4.252,6.415,4.229C6.38,4.208,6.356,4.172,6.348,4.131C6.117,3.032,5.135,2.235,4.01,2.235c-1.252,0-2.297,0.979-2.379,2.23c-0.004,0.056-0.039,0.108-0.093,0.13C1.076,4.793,0.776,5.249,0.776,5.752c0,0.693,0.564,1.257,1.257,1.257h6.495c0.383,0,0.695-0.31,0.695-0.692S8.911,5.624,8.528,5.624z"></path>
            </svg>

            <svg version="1.1" id="cloud3" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="10px" height="10px" viewBox="0 0 10 10" enable-background="new 0 0 10 10" xml:space="preserve">
                <path fill="none" d="M8.528,5.624H8.247c-0.085,0-0.156-0.068-0.156-0.154c0-0.694-0.563-1.257-1.257-1.257c-0.098,0-0.197,0.013-0.3,0.038C6.493,4.259,6.45,4.252,6.415,4.229C6.38,4.208,6.356,4.172,6.348,4.131C6.117,3.032,5.135,2.235,4.01,2.235c-1.252,0-2.297,0.979-2.379,2.23c-0.004,0.056-0.039,0.108-0.093,0.13C1.076,4.793,0.776,5.249,0.776,5.752c0,0.693,0.564,1.257,1.257,1.257h6.495c0.383,0,0.695-0.31,0.695-0.692S8.911,5.624,8.528,5.624z"></path>
            </svg>

            <div class="rain">
                <span class="drop"></span>
                <span class="drop"></span>
                <span class="drop"></span>
                <span class="drop"></span>
                <span class="drop"></span>
                <span class="drop"></span>
                <span class="drop"></span>
                <span class="drop"></span>
                <span class="drop"></span>
                <span class="drop"></span>
            </div>

            </div>
            <div class="text">
            WE'LL GET YOU THERE IN A SEC...
            </div>
        `;
    }
}

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

    const [ PriceMarkupPercentage, setPriceMarkupPercentage ] = useState(0);
    
    useEffect(()=>{
        (async()=>{
            let price_markup = await getPriceMarkupPercentage();
            setPriceMarkupPercentage(parseInt(price_markup));
        })();
    }, []);

    const { 
        SEARCH_OBJ,
        bookingEngine
    } = props;
    
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

    const showPricesGrid = () => {
        if(isShowPriceGrid)
            setIsShowPriceGrid(false);
        else
            setIsShowPriceGrid(true);
    }

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
        // Price
        const PRICE_RANGE = getMinAndMaxPrice(props.flights);
        setFlightsMaxPrice(PRICE_RANGE.max_price);
        setFlightsMinPrice(PRICE_RANGE.min_price);
        setSliderMinPercent((PRICE_RANGE.min_price*100)/PRICE_RANGE.max_price);

        // Duration
        const DURATION_RANGE = getMinAndMaxDuration(props.flights);
        setFlightsMaxDuration(DURATION_RANGE.max_duration);
        setFlightsMinDuration(DURATION_RANGE.min_duration);
        setDSliderMinPercent((DURATION_RANGE.min_duration*100)/DURATION_RANGE.max_duration);

        // Bags
        const MAX_BAGS = getMaxBags(props.flights);
        setMaxCheckedBagsFilter(MAX_BAGS.maxCheckedBags); 
        setMaxCarryOnBagsFilter(MAX_BAGS.maxCarryOnBags);
        
    });

    const slidePriceFilter = (e) => {
        let _value=e.target.value;
        setPriceSlider(_value);
        const _price = Math.ceil((_value/100)*flightsMaxPrice);
        setFlightsSliderMaxPrice(_price);
        //setFilteredFlights(filterByMaxPrice(props.flights, _price));
        if(_value>99){
            filtersByPrice["_by_price_range"]=[];
        }else{
            filtersByPrice["_by_price_range"]=filterByMaxPrice(props.flights, _price);
        }
        filterFlights();
    }

    const slideDurationFilter = (e) => {
        let _value=e.target.value;
        setDurationSlider(_value);
        const _duration = (_value/100)*flightsMaxDuration;
        setFlightsSliderMaxDuration(_duration);
        //setFilteredFlights(filterByMaxDuration(props.flights, _duration));
        if(_value>99){
            filtersByDuration["_by_duration_range"]=[];
        }else{
            filtersByDuration["_by_duration_range"]=filterByMaxDuration(props.flights, _duration);
        }
        filterFlights();
    }

    const filterBags = (maxChecked, maxCarryOn) => {
        if(!maxCarryOn && !maxChecked){
            filtersByBags["_by_bags_count"]=[];
        }else{
            filtersByBags["_by_bags_count"] = filterByBags(props.flights, maxChecked, maxCarryOn); 
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

    let FLIGHTS;
    if(props.flights.length>0 && filteredFlights?.length<1){

        // Sorting takes place here
        let _flights = bubbleSort(props.flights, priceHighLowSort);

        FLIGHTS = _flights.map((each, index) => 
            <FlightOfferItem 
                bookingEngine={bookingEngine}
                selectFlightOffer={props.selectFlightOffer}
                key={index} 
                index={index}
                flight={each}
            />);
    }else if(Array.isArray(filteredFlights) && filteredFlights.length>0){

        FLIGHTS = filteredFlights.map((each, index) => 
            <FlightOfferItem 
                bookingEngine={bookingEngine}
                selectFlightOffer={props.selectFlightOffer}
                key={index} 
                index={index}
                flight={each}
            />);
    }else{
        FLIGHTS = <div style={{padding: "10px", maxWidth: 250, margin: "auto", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
            <div style={{backgroundImage: `url('${missing_icon}')`, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center", width: "100%", height: "100%", position: "absolute", left: 10, top: -5,  zIndex: 1, opacity: 0.1}}></div>
            <p style={{textAlign: "center"}}>
                <img src={plane_departure}  style={{width: "100%", height: "auto", opacity: 0.4}} alt="plane departure"/>
            </p>
            <p style={{fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)", fontSize: 14, textAlign: "center", marginTop: 20}}>
                <i style={{marginRight: 10, color: "goldenrod"}}
                    className="fa-solid fa-exclamation-triangle"></i>
                Oops! Nothing to show</p>
        </div>
    }
    
    setTimeout(()=>{
        add_clouds_to_animated_loader();
    },500);

    // Getting Filter - Flight Stops - Creates Filter Toggles
    let filterStops = duffelStopsAndPrices(props.flights);
    // Getting Filter - Airlines - Creates Filter Toggles
    let filterAirlines = duffelAirlinesAndPrices(props.flights);
    // Getting Filter - Take-off Times - Creates Filter Toggles
    let filterTimes = duffelTimesAndPrices(props.flights);

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
                        props.flights.length > 0 &&
                            <SearchFilters 
                                bookingEngine={bookingEngine}
                                sortByHighestOrLowestPrice={sortByHighestOrLowestPrice}
                                priceHighLowSort={priceHighLowSort}
                                filterStops={filterStops}
                                filterAirlines={filterAirlines}
                                filterFlights={filterFlights}
                                filtersByStops={filtersByStops}
                                filtersByAirlines={filtersByAirlines}
                            /> :
                            <SearchFiltersLoader />
                    }
                </div>
                <div className="search_list_main_tickets_section">
                    <div id="animated_loader" style={{position: "relative", height: 190, display: props.loading ? "block" : "none"}}>
                        <div style={{backgroundImage: `url('${airplane}')`, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center", width: 120, height: 120, position: "absolute", left: "calc(50% - 80px)", zIndex: 2, animation: "the_moving_plane 15s ease-in-out infinite"}}></div>
                    </div>

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
                                    <p style={{color: "rgba(0,0,0,0.8)", fontSize: 16, fontFamily: "'Prompt', Sans-serif", marginBottom: 5}}>
                                        <i className="fa-solid fa-tags" style={{fontsize: 14, color: "orangered", marginRight: 10}}></i>
                                        Prices
                                    </p>
                                    <p style={{color: "rgba(0,0,0,0.7)", fontSize: 13, fontFamily: "'Prompt', Sans-serif"}}>
                                        Prices displayed include taxes and may change based on availability. 
                                        You can review any additional fees before checkout. 
                                        Prices are not final until you complete your purchase.
                                    </p>
                                    <div style={{padding: 10, marginTop: 10}}>
                                        <div style={{display: "flex", justifyContent: "space-between"}}>
                                            <div>
                                                <div style={{display: "flex", justifyContent: "space-between"}}>
                                                    <p style={{color: "rgba(0,0,0,0.8)", fontSize: 10, fontFamily: "'Prompt', Sans-serif"}}>
                                                        ${(add_commas_to_number((markup(flightsMinPrice, PriceMarkupPercentage).new_price.toFixed(0))))}
                                                    </p>
                                                    <p style={{color: "crimson", fontSize: 10, fontWeight: "bolder", fontFamily: "'Prompt', Sans-serif"}}>
                                                        ${(add_commas_to_number((markup(flightsSliderMaxPrice, PriceMarkupPercentage).new_price.toFixed(0))))}
                                                    </p>
                                                    <p style={{color: "rgba(0,0,0,0.8)", fontSize: 10, fontFamily: "'Prompt', Sans-serif"}}>
                                                        ${(add_commas_to_number((markup(flightsMaxPrice, PriceMarkupPercentage).new_price.toFixed(0))))}
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
                                                        />
                                                    }
                                                    <div onClick={showTimesFilter}
                                                        className="hover_bg-grey show_only_mobile_flex" 
                                                            style={{display: "none", cursor: "pointer", borderRadius: "100%", height: 40, width: 40, justifyContent: "center", alignItems: "center"}}>
                                                        <i style={{color: "#c751b9", fontSize: 17}} 
                                                            className="fa-solid fa-business-time"></i>    
                                                    </div>
                                                    <div onClick={showTimesFilter}
                                                        className="mobile_hidden hover_bg-grey" style={{cursor: "pointer", padding: "7px 13px", borderRadius: 8, display: "flex", alignItems: "center"}}>
                                                        <i style={{marginRight: 10, color: "#c751b9", fontSize: 13.5}} 
                                                            className="fa-solid fa-business-time"></i>
                                                        <p style={{color: "rgb(23, 87, 148)", fontSize: 13, fontWeight: "bolder", fontFamily: "'Prompt', Sans-serif"}}>
                                                            Time
                                                        </p>
                                                        <i style={{marginLeft: 15, color: "rgba(0,0,0,0.7)", fontSize: 13}} 
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
                                                        />
                                                    }
                                                    <div onClick={showBagsFilter}
                                                        className="hover_bg-grey show_only_mobile_flex" style={{display: "none", cursor: "pointer", borderRadius: "100%", height: 40, width: 40, justifyContent: "center", alignItems: "center"}}>
                                                        <i style={{color: "#c751b9", fontSize: 19}} 
                                                            className="fa-solid fa-person-walking-luggage"></i>    
                                                    </div>
                                                    <div onClick={showBagsFilter}
                                                        className="mobile_hidden hover_bg-grey" style={{cursor: "pointer", padding: "7px 13px", borderRadius: 8, display: "flex", alignItems: "center"}}>
                                                        <i style={{marginRight: 10, color: "#c751b9", fontSize: 15}} 
                                                            className="fa-solid fa-person-walking-luggage"></i>
                                                        <p style={{color: "rgb(23, 87, 148)", fontSize: 13, fontWeight: "bolder", fontFamily: "'Prompt', Sans-serif"}}>
                                                            Bags
                                                        </p>
                                                        <i style={{marginLeft: 15, color: "rgba(0,0,0,0.7)", fontSize: 13}} 
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
                                                        />
                                                    }
                                                    <div onClick={showDurationFilter}
                                                        className="hover_bg-grey show_only_mobile_flex" style={{display: "none", cursor: "pointer", borderRadius: "100%", height: 40, width: 40, justifyContent: "center", alignItems: "center"}}>
                                                        <i style={{color: "#c751b9", fontSize: 17}} 
                                                            className="fa-solid fa-clock"></i>    
                                                    </div>
                                                    <div onClick={showDurationFilter}
                                                        className="mobile_hidden hover_bg-grey" style={{marginLeft: 5, cursor: "pointer", padding: "7px 13px", borderRadius: 8, display: "flex", alignItems: "center"}}>
                                                        <i style={{marginRight: 10, color: "#c751b9", fontSize: 13}} 
                                                            className="fa-solid fa-clock"></i>
                                                        <p style={{color: "rgb(23, 87, 148)", fontSize: 13, fontWeight: "bolder", fontFamily: "'Prompt', Sans-serif"}}>
                                                            Duration
                                                        </p>
                                                        <i style={{marginLeft: 15, color: "rgba(0,0,0,0.7)", fontSize: 13}} 
                                                            className="fa-solid fa-angle-down"></i>
                                                    </div>
                                                </div>
                                                <div style={{position: "relative"}}>
                                                    {   isShowPriceGrid &&
                                                        <FlightPricesGrid hidePricesGrid={hidePricesGrid} />
                                                    }
                                                    <div onClick={showPricesGrid}
                                                        className="hover_bg-grey show_only_mobile_flex" style={{display: "none", cursor: "pointer", borderRadius: "100%", height: 40, width: 40, justifyContent: "center", alignItems: "center"}}>
                                                        <i style={{color: "blue", fontSize: 17}} 
                                                            className="fa-solid fa-chart-column"></i>    
                                                    </div>
                                                    <div onClick={showPricesGrid}
                                                        className="mobile_hidden hover_bg-grey"
                                                        style={{ marginLeft: 5, cursor: "pointer", padding: "7px 13px", display: "flex", alignItems: "center", borderRadius: 50}}>
                                                        <i style={{marginRight: 10, color: "#c751b9", fontSize: 14}}
                                                            class="fa-solid fa-chart-column"></i>
                                                        <p style={{color: "rgb(23, 87, 148)", fontSize: 13, fontWeight: "bolder", fontFamily: "'Prompt', Sans-serif"}}>
                                                            Prices
                                                        </p>
                                                        <i style={{marginLeft: 15, color: "rgba(0,0,0,0.7)", fontSize: 13}} 
                                                            className="fa-solid fa-angle-down"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
