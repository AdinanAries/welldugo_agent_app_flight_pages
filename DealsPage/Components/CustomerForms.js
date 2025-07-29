import PassengerNameRecord from "../../CheckoutPage/Components/PassengerNameRecord";

const CustomerForms = (props) => {
    const {
        prices,
        passengers,
        resetCheckoutConfirmation,
        hasNewMessageFromParent,
        currentParentMessge,
        savePassengerInfo,
        setResponsibleAdultForInfant,
        bookingEngine,
    } = props;
    
    return <div>
        <PassengerNameRecord
            hide_prices_section={true}
            prices={prices}
            bookingEngine={bookingEngine}
            setResponsibleAdultForInfant={setResponsibleAdultForInfant}
            savePassengerInfo={savePassengerInfo}
            passengers={passengers}
            resetCheckoutConfirmation={resetCheckoutConfirmation}
            hasNewMessageFromParent={hasNewMessageFromParent}
            currentParentMessge={currentParentMessge}
        />
    </div>
}

export default CustomerForms;