import plane_departure from "../../../airplane-departure.svg"
import missing_icon from "../../../missing.svg"
import SelectedTicketInfo from "./SelectedTicketInfo";
import { FLIGHT_DATA_ADAPTER } from "../../../helpers/FlightDataAdapter";
import { useState, useEffect } from "react";
import { getFlightDetail } from "../../../services/flightsServices";
import CONSTANTS from "../../../Constants/Constants";

export default function SelectedTicketPane(props){

    const { 
        data_provider,
        selectedFlightData,
        selectedFlightId,
        bookingEngine,
        hasNewMessageFromParent,
        currentParentMessge
    } = props;
    const [ flightDetail, setFlightDetail ] = useState(null);
    const [ rawData, setRawData ] = useState(null);
    const [ providerDictionary, setProviderDictionary ] = useState({});
    const [isError, setIsError] = useState(false);

    useEffect(()=>{
        (async () => {
            const flight_id = (selectedFlightId || "");
            const flight_object = (selectedFlightData || {});
            let data = await getFlightDetail({ flight_id, flight_object });
            console.log("Full Flight Detail: ", data);
            if(
                (data_provider.toUpperCase()===CONSTANTS.duffel && data.data) ||
                (data_provider.toUpperCase()===CONSTANTS.amadeus && data.result)
            ) {
                if(data) {
                    let dataDict = {};
                    if(data_provider.toUpperCase()===CONSTANTS.amadeus){
                        //dataDict = data?.result?.dictionaries;
                        setProviderDictionary(dataDict);
                    }
                    setRawData(data);
                    let detail = await FLIGHT_DATA_ADAPTER?.adapt(data, data_provider, dataDict, "full_flight");
                    setFlightDetail(detail);
                }
            }else{
                setIsError(true);
                setFlightDetail(null);
            }
        })()
    }, []);

    const unselectFlightOffer = () => {
        props.unselectFlightOffer();
        setFlightDetail(null);
    }
    global.__unselectFlightOffer = unselectFlightOffer;

    return (
        <div id="selected_ticket_pane" className="display_more_info_pane" 
            style={{display: "block", zIndex: 10002/*, height: (isError || !flightDetail) ? "100vh": "calc(100vh - 120px)"*/}}>
            {
                !isError ?
                    flightDetail ? 
                        <SelectedTicketInfo 
                            data_provider={data_provider}
                            bookingEngine={bookingEngine}
                            key={0}
                            rawData={rawData}
                            flight={flightDetail}
                            unselectFlightOffer={unselectFlightOffer} 
                            begin_checkout={props.begin_checkout} 
                            hasNewMessageFromParent={hasNewMessageFromParent}
                            currentParentMessge={currentParentMessge}
                        /> : 
                        <div style={{padding: "40px 10px", height: "calc(100% + 90px)", backgroundColor: "white", display: "flex", alignItems: "center"}}>
                            <div style={{width: "calc(100% - 20px)"}}>
                                <p style={{color: "rgba(0,0,0,0.8)", textAlign: "center"}}>
                                    <i className="fa-solid fa-spinner" style={{marginRight: 10, color: "green"}}></i>
                                    Loadding... Please Wait</p>
                            </div>
                        </div>
                : <div id="selected_ticket_main_details_pane" style={{padding: "40px 10px", height: "calc(100% + 90px)", display: "flex", alignItems: "center"}}>
                    <div style={{width: "calc(100% - 20px)"}}>
                        <div style={{margin: "auto", width: 280, marginBottom: 10}}>
                            <div style={{backgroundImage: `url('${missing_icon}')`, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center", width: "100%", height: "100%", position: "absolute", left: 10, top: -5,  zIndex: 1, opacity: 0.1}}></div>
                            <p style={{textAlign: "center"}}>
                                <img src={plane_departure}  style={{width: "100%", height: "auto", opacity: 0.4}} alt="plane departure"/>
                            </p>
                        </div>
                        <p style={{color: "rgba(0,0,0,0.8)", textAlign: "center"}}>
                            <i className="fa-solid fa-exclamation-triangle" style={{marginRight: 10, color: "orange"}}></i>
                            This flight is no longer available
                        </p>
                        <div onClick={()=>{unselectFlightOffer();global.hide_selected_ticket_details_pane();}}
                            style={{padding: "15px", backgroundColor: bookingEngine?.closeButtonBgColor, cursor: "pointer", 
                                color: bookingEngine?.closeButtonIconColor, textAlign: "center", margin: "auto", marginTop: 30, borderRadius: 50, width: 220, boxShadow: "1px 2px 3px rgba(0,0,0,0.3)"}}>
                            <i className="fa-solid fa-times" style={{marginRight: 10, color: bookingEngine?.closeButtonIconColor}}></i>
                            close</div>
                    </div>
                </div>
            }
        </div>
    );
}
