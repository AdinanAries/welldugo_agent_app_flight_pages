import { markup } from "../../../helpers/Prices";
import { 
    get_currency_symbol,
    add_commas_to_number
 } from "../../../helpers/general";
import { useEffect, useState } from "react";
import { fetchAgentPriceMarkupInfo } from "../../../services/agentServices";

const PriceSummary = (props) => {

    const { 
        disregard_markup,
        item_type,
        payments, 
        prices, 
        total_travelers, 
        bookingEngine,
        hasNewMessageFromParent,
        currentParentMessge,
    } = props;

    const __item_type = (item_type || "Flight");
    let overallTotal = parseFloat(prices.total_amount);

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

            if(disregard_markup){
                setCanShowPrice({
                    profit_type: "",
                    with_price_bound_profit: false,
                    show: true,
                });
                return;
            }

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
    
    const { extras } = prices;
    const EXTRAS_MARKUP = [];
    let extras_total=0;
    extras.forEach(each=>{
        extras_total=(extras_total+each.total);
        EXTRAS_MARKUP.push(
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                <p style={{fontSize: 14, letterSpacing: 1, color: "rgba(0,0,0,0.7)"}}>
                    {each.name} ({each?.quantity})
                </p>
                <p style={{fontSize: 14, letterSpacing: 1, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)"}}>
                    {
                        (canShowPrice?.show && (!canShowPrice?.with_price_bound_profit || PriceMarkupValue?.value)) ?
                        <span style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)"}} 
                        dangerouslySetInnerHTML={{__html: get_currency_symbol(prices.base_currency)}}></span> : ""
                    }
                    { 
                        canShowPrice?.show ?
                            <> 
                                {
                                    add_commas_to_number(parseFloat(each.total)?.toFixed(2))
                                }
                                {/*
                                    !canShowPrice?.with_price_bound_profit ?
                                    add_commas_to_number(parseFloat(each.total)?.toFixed(2)) :
                                    <>
                                        {
                                            PriceMarkupValue?.value ?
                                            (add_commas_to_number((markup(each.total, PriceMarkupValue?.value, PriceMarkupValue?.type)?.new_price)?.toFixed(2)))
                                            : "N/A"
                                        }
                                    </>
                                */}
                            </>
                        : <span style={{color: "rgba(0,0,0,0.8)"}}>
                            <i className="fa-solid fa-filter-circle-dollar"></i>
                        </span>
                    }
                </p>
            </div>
        );
    });
    
    return (
        <div style={{border: "1px solid rgba(0,0,0,0.1)", borderRadius: 9, padding: 10, margin: 10}}>
            <p style={{fontSize: 16, letterSpacing: 1, fontWeight: "bolder", fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.8)"}}>
                Price Summary
            </p>
            <div style={{marginTop: 20, borderBottom: "1px solid rgba(0,0,0,0.1)", paddingBottom: 10}}>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                    <p style={{fontSize: 14, letterSpacing: 1, color: "rgba(0,0,0,0.7)"}}>
                        {__item_type}
                    </p>
                    <p style={{fontSize: 14, letterSpacing: 1, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)"}}>
                        {
                            (canShowPrice?.show && (!canShowPrice?.with_price_bound_profit || PriceMarkupValue?.value)) ?
                            <span style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)"}} 
                            dangerouslySetInnerHTML={{__html: get_currency_symbol(prices.base_currency)}}></span> : ""
                        }
                        { 
                            canShowPrice?.show ?
                                <> 
                                    {
                                        !canShowPrice?.with_price_bound_profit ?
                                        add_commas_to_number(parseFloat(prices.base_amount)?.toFixed(2)) :
                                        <>
                                            {
                                                PriceMarkupValue?.value ?
                                                (add_commas_to_number((markup(prices.base_amount, PriceMarkupValue?.value, PriceMarkupValue?.type)?.new_price)?.toFixed(2)))
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
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 10, borderBottom: "1px dashed rgba(0,0,0,0.1)", paddingBottom: 10}}>
                    <p style={{fontSize: 14, letterSpacing: 1, color: "rgba(0,0,0,0.7)"}}>
                        Taxes
                    </p>
                    <p style={{fontSize: 14, letterSpacing: 1, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)"}}>
                        {
                            (canShowPrice?.show && (!canShowPrice?.with_price_bound_profit || PriceMarkupValue?.value)) ?
                            <span style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)"}} 
                            dangerouslySetInnerHTML={{__html: get_currency_symbol(prices.tax_currency)}}></span> : ""
                        }
                        { 
                            canShowPrice?.show ?
                                <> 
                                    {
                                        (
                                            !canShowPrice?.with_price_bound_profit || 
                                            PriceMarkupValue?.type==="flat_rate"
                                        ) ?
                                        add_commas_to_number(parseFloat(prices.tax_amount)?.toFixed(2)) :
                                        <>
                                            {
                                                PriceMarkupValue?.value ?
                                                (add_commas_to_number((markup(prices.tax_amount, PriceMarkupValue?.value, PriceMarkupValue?.type)?.new_price)?.toFixed(2)))
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
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 10, borderBottom: "1px dashed rgba(0,0,0,0.1)", paddingBottom: 10}}>
                    <p style={{fontSize: 14, letterSpacing: 1, color: "rgba(0,0,0,0.8)"}}>
                        {total_travelers>1 ? (total_travelers+" People"): (total_travelers+" Person")}:
                    </p>
                    <p style={{fontSize: 14, letterSpacing: 1, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.8)"}}>
                        {
                            (canShowPrice?.show && (!canShowPrice?.with_price_bound_profit || PriceMarkupValue?.value)) ?
                            <span style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)"}} 
                            dangerouslySetInnerHTML={{__html: get_currency_symbol(prices.total_currency)}}></span> : ""
                        }
                        { 
                            canShowPrice?.show ?
                                <> 
                                    {
                                        !canShowPrice?.with_price_bound_profit ?
                                        add_commas_to_number(parseFloat(prices.total_amount)?.toFixed(2)) :
                                        <>
                                            {
                                                PriceMarkupValue?.value ?
                                                (add_commas_to_number((markup(prices.total_amount, PriceMarkupValue?.value, PriceMarkupValue?.type)?.new_price)?.toFixed(2)))
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
                <div>
                    {EXTRAS_MARKUP.map(each=>each)}
                </div>
            </div>
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 20}}>
                <div>
                    <p style={{fontSize: 16, letterSpacing: 1, color: "rgba(0,0,0,0.8)", fontWeight: "bolder"}}>
                        Total
                    </p>
                    <p style={{fontSize: 12, marginTop: 5, color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif"}}>
                        <i style={{marginRight: 10, color: "green"}} className="fa fa-info"></i>
                        prices are quoted in {prices.total_currency}
                    </p>
                </div>
                <p style={{fontSize: 17, fontWeight: "bolder", letterSpacing: 1, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.8)"}}>
                    {
                        (canShowPrice?.show && (!canShowPrice?.with_price_bound_profit || PriceMarkupValue?.value)) ?
                        <span style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)", fontWeight: "bolder"}}
                        dangerouslySetInnerHTML={{__html: get_currency_symbol(prices.total_currency)}}></span> : ""
                    }
                    { 
                        canShowPrice?.show ?
                            <> 
                                {
                                    !canShowPrice?.with_price_bound_profit ?
                                    add_commas_to_number(parseFloat((extras_total+overallTotal))?.toFixed(2)) :
                                    <>
                                        {
                                            
                                            PriceMarkupValue?.value ? (
                                                add_commas_to_number((
                                                    parseFloat((
                                                        markup(overallTotal, PriceMarkupValue?.value, PriceMarkupValue?.type)?.new_price
                                                        +extras_total
                                                    ))?.toFixed(2)
                                                ))
                                            )
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
            <div className="checkout_page_main_checkout_btn_container">
                <p style={{textAlign: "left"}}
                    className="checkout_page_mobile_button_place_total_price_display">
                    Total:
                    <span style={{fontSize: 12, color: "crimson", fontWeight: "bolder"}}> 
                        {
                            (canShowPrice?.show && (!canShowPrice?.with_price_bound_profit || PriceMarkupValue?.value)) ?
                            <span style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif"}}
                            dangerouslySetInnerHTML={{__html: get_currency_symbol(prices.total_currency)}}></span> : ""
                        }
                        { 
                            canShowPrice?.show ?
                                <> 
                                    {
                                        !canShowPrice?.with_price_bound_profit ?
                                        add_commas_to_number(parseFloat(overallTotal)?.toFixed(2)) :
                                        <>
                                            {
                                                add_commas_to_number(parseFloat(overallTotal)?.toFixed(2))
                                                /*
                                                PriceMarkupValue?.value ?
                                                (add_commas_to_number((markup(overallTotal, PriceMarkupValue?.value, PriceMarkupValue?.type)?.new_price)?.toFixed(2)))
                                                : "N/A"*/
                                            }
                                        </>
                                    }
                                </>
                            : <span style={{color: "rgba(0,0,0,0.8)"}}>
                                <i className="fa-solid fa-filter-circle-dollar"></i>
                            </span>
                        }
                    </span>
                </p>
                <div style={{display: "flex", marginTop: 10, justifyContent: "space-between"}}>
                    <div onClick={props.backButtonFunction} 
                        style={{cursor: "pointer", 
                            boxShadow: "1px 2px 3px rgba(0,0,0,0.3)", 
                            backgroundColor: bookingEngine?.closeButtonBgColor, 
                            color: bookingEngine?.closeButtonIconColor, 
                            borderRadius: bookingEngine?.closeButtonBorderRadius, width: 40, height: 40, display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <i className="fa-solid fa-arrow-left"></i>
                    </div>
                    {
                        ( !props.isPaymentPage ) ?
                        <div onClick={props.buttonFunction} className="checkout_page_main_checkout_btn" 
                            style={{marginTop: 0, width: "calc(100% - 50px)",
                                backgroundColor: bookingEngine?.actionButtonsBg,
                                color: bookingEngine?.actionButtonsTxtColor, 
                                borderRadius: bookingEngine?.actionButtonBorderRadius,
                            }}>
                            Continue
                            <span style={{fontSize: 13, color: "rgba(255,255,255,0.4)", marginLeft: 10}}>
                                ({props.buttonText})</span>
                        </div> : <div></div>
                        
                    }
                </div>
            </div>
        </div>
    )
}

export default PriceSummary;

/*<div  onClick={props.buttonFunction} className="checkout_page_main_checkout_btn">
    <i style={{marginRight: 5, color: "rgba(255,255,255,0.5)"}} className="fa fa-credit-card"></i>Checkout
</div>*/