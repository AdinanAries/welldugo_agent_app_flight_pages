import { markup } from "../../../helpers/Prices";
import { 
    get_currency_symbol,
    add_commas_to_number
 } from "../../../helpers/general";
import { useEffect, useState } from "react";
import { getPriceMarkupPercentage } from "../../../services/flightsServices";

const PriceSummary = (props) => {

    const [ PriceMarkupPercentage, setPriceMarkupPercentage ] = useState(0);
            
    useEffect(()=>{
        (async()=>{
            let perc = await getPriceMarkupPercentage();
            setPriceMarkupPercentage(parseInt(perc));
        })();
    }, []);

    const { payments, prices, total_travelers } = props;
    let overallTotal = parseFloat(prices.total_amount);
    
    const { extras } = prices;
    const EXTRAS_MARKUP = [];
    extras.forEach(each=>{
        overallTotal=(overallTotal+each.total);
        EXTRAS_MARKUP.push(
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 10}}>
                <p style={{fontSize: 14, letterSpacing: 1, color: "rgba(0,0,0,0.7)"}}>
                    {each.name} ({each?.quantity})
                </p>
                <p style={{fontSize: 14, letterSpacing: 1, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)"}}>
                    {
                        PriceMarkupPercentage ?
                        <span style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)"}} 
                            dangerouslySetInnerHTML={{__html: get_currency_symbol(prices.base_currency)}}></span> : ""
                    }
                    {
                        PriceMarkupPercentage ?
                        (add_commas_to_number((markup(each.total, PriceMarkupPercentage).new_price).toFixed(2)))
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
                    <p style={{fontSize: 14, letterSpacing: 1, color: "rgba(0,0,0,0.8)"}}>
                        {total_travelers>1 ? (total_travelers+" Travelers"): (total_travelers+" Traveler")}:
                    </p>
                    <p style={{fontSize: 14, letterSpacing: 1, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.8)"}}>
                        {
                            PriceMarkupPercentage ?
                            <span style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)", fontWeight: "bolder"}} 
                                dangerouslySetInnerHTML={{__html: get_currency_symbol(prices.total_currency)}}></span> : ""
                        }
                        {
                            PriceMarkupPercentage ?
                            (add_commas_to_number((markup(prices.total_amount, PriceMarkupPercentage).new_price).toFixed(2)))
                            : <span style={{color: "rgba(0,0,0,0.8)"}}>
                                <i className="fa-solid fa-filter-circle-dollar"></i>
                            </span>
                        }
                    </p>
                </div>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 10}}>
                    <p style={{fontSize: 14, letterSpacing: 1, color: "rgba(0,0,0,0.7)"}}>
                        Flight
                    </p>
                    <p style={{fontSize: 14, letterSpacing: 1, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)"}}>
                        {
                            PriceMarkupPercentage ?
                            <span style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)"}} 
                                dangerouslySetInnerHTML={{__html: get_currency_symbol(prices.base_currency)}}></span> : ""
                        }
                        {
                            PriceMarkupPercentage ?
                            (add_commas_to_number((markup(prices.base_amount, PriceMarkupPercentage).new_price).toFixed(2)))
                            : <span style={{color: "rgba(0,0,0,0.8)"}}>
                                <i className="fa-solid fa-filter-circle-dollar"></i>
                            </span>
                        }
                    </p>
                </div>
                {EXTRAS_MARKUP.map(each=>each)}
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 10}}>
                    <p style={{fontSize: 14, letterSpacing: 1, color: "rgba(0,0,0,0.7)"}}>
                        Taxes and fees
                    </p>
                    <p style={{fontSize: 14, letterSpacing: 1, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)"}}>
                        {
                            PriceMarkupPercentage ?
                            <span style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)"}} 
                                dangerouslySetInnerHTML={{__html: get_currency_symbol(prices.tax_currency)}}></span> : ""
                        }
                        {
                            PriceMarkupPercentage ?
                            (add_commas_to_number((markup(prices.tax_amount, PriceMarkupPercentage).new_price).toFixed(2)))
                            : <span style={{color: "rgba(0,0,0,0.8)"}}>
                                <i className="fa-solid fa-filter-circle-dollar"></i>
                            </span>
                        }
                    </p>
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
                        PriceMarkupPercentage ?
                        <span style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)", fontWeight: "bolder"}} 
                                dangerouslySetInnerHTML={{__html: get_currency_symbol(prices.total_currency)}}></span> : ""
                    }
                    {
                        PriceMarkupPercentage ?
                        (add_commas_to_number((markup(overallTotal, PriceMarkupPercentage).new_price).toFixed(2)))
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
                            PriceMarkupPercentage ?
                            <span style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif"}} 
                                dangerouslySetInnerHTML={{__html: get_currency_symbol(prices.total_currency)}}></span> : ""
                        }
                        {
                            PriceMarkupPercentage ?
                            (add_commas_to_number((markup(overallTotal, PriceMarkupPercentage).new_price).toFixed(2)))
                            : <span style={{color: "rgba(0,0,0,0.8)"}}>
                                <i className="fa-solid fa-filter-circle-dollar"></i>
                            </span>
                        }
                    </span>
                </p>
                <div style={{display: "flex", marginTop: 10, justifyContent: "space-between"}}>
                    <div onClick={props.backButtonFunction} style={{cursor: "pointer", boxShadow: "1px 2px 3px rgba(0,0,0,0.3)", backgroundColor: "crimson", color: "white", borderRadius: "100%", width: 40, height: 40, display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <i className="fa-solid fa-arrow-left"></i>
                    </div>
                    {
                        ( !props.isPaymentPage ) ?
                        <div onClick={props.buttonFunction} className="checkout_page_main_checkout_btn" style={{marginTop: 0, width: "calc(100% - 50px)"}}>
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