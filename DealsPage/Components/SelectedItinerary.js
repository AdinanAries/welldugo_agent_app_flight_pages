import { useState } from "react";

const SelectedItinerary = (props) => {

    const {
        itinerary,
    } = props;

    const _PAGES = {
        preview: 1,
        calendar: 2,
        alerts: 3,
    }

    const [ currentPage, setCurrentPage ] = useState(_PAGES?.preview);
    const [ showBodyMessage, setShowBodyMessage ] = useState(false);

    const showPreviewPage = () => {
        setCurrentPage(_PAGES?.preview);
    }

    const showCalendarPage = () => {
        setCurrentPage(_PAGES?.calendar);
    }

    const showAlertsPage = () => {
        setCurrentPage(_PAGES?.alerts);
    }

    const showMoreItemDetails = (_item_id) => {
        document.querySelectorAll(".mobile-view-show-item-more-details-pane").forEach(each=>{
            if(each.id!==_item_id){
                each.style.display="none";
            }
        });
        if(document.getElementById(_item_id).style.display==="block")
            document.getElementById(_item_id).style.display="none";
        else
            document.getElementById(_item_id).style.display="block";
    }

    return <div style={{backgroundColor: "white"}}>
        <div style={{display: "flex", backgroundColor: "black", padding: 10}}>
            <div onClick={showPreviewPage} style={{padding: "10px 15px", color: currentPage===_PAGES?.preview ? "lightgreen" : "rgba(255,255,255,0.6)", fontSize: 13, cursor: "pointer"}}>
                <i style={{marginRight: 10, color: currentPage===_PAGES?.preview ? "yellow" : "rgba(255,255,255,0.5)"}}
                    className="fa-solid fa-clipboard"></i>
                    Preview
            </div>
            <div onClick={showCalendarPage} style={{padding: "10px 15px", color: currentPage===_PAGES?.calendar ? "lightgreen" : "rgba(255,255,255,0.6)", fontSize: 13, cursor: "pointer"}}>
                <i style={{marginRight: 10, color: currentPage===_PAGES?.calendar ? "yellow" : "rgba(255,255,255,0.5)"}}
                    className="fa-solid fa-calendar-alt"></i>
                    Calender
            </div>
            <div onClick={showAlertsPage} style={{padding: "10px 15px", color: currentPage===_PAGES?.alerts ? "lightgreen" : "rgba(255,255,255,0.6)", fontSize: 13, cursor: "pointer"}}>
                <i style={{marginRight: 10, color: currentPage===_PAGES?.alerts ? "yellow" : "rgba(255,255,255,0.5)"}}
                    className="fa-solid fa-bell"></i>
                    Alerts
            </div>
        </div>
        {
            showBodyMessage &&
            <div style={{padding: 10, display: "flex", alignItems: "center", borderBottom: "1px solid rgba(0,0,0,0.1)", backgroundColor: "rgba(0,0,0,0.1)"}}>
                <i style={{marginRight: 10, color: "rgba(0,0,0,0.4)"}} className="fa-solid fa-envelope"></i>
                <p style={{fontSize: 13, color: "rgba(0,0,0,0.8)"}}
                    dangerouslySetInnerHTML={{ __html: itinerary?.sent_email_title }}
                />
            </div>
        }
        {
            currentPage===_PAGES?.preview &&
            <div style={{backgroundColor: "white", padding: "0 5px"}}>
                <div id="itinerary_page_designer_content" style={{paddingBottom: 400}}>
                    <div className="reset-width-on-mobile-clients">
                        {
                            showBodyMessage &&
                            <div>
                                <p style={{padding: 10, fontSize: 13}}>
                                    <span dangerouslySetInnerHTML={{ __html: itinerary?.body_message }}
                                    />
                                    <br/>
                                    {   
                                        (itinerary?.include_book_package_link && itinerary?.package_id) &&
                                        <a style={{color: "blue", textDecoration: "underline", cursor: "pointer"}} className="itinerary_page_include_package_link_anchor_tag" target="_blank">
                                            <span dangerouslySetInnerHTML={{ __html: (itinerary?.body_package_link_message || "Please click here to book package") }} />
                                        </a>
                                    }
                                </p>
                            </div>
                        }
                        <div style={{padding: 20, backgroundColor: "rgb(222, 248, 255)"}}>
                            <table style={{width: "100%", borderSpacing: 0}}>
                                <tr>
                                    <td style={{width: "50%"}}>
                                        <div style={{display: "flex", alignItems: "center"}}>
                                            <p className="hide_at_500"
                                                style={{marginRight: 10, fontWeight: "bolder", fontSize: 13}}>
                                                Purpose:
                                            </p>
                                            <p dangerouslySetInnerHTML={{ __html: itinerary?.purpose }}
                                                style={{fontSize: 13}} />
                                        </div>
                                        <div style={{display: "flex", alignItems: "center", marginTop: 5}}>
                                            <p className="hide_at_500"
                                                style={{marginRight: 10, fontWeight: "bolder", fontSize: 13}}>
                                                Destination:
                                            </p>
                                            <p dangerouslySetInnerHTML={{ __html: itinerary?.destination }}
                                                style={{fontSize: 13}} />
                                        </div>
                                    </td>
                                    <td style={{width: "50%"}}>
                                        <div style={{display: "flex", alignItems: "center"}}>
                                            <p  className="hide_at_500"
                                                style={{marginRight: 10, fontWeight: "bolder", fontSize: 13}}>
                                                Start Date:
                                            </p>
                                            <p dangerouslySetInnerHTML={{ __html: itinerary?.start_date }}
                                                style={{fontSize: 13}} />
                                        </div>
                                        <div style={{display: "flex", alignItems: "center", marginTop: 5}}>
                                            <p  className="hide_at_500"
                                                style={{marginRight: 10, fontWeight: "bolder", fontSize: 13}}>
                                                End Date:
                                            </p>
                                            <p dangerouslySetInnerHTML={{ __html: itinerary?.end_date }}
                                                style={{fontSize: 13}} />
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div style={{borderTop: "1px solid rgba(0,0,0,0.1)"}}>
                            {
                                (itinerary?.products?.length < 1) &&
                                <div style={{border: "3px dashed rgba(0,0,0,0.6)", padding: 20, backgroundColor: "#eee", margin: "20px 0"}}>
                                    <p style={{fontSize: 13}}>
                                        <i style={{marginRight: 10, color: "orange"}}
                                            className="fa-solid fa-exclamation-triangle"></i>
                                        No Products Added! You may include flights, hotels, rental cars, cruises, restaurants, events, etc. which the toggles above.
                                    </p>
                                </div>
                            }
                            {
                                itinerary?.products?.map((product, product_index)=>{
                                    // Getting headers from first product item - All Objects are equivalent
                                    let first_item = product.items[0];
                                    const _headers = Object.keys(first_item);
                                    return <div style={{marginBottom: 20}}>
                                        <div style={{backgroundColor: "rgba(0, 170, 255, 0.3)", display: "flex", alignItems: "center"}}>
                                            <div style={{display: "flex", alignItems: 'center'}}>
                                                <h5 dangerouslySetInnerHTML={{ __html: product?.title }}
                                                    style={{padding: 10, marginLeft: 5, fontSize: 13}} />
                                            </div>
                                        </div>
                                        <table style={{borderSpacing: 0, width: "100%"}}>
                                            <tr style={{backgroundColor: "rgba(0, 140, 255, 0.15)", paddingBottom: 20}}>
                                                <td style={{backgroundColor: "rgb(16, 55, 75)", width: 40}}>
                                                    <p className="tooltip_parent"
                                                        style={{textAlign: "center", cursor: "pointer"}}>
                                                        <i style={{color: "rgba(255,255,255,0.5)", fontSize: 13}} className="fa-solid fa-bell"></i>
                                                        <span className="tooltip" style={{color: "black"}}>
                                                            Enable alert on all items in this list
                                                        </span>
                                                    </p>
                                                </td>
                                                {
                                                    _headers?.map((header, header_index)=>{
                                                        if(
                                                            header==="is_attached_item_verified" ||
                                                            header==="link_type"
                                                        ){
                                                            return<></>;
                                                        }
                                                        let _h_arr = header?.split("_");
                                                        let _header="";
                                                        for(let _i=0; _i < _h_arr?.length; _i++){
                                                            if(_h_arr[_i])
                                                                _header += (_h_arr[_i][0].toUpperCase()+_h_arr[_i].substring(1)+" ");
                                                        }
                                                        _header=_header?.replaceAll("Number", "#");
                                                        if(header==="search_link"){
                                                            _header=`
                                                                <span style='color: blue; font-size: 13px;'>
                                                                    Actions
                                                                </span>
                                                            `;
                                                        }
                                                        return <td className={(""+((header_index>2) && "hide_at_500"))}
                                                            style={{fontSize: 13, border: "1px dashed rgba(0,0,0,0.1)", fontWeight: "bolder", padding: 5, color: "rgba(0,0,0,0.7)"}}>
                                                            <span style={{color: (_header?.trim()==="Title Here") ? "red" : "inherit", fontSize: 13}}
                                                                dangerouslySetInnerHTML={{ __html: _header?.trim() }}/>
                                                        </td>
                                                    }) 
                                                }
                                                <td style={{backgroundColor: "rgb(16, 55, 75)", width: 80}}></td>
                                            </tr>
                                            {
                                                product?.items?.map((item, item_index)=>{
                                                    // Getting values in equivalent to headers array above.
                                                    const _obj_props = Object.keys(item);
                                                    let unique_item_key = (product?.product_type+"_"+product_index+"_"+item_index);
                                                    return <tr style={{position: "relative"}}>
                                                        <td style={{backgroundColor: "black", width: 40}}>
                                                            <p className="tooltip_parent"
                                                                style={{textAlign: "center", cursor: "pointer"}}>
                                                                <i style={{color: "rgba(255,255,255,0.5)", fontSize: 13}} className="fa-solid fa-bell"></i>
                                                                <span className="tooltip" style={{color: "black"}}>
                                                                Enable alert on item
                                                            </span>
                                                            </p>
                                                        </td>
                                                        {
                                                            _obj_props?.map((_obj_prop, _obj_prop_index)=>{
                                                                if(
                                                                    _obj_prop==="is_attached_item_verified" ||
                                                                    _obj_prop==="link_type"
                                                                ){
                                                                    return<></>;
                                                                }
                                                                return <td style={{border: "1px dashed rgba(0,0,0,0.1)"}} className={(""+((_obj_prop_index>2) && "hide_at_500"))}>
                                                                    {
                                                                        _obj_prop==="search_link" ?
                                                                        <>
                                                                            {
                                                                                item[_obj_prop] &&
                                                                                <div style={{display: "flex", alignItems: "center"}}>
                                                                                    <a target="_blank" href={item[_obj_prop]}>
                                                                                        <p style={{fontSize: 13, padding: 5, color: item?.link_type==="booking_id" ? "black" : "blue", textDecoration: "underline", cursor: "pointer"}}>
                                                                                            {
                                                                                                item?.link_type==="booking_id" ? "Details" : "Book"
                                                                                            }
                                                                                        </p>
                                                                                    </a>
                                                                                </div>
                                                                            }
                                                                        </> :
                                                                        <p style={{padding: 5, fontSize: 13}}
                                                                            dangerouslySetInnerHTML={{ __html: item[_obj_prop] }} />
                                                                    }
                                                                </td>
                                                            })
                                                        }
                                                        <td onClick={()=>showMoreItemDetails(unique_item_key)}
                                                            style={{fontSize: 11, padding: "0 10px", textAlign: "center", width: 80, cursor: "pointer", whiteSpace: "nowrap", backgroundColor: "black", color: "rgba(255,255,255,0.7)"}}
                                                        >
                                                            details <i style={{marginLeft: 5, color: "rgba(255,255,255,0.6)"}} className="fa-solid fa-caret-down"></i>
                                                        </td>
                                                        <div className="mobile-view-show-item-more-details-pane" id={unique_item_key} 
                                                            style={{padding: 20, top: "100%", left: 0, border: "1px solid rgba(0,0,0,0.1)", borderRadius: 8, position: "absolute", display: "none", zIndex: 1, width: "100%", backgroundColor: "#eee", boxShadow: "1px 2px 3px rgba(0,0,0,0.3)"}}>
                                                            {
                                                                _obj_props?.map((_obj_prop, _obj_prop_index)=>{
                                                                    if(
                                                                        _obj_prop==="is_attached_item_verified" ||
                                                                        _obj_prop==="link_type"
                                                                    ){
                                                                        return<></>;
                                                                    }
                                                                    let header=_obj_prop;
                                                                    if(
                                                                        header==="is_attached_item_verified" ||
                                                                        header==="link_type"
                                                                    ){
                                                                        return<></>;
                                                                    }
                                                                    let _h_arr = header?.split("_");
                                                                    let _header="";
                                                                    for(let _i=0; _i < _h_arr?.length; _i++){
                                                                        if(_h_arr[_i])
                                                                            _header += (_h_arr[_i][0].toUpperCase()+_h_arr[_i].substring(1)+" ");
                                                                    }
                                                                    _header=_header?.replaceAll("Number", "#");
                                                                    if(header==="search_link"){
                                                                        _header=`
                                                                            <span style='color: blue; font-size: 13px;'>
                                                                                Actions
                                                                            </span>
                                                                        `;
                                                                    }
                                                                    return <div>
                                                                        {
                                                                            _obj_prop==="search_link" ?
                                                                            <>
                                                                                {
                                                                                    item[_obj_prop] &&
                                                                                    <div style={{display: "flex", alignItems: "center"}}>
                                                                                        <a target="_blank" href={item[_obj_prop]}>
                                                                                            <p style={{fontSize: 13, color: "blue", textDecoration: "underline", cursor: "pointer"}}>
                                                                                                {
                                                                                                    item?.link_type==="booking_id" ? "Booking Details" : "Book Now"
                                                                                                }
                                                                                            </p>
                                                                                        </a>
                                                                                    </div>
                                                                                }
                                                                            </> :
                                                                            <div style={{display: "flex", marginBottom: 5, paddingBottom: 5, justifyContent: "space-between", borderBottom: "1px dashed rgba(0,0,0,0.1)"}}>
                                                                                <p style={{fontSize: 13, fontWeight: "bolder", marginRight: 10}}>
                                                                                    {_header}:</p>
                                                                                <p style={{fontSize: 13}}
                                                                                    dangerouslySetInnerHTML={{ __html: item[_obj_prop] }} />
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                })
                                                            }
                                                        </div>
                                                    </tr>
                                                })
                                            }
                                        </table>
                                    </div>
                                })
                            }
                        </div>
                        {
                            showBodyMessage &&
                            <p dangerouslySetInnerHTML={{ __html: itinerary?.salutation }}
                                style={{fontSize: 14, padding: 10}} />
                        }
                    </div>
                </div>
            </div>
        }
        {
            currentPage===_PAGES?.calendar &&
            <div>

            </div>
        }
        {
            currentPage===_PAGES?.alerts &&
            <div>
                
            </div>
        }
    </div>
}

export default SelectedItinerary;