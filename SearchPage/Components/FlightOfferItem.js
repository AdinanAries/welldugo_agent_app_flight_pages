import CONSTANTS from "../../../Constants/Constants";
import ENVIRONMENT from "../../../Constants/Environment";

//Offer item cards
import DuffelOfferItem from "./FlightOfferCards.js/DuffelOfferItem";

const FlightOfferItem = (props) => {
    const {
        bookingEngine,
        hasNewMessageFromParent,
        currentParentMessge,
    } = props;
    if(CONSTANTS.duffel===ENVIRONMENT.data_provider) {
        return <DuffelOfferItem
            bookingEngine={bookingEngine}
            selectFlightOffer={props.selectFlightOffer}
            flight={props.flight} 
            index={props.index}
            hasNewMessageFromParent={hasNewMessageFromParent}
            currentParentMessge={currentParentMessge}
        />
    } else {
        return <div>
            <p>Unknown Data Provider</p>
        </div>
    }
}

export default FlightOfferItem;