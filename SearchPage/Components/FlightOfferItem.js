import CONSTANTS from "../../../Constants/Constants";
import ENVIRONMENT from "../../../Constants/Environment";
import { has_data_provider } from "../../../helpers/general";

//Offer item cards
import OfferItem from "./FlightOfferCards.js/OfferItem";

const FlightOfferItem = (props) => {
    const {
        data_provider,
        bookingEngine,
        hasNewMessageFromParent,
        currentParentMessge,
        rawData,
    } = props;


    
    if(has_data_provider(data_provider)) {
        return <OfferItem
            bookingEngine={bookingEngine}
            selectFlightOffer={props.selectFlightOffer}
            flight={props.flight} 
            index={props.index}
            hasNewMessageFromParent={hasNewMessageFromParent}
            currentParentMessge={currentParentMessge}
            rawData={rawData}
            data_provider={data_provider}
        />
    } else {
        return <div style={{marginTop: 10, padding: 20, backgroundColor: "crimson", border: "2px dashed red", fontSize: 13}}>
            <p style={{fontSize: 13, color: "white"}}>
                <i style={{marginRight: 10, color: "yellow"}}
                    className="fa-solid fa-exclamation-triangle"></i>
                Data Source Not Identified.
            </p>
        </div>
    }
}

export default FlightOfferItem;