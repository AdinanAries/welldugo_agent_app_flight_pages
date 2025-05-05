import { useEffect, useState } from "react";
import { BhDateChoosersInit } from "../../../helpers/DateChoosersInit";
import CONSTANTS from "../../../Constants/Constants";

const BookingHistoryFiltersForm = (props) => {

    const { ShowBookingHistory, toggle_show_booking_history_filters, hide_booking_history_filters } = props;
    const [ filtersForm, setFiltersForm ] = useState({
        departure_date: "",
        return_date: "",
        trip_type: "",
        cabin_type: ""
    });


    const searchFiltersOnsubmit = () => {
        ShowBookingHistory(filtersForm);
    }

    const setFlightHistoryFilterDates = (_departure, _return) => {
        setFiltersForm((prevState)=>{
            prevState.departure_date=_departure;
            prevState.return_date=_return;
            ShowBookingHistory(prevState);
            return prevState;
        });
    }
    // Making global - to used in DateChooserInit
    global._setFlightHistoryFilterDates=setFlightHistoryFilterDates;

    const setFilterTripType = (e) => {
        if(e.target.value!=="*"){
            BhDateChoosersInit(e.target.value);
        }else{
            BhDateChoosersInit(CONSTANTS.one_way);
        }
        setFiltersForm({
            ...filtersForm,
            departure_date: "",
            return_date: "",
            trip_type: e.target.value
        });
    }

    const setFilterCabinType = (e) => {
        setFiltersForm({
            ...filtersForm,
            cabin_type: e.target.value
        })
    }

    useEffect(()=>{
        BhDateChoosersInit();
    }, []);

    return (
        <div>
            <p style={{fontFamily: "'Prompt', Sans-serif", textAlign: "center", fontSize: 13, color: "rgba(0,0,0,0.7)", cursor: "pointer"}}>
                <i style={{marginRight: 10}} className="fa fa-history"></i>
                Booking History
            </p>
            <div style={{marginTop: 10, position: "relative", backgroundColor: "rgba(0,0,0,0.072)", borderRadius: 50, display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                <p style={{position: "relative", zIndex: 4, display: "flex", flexDirection: 'column', justifyContent: "center", alignItems: "center", width: 40, height: 48, borderRadius: "100%"}}>
                    <i style={{color: "rgba(0,0,0,0.7)"}} className="fa fa-calendar"></i>
                </p>
                <input id="booking_history_date_range_input"
                    readOnly="true" 
                    style={{position: "relative", zIndex: 4, border: "none", borderRadius: 50, fontSize: 13, padding: "14px 10px", backgroundColor: "rgba(0,0,0,0.052)", fontFamily: "'Prompt', sans-serif", width: "calc(100% - 95px)"}} type="text" 
                    placeholder="departure date"/>
                <p onClick={toggle_show_booking_history_filters} style={{cursor: "pointer", position: "relative", zIndex: 4, display: "flex", flexDirection: 'column', justifyContent: "center", alignItems: "center", width: 48, height: 48, borderRadius: "100%", backgroundColor: "rgba(0,0,0,0.072)",}}>
                    <i id="toggle_show_booking_history_filters_caret" style={{color: "rgba(0,0,0,0.7)", transition: "all 0.2s ease-in-out"}} className="fa fa-caret-down"></i>
                </p>
                <div id="booking_history_filters_container" style={{display: "none", padding: "0 10px", backgroundColor: "rgb(240,240,240)", paddingTop: 70, position: "absolute", top: -10, left: 0, zIndex: 3, width: "calc(100% + 5px)", borderRadius: 20, boxShadow: "0 0 5px rgba(0,0,0,0.33)",}}>
                    <div style={{padding: 10}}>
                        <p style={{fontSize: 13, fontWeight: "bolder", letterSpacing: 1, color: "rgba(0,0,0,0.6)", fontFamily: "'Prompt', sans-serif"}}>
                            Filter by:</p>
                        <div style={{marginLeft: 10, marginTop: 10}}>
                            <p style={{fontSize: 13, letterSpacing: 1, color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', sans-serif"}}>
                                Cabin type</p>
                            <select
                                onChange={setFilterCabinType}
                                style={{marginTop: 5, border: "none", borderRadius: 50, backgroundColor: "rgba(0,0,0,0.052)", fontFamily: "'Prompt', sans-serif", padding: 10, fontSize: 13, width: "100%"}}>
                                <option value="*">All</option>
                                {/*<option>Cheapest</option>*/}
                                <option value="economy">Economy</option>
                                <option value="premium">Premium</option>
                                <option value="business">Business</option>
                                <option value="first">First</option>
                            </select>
                            <p style={{fontSize: 13, letterSpacing: 1, color: "rgba(0,0,0,0.7)", marginTop: 15, fontFamily: "'Prompt', sans-serif"}}>
                                Trip type</p>
                                <select 
                                    onChange={setFilterTripType}
                                    style={{marginTop: 5, border: "none", borderRadius: 50, backgroundColor: "rgba(0,0,0,0.052)", fontFamily: "'Prompt', sans-serif", padding: 10, fontSize: 13, width: "100%"}}>
                                <option value="*">All</option>
                                <option value={CONSTANTS.round_trip}>Round-trip</option>
                                <option value={CONSTANTS.one_way}>One-way</option>
                            </select>
                            <div onClick={()=>{hide_booking_history_filters();searchFiltersOnsubmit()}} style={{cursor: "pointer", padding: 10, backgroundColor: "rgba(53,53,86)", color: "white", borderRadius: 50, textAlign: "center", marginTop: 10}}>
                                Done
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookingHistoryFiltersForm;