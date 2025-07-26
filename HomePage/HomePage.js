import Main from "./Components/Main";
import SearchPage from "../SearchPage/SearchPage";

function HomePage(props){
    
   const { 
    agentDetails,
    bookingEngine,
    siteCurrency, 
    siteLanguage, 
    toggle_show_hide_currency_page, 
    toggle_show_hide_languages_page,
    productType,
    change_product_type,
    hasNewMessageFromParent,
    currentParentMessge,
} = props
    return(
        <div id="home_page">
            { !props.showSearchPage ? 
                    <Main 
                        toggle_show_hide_languages_page={toggle_show_hide_languages_page}
                        toggle_show_hide_currency_page={toggle_show_hide_currency_page}
                        siteCurrency={siteCurrency}
                        siteLanguage={siteLanguage}
                        showSearchForm={props.showSearchForm} 
                        show_search_page={props.show_search_page} 
                        productType={productType}
                        change_product_type={change_product_type}
                    /> : 
                <SearchPage 
                    bookingEngine={bookingEngine}
                    agentDetails={agentDetails}
                    begin_checkout={props.begin_checkout}
                    productType={productType}
                    change_product_type={change_product_type}
                    hasNewMessageFromParent={hasNewMessageFromParent}
                    currentParentMessge={currentParentMessge}
                /> 
            }
        </div>
    );
}

export default HomePage;