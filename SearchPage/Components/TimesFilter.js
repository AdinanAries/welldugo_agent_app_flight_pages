import { useEffect, useState } from "react";
import { markup } from "../../../helpers/Prices";
import { get_currency_symbol, convert24HTimeToAMPM, add_commas_to_number } from "../../../helpers/general";
import { fetchAgentPriceMarkupInfo } from "../../../services/agentServices";


const TimesFilter = (props) => {
    
    const { 
        hideTimesFilter,
        filterTimes, 
        filterFlights, // Applies the filters
        filtersByTimes,
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

    return <div className="classic_popup_pane" style={{right: -60}}>
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