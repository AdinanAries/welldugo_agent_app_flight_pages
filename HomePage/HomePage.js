import Main from "./Components/Main";
import SearchPage from "../SearchPage/SearchPage";

function HomePage(props){
    
   const { 
    agentDetails,
    siteCurrency, 
    siteLanguage, 
    toggle_show_hide_currency_page, 
    toggle_show_hide_languages_page,
    productType,
    change_product_type,
} = props
    return(
        <div id="home_page">
            <SearchPage 
                agentDetails={agentDetails}
                begin_checkout={props.begin_checkout}
                productType={productType}
                change_product_type={change_product_type}
            /> 
        </div>
    );
}

export default HomePage;