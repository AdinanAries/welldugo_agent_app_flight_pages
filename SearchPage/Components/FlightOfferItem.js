import CONSTANTS from "../../../Constants/Constants";
import ENVIRONMENT from "../../../Constants/Environment";

//Offer item cards
import DuffelOfferItem from "./FlightOfferCards.js/DuffelOfferItem";

const FlightOfferItem = (props) => {
    if(CONSTANTS.duffel===ENVIRONMENT.data_provider) {
        return <DuffelOfferItem
            selectFlightOffer={props.selectFlightOffer}
            flight={props.flight} 
            index={props.index}
        />
    } else {
        return <div>
            <p>Unknown Data Provider</p>
        </div>
    }
}

export default FlightOfferItem;