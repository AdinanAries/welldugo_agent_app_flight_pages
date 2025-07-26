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

    return (
        <main>
            <ExploreDestinations 
                siteCurrency={siteCurrency}
                siteLanguage={siteLanguage}
                toggle_show_hide_currency_page={toggle_show_hide_currency_page} 
                toggle_show_hide_languages_page={toggle_show_hide_languages_page}
                productType={productType}
                change_product_type={change_product_type}
            /> 
        </main>
    );
}

export default Main;