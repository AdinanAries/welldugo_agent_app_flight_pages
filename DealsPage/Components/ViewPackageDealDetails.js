import { useState } from "react";
import { add_commas_to_number } from "../../../helpers/general";

const ViewPackageDealDetails = (props) => {

    const {
        data,       
    } = props;

    let hidePlaceHolders = true;

    const {
        _id,
        title,
        travel_destination,
        total_price,
        cover_picture,
        html_description,
        items,
        max_num_of_adults,
        max_num_of_children,
        max_num_of_infants,
        type,
        view_template,
        view_theme,
        price_currency,
        start_date,
        end_date,
        include_adults,
        include_children,
        include_infants,
        text_editor_content,
    } = data;

    let agent_id="";
    if(localStorage.getItem("agent")){
        agent_id = localStorage.getItem("agent");
    }

    const __THEME_COLORS = {
        sunshine: {
            primary: "yellow",
            secondary: "orange",
            text: "",
        },
        breeze: {
            primary: "skyblue",
            secondary: "slateblue",
            text: ""
        }
    }

    let total_people = ``;
    
    if(include_adults){
        total_people += `${parseInt(max_num_of_adults || 0)} Adult(s)`
    }
    if(include_children){
        total_people += `, ${parseInt(max_num_of_children || 0)} Child(ren)`;
    }
    if(include_infants){
        total_people += `, ${parseInt(max_num_of_infants || 0)} Infant(s)`;
    }

    const INCLUDED_ITEMS_NAME_ARRAY = data.items?.map(each=>each.name);

    return <div style={{background: "white"}}>
        <div style={{borderBottom: "1px solid rgba(0,0,0,0.1)", background: "rgb(0, 37, 63)"}}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 20}}>
                <div>
                    <h3 style={{color: "yellow"}}>
                        {title}
                    </h3>
                    <p style={{color: "yellow", fontSize: 13}}>
                        {travel_destination}
                    </p>
                </div>
                <a href={`/deals?&ag=${agent_id}`} style={{textDecoration: "none"}}>
                    <div style={{cursor: "pointer", color: "orange", fontSize: 13, textDecoration: "underline"}}>
                        <i style={{marginRight: 10, color: "rgba(255,255,255,0.5)"}}
                            className="fa-solid fa-arrow-up"></i>
                        See Package/Deals List
                    </div>
                </a>
            </div>
        </div>
        <div>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center",
                backgroundImage: `url(${cover_picture})`, backgroundSize: "cover", backgroundRepeat: "no-repeat", height: 400}}>
                <div>
                    <h1 style={{textAlign: "center", color: "white", textShadow: "1px 2px 3px rgba(0,0,0,0.9)"}}>
                        {title|| "Heading Title Here"}</h1>
                    <p style={{textAlign: "center", backgroundColor: __THEME_COLORS[view_theme]?.primary, color: "black"}}>
                        <i className="fa-solid fa-map-marker-alt" style={{marginRight: 10}}></i>
                        {travel_destination || "Travel Destination"}</p>
                </div>
            </div>
            <div style={{padding: 10}}>
                <div style={{backgroundColor: __THEME_COLORS[view_theme]?.primary, marginTop: -50, padding: 20, paddingBottom: 40}}>
                    <div style={{padding: 20, width: "fit-content", marginTop: -70, backgroundColor: __THEME_COLORS[view_theme]?.secondary}}>
                        {
                            total_price ?
                            <h1>$ {add_commas_to_number(parseFloat(total_price)?.toFixed(2)) || "0.00"}</h1> :
                            <h1>$ 0.00</h1>
                        }
                        <div style={{marginTop: 5}}>
                            <p style={{fontSize: 13}}>
                                <i style={{marginRight: 10}} className="fa-solid fa-user"></i>
                                {total_people}
                            </p>
                            {
                                end_date &&
                                <p style={{fontSize: 13}}>
                                <i style={{marginRight: 10}} className="fa-solid fa-calendar-alt"></i>
                                Available until {end_date}</p>
                            }
                        </div>
                    </div>
                    <div style={{padding: 10}}>
                        {
                            html_description ? 
                            <div style={{fontSize: 13, marginBottom: 20}} 
                                dangerouslySetInnerHTML={{ __html: html_description }} /> :
                            <>
                            {
                                !hidePlaceHolders &&
                                <p style={{fontSize: 13, marginBottom: 20, color: "rgba(0,0,0,0.7)"}}>
                                    The information you include in this section may include; Crafted Activities: Develop a detailed itinerary with a mix of activities, attractions, and free time. Considered Logistics: Plan transportation, accommodation, and other logistical elements to ensure a smooth and enjoyable experience. Travel Dates and Times: Specify the exact dates and times of departure and arrival for each flight, noting the local time at each location. Confirmation Number: Provide the flight confirmation or booking reference number. Ticket Number: Include the ticket number, not just the reservation number, as this is crucial for replacement if lost. Reservation Number: While the ticket number is essential, the reservation number can also be included for convenience
                                </p>
                            }
                            </>
                        }
                        {
                            (INCLUDED_ITEMS_NAME_ARRAY.length > 0) ?
                            <p style={{fontSize: 14, textAlign: "center"}}>
                                <span style={{fontWeight: "bolder"}}>
                                    Includes: </span>{
                                        INCLUDED_ITEMS_NAME_ARRAY?.map(each=>`${each?.replaceAll("_", " ")}, `)
                                    }</p> :
                            <p style={{fontSize: 14, textAlign: "center"}}>
                                <i style={{marginRight: 10, color: "red"}} className="fa-solid fa-exclamation-triangle"></i>
                                No items included in this package
                            </p>
                        }
                    </div>
                </div>
                <div style={{display: "flex", justifyContent: "center", flexWrap: "wrap", marginTop: -25}}>
                    {
                        INCLUDED_ITEMS_NAME_ARRAY?.map(each=>{
                            
                            let all_icons = {
                                flight: "plane",
                                stay: "hotel",
                                rental_car: "car",
                                event: "ticket",
                                cruise: "ship",
                                bus_tour: "bus",
                                restaurant: "spoon",
                                other: "list-ol"
                            };
                            let _icon = all_icons[each];
                            return <div style={{width: 50, height: 50, borderRadius: "100%", backgroundColor: __THEME_COLORS[view_theme]?.secondary, display: "flex", justifyContent: "center", alignItems: "center", margin: "0 5px"}}>
                                <i style={{fontSize: 20}} className={('fa-solid fa-'+_icon)}></i>
                            </div>
                        })
                    }
                </div>
                <div>
                    {
                        items?.map((each, i)=>{
                            let _flip = ((i%2)===0);
                            let name = each?.name?.replaceAll("_", " ");
                            if(name)
                                name = (name[0].toUpperCase() + name.substring(1));
                            let _html_details = each?.html_details;
                            let _image_url = each?.image_url;
                            let individual_fields_info = [];

                            for(const key in each){
                                let __value = each[key];
                                if(Array.isArray(__value)){
                                    __value = __value?.join(", ");
                                }
                                if(
                                    key!=="name" &&
                                    key!=="text_editor_content" &&
                                    key!=="html_details" &&
                                    key!=="image_url" 
                                ){
                                    if(each[key]){
                                        let _key = key?.replaceAll("_", " ");
                                        _key = (_key[0].toUpperCase() + _key.substring(1))
                                        individual_fields_info.push(<span style={{fontSize: 13}}>
                                            <span style={{color: "rgba(0,0,0,0.8)", fontSize: 13}}>
                                                {_key}:{" "}
                                            </span>
                                            {__value}
                                            <br/>
                                        </span>);
                                    }
                                }
                            }
                            if(!_flip){
                                return <div className="highlighter-package-previewer-item-section" style={{marginTop: 20, display: "flex"}}>
                                    <div className="highlighter-package-previewer-item-section-img" style={{width: 250, maxHeight: 250, backgroundImage: `url(${_image_url})`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center"}}>
                                    </div>
                                    <div className="highlighter-package-previewer-item-section-info" style={{width: "calc(100% - 230px)", margin: 10, marginRight: 0, padding: 10, marginLeft: -20, background: __THEME_COLORS[view_theme]?.primary}}>
                                        <h3 style={{marginBottom: 10}}>
                                            {name}s:</h3>
                                        <p style={{marginBottom: 10, fontSize: 13, marginRight: -15, backgroundColor: __THEME_COLORS[view_theme]?.secondary, padding: 10}}>
                                            {individual_fields_info?.map(each=>each)}
                                        </p>
                                        {
                                            _html_details ? 
                                            <div style={{fontSize: 13}} 
                                                dangerouslySetInnerHTML={{ __html: _html_details }} /> :
                                            <>
                                                {
                                                    !hidePlaceHolders &&
                                                    <p style={{fontSize: 13, color: "rgba(0,0,0,0.7)"}}>
                                                        Text editor details will be shown here.. 
                                                    </p>
                                                }
                                            </>
                                        }
                                    </div>
                                </div>
                            }else{
                                return <div className="highlighter-package-previewer-item-section second" style={{marginTop: 20, display: "flex"}}>
                                    <div className="highlighter-package-previewer-item-section-info second" style={{width: "calc(100% - 230px)", zIndex: 2, margin: 10, marginLeft: 0, padding: 10, marginRight: -20, background: __THEME_COLORS[view_theme]?.primary}}>
                                        <h3 style={{marginBottom: 10}}>
                                            {name}s:</h3>
                                        <p style={{marginBottom: 10, fontSize: 13, marginLeft: -15, backgroundColor: __THEME_COLORS[view_theme]?.secondary, padding: 10}}>
                                            {individual_fields_info?.map(each=>each)}
                                        </p>
                                        {
                                            _html_details ? 
                                            <div style={{fontSize: 13}} 
                                                dangerouslySetInnerHTML={{ __html: _html_details }} /> :
                                            <>
                                                {
                                                    !hidePlaceHolders &&
                                                    <p style={{fontSize: 13, color: "rgba(0,0,0,0.7)"}}>
                                                        Text editor details will be shown here.. 
                                                    </p>
                                                }
                                            </>
                                        }
                                    </div>
                                    <div className="highlighter-package-previewer-item-section-img second" style={{width: 250, maxHeight: 250, backgroundImage: `url('https://welldugo-oc-53db16692066.herokuapp.com/static/media/news-letter-bg1.f922fef0.jpg')`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center"}}>
                                    </div>
                                </div>
                            }
                        })
                    }
                </div>
                <div style={{padding: 20, borderTop: "1px solid rgba(0,0,0,0.1)", marginTop: 20}}>
                    <p style={{fontSize: 13, textAlign: "center"}}>
                        For more information contact us on +1 123 123 1234
                    </p>
                </div>
            </div>
        </div>
    </div>
}

export default ViewPackageDealDetails;