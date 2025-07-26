import deals_icon from "../../../icons/deals_icon.png";
import trips_icon from "../../../icons/trips_icon.png";
import explore_icon from "../../../icons/explore_icon.png";
import botIcon from "../../../icons/botIcon.svg";
import HeroMainMenu from './HeroMainMenu';
import getBotNoticeMessage, { getBotGreeting } from "../../../Constants/BotNoticeMsg";

import { 
    show_full_search_form, 
    show_trips_page, 
    show_deals_page, 
    show_help_page, 
    show_explore_page, 
} from '../../../helpers/PageRoutingFuncs';

import $ from "jquery"
import { useEffect } from 'react';
import HeroDropIcon from '../../../helpers/HeroDropIcons';
import CONSTANTS from "../../../Constants/Constants";

export default function ExploreDestinations(props){

    const { 
        siteCurrency, 
        siteLanguage, 
        toggle_show_hide_currency_page, 
        toggle_show_hide_languages_page,
        productType,
        change_product_type,
    } = props;
    // Reset for toggling to hide or show the dropdown buttons
    global.is_landing_page_search_filters_open=false;

    useEffect(()=>{
        HeroDropIcon();
        chat_bot_new_msg(getBotGreeting());
        setInterval(() => {
            chat_bot_new_msg(getBotNoticeMessage());
        }, 20000);
    }, [])

    return (
            <div className="explore_destinations_promo_card">
                <div>
                    <div className="wrapper">
                        <HeroMainMenu 
                            toggle_show_hide_currency_page={toggle_show_hide_currency_page}
                            toggle_show_hide_languages_page={toggle_show_hide_languages_page}
                            siteCurrency={siteCurrency} 
                            siteLanguage={siteLanguage}
                            productType={productType}
                            change_product_type={change_product_type}
                        />
                    </div>
                </div>
            </div>
        
    );
}

var i = 0;
var txt = getBotGreeting(); /*The text click to start search...*/
var speed = 30; /* The speed/duration of the effect in milliseconds */

export function chat_bot_new_msg(txt_p){
    if(document.getElementById("landing_page_search_input_text_display"))
        document.getElementById("landing_page_search_input_text_display").innerHTML="";

    i=0;
    txt=txt_p;
    typeWriter();
}

function typeWriter() {
    if (i < txt.length) {

        if(txt.charAt(i) === "&" && txt.charAt(i+1) === "#"){
            if(document.getElementById("landing_page_search_input_text_display"))
                document.getElementById("landing_page_search_input_text_display").innerHTML += txt.substring(i, i+8);
            i = i+9;
        }else{
            if(document.getElementById("landing_page_search_input_text_display"))
                document.getElementById("landing_page_search_input_text_display").innerHTML += txt.charAt(i); 
            i++;
        }

        setTimeout(typeWriter, speed);
  }
}

$(document).ready(()=>{
    setTimeout(()=>{
        if(document.getElementById("landing_page_search_input_text_display"))
            document.getElementById("landing_page_search_input_text_display").innerHTML = '';
        i = 0;
        typeWriter();
    }, 1000);

});
