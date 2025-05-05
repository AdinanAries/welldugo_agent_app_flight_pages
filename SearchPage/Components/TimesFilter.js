import { useEffect, useState } from "react";
import { markup } from "../../../helpers/Prices";
import { get_currency_symbol, convert24HTimeToAMPM } from "../../../helpers/general";
import { getPriceMarkupPercentage } from "../../../services/flightsServices";


const TimesFilter = (props) => {
    
    const { 
        hideTimesFilter,
        filterTimes, 
        filterFlights, // Applies the filters
        filtersByTimes,
    } = props;

    const [ PriceMarkupPercentage, setPriceMarkupPercentage ] = useState(0);
        
    useEffect(()=>{
        (async()=>{
            let price_markup = await getPriceMarkupPercentage();
            setPriceMarkupPercentage(parseInt(price_markup));
        })();
    }, []);

    const [ applied, setApplied ] = useState([]);

    const filterByTimes = (e, flights, key) => {
        if(e.target.checked){
            filtersByTimes[key]=flights;
            
            // Only for UI Rendering of Checkbox check status
            addFilterKeyToApplied(key);
        }else{
            filtersByTimes[key]=[];
            // Only for UI Rendering of Checkbox check status
            removeFilterKyeFromApplied(key);
        }
        filterFlights();
    }

    useEffect(()=>{
        let keys = Object.keys(filtersByTimes);
        let arr=[];
        keys.forEach(key=>{
            if(filtersByTimes[key].length>0){
                arr.push(key);
            }
        });
        setApplied(arr);
    }, [])

    const addFilterKeyToApplied = (key) => {
        setApplied([...applied, key]);
    }

    const removeFilterKyeFromApplied = (key) => {
        let index = applied.findIndex(each=>each===key);
        applied.splice(index, 1)
        setApplied([...applied]);
    }

    const TIME_FILTERS_MARKUP = filterTimes.map(each=>{
        let checked=applied.includes(`times_${each.takeOffTime}`);
        return (
            <div key={each.takeOffTime} style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 10}}>
                <div style={{display: "flex", flexDirection: "row"}}>
                    <input className="cm-toggle" onChange={(e)=>filterByTimes(e, each.flights, `times_${each.takeOffTime}`)} 
                        id={"filter-by-times_"+each.takeOffTime} checked={checked}
                            style={{marginRight: 15}} type="checkbox" />
                    <label htmlFor={"filter-by-times_"+each.takeOffTime}>
                        <p style={{color: "rgba(0,0,0,0.8)", fontFamily: "'Prompt', Sans-serif", fontSize: 13}}>
                            {convert24HTimeToAMPM(each.takeOffTime.replaceAll("_", ":"))} ({each.flights.length})</p>
                    </label>
                </div>
                <label htmlFor={"filter-by-times_"+each.takeOffTime}>
                    <p style={{fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)", fontSize: 13}}>
                        <span style={{fontSize: 15, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)"}} 
                            dangerouslySetInnerHTML={{__html: get_currency_symbol(each.currency)}}></span>
                        {(markup(each.lowest, PriceMarkupPercentage).new_price).toFixed(2)}</p>
                </label>
            </div>
        );   
    });

    return <div className="classic_popup_pane" style={{right: -135}}>
        <p onClick={hideTimesFilter} className="hover_bg-grey"
            style={{zIndex: 1, cursor: "pointer", fontFamily: "'Pompt', Sans-serif", position: "absolute", top: 4, right: 10, fontSize: 20, color: "rgba(0,0,0,0.7)", width: 35, height: 35, borderRadius: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
            x</p>
        <div style={{padding: 10, paddingTop: 0, marginBottom: 10}}>
            <p style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", fontWeight: "bolder"}}>
                Departure Times
            </p>
        </div>
        <div>
            <div style={{padding: "10px"}}>
                {
                    (TIME_FILTERS_MARKUP.length > 0) ?
                    TIME_FILTERS_MARKUP.map(each=>each)
                    : <p style={{textAlign: "center", fontSize: 13, fontFamily: "'Prompt', Sans-serif"}}>
                        <i style={{marginRight: 10, color: "orange"}} className="fa-solid fa-exclamation-triangle"></i>
                        No data available
                    </p>
                }
            </div>
        </div>
    </div>
}

export default TimesFilter;