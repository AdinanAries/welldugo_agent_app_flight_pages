import { 
    get_currency_symbol, 
    ellipsify,
    add_commas_to_number
 } from "../../../../helpers/general";
import { markup } from "../../../../helpers/Prices";

const FilterCard = (props) => {
    
    const {
        bookingEngine,
        filterStops,
        filterAirlines,
        sortByHighestOrLowestPrice,
        priceHighLowSort,
        filterByStops,
        canShowPrice,
        PriceMarkupValue,
        filterByAilines,
    } = props;

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

export default FilterCard;