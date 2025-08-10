import { useState } from "react";
import WDGCalendar from "./Calendar";
import CalendarAlerts from "./CalendarAlerts";

const SelectedItinerary = (props) => {

    const {
        userDetails,
        itinerary,
        setItinerary,
    } = props;

    const __PRODUCTS = {
        flight: "flight",
        hotel: "hotel",
        rental_car: "rental_car",
        event: "event",
        cruise: "cruise",
        bus_tour: "bus_tour",
        restaurant: "restaurant",
        other: "other"
    }

    const _PAGES = {
        preview: 1,
        calendar: 2,
        alerts: 3,
    }

    const returnDateEventCalendarTime = (
        date, time, params={}
    ) => {

        const {
            addYears,
            addMonths,
            addDays,
            addHours, 
            addMinutes, 
            addSeconds,
        } = params;

        let date_parts = date?.split("-");
        let time_parts = time?.split(" ");
        let plus12 = 0;
        if(time_parts?.[1].toLowerCase()?.trim()==="pm" && time_parts?.[0].split(":")[0].trim()!=="12"){
            plus12 = 12;
        }
        if(time_parts?.[1]?.toLowerCase()?.trim()==="am" && time_parts?.[0].split(":")[0].trim()==="12"){
            plus12 = -12;
        }
        time_parts = time_parts?.[0].split(":");
        let _date_obj = new Date(
            (parseInt(date_parts?.[0]) + (addYears || 0)),  // Year
            ((parseInt(date_parts?.[1]) - 1) + (addMonths || 0)), // Month
            (parseInt(date_parts?.[2]) + (addDays || 0)), // Day
            ((parseInt(time_parts?.[0]) + plus12) + (addHours || 0)), // Hour
            (parseInt(time_parts?.[1]) + (addMinutes || 0)) // Minute
        );
        return _date_obj;
    }

    const isSameCalendarDay = (start_date, start_time, end_date, end_time) => {
        if(
            returnDateEventCalendarTime(start_date, start_time).toString().substring(0,15)
            === returnDateEventCalendarTime(end_date, end_time).toString().substring(0,15)){
            return true;
        }else {
            return false;
        }
    }

    const returnCalendarEventsArrayFromItinerary = (itin_obj) => {
        console.log(itin_obj);
        const _arr_ = [];
        for(let i=0; i<itin_obj?.products?.length; i++){
            let _product = itin_obj?.products[i];
            for(let j=0; j<_product?.items?.length; j++){
                let _item = _product?.items[j];
                let title = "";
                let start = "";
                let end = "";
                if(_product?.product_type===__PRODUCTS?.flight){  
                    let start_date = _item?.date;
                    let start_time = _item?.departs;
                    let arrival_date_time_parts = _item?.arrives?.split(" at ");
                    let end_date = arrival_date_time_parts[0];
                    let end_time = arrival_date_time_parts[1];                  
                    if(isSameCalendarDay(start_date, start_time, end_date, end_time)){
                        title=(`Flight: From ${_item?.departure_airport} to ${_item?.arrival_airport}, ${_item?.airline} (${_item?.confirmation_number})`);
                        start = returnDateEventCalendarTime(start_date, start_time);
                        end = returnDateEventCalendarTime(end_date, end_time);
                        _arr_.push({title, start, end});
                    }else{
                        title=(`Flight: Takeoff from ${_item?.departure_airport} to ${_item?.arrival_airport}, ${_item?.airline} (${_item?.confirmation_number})`);
                        start = returnDateEventCalendarTime(start_date, start_time);
                        end = returnDateEventCalendarTime(start_date, start_time);
                        _arr_.push({title, start, end});
                        title=(`Flight: Arrives at ${_item?.arrival_airport} from ${_item?.departure_airport}, ${_item?.airline} (${_item?.confirmation_number})`);
                        start = returnDateEventCalendarTime(end_date, end_time);
                        end = returnDateEventCalendarTime(end_date, end_time);
                        _arr_.push({title, start, end});
                    }   
                }else if(_product?.product_type===__PRODUCTS?.hotel){
                    let start_date = _item?.date;
                    let start_time = _item?.checkin_time;
                    let end_date = _item?.checkout_date;
                    let end_time = _item?.checkout_time;                  
                    if(isSameCalendarDay(start_date, start_time, end_date, end_time)){
                        title=(`Hotel: Stay at ${_item?.name}, ${_item?.street}, ${_item?.city}`);
                        start = returnDateEventCalendarTime(start_date, start_time);
                        end = returnDateEventCalendarTime(end_date, end_time);
                        _arr_.push({title, start, end});
                    }else{
                        title=(`Hotel: Checkin at ${_item?.name}, ${_item?.street}, ${_item?.city}`);
                        start = returnDateEventCalendarTime(start_date, start_time/*, {addHours: -1}*/);
                        end = returnDateEventCalendarTime(start_date, start_time);
                        _arr_.push({title, start, end});
                        title=(`Hotel: Checkout at ${_item?.name}, ${_item?.street}, ${_item?.city}`);
                        start = returnDateEventCalendarTime(end_date, end_time);
                        end = returnDateEventCalendarTime(end_date, end_time/*, {addHours: 1}*/);
                        _arr_.push({title, start, end});
                    }
                }else if(_product?.product_type===__PRODUCTS?.event){
                    let start_date = _item?.date;
                    let start_time = _item?.time;
                    let arrival_date_time_parts = _item?.end_time?.split(" at ");
                    let end_date = arrival_date_time_parts[0];
                    let end_time = arrival_date_time_parts[1];                  
                    if(isSameCalendarDay(start_date, start_time, end_date, end_time)){
                        title=(`Event: ${_item?.topic} at ${_item?.venue}, ${_item?.street}`);
                        start = returnDateEventCalendarTime(start_date, start_time);
                        end = returnDateEventCalendarTime(end_date, end_time);
                        _arr_.push({title, start, end});
                    }else{
                        title=(`Event Start: ${_item?.topic} at ${_item?.venue}, ${_item?.street}`);
                        start = returnDateEventCalendarTime(start_date, start_time/*, {addHours: -1}*/);
                        end = returnDateEventCalendarTime(start_date, start_time);
                        _arr_.push({title, start, end});
                        title=(`Event End: ${_item?.topic} at ${_item?.venue}, ${_item?.street}`);
                        start = returnDateEventCalendarTime(end_date, end_time/*, {addHours: -1}*/);
                        end = returnDateEventCalendarTime(end_date, end_time);
                        _arr_.push({title, start, end});
                    }
                }else if(_product?.product_type===__PRODUCTS?.cruise){
                    let start_date = _item?.date;
                    let start_time = _item?.time;
                    let arrival_date_time_parts = _item?.end_time?.split(" at ");
                    let end_date = arrival_date_time_parts[0];
                    let end_time = arrival_date_time_parts[1];                  
                    if(isSameCalendarDay(start_date, start_time, end_date, end_time)){
                        title=(`Cruise: From ${_item?.start_location} (${_item?.company}) to ${_item?.end_location}`);
                        start = returnDateEventCalendarTime(start_date, start_time);
                        end = returnDateEventCalendarTime(end_date, end_time);
                        _arr_.push({title, start, end});
                    }else{
                        title=(`Cruise Start: From ${_item?.start_location} (${_item?.company}) to ${_item?.end_location}`);
                        start = returnDateEventCalendarTime(start_date, start_time/*, {addHours: -1}*/);
                        end = returnDateEventCalendarTime(start_date, start_time);
                        _arr_.push({title, start, end});
                        title=(`Cruise End: From ${_item?.start_location} (${_item?.company}) to ${_item?.end_location}`);
                        start = returnDateEventCalendarTime(end_date, end_time/*, {addHours: -1}*/);
                        end = returnDateEventCalendarTime(end_date, end_time);
                        _arr_.push({title, start, end});
                    }
                }else if(_product?.product_type===__PRODUCTS?.restaurant){
                    let start_date = _item?.date;
                    let start_time = _item?.time;
                    let arrival_date_time_parts = _item?.end_time?.split(" at ")
                    let end_date = arrival_date_time_parts[0];
                    let end_time = arrival_date_time_parts[1];                  
                    if(isSameCalendarDay(start_date, start_time, end_date, end_time)){
                        title=(`Restaurant Reservation: At ${_item?.name}, ${_item?.address}`);
                        start = returnDateEventCalendarTime(start_date, start_time);
                        end = returnDateEventCalendarTime(end_date, end_time);
                        _arr_.push({title, start, end});
                    }else{
                        title=(`Restaurant Reservation Start: At ${_item?.name}, ${_item?.address}`)
                        start = returnDateEventCalendarTime(start_date, start_time/*, {addHours: -1}*/);
                        end = returnDateEventCalendarTime(start_date, start_time);
                        _arr_.push({title, start, end});
                        title=(`Restaurant Reservation End: At ${_item?.name}, ${_item?.address}`)
                        start = returnDateEventCalendarTime(end_date, end_time/*, {addHours: -1}*/);
                        end = returnDateEventCalendarTime(end_date, end_time);
                        _arr_.push({title, start, end});
                    }
                }else if(_product?.product_type===__PRODUCTS?.rental_car){
                    let start_date = _item?.date;
                    let start_time = _item?.pickup_time;
                    let end_date = _item?.dropoff_date;
                    let end_time = _item?.dropoff_time;                  
                    if(isSameCalendarDay(start_date, start_time, end_date, end_time)){
                        title=(`Rental Car (Pickup - Dropoff): At ${_item?.location} (${_item?.company})`);
                        start = returnDateEventCalendarTime(start_date, start_time);
                        end = returnDateEventCalendarTime(end_date, end_time);
                        _arr_.push({title, start, end});
                    }else{
                        title=(`Rental Car Pickup: At ${_item?.location} (${_item?.company})`);
                        start = returnDateEventCalendarTime(start_date, start_time/*, {addHours: -1}*/);
                        end = returnDateEventCalendarTime(start_date, start_time);
                        _arr_.push({title, start, end});

                        title=(`Rental Car Droppoff: At ${_item?.location} (${_item?.company})`);
                        start = returnDateEventCalendarTime(end_date, end_time/*, {addHours: -1}*/);
                        end = returnDateEventCalendarTime(end_date, end_time);
                        _arr_.push({title, start, end});
                    }
                }else if(_product?.product_type===__PRODUCTS?.other){
                    let keys = Object?.keys(_item);
                    let details = "";
                    for(let i=0; i<keys?.length;i++){
                        let _key=keys[i];
                        let _word_arr = _key?.split("_");
                        let _full_word = "";
                        for(let j=0; j<_word_arr?.length; j++){
                            _full_word += (_word_arr[j]+" ");
                        }
                        details += (`${_full_word?.trim()} = ${_item[_key]}, `);
                        if(i>4){
                            details += "...";
                            break;
                        }
                    }
                    let start_date = _item?.date;
                    let start_time = _item?.time;
                    let arrival_date_time_parts = _item?.end_time?.split(" at ");
                    let end_date = arrival_date_time_parts[0];
                    let end_time = arrival_date_time_parts[1];                  
                    if(isSameCalendarDay(start_date, start_time, end_date, end_time)){
                        title=(`Activity With Details: ${details}`);
                        start = returnDateEventCalendarTime(start_date, start_time);
                        end = returnDateEventCalendarTime(end_date, end_time);
                        _arr_.push({title, start, end});
                    }else{
                        title=(`Start Activity With Details: ${details}`);
                        start = returnDateEventCalendarTime(start_date, start_time/*, {addHours: -1}*/);
                        start = returnDateEventCalendarTime(start_date, start_time);
                        _arr_.push({title, start, end});
                        title=(`End Activity With Details: ${details}`);
                        start = returnDateEventCalendarTime(end_date, end_time/*, {addHours: -1}*/);
                        end = returnDateEventCalendarTime(end_date, end_time);
                        _arr_.push({title, start, end});
                    }
                }else if(_product?.product_type==__PRODUCTS?.bus_tour){
                    let start_date = _item?.date;
                    let start_time = _item?.time;
                    let arrival_date_time_parts = _item?.end_time?.split(" at ");
                    let end_date = arrival_date_time_parts[0];
                    let end_time = arrival_date_time_parts[1];                  
                    if(isSameCalendarDay(start_date, start_time, end_date, end_time)){
                        title=(`Bus Tour: At ${_item?.start_location} (${_item?.company})`);
                        start = returnDateEventCalendarTime(start_date, start_time);
                        end = returnDateEventCalendarTime(end_date, end_time);
                        _arr_.push({title, start, end});
                    }else{
                        title=(`Bus Tour Starts: At ${_item?.start_location} (${_item?.company})`);
                        start = returnDateEventCalendarTime(start_date, start_time/*, {addHours: -1}*/);
                        end = returnDateEventCalendarTime(start_date, start_time);
                        _arr_.push({title, start, end});
                        title=(`Bus Tour Ends: At ${_item?.start_location} (${_item?.company})`);
                        start = returnDateEventCalendarTime(end_date, end_time);
                        end = returnDateEventCalendarTime(end_date, end_time/*, {addHours: 1}*/);
                        _arr_.push({title, start, end});
                    }
                }
            }
        }
        return _arr_;
    }

    const [ currentPage, setCurrentPage ] = useState(_PAGES?.preview);
    const [ showBodyMessage, setShowBodyMessage ] = useState(false);
    const [ calendarEvents, setCalendarEvents ] = useState(returnCalendarEventsArrayFromItinerary(itinerary)/*[
        {
            title: 'Meeting with Team',
            start: new Date(2025, 7, 6, 10, 0), // Year, Month (0-indexed), Day, Hour, Minute
            end: new Date(2025, 7, 6, 11, 0),
        },
        {
            title: 'Project Deadline',
            start: new Date(2025, 7, 8, 14, 0),
            end: new Date(2025, 7, 8, 16, 0),
        },
    ]*/);

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

    const setProductItemValue = (_value, obj_prop, _product_type, prod_index, item_index) => {
        setItinerary((prevState) => ({
            ...prevState,
            products: prevState?.products?.map((_product, _p_index) => {
                let return_obj = {
                    ..._product
                }
                if(_p_index===prod_index){
                    if(_product?.product_type===_product_type){
                        let __items = return_obj?.items?.map((each, _i_index)=>{
                            if(_i_index===item_index){
                                each[obj_prop]=_value;
                            }
                            return each;
                        });
                        return_obj.items=__items;
                    }
                }
                return return_obj;
            })
        }))
    };

    const toggleEnableItemNotification = (_value, _product_type, prod_index, item_index) => {
        const obj_prop="is_notification_enabled";
        setProductItemValue(_value, obj_prop, _product_type, prod_index, item_index);
    }

    return <div style={{backgroundColor: "white", paddingBottom: 20}}>
        <div style={{display: "flex", backgroundColor: "#2b343d", padding: 10}}>
            <div onClick={showPreviewPage} style={{padding: "10px 15px", color: currentPage===_PAGES?.preview ? "lightgreen" : "rgba(255,255,255,0.6)", fontSize: 13, cursor: "pointer"}}>
                <i style={{marginRight: 10, color: currentPage===_PAGES?.preview ? "yellow" : "rgba(255,255,255,0.5)"}}
                    className="fa-solid fa-clipboard"></i>
                    Preview
            </div>
            <div onClick={showCalendarPage} style={{padding: "10px 15px", color: currentPage===_PAGES?.calendar ? "lightgreen" : "rgba(255,255,255,0.6)", fontSize: 13, cursor: "pointer"}}>
                <i style={{marginRight: 10, color: currentPage===_PAGES?.calendar ? "yellow" : "rgba(255,255,255,0.5)"}}
                    className="fa-solid fa-calendar-alt"></i>
                    Calender View
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
                        <div style={{margin: "5px 0", backgroundColor: "rgb(222, 248, 255)"}}>
                                <table style={{width: "100%", borderSpacing: 0}}>
                                    <tr>
                                        <td style={{width: "55%", border: "1px dashed rgba(0,0,0,0.1)", padding: 10,}}>
                                            <div style={{display: "flex", alignItems: "center"}}>
                                                <p className="hide_at_500" style={{marginRight: 10, fontWeight: "bolder", fontSize: 13}}>
                                                    Purpose:
                                                </p>
                                                <span className="show_at_500">
                                                    <i style={{marginRight: 10, color: "rgba(0,0,0,0.6)"}} 
                                                        className="fa-solid fa-calendar-plus"></i>
                                                </span>
                                                <p dangerouslySetInnerHTML={{ __html: itinerary?.purpose }}
                                                    contentEditable="true" zIndex="0" style={{fontSize: 13}} />
                                            </div>
                                            <div style={{display: "flex", alignItems: "center", marginTop: 5}}>
                                                <p className="hide_at_500" style={{marginRight: 10, fontWeight: "bolder", fontSize: 13}}>
                                                    Destination:
                                                </p>
                                                <span className="show_at_500">
                                                    <i style={{marginRight: 10, color: "rgba(0,0,0,0.6)"}} 
                                                        className="fa-solid fa-map-marker-alt"></i>
                                                </span>
                                                <p dangerouslySetInnerHTML={{ __html: itinerary?.destination }}
                                                    contentEditable="true" zIndex="0" style={{fontSize: 13}} />
                                            </div>
                                        </td>
                                        <td style={{width: "45%", paddingLeft: 20, border: "1px dashed rgba(0,0,0,0.1)"}}>
                                            <div style={{display: "flex", alignItems: "center"}}>
                                                <p style={{marginRight: 10, fontWeight: "bolder", fontSize: 13}}>
                                                    Starts:
                                                </p>
                                                <p dangerouslySetInnerHTML={{ __html: itinerary?.start_date }}
                                                    contentEditable="true" zIndex="0" style={{fontSize: 13}} />
                                            </div>
                                            <div style={{display: "flex", alignItems: "center", marginTop: 5}}>
                                                <p style={{marginRight: 10, fontWeight: "bolder", fontSize: 13}}>
                                                    Ends:
                                                </p>
                                                <p dangerouslySetInnerHTML={{ __html: itinerary?.end_date }}
                                                    contentEditable="true" zIndex="0" style={{fontSize: 13}} />
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
                                                            header==="link_type" ||
                                                            header==="is_notification_enabled" 
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
                                                                <span style='color: rgb(28, 157, 171); font-size: 13px; font-weight: initial;'>
                                                                    Actions
                                                                </span>
                                                            `;
                                                        }
                                                        return <td className={(""+((header_index>2) && "hide_at_500"))}
                                                            style={{fontSize: 13, border: "1px dashed rgba(0,0,0,0.1)", fontWeight:  header==="date" ? "initial" : "bolder", padding: 5, color: header==="date" ? "rgb(28, 157, 171)" : "rgba(0,0,0,0.7)", textAlign: header==="date" ? "center" : "left"}}>
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
                                                        <td style={{backgroundColor: "#2b343d", width: 40}}>
                                                            <p onClick={()=>toggleEnableItemNotification((item?.is_notification_enabled==undefined || !item?.is_notification_enabled), product?.product_type, product_index, item_index)}
                                                                className="tooltip_parent"
                                                                style={{textAlign: "center", cursor: "pointer"}}>
                                                                <i style={{color: item?.is_notification_enabled ? "lightgreen" : "rgba(255,255,255,0.5)", fontSize: 13}} className="fa-solid fa-bell"></i>
                                                                <span className="tooltip" style={{color: "black"}}>
                                                                Enable alert on item
                                                            </span>
                                                            </p>
                                                        </td>
                                                        {
                                                            _obj_props?.map((_obj_prop, _obj_prop_index)=>{
                                                                if(
                                                                    _obj_prop==="is_attached_item_verified" ||
                                                                    _obj_prop==="link_type" ||
                                                                    _obj_prop==="is_notification_enabled"
                                                                ){
                                                                    return<></>;
                                                                }
                                                                return <td style={{border: "1px dashed rgba(0,0,0,0.1)", backgroundColor: _obj_prop==="date" ? "rgba(0, 140, 255, 0.15)" : "none", width: _obj_prop==="date" ? 130 : "auto", textAlign: _obj_prop==="date" ? "center" : "left"}} className={(""+((_obj_prop_index>2) && "hide_at_500"))}>
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
                                                                            dangerouslySetInnerHTML={{ 
                                                                                __html: ((_obj_prop==="date") ?
                                                                                    (new Date(item[_obj_prop]+"T00:00:00").toString()?.substring(0,16)) : 
                                                                                    item[_obj_prop]
                                                                                )
                                                                             }} />
                                                                    }
                                                                </td>
                                                            })
                                                        }
                                                        <td onClick={()=>showMoreItemDetails(unique_item_key)}
                                                            style={{fontSize: 11, padding: "0 10px", textAlign: "center", width: 80, cursor: "pointer", whiteSpace: "nowrap", backgroundColor: "#2b343d", color: "rgba(255,255,255,0.7)"}}
                                                        >
                                                            details <i style={{marginLeft: 5, color: "rgba(255,255,255,0.6)"}} className="fa-solid fa-caret-down"></i>
                                                        </td>
                                                        <div className="mobile-view-show-item-more-details-pane" id={unique_item_key} 
                                                            style={{top: 0, left: 0, borderBottomLeftRadius: 8, borderBottomRightRadius: 8, position: "absolute", display: "none", zIndex: 1, width: "100%", backgroundColor: "#2b343d", boxShadow: "1px 2px 3px rgba(0,0,0,0.3)"}}>
                                                            <p style={{display: "flex", padding: 20, backgroundColor: "rgba(255,255,255,0.1)", justifyContent: "space-between", alignItems: "center"}}>
                                                                <span style={{color: "white", fontSize: 13, display: "flex", alignItems: "center"}}>
                                                                    <span style={{marginRight: 15}}>
                                                                        <span className="tooltip_parent"
                                                                            style={{textAlign: "center", cursor: "pointer"}}>
                                                                            <i style={{color: "rgba(255,255,255,0.5)", fontSize: 14}} className="fa-solid fa-bell"></i>
                                                                            <span className="tooltip" style={{color: "black"}}>
                                                                                Enable alert on this item
                                                                            </span>
                                                                        </span>
                                                                    </span>
                                                                    Details:</span>
                                                                <span onClick={()=>showMoreItemDetails(unique_item_key)} style={{color: "red", fontSize: 13, cursor: "pointer"}}>
                                                                    hide <i style={{marginLeft: 5, color: "rgba(255,255,255,0.6)"}} className="fa-solid fa-caret-up"></i>
                                                                </span>
                                                            </p>
                                                            <div style={{padding: 20}}>
                                                                {
                                                                    _obj_props?.map((_obj_prop, _obj_prop_index)=>{
                                                                        if(
                                                                            _obj_prop==="is_attached_item_verified" ||
                                                                            _obj_prop==="link_type" ||
                                                                            _obj_prop==="is_notification_enabled"
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
                                                                                <span style='color: skyblue; font-size: 13px;'>
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
                                                                                            <a target="_blank" href={item[_obj_prop]} style={{textDecoration: "none"}}>
                                                                                                <p style={{fontSize: 13, color: "skyblue", padding: 10, marginTop: 10, borderRadius: 8, backgroundColor: "darkblue", cursor: "pointer"}}>
                                                                                                    {
                                                                                                        item?.link_type==="booking_id" ? "Booking Details" : "Book Now"
                                                                                                    }
                                                                                                </p>
                                                                                            </a>
                                                                                        </div>
                                                                                    }
                                                                                </> :
                                                                                <div style={{display: "flex", marginBottom: 5, paddingBottom: 5, justifyContent: "space-between", borderBottom: "1px dashed rgba(255,255,255,0.2)"}}>
                                                                                    <p style={{fontSize: 13, marginRight: 10, color: "rgba(255,255,255,0.8)"}}>
                                                                                        {_header}:</p>
                                                                                    <p style={{fontSize: 13, color: "lightgreen"}}
                                                                                        dangerouslySetInnerHTML={{ 
                                                                                            __html: ((_obj_prop==="date") ?
                                                                                                (new Date(item[_obj_prop]+"T00:00:00").toString()?.substring(0,16)) : 
                                                                                                item[_obj_prop]
                                                                                            )
                                                                                        }} />
                                                                                </div>
                                                                            }
                                                                        </div>
                                                                    })
                                                                }
                                                            </div>
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
                <WDGCalendar
                    calendarEvents={calendarEvents}
                />
            </div>
        }
        {
            currentPage===_PAGES?.alerts &&
            <div>
                <div style={{padding: 20, background: "#2b343d", borderTop: "1px dashed rgba(255,255,255,0.1)"}}>
                    <CalendarAlerts 
                        userDetails={userDetails}
                        itinerary={itinerary}
                        setItinerary={setItinerary}
                    />
                </div>
            </div>
        }
    </div>
}

export default SelectedItinerary;