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

    const [ newCustomerAgeGroup, setNewCustomerAgeGroup ] = useState("adult");
    const [ selectedPassengertIndex, setSelectedPassengertIndex ] = useState(UNSELECTED_PASSENGER_VALUE);
    const [ pageMsg, setPageMsg ] = useState(PAGE_TITLES.initial);
    const [ availableAdultPassengersForInfants, setAvailableAdultPassengersForInfants ] = useState([]);
    const [ allInfantsPassengers, setAllInfantPassengers ] = useState([]);

    const { 
        data_provider,
        hide_prices_section,
        passengers, 
        prices, 
        resetCheckoutConfirmation, 
        showInfoPage,
        bookingEngine,
        hasNewMessageFromParent,
        currentParentMessge,
        removeCustomer,
        addCustomer,
    } = props;

    const SHOW_PRICES = (hide_prices_section ? !hide_prices_section : true);

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
        window.scrollTo(0, 0);
        props.savePassengerInfo(new_info_obj, index);
        unSelectPassengerCard();
        setAdultPsngrForInfants();
        setInfantPsngr();
    }

    return (
        <div>
            <div className="checkout_page_all_info_flex_container">
                <div className="checkout_page_all_info_flex_left checkout_passengers_container" style={{width: SHOW_PRICES ? "calc(65% - 30px)" : "100%"}}>
                    <div style={{marginTop: 10}}>
                        <p style={{color: "rgba(0,0,0,0.7)", fontSize: 13, fontFamily: "'Prompt', Sans-serif"}}>
                            <i className={pageMsg.icon} style={{marginRight: 10, color: "green"}}></i>
                            {pageMsg.msg}</p>
                        <div style={{padding: "10px 0", display: "flex", flexWrap: "wrap", justifyContent: "space-between"}}>
                            
                            { ((selectedPassengertIndex > UNSELECTED_PASSENGER_VALUE) && (selectedPassengertIndex < passengers.length)) ? 
                                <PassengerForm 
                                    data_provider={data_provider}
                                    bookingEngine={bookingEngine}
                                    index={selectedPassengertIndex}
                                    savePassengerInfo={savePassengerInfo}
                                    resetCheckoutConfirmation={resetCheckoutConfirmation}
                                    passenger={passengers[selectedPassengertIndex]}
                                    unSelectPassengerCard={unSelectPassengerCard}
                                /> :
                                <>
                                    {
                                        passengers.map((each, i) => {
                                            let age = calculate_age(each.born_on);
                                            return <PassengerCard 
                                                bookingEngine={bookingEngine}
                                                key={each.id}
                                                index={i}
                                                age={age}
                                                setResponsibleAdultForInfant={props.setResponsibleAdultForInfant}
                                                availableAdultPassengersForInfants={availableAdultPassengersForInfants}
                                                allInfantsPassengers={allInfantsPassengers}
                                                selectPassengerCard={selectPassengerCard} 
                                                passenger={each} 
                                                hasNewMessageFromParent={hasNewMessageFromParent}
                                                currentParentMessge={currentParentMessge}
                                                removeCustomer={(removeCustomer ? ()=>removeCustomer(i) : null)}
                                            />
                                        })
                                    }
                                    {
                                        addCustomer &&
                                        <div className="checkout_passenger_card" style={{position: "relative", border: "1px dashed rgba(0,0,0,0.2)", width: "calc(50% - 5px)", borderRadius: 8, marginTop: 7}}>
                                            <div style={{cursor: "pointer", padding: 10, backgroundColor: "rgba(0,0,0,0.07)", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                                                <div style={{padding: "10px 0", width: "100%"}}>
                                                    <select onInput={(e)=>setNewCustomerAgeGroup(e.target.value)}
                                                        value={newCustomerAgeGroup}
                                                        style={{padding: 10, width: "100%", fontSize: 13, border: "1px solid rgba(0,0,0,0.1)", textAlign: "center"}}>
                                                        <option value="adult">Adult</option>
                                                        <option value="child">Child</option>
                                                        <option value="infant_without_seat">Infant</option>
                                                    </select>
                                                    <p onClick={()=>addCustomer(newCustomerAgeGroup)} 
                                                        style={{fontSize: 13, color: "white", textAlign: "center", textDecoration: "underline", padding: 10, backgroundColor: "darkslateblue"}}>
                                                        <i style={{color: "rgba(255,255,255,0.5)", marginRight: 10, fontSize: 13}}
                                                            className="fa-solid fa-plus"></i>
                                                        Add Person
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </>
                            }
                            
                        </div>
                    </div>
                </div>
                {
                    SHOW_PRICES &&
                    <div className="checkout_page_all_info_flex_right">
                        <PriceSummary 
                            bookingEngine={bookingEngine}
                            prices={prices}
                            buttonFunction={props.showPaymentPage} 
                            backButtonFunction={showInfoPage}
                            buttonText="Payment"
                            total_travelers={passengers.length}
                            hasNewMessageFromParent={hasNewMessageFromParent}
                            currentParentMessge={currentParentMessge}
                        />
                    </div>
                }
            </div>
        </div>
    );
}

export default PassengerNameRecord;