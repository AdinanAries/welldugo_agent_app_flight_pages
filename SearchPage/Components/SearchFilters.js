import { useState, useEffect } from "react";
import { fetchAgentPriceMarkupInfo } from "../../../services/agentServices";

import FilterCard from "./FlightFiltersCards/FilterCard";
import Type4FilterCard from "./FlightFiltersCards/Type4FilterCard";
import Type2FilterCard from "./FlightFiltersCards/Type2FilterCard";

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

    const filterCardType = 2;

    return <div>
        {
            (filterCardType===1) &&
            <FilterCard
                bookingEngine={bookingEngine}
                filterStops={filterStops}
                filterAirlines={filterAirlines}
                sortByHighestOrLowestPrice={sortByHighestOrLowestPrice}
                priceHighLowSort={priceHighLowSort}
                filterByStops={filterByStops}
                canShowPrice={canShowPrice}
                PriceMarkupValue={PriceMarkupValue}
                filterByAilines={filterByAilines}
            />
        }
        {
            (filterCardType===2) &&
            <Type2FilterCard />
        }
        {
            (filterCardType===4) &&
            <Type4FilterCard />
        }
    </div>

}

export default SearchFilters;