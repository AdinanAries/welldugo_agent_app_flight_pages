import { useEffect, useState } from "react";
import PassengerCard from "./PassengerCard";
import PassengerForm from "./PassengerForm";
import PriceSummary from "./PriceSummary";
import { calculate_age } from "../../../helpers/general";
import CONSTANTS from "../../../Constants/Constants";

const PassengerNameRecord = (props) => {
    
    const UNSELECTED_PASSENGER_VALUE = -1;
    const PAGE_TITLES = {
        initial: {
            msg: "Please click on each passenger card below to add their details..",
            icon: "fa-solid fa-info"
        },
        passenger_selected: {
            msg: "Please Provide Passenger Information",
            icon: "fa-solid fa-user"
        }
    }

    const [ selectedPassengertIndex, setSelectedPassengertIndex ] = useState(UNSELECTED_PASSENGER_VALUE);
    const [ pageMsg, setPageMsg ] = useState(PAGE_TITLES.initial);
    const [ availableAdultPassengersForInfants, setAvailableAdultPassengersForInfants ] = useState([]);
    const [ allInfantsPassengers, setAllInfantPassengers ] = useState([]);

    const { 
        passengers, 
        prices, 
        resetCheckoutConfirmation, 
        showInfoPage,
    } = props;

    useEffect(()=> {
        setAdultPsngrForInfants();
        setInfantPsngr();
    }, []);

    const setAdultPsngrForInfants = () => {
        let temp_arr=[];
        passengers.forEach( each => {
            if((calculate_age(each.born_on) > 17) || (each?.type?.trim()==="adult")) 
                temp_arr.push(each);
        });
        setAvailableAdultPassengersForInfants(temp_arr);
    }

    const setInfantPsngr = () => {
        let temp_arr=[];
        passengers.forEach( each => {
            if(calculate_age(each.born_on) <= CONSTANTS.infant_age_threshold) 
                temp_arr.push(each);
        });
        setAllInfantPassengers(temp_arr);
    }

    const selectPassengerCard = (index) => {
        setSelectedPassengertIndex(index);
        setPageMsg(PAGE_TITLES.passenger_selected);
    }

    const unSelectPassengerCard = () => {
        setSelectedPassengertIndex(UNSELECTED_PASSENGER_VALUE);
        setPageMsg(PAGE_TITLES.initial);
    }

    const savePassengerInfo = (new_info_obj, index) => {
        props.savePassengerInfo(new_info_obj, index);
        unSelectPassengerCard();
        setAdultPsngrForInfants();
        setInfantPsngr();
    }

    return (
        <div>
            <div className="checkout_page_all_info_flex_container">
                <div className="checkout_page_all_info_flex_left checkout_passengers_container">
                    <div style={{marginTop: 10}}>
                        <p style={{color: "rgba(0,0,0,0.7)", fontSize: 13, fontFamily: "'Prompt', Sans-serif"}}>
                            <i className={pageMsg.icon} style={{marginRight: 10, color: "green"}}></i>
                            {pageMsg.msg}</p>
                        <div style={{padding: "10px 0", display: "flex", flexWrap: "wrap", justifyContent: "space-between"}}>
                            
                            { ((selectedPassengertIndex > UNSELECTED_PASSENGER_VALUE) && (selectedPassengertIndex < passengers.length)) ? 
                                <PassengerForm 
                                    index={selectedPassengertIndex}
                                    savePassengerInfo={savePassengerInfo}
                                    resetCheckoutConfirmation={resetCheckoutConfirmation}
                                    passenger={passengers[selectedPassengertIndex]}
                                    unSelectPassengerCard={unSelectPassengerCard}
                                /> :
                                passengers.map((each, i) => {
                                    let age = calculate_age(each.born_on);
                                    return <PassengerCard 
                                        key={each.id}
                                        index={i}
                                        age={age}
                                        setResponsibleAdultForInfant={props.setResponsibleAdultForInfant}
                                        availableAdultPassengersForInfants={availableAdultPassengersForInfants}
                                        allInfantsPassengers={allInfantsPassengers}
                                        selectPassengerCard={selectPassengerCard} 
                                        passenger={each} 
                                    />
                                })
                            }
                            
                        </div>
                    </div>
                </div>
                <div className="checkout_page_all_info_flex_right">
                    <PriceSummary 
                        prices={prices}
                        buttonFunction={props.showPaymentPage} 
                        backButtonFunction={showInfoPage}
                        buttonText="Payment"
                        total_travelers={passengers.length}
                    />
                </div>
            </div>
        </div>
    );
}

export default PassengerNameRecord;