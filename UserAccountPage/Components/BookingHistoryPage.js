import PaginationButtons from "../../../components/PaginationButtons";
import BookingHistoryFiltersForm from "./BookingHistoryFiltersForm";
import loading_icon from "../../../icons/loading.svg";
import nothing_found_icon from "../../../icons/nothing_found_icon.svg";
import { useState } from "react";
import { get_date_format_DAYMMMDDYYYY } from "../../../helpers/general";
import BookingHistorySelectedItem from "./BookingHistorySelectedItem";
import CONSTANTS from "../../../Constants/Constants";

const BookingHistoryPage = (props) => {
    
    const { 
        isLoading, 
        ShowBookingHistory, 
        toggle_show_booking_history_filters, 
        hide_booking_history_filters, 
        bookings, 
        show_booking_history_more_info_pane 
    } = props;
    const [ selectedHistoryItem, setSelectedHistoryItem ] = useState();
    const [pagination, setPagination] = useState({
        CURRENT_PAGE: 1,
        PAGE_SIZE: 4,
        TOTAL_PAGES: 0,
    });

    function nextPage() {
        if(
            (((pagination.CURRENT_PAGE - 1) * pagination.PAGE_SIZE)+pagination.PAGE_SIZE)
            > bookings.length
        ) return;
        ++pagination.CURRENT_PAGE;
        setPagination({...pagination});
    }

    function prevPage() {
        if((pagination.CURRENT_PAGE-1) < 1) return;
        --pagination.CURRENT_PAGE;
        setPagination({...pagination});
    }

    function setPage(num) {
        setPagination({...pagination, CURRENT_PAGE: num});
    }

    let begin = ((pagination.CURRENT_PAGE - 1) * pagination.PAGE_SIZE);
    let end = begin + pagination.PAGE_SIZE;
    return (
        <div className="user_account_page_each_child_container user_account_page_second_child_container" style={{borderLeft: "1px solid rgba(0,0,0,0.1)"}}>
            <BookingHistoryFiltersForm
                toggle_show_booking_history_filters={toggle_show_booking_history_filters}
                hide_booking_history_filters={hide_booking_history_filters}
                ShowBookingHistory={ShowBookingHistory}

            />
            {
                isLoading && 
                    <div style={{marginBottom: 20, padding: "20px"}}>
                        <div style={{backgroundImage: `url(${loading_icon})`, backgroundSize: "contain", backgroundRepeat: "no-repeat", width: 150, height: 150, margin: "auto"}}></div>
                        <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif", textAlign: "center", marginTop: 20}}>
                            Please wait...</p>
                    </div>
            }
            {
                (!isLoading && bookings.isError) && 
                    <div style={{marginBottom: 20, padding: "20px"}}>
                        <div style={{backgroundImage: `url(${nothing_found_icon})`, backgroundSize: "contain", backgroundRepeat: "no-repeat", width: 150, height: 150, margin: "auto"}}></div>
                        <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif", textAlign: "center", marginTop: 20}}>
                            <i style={{marginRight: 15, fontSize: 19, color: "orangered", textShadow: "1px 2px 3px rgba(0,0,0,0.2)"}} className="fa fa-exclamation-triangle"></i>
                            Oop! Error on server</p>
                    </div>
            }
            {
                (!isLoading && !bookings.isError) &&
                <>
                    <div style={{marginTop: 10, height: 400, overflowY: "auto"}}>
                        { 
                            bookings.length < 1 &&
                            <div style={{marginBottom: 20, padding: "20px"}}>
                                <div style={{backgroundImage: `url(${nothing_found_icon})`, backgroundSize: "contain", backgroundRepeat: "no-repeat", width: 150, height: 150, margin: "auto"}}></div>
                                <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif", textAlign: "center", marginTop: 20}}>
                                    <i style={{marginRight: 15, fontSize: 19, color: "orangered", textShadow: "1px 2px 3px rgba(0,0,0,0.2)"}} className="fa fa-exclamation-triangle"></i>
                                    Oops nothing found</p>
                            </div>
                        }{
                            (bookings.length > 0) && bookings.slice(begin, end).map(each => {
                                let trip_type = each.trip_type;
                                let departure_date = get_date_format_DAYMMMDDYYYY(each.departure_date);
                                let return_date = "";
                                let trip_type_icon_class = "fa-solid fa-arrow-right"
                                if(trip_type===CONSTANTS.round_trip.toLocaleLowerCase()){
                                    return_date = `- ${get_date_format_DAYMMMDDYYYY(each.return_date)}`;
                                    trip_type_icon_class= "fa-solid fa-exchange"
                                }
                                return (
                                    <div key={each._id} style={{padding: 10, display: "flex"}}>
                                        <p>
                                            <i className="fa fa-route" style={{marginRight: 10, color: "rgba(0,0,0,0.6)"}}></i>
                                        </p>
                                        <div>
                                            <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 13, color: "rgb(12, 109, 133)"}}>
                                                {each.takeoff_city} ({each.takeoff_airport_code})
                                                <i style={{margin: "0px 10px", fontSize: 13, color: "rgba(0,0,0,0.6)"}}
                                                    className={trip_type_icon_class}></i> 
                                                {each.destination_city} ({each.destination_airport_code})
                                            </p>
                                            <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 13, color: "rgba(0,0,0,0.5)"}}>
                                                {departure_date} {return_date}</p>
                                            <p onClick={()=> {
                                                    show_booking_history_more_info_pane();
                                                    setSelectedHistoryItem(each);
                                                }
                                            } style={{fontFamily: "'Prompt', Sans-serif", cursor: "pointer", fontSize: 13, borderRadius: 6, color: "rgb(199, 81, 185)"}}>
                                                view more ...
                                            </p>
                                        </div>
                                    </div>)
                                }
                            )
                        }
                    </div>
                    {
                        (bookings.length>pagination.PAGE_SIZE) && <div style={{paddingTop: 20}}>
                            <PaginationButtons 
                                pageSize={pagination.PAGE_SIZE} 
                                currentPage={pagination.CURRENT_PAGE} 
                                totalItems={bookings.length}
                                nextPage={nextPage}
                                prevPage={prevPage}
                                setPage={setPage}
                            />
                        </div>
                    }
                </>
            }
            <div id="booking_history_more_info_pane" className="display_more_info_pane">
                <p onClick={()=>document.getElementById("booking_history_more_info_pane").style.display="none"} className="page-popup-cover-close-btn">
                    &times;
                </p>
                <p>

                </p>
                {
                    selectedHistoryItem?._id && 
                    <BookingHistorySelectedItem 
                        selectedHistoryItem={selectedHistoryItem} 
                    />
                }
            </div>
        </div>
    )
}

export default BookingHistoryPage