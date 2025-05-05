import { useEffect, useState } from 'react';
import { show_full_search_form } from '../../../helpers/PageRoutingFuncs';
import { show_prompt_on_Bot_AD_tips_popup } from "../../../components/HPSupport";
import BotRandPrompt from '../../../components/BotRandPrompt';
import CONSTANTS from '../../../Constants/Constants';
import getBotResponse from "../../../Constants/BotResponses";

const HeroMainMenu = (props) => {

    const { 
        siteCurrency, 
        siteLanguage, 
        toggle_show_hide_currency_page, 
        toggle_show_hide_languages_page, 
        productType,
        change_product_type
    } = props;
    
    const [showDropDown, setShowDropDown] = useState(false);

    useEffect(()=>{
        setTimeout(()=>{
            window.__showBotRandPrompt();
        }, 5000);
    })

    const showDropDownMenu = () => {
        setShowDropDown(!showDropDown);
    }

    return (
        <div style={{position: "relative", /*border: "1px solid rgba(255,255,255,0.07)",*/ borderRadius: 10, marginBottom: 30}}>
            <div style={{display: "flex", justifyContent: "center"}}>
                <div className="flights_hero_menu_item main" style={{cursor: "pointer", textAlign: "center", 
                    color: ((productType===CONSTANTS.product_types.flights) ? "#d66aca" : "rgba(255,255,255,0.4)"),  
                    borderBottom: ((productType===CONSTANTS.product_types.flights) ? "3px solid #d66aca" : "none"), 
                    fontSize: 14, fontFamily: "'Prompt', Sans-serif", position: "relative"}}
                >
                    <BotRandPrompt
                        promptMessage={
                            getBotResponse(CONSTANTS.bot.responses.click_to_start_flight_booking)
                        }
                        requiredAction={()=>{
                            change_product_type(CONSTANTS.product_types.flights)
                            show_full_search_form();
                        }}
                    />
                    <div style={{padding: "20px 10px",}} onClick={()=>{
                        change_product_type(CONSTANTS.product_types.flights)
                        show_full_search_form();
                    }}>
                        <i style={{marginRight: 10}} className="fa-solid fa-plane-departure"></i>
                        Flights
                    </div>
                </div>
                <div className="stays_hero_menu_item main" 
                        onClick={()=>{
                            change_product_type(CONSTANTS.product_types.stays);
                            show_full_search_form();
                            (CONSTANTS.disabled_features.stays_search) && show_prompt_on_Bot_AD_tips_popup(
                                getBotResponse(CONSTANTS.bot.responses.no_hotel_booking), 
                                CONSTANTS.bot.prompt_types.warn);
                        }}
                        style={{cursor: ((CONSTANTS.disabled_features.stays_search) ? "not-allowed" : "pointer"), textAlign: "center", 
                        color: ((productType===CONSTANTS.product_types.stays) ? "#d66aca" : "rgba(255,255,255,0.4)"), 
                        borderBottom: ((productType===CONSTANTS.product_types.stays) ? "3px solid #d66aca" : "none"),
                        marginLeft: 20, fontSize: 14, padding: "20px 10px", fontFamily: "'Prompt', Sans-serif"}}>
                    <i style={{marginRight: 10}} className="fa-solid fa-hotel"></i>
                    Stays</div>
                <div className="cars_hero_menu_item main" 
                        onClick={()=>{
                            change_product_type(CONSTANTS.product_types.rental_cars);
                            show_full_search_form();
                            (CONSTANTS.disabled_features.rental_car_search) && show_prompt_on_Bot_AD_tips_popup(
                                getBotResponse(CONSTANTS.bot.responses.no_cars_renting),
                                CONSTANTS.bot.prompt_types.warn);
                        }}
                        style={{cursor: ((CONSTANTS.disabled_features.rental_car_search) ? "not-allowed" : "pointer"), textAlign: "center",
                        color: ((productType===CONSTANTS.product_types.rental_cars) ? "#d66aca" : "rgba(255,255,255,0.4)"), 
                        borderBottom: ((productType===CONSTANTS.product_types.rental_cars) ? "3px solid #d66aca" : "none"),
                         marginLeft: 20, fontSize: 14, padding: "20px 10px", fontFamily: "'Prompt', Sans-serif"}}>
                    <i style={{marginRight: 10}} className="fa-solid fa-car"></i>
                    Cars</div>
                <div className="packages_hero_menu_item main" 
                        onClick={()=>{
                            (CONSTANTS.disabled_features.travel_packages) && show_prompt_on_Bot_AD_tips_popup(
                                getBotResponse(CONSTANTS.bot.responses.no_travel_packages), 
                                CONSTANTS.bot.prompt_types.warn)
                            }}
                        style={{cursor: (CONSTANTS.disabled_features.travel_packages) ? "not-allowed" : "pointer", textAlign: "center", color: "rgba(255,255,255,0.4)", marginLeft: 20, fontSize: 14, padding: "20px 10px", fontFamily: "'Prompt', Sans-serif"}}>
                    <i style={{marginRight: 10}} className="fa-solid fa-box-open"></i>
                    Packages</div>
                <div className="agent_hero_menu_item main" id="landing_page_hero_manu_bar_bot_item" style={{cursor: "pointer", textAlign: "center", color: "rgba(169, 221, 255, 0.8)", marginLeft: 20, fontSize: 14, padding: "20px 10px", fontFamily: "'Prompt', Sans-serif"}}>
                    <i style={{marginRight: 10}} className="fa-solid fa-robot"></i>
                    Agent</div>
                <div className="currency_hero_menu_item main" 
                        onClick={toggle_show_hide_currency_page}
                        style={{cursor: "pointer", textAlign: "center", color: "rgba(169, 221, 255, 0.8)", marginLeft: 20, fontSize: 14, padding: "20px 10px", fontFamily: "'Prompt', Sans-serif"}}>
                    <i style={{marginRight: 10}} className="fa-solid fa-globe"></i>
                    {siteCurrency}</div>
                <div className="language_hero_menu_item main" 
                        onClick={toggle_show_hide_languages_page}
                        style={{cursor: "pointer", textAlign: "center", color: "rgba(169, 221, 255, 0.8)", marginLeft: 20, fontSize: 14, padding: "20px 10px", fontFamily: "'Prompt', Sans-serif"}}>
                    <i style={{marginRight: 10}} className="fa-solid fa-language"></i>
                    {siteLanguage}</div>
                <div className="more_hero_menu_item main" style={{position: "relative"}}>
                    <div onClick={showDropDownMenu} style={{cursor: "pointer", textAlign: "center", color: "rgba(169, 221, 255, 0.8)", marginLeft: 20, fontSize: 14, padding: "20px 10px", fontFamily: "'Prompt', Sans-serif"}}>
                        <i style={{marginRight: 10}} className="fa-solid fa-bars"></i>
                        More
                    </div>
                    <div style={{display: showDropDown ? "block" : "none", position: "absolute", zIndex: 10, width: 150, padding: 10, top: "80%", boxShadow: "1px 2px 3px rgba(0,0,0,0.4)", right: 0, backgroundColor: "rgb(43, 52, 61)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10}}>
                        <div className="cars_hero_menu_item dropdown" 
                                onClick={()=>{
                                    change_product_type(CONSTANTS.product_types.rental_cars);
                                    show_full_search_form();
                                    (CONSTANTS.disabled_features.rental_car_search) && show_prompt_on_Bot_AD_tips_popup(
                                    getBotResponse(CONSTANTS.bot.responses.no_cars_renting),
                                    CONSTANTS.bot.prompt_types.warn)}}
                                style={{cursor: ((CONSTANTS.disabled_features.rental_car_search) ? "not-allowed" : "pointer"), textAlign: "initial", color: "rgba(255,255,255,0.4)", fontSize: 14, padding: "10px", fontFamily: "'Prompt', Sans-serif"}}>
                            <i style={{marginRight: 10}} className="fa-solid fa-car"></i>
                            Cars</div>
                        <div className="packages_hero_menu_item dropdown" 
                                onClick={()=>{
                                    (CONSTANTS.disabled_features.travel_packages) && show_prompt_on_Bot_AD_tips_popup(
                                    getBotResponse(CONSTANTS.bot.responses.no_travel_packages),
                                    CONSTANTS.bot.prompt_types.warn)
                                }}
                                style={{cursor: (CONSTANTS.disabled_features.travel_packages) ? "not-allowed" : "pointer", textAlign: "initial", color: "rgba(255,255,255,0.4)", fontSize: 14, padding: "10px", fontFamily: "'Prompt', Sans-serif"}}>
                            <i style={{marginRight: 10}} className="fa-solid fa-box-open"></i>
                            Packages</div>
                        <div className="agent_hero_menu_item dropdown" id="dropdown_landing_page_hero_manu_bar_bot_item" style={{cursor: "pointer", textAlign: "initial", color: "rgba(169, 221, 255, 0.8)", fontSize: 14, padding: "10px", fontFamily: "'Prompt', Sans-serif"}}>
                            <i style={{marginRight: 10}} className="fa-solid fa-robot"></i>
                            Agent</div>
                        <div className="currency_hero_menu_item dropdown" 
                            onClick={toggle_show_hide_currency_page}
                                style={{cursor: "pointer", textAlign: "initial", color: "rgba(169, 221, 255, 0.8)", fontSize: 14, padding: "10px", fontFamily: "'Prompt', Sans-serif"}}>
                            <i style={{marginRight: 10}} className="fa-solid fa-globe"></i>
                            {siteCurrency}</div>
                        <div className="language_hero_menu_item dropdown" 
                                onClick={toggle_show_hide_languages_page}
                                style={{cursor: "not-allowed", textAlign: "initial", color: "rgba(169, 221, 255, 0.8)", fontSize: 14, padding: "10px", fontFamily: "'Prompt', Sans-serif"}}>
                            <i style={{marginRight: 10}} className="fa-solid fa-language"></i>
                            {siteLanguage}</div>
                        <div className="feedback_hero_menu_item dropdown" 
                                onClick={()=>show_prompt_on_Bot_AD_tips_popup(
                                    "Feedback feature is in maintenance",
                                    CONSTANTS.bot.prompt_types.warn)}
                                style={{cursor: "not-allowed", textAlign: "initial", color: "rgba(255,255,255,0.4)", fontSize: 14, padding: "10px", fontFamily: "'Prompt', Sans-serif"}}>
                            <i style={{marginRight: 10}} className="fa-solid fa-comment-dots"></i>
                            Feedback</div>
                            <div className="feedback_hero_menu_item dropdown" 
                                onClick={()=>show_prompt_on_Bot_AD_tips_popup(
                                    "Support Feature is in maintenance",
                                    CONSTANTS.bot.prompt_types.warn)}
                                style={{cursor: "not-allowed", textAlign: "initial", color: "rgba(255,255,255,0.4)", fontSize: 14, padding: "10px", fontFamily: "'Prompt', Sans-serif"}}>
                        <i style={{marginRight: 10}} className="fa-solid fa-headset"></i>
                            Support</div>
                    </div>
                </div>
            </div>
            
        </div>
    );
}

export default HeroMainMenu;