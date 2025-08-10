import { useEffect } from "react";
import { useState } from "react";

const CalendarAlerts = (props) => {

    const {
        userDetails,
        itinerary,
        setItinerary,
    } = props;

    const [ pageData, setPageData ] = useState(itinerary?.alerts_settings || {
        on_before_trip_date: false,
        on_before_activity_start: false,
        days_before_trip_start: "1d",
        time_before_activity_start: "1h",
    });

    useEffect(()=>{
        let _itin = itinerary;
        _itin.alerts_settings=pageData;
        setItinerary(_itin);
        // To Do Save Itinerary to DB here 
    }, pageData);

    return <div>
        <div>
            <p style={{paddingBottom: 10, fontSize: 13, color: "rgba(255,255,255,0.8)"}}>
                Setup Reminders!</p>
            <div>
                <p style={{maxWidth: 250, color: "lightgreen", fontSize: 12, marginBottom: 15}}>
                    Remenders will send email notifications to the client at the specified times when enabled
                </p>
                <p style={{color: "rgba(255,255,255,0.8)"}}>
                    <span>
                        <input onInput={()=>setPageData({
                                ...pageData,
                                on_before_trip_date: !pageData?.on_before_trip_date
                            })}
                            checked={pageData?.on_before_trip_date}
                            id="itinerary_page_reminders_trip_day_check"
                            type="checkbox" 
                            className="cm-toggle"
                        />
                    </span>
                    <label htmlFor="itinerary_page_reminders_trip_day_check">
                        <span style={{marginLeft: 10, fontSize: 12}}>
                            On trip date
                        </span>
                    </label>
                </p>
                <p style={{color: "rgba(255,255,255,0.8)"}}>
                    <span>
                        <input onInput={()=>setPageData({
                                ...pageData,
                                on_before_activity_start: !pageData?.on_before_activity_start
                            })}
                            checked={pageData?.on_before_activity_start}
                            id="itinerary_page_reminders_trip_event_check"
                            type="checkbox" 
                            className="cm-toggle"
                        />
                    </span>
                    <label htmlFor="itinerary_page_reminders_trip_event_check">
                        <span style={{marginLeft: 10, fontSize: 12}}>
                            On activity start
                        </span>
                    </label>
                </p>
            </div>
        </div>
        {
            (pageData?.on_before_trip_date || pageData?.on_before_activity_start) &&
            <div style={{marginTop: 20}}>
                <p style={{cursor: "pointer", textDecoration: "underline", color: "lightgreen", fontSize: 13}}>
                    <i className="fa-solid fa-tools" style={{marginRight: 10, color: "rgba(255,255,255,0.8)"}}></i>     
                    Configure Alerts</p>
                <div style={{marginTop: 10}}>
                    {
                        pageData?.on_before_trip_date &&
                        <div style={{borderTop: "1px solid rgba(255,255,255,0.1)", padding: 5, paddingTop: 15}}>
                            <p className="subtitle-font-color-default" style={{fontSize: 13, color: "rgba(255,255,255,0.7)"}}>
                                <i className="fa-solid fa-calendar-days" style={{marginRight: 10, color: "rgba(255,255,255,0.8)"}}></i>
                                Days Before Trip</p>
                            <div>
                                <select onInput={(e)=>{
                                        setPageData({
                                            ...pageData,
                                            days_before_trip_start: e.target.value
                                        });
                                    }}
                                    value={pageData?.days_before_trip_start}
                                    style={{fontSize: 14, color: "white", width: "calc(100% - 20px)", padding: 10, background: "none", border: "none"}}>
                                        <option style={{color: "black"}} value="1d">1 day</option>
                                        <option style={{color: "black"}} value="2d">2 days</option>
                                        <option style={{color: "black"}} value="3d">3 days</option>
                                        <option style={{color: "black"}} value="4d">4 days</option>
                                        <option style={{color: "black"}} value="5d">5 days</option>
                                        <option style={{color: "black"}} value="6d">6 days</option>
                                        <option style={{color: "black"}} value="1w">1 Week</option>
                                        <option style={{color: "black"}} value="2w">2 Weeks</option>
                                </select>
                            </div>
                        </div>
                    }
                    {
                        pageData?.on_before_activity_start &&
                        <div style={{padding: 5}}>
                            <p className="subtitle-font-color-default" style={{fontSize: 13, color: "rgba(255,255,255,0.7)"}}>
                                <i className="fa-solid fa-clock" style={{marginRight: 10, color: "rgba(255,255,255,0.8)"}}></i>
                                Time Before Each Trip Event</p>
                            <div>
                                <select onInput={(e)=>{
                                        setPageData({
                                            ...pageData,
                                            time_before_activity_start: e.target.value
                                        });
                                    }}
                                    value={pageData?.time_before_activity_start}
                                    style={{fontSize: 14, color: "white", width: "calc(100% - 20px)", padding: 10, background: "none", border: "none"}}>
                                        <option style={{color: "black"}} value="5m">5 minutes</option>
                                        <option style={{color: "black"}} value="10m">10 minutes</option>
                                        <option style={{color: "black"}} value="15m">15 minutes</option>
                                        <option style={{color: "black"}} value="20m">20 minutes</option>
                                        <option style={{color: "black"}} value="30m">30 minutes</option>
                                        <option style={{color: "black"}} value="1h">1 hour</option>
                                        <option style={{color: "black"}} value="2h">2 hours</option>
                                        <option style={{color: "black"}} value="3h">3 hours</option>
                                        <option style={{color: "black"}} value="4h">4 hours</option>
                                        <option style={{color: "black"}} value="5h">5 hours</option>
                                        <option style={{color: "black"}} value="6h">6 hours</option>
                                        <option style={{color: "black"}} value="7h">7 hours</option>
                                        <option style={{color: "black"}} value="8h">8 hours</option>
                                        <option style={{color: "black"}} value="9h">9 hours</option>
                                        <option style={{color: "black"}} value="10h">10 hours</option>
                                        <option style={{color: "black"}} value="11h">11 hours</option>
                                        <option style={{color: "black"}} value="12h">12 hours</option>
                                </select>
                            </div>
                        </div>
                    }
                </div>
            </div>
        }
    </div>
}

export default CalendarAlerts;