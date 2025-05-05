import SearchForm from "./SearchForm";
import ChooseUs from "./ChooseUs";
import ExploreDestinations from "./ExploreDestination";

import { show_explore_page } from "../../../helpers/PageRoutingFuncs";
import { useEffect } from "react";
import CONSTANTS from "../../../Constants/Constants";

function Main(props){

    const { 
        siteCurrency, 
        siteLanguage, 
        toggle_show_hide_currency_page, 
        toggle_show_hide_languages_page,
        productType,
        change_product_type,
    } = props;
    localStorage.setItem("is_home_page", "yes");
    useEffect(()=>{
        if(props.showSearchForm){
            document.getElementById("main_hero_section").style.display="block";
            if(global.$(window).width() > CONSTANTS.viewport_threshold)
                document.querySelector("header").style.backgroundColor="#000000";
        }else{
            document.getElementById("main_hero_section").style.display="none";
            if(global.$(window).width() > CONSTANTS.viewport_threshold)
                document.querySelector("header").style.background="none";
        }
    }, []);

    return (
        <main>
            <div id="main_hero_section" className="hero-section">
                <div style={{maxWidth: 1500, margin: "auto"}}>
                    <div className="search-form-container">
                        <SearchForm 
                            productType={productType}
                            change_product_type={change_product_type}
                            show_search_page={props.show_search_page}
                        />
                    </div>
                </div>
                <div className="wrapper">
                    <div className="search_forms_promo_card">
                        <p style={{color: "white", fontWeight: 1000, fontFamily: "'Prompt', sans-serif", fontSize: 35}}>
                            Read, Travel,</p>
                        <p style={{marginTop: -9,color: "white", fontWeight: 1000, fontFamily: "'Prompt', sans-serif", fontSize: 28 }}>
                            and Become.</p>
                        <p style={{color: "white", maxWidth: 350, marginTop: 10, marginBottom: 10, fontFamily: "'Prompt', sans-serif", lineHeight: 1.1}}>
                            We've got trip ideas for you...
                        </p>
                        <div onClick={show_explore_page} style={{padding: 14, color: "orange", cursor: "pointer", fontFamily: "'Prompt', sans-serif", marginTop: 15, width: "fit-content", borderRadius: 50}}>
                            <i className="fa fa-globe" style={{marginRight: 7, fontSize: 19, color: "rgba(255,255,5,0.5)"}}></i>Start exploring
                        </div>
                    </div>
                </div>
            </div>
            <ExploreDestinations 
                siteCurrency={siteCurrency}
                siteLanguage={siteLanguage}
                toggle_show_hide_currency_page={toggle_show_hide_currency_page} 
                toggle_show_hide_languages_page={toggle_show_hide_languages_page}
                productType={productType}
                change_product_type={change_product_type}
            />
            <ChooseUs />
            
        </main>
    );
}

export default Main;