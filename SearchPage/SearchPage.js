import CONSTANTS from "../../Constants/Constants";
import SearchPageMain from "./Components/SearchPageMain";
import HotelSearchPageMain from "../../Hotel/HotelSearchPageMain";
import CarSearchPageMain from "../../Car/CarSearchPageMain";

function SearchPage(props){

    const PRODUCT_TYPE = parseInt(localStorage.getItem(CONSTANTS.local_storage.product_type));
    const AGENTID = parseInt(localStorage.getItem("agent"));
    let searchObjectIncomplete=false;

    const {
        agentDetails,
        productType,
        change_product_type
    } = props;

    return (
        <div id="search_page">
            {
                (!AGENTID) ?
                <div className="wrapper" style={{padding: "150px 0"}}>
                    <div style={{borderRadius: 8, background: "rgb(0,0,0)", padding: 20, boxShadow: "1px 2px 3px rgba(0,0,0,0.43)"}}>
                        <p style={{fontWeight: "bolder", fontFamily: "'Prompt', Sans-serif", fontSize: 14, color: "lightblue"}}>
                            <i className="fa-solid fa-user-tie" style={{marginRight: 10, color: "yellow"}}></i>
                            Travel Agent Information Not Found!
                        </p>
                        <p style={{marginTop: 10, fontFamily: "'Prompt', Sans-serif", fontSize: 14, color: "lightblue"}}>
                                No travel agent associated with this booking engine...
                        </p>
                        <p style={{display: "none", marginTop: 10, fontFamily: "'Prompt', Sans-serif", fontSize: 11, color: "skyblue"}}>
                                {new Date().toString().split("(")[0]}
                        </p>
                        <p style={{color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 10, marginBottom: 5, textAlign: "right"}}>
                            <span style={{color: "red", fontWeight: "bolder", fontSize: 14, letterSpacing: 0.5, fontFamily: "Courgette"}}>
                                    Byte the Code LLC
                                </span>
                                <br/>&copy; {new Date().getFullYear()}, all rights reserved
                        </p>
                    </div>
                </div> : ""
            }
            {
                AGENTID ?
                <>
                    {
                        (!PRODUCT_TYPE && PRODUCT_TYPE!==0) &&
                        <div className="wrapper" style={{padding: "150px 0"}}>
                            <div style={{borderRadius: 8, background: "rgb(0,0,0)", padding: 20, boxShadow: "1px 2px 3px rgba(0,0,0,0.43)"}}>
                                <p style={{fontWeight: "bolder", fontFamily: "'Prompt', Sans-serif", fontSize: 14, color: "lightblue"}}>
                                    <i className="fa-solid fa-exclamation-triangle" style={{marginRight: 10, color: "red"}}></i>
                                    Product Type Error
                                </p>
                                <p style={{marginTop: 10, fontFamily: "'Prompt', Sans-serif", fontSize: 14, color: "lightblue"}}>
                                        No Product type has been Specified (eg. Flights, Stays, or Rental Cars)
                                </p>
                                <p style={{display: "none", marginTop: 10, fontFamily: "'Prompt', Sans-serif", fontSize: 11, color: "skyblue"}}>
                                        {new Date().toString().split("(")[0]}
                                </p>
                                <p style={{color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 10, marginBottom: 5, textAlign: "right"}}>
                                    <span style={{color: "red", fontWeight: "bolder", fontSize: 14, letterSpacing: 0.5, fontFamily: "Courgette"}}>
                                            Byte the Code LLC
                                        </span>
                                        <br/>&copy; {new Date().getFullYear()}, all rights reserved
                                </p>
                            </div>
                        </div>
                    }
                    {
                        (CONSTANTS.product_types.flights===PRODUCT_TYPE) &&
                        <SearchPageMain
                            agentDetails={agentDetails}
                            begin_checkout={props.begin_checkout}
                            productType={productType}
                            change_product_type={change_product_type}
                        />
                    }
                    {
                        (CONSTANTS.product_types.stays===PRODUCT_TYPE && !CONSTANTS.disabled_features.stays_search) &&
                        <HotelSearchPageMain />
                    }
                    {
                        // When hotel search has been disabled
                        (CONSTANTS.product_types.stays===PRODUCT_TYPE && CONSTANTS.disabled_features.stays_search) &&
                        <div className="wrapper" style={{padding: "150px 0"}}>
                            <div style={{borderRadius: 8, background: "rgb(0,0,0)", padding: 20, boxShadow: "1px 2px 3px rgba(0,0,0,0.43)"}}>
                                <p style={{fontWeight: "bolder", fontFamily: "'Prompt', Sans-serif", fontSize: 14, color: "lightblue"}}>
                                    <i className="fa-solid fa-tools" style={{marginRight: 10, color: "red"}}></i>
                                    Maintenance Notice
                                </p>
                                <p style={{marginTop: 10, fontFamily: "'Prompt', Sans-serif", fontSize: 14, color: "lightblue"}}>
                                        Stays search has been disabled due to ongoing site development work...
                                </p>
                                <p style={{display: "none", marginTop: 10, fontFamily: "'Prompt', Sans-serif", fontSize: 11, color: "skyblue"}}>
                                        {new Date().toString().split("(")[0]}
                                </p>
                                <p style={{color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 10, marginBottom: 5, textAlign: "right"}}>
                                    <span style={{color: "red", fontWeight: "bolder", fontSize: 14, letterSpacing: 0.5, fontFamily: "Courgette"}}>
                                            Byte the Code LLC
                                        </span>
                                        <br/>&copy; {new Date().getFullYear()}, all rights reserved
                                </p>
                            </div>
                        </div>
                    }
                    {
                        (CONSTANTS.product_types.rental_cars===PRODUCT_TYPE && !CONSTANTS.disabled_features.rental_car_search) &&
                        <CarSearchPageMain />
                    }
                    {
                        // When rental cars search has been disalbed
                        (CONSTANTS.product_types.rental_cars===PRODUCT_TYPE && CONSTANTS.disabled_features.rental_car_search) &&
                        <div className="wrapper" style={{padding: "150px 0"}}>
                            <div style={{borderRadius: 8, background: "rgb(0,0,0)", padding: 20, boxShadow: "1px 2px 3px rgba(0,0,0,0.43)"}}>
                                <p style={{fontWeight: "bolder", fontFamily: "'Prompt', Sans-serif", fontSize: 14, color: "lightblue"}}>
                                    <i className="fa-solid fa-tools" style={{marginRight: 10, color: "red"}}></i>
                                    Maintenance Notice
                                </p>
                                <p style={{marginTop: 10, fontFamily: "'Prompt', Sans-serif", fontSize: 14, color: "lightblue"}}>
                                        Rental car search has been disabled due to ongoing site development work...
                                </p>
                                <p style={{display: "none", marginTop: 10, fontFamily: "'Prompt', Sans-serif", fontSize: 11, color: "skyblue"}}>
                                        {new Date().toString().split("(")[0]}
                                </p>
                                <p style={{color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 10, marginBottom: 5, textAlign: "right"}}>
                                    <span style={{color: "red", fontWeight: "bolder", fontSize: 14, letterSpacing: 0.5, fontFamily: "Courgette"}}>
                                            Byte the Code LLC
                                        </span>
                                        <br/>&copy; {new Date().getFullYear()}, all rights reserved
                                </p>
                            </div>
                        </div>
                    }
                </> : ""
            }
        </div>
    );
}

export default SearchPage;