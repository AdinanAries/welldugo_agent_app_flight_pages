import { useState, useEffect } from "react";
import { 
    get_currency_symbol, 
    ellipsify,
    add_commas_to_number
 } from "../../../helpers/general";
import { markup } from "../../../helpers/Prices";
import { fetchAgentPriceMarkupInfo } from "../../../services/agentServices";

const SearchFilters = (props) => {

    const { 
        bookingEngine,
        filterStops, // array of stop filters
        filterAirlines, // array of airline filters
        filterFlights, // runs filter function to appy filters
        filtersByStops, // global object to keep filter by stops
        filtersByAirlines, // global object to keep filter by airlines
        sortByHighestOrLowestPrice,
        priceHighLowSort,
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

    const filterByStops = (e, flights, key) => {
        if(e.target.checked){
            filtersByStops[key]=flights;
        }else{
            filtersByStops[key]=[];
        }
        filterFlights();
    }

    const filterByAilines = (e, flights, key) => {
        if(e.target.checked){
            filtersByAirlines[key]=flights;
        }else{
            filtersByAirlines[key]=[];
        }
        filterFlights();
    }

    const STOPS = filterStops.map(each=>{
        /*{
            count: STOPS_COUNT,
            prices: [TOTAL_AMOUNT],
            lowest: TOTAL_AMOUNT,
            currency: CURRENCY,
            flights: [FLIGHT]
        }*/
        if(each.count===0){
            return (
                <div key={each.count} style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 10}}>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <input className="cm-toggle" onChange={(e)=>filterByStops(e, each.flights, `stops_${each.count}`)} 
                            id={"filter-by-stops_"+each.count} style={{marginRight: 5}} type="checkbox" />
                        <label htmlFor={"filter-by-stops_"+each.count}>
                            <p style={{color: "rgba(0,0,0,0.7)", fontSize: 13}}>Nonstop ({each.flights.length})</p>
                        </label>
                    </div>
                    <label htmlFor={"filter-by-stops_"+each.count}>
                        <p style={{fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)", fontSize: 13}}>
                            {
                                (canShowPrice?.show && (!canShowPrice?.with_price_bound_profit || PriceMarkupValue?.value)) ?
                                <span style={{fontSize: 15, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)"}} 
                                dangerouslySetInnerHTML={{__html: get_currency_symbol(each.currency)}}></span> : ""
                            }
                            { 
                                canShowPrice?.show ?
                                    <> 
                                        {
                                            !canShowPrice?.with_price_bound_profit ?
                                            add_commas_to_number(parseFloat(each.lowest)?.toFixed(2)) :
                                            <>
                                                {
                                                    PriceMarkupValue?.value ?
                                                    (add_commas_to_number((markup(each.lowest, PriceMarkupValue?.value, PriceMarkupValue?.type)?.new_price)?.toFixed(2)))
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
                    </label>
                </div>
            );
        } else {
             return (
                <div key={each.count} style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 10}}>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <input className="cm-toggle" onChange={(e)=>filterByStops(e, each.flights, `stops_${each.count}`)}
                            id={"filter-by-stops_"+each.count} style={{marginRight: 5}} type="checkbox" />
                        <label htmlFor={"filter-by-stops_"+each.count}>
                            <p style={{fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)", fontSize: 13}}>
                                {(each.count>1 ? each.count+" Stops" : each.count+" Stop")} ({each.flights.length})
                            </p>
                        </label>
                    </div>
                    <label htmlFor={"filter-by-stops_"+each.count}>
                        <p style={{fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)", fontSize: 13}}>
                            {
                                (canShowPrice?.show && (!canShowPrice?.with_price_bound_profit || PriceMarkupValue?.value)) ?
                                <span style={{fontSize: 15, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)"}} 
                                dangerouslySetInnerHTML={{__html: get_currency_symbol(each.currency)}}></span> : ""
                            }
                            { 
                                canShowPrice?.show ?
                                    <> 
                                        {
                                            !canShowPrice?.with_price_bound_profit ?
                                            add_commas_to_number(parseFloat(each.lowest)?.toFixed(2)) :
                                            <>
                                                {
                                                    PriceMarkupValue?.value ?
                                                    (add_commas_to_number((markup(each.lowest, PriceMarkupValue?.value, PriceMarkupValue?.type)?.new_price)?.toFixed(2)))
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
                    </label>
                </div>
            );
        }
    });

    const AIRLINES = filterAirlines.map(each=>{
        /*{
            airlineCode: AIRLINE_CODE,
            airlineName: AIRLINE_NAME,
            prices: [TOTAL_AMOUNT],
            lowest: TOTAL_AMOUNT,
            highest: TOTAL_AMOUNT,
            currency: CURRENCY,
            flights: [FLIGHT]
        }*/
        return (
            <div onChange={(e)=>filterByAilines(e, each.flights, `airlines_${each.airlineCode}`)}
                key={each.airlineCode} style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 10}}>
                <div style={{display: "flex", flexDirection: "row"}}>
                    <input className="cm-toggle" id={"filter-by-flights_"+each.airlineCode} 
                        style={{marginRight: 5}} type="checkbox" />
                    <label htmlFor={"filter-by-flights_"+each.airlineCode}>
                        <p style={{fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)", fontSize: 13}}>{ellipsify(each.airlineName, 15)} ({each.flights.length})</p>
                    </label>
                </div>
                <label htmlFor={"filter-by-flights_"+each.airlineCode}>
                    <p style={{fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)", fontSize: 13}}>
                        {
                            (canShowPrice?.show && (!canShowPrice?.with_price_bound_profit || PriceMarkupValue?.value)) ?
                            <span style={{fontSize: 15, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)"}} 
                            dangerouslySetInnerHTML={{__html: get_currency_symbol(each.currency)}}></span> : ""
                        }
                        { 
                            canShowPrice?.show ?
                                <> 
                                    {
                                        !canShowPrice?.with_price_bound_profit ?
                                        add_commas_to_number(parseFloat(each.lowest)?.toFixed(2)) :
                                        <>
                                            {
                                                PriceMarkupValue?.value ?
                                                (add_commas_to_number((markup(each.lowest, PriceMarkupValue?.value, PriceMarkupValue?.type)?.new_price)?.toFixed(2)))
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
                </label>
            </div>
        );
    });

    return (
        <div>
            <div id="mobile_sort_and_filter_title_and_sort">
                <div style={{height: 50, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                        <p style={{color: "rgba(0,0,0,0.5)", fontFamily: "'Prompt', Sans-serif", display: "flex", flexDirection: "column", justifyContent: "center", marginTop: 15}}>
                            Sort:
                        </p>
                        <p onClick={()=>document.getElementById('search_list_main__settings_section').style.display='none'} id="close_filter_and_sort_btn" style={{color: "rgba(255,0,0,0.6)", fontSize: 33, marginRight: 5}}>
                            &times;
                        </p>
                    </div>
                </div>
                <div style={{marginBottom: 35}}>
                    <div style={{display: "flex", alignItems: "center", padding: 10, borderRadius: 50}}>
                        <p>
                            <i style={{fontSize: 17, color: "rgba(0,0,0,0.5)", marginRight: 5}} 
                                class="fa-solid fa-arrow-down-1-9"></i>
                        </p>
                        <select 
                            value={priceHighLowSort}
                            onChange={sortByHighestOrLowestPrice} 
                            style={{border: "none", textDecoration: "underline", background: "none", fontSize: 13, width: "100%"}}>
                            <option value={0}>
                                Price (Lowest)
                            </option>
                            <option value={1}>
                                Price (Highest)
                            </option>
                        </select>
                    </div>
                </div>
            </div>
            <p style={{color: "rgba(0,0,0,0.5)", fontSize: 14, marginBottom: 20, fontFamily: "'Prompt', Sans-serif",}}>
                <i style={{marginRight: 7}} className="fa fa-sliders" aria-hidden="true"></i>
                Filters:</p>
            <div style={{marginBottom: 30}}>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 15}}>
                    <p style={{fontWeight: "bolder", color: "rgba(0,0,0,0.7)", fontSize: 14}}>Stops</p>
                    <p style={{fontWeight: "bolder", color: "rgba(0,0,0,0.7)", fontSize: 14}}>From</p>
                </div>
                {
                    STOPS.map(each=>each)
                }
            </div>

            <div style={{marginBottom: 20}}>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 15}}>
                    <p style={{fontWeight: "bolder", color: "rgba(0,0,0,0.7)", fontSize: 14}}>Airlines</p>
                    <p style={{fontWeight: "bolder", color: "rgba(0,0,0,0.7)", fontSize: 14}}>From</p>
                </div>
                {
                    AIRLINES.map(each=>each)
                }
            </div>

            <div style={{marginBottom: 30, display: "none"}}>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 15}}>
                    <p style={{fontWeight: "bolder", color: "rgba(0,0,0,0.7)", fontSize: 14}}>Travel and baggage</p>
                    <p style={{fontWeight: "bolder", color: "rgba(0,0,0,0.7)", fontSize: 14}}>From</p>
                </div>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 10}}>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <input style={{width: 19, height: 19, marginRight: 5}} type="checkbox" />
                        <p style={{color: "rgba(0,0,0,0.7)", fontSize: 15}}>Seat choice included</p>
                    </div>
                    <p style={{color: "rgba(0,0,0,0.7)", fontSize: 15}}>$143</p>
                </div>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 10}}>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <input style={{width: 19, height: 19, marginRight: 5}} type="checkbox" />
                        <p style={{color: "rgba(0,0,0,0.7)", fontSize: 15}}>Carry-on bag included</p>
                    </div>
                    <p style={{color: "rgba(0,0,0,0.7)", fontSize: 15}}>$123</p>
                </div>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 10}}>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <input style={{width: 19, height: 19, marginRight: 5}} type="checkbox" />
                        <p style={{color: "rgba(0,0,0,0.7)", fontSize: 15}}>No cancel fee</p>
                    </div>
                    <p style={{color: "rgba(0,0,0,0.7)", fontSize: 15}}>$111</p>
                </div>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 10}}>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <input style={{width: 19, height: 19, marginRight: 5}} type="checkbox" />
                        <p style={{color: "rgba(0,0,0,0.7)", fontSize: 15}}>No change fee</p>
                    </div>
                    <p style={{color: "rgba(0,0,0,0.7)", fontSize: 15}}>$371</p>
                </div>
            </div>
        </div>
    );
}

export default SearchFilters;