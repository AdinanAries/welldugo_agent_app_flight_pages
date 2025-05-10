import CheckoutInfo from './Components/CheckoutInfo';
import PassengerNameRecord from './Components/PassengerNameRecord';
import PaymentPage from './Components/PaymentPage';
import CONSTANTS from '../../Constants/Constants';
import getBotResponse from '../../Constants/BotResponses';
import { obj_has_empty_prop, calculate_age, get_currency_symbol } from "../../helpers/general";
import { markup } from '../../helpers/Prices';
import { FLIGHT_DATA_ADAPTER } from "../../helpers/FlightDataAdapter";
import { show_prompt_on_Bot_AD_tips_popup } from '../../components/HPSupport';
import { createFlightOrder } from '../../services/flightsServices';
import { logFlightBooking } from "../../services/bookingHistoryServices";
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import OrderCompletedPage from './Components/OrderCompletedPage';
import Logger, { getBookingConfirmedLogMessage } from '../../helpers/Logger';
import PassengerImg from "../../TravelerAnonymous.jpg";
import PassengerImg2 from "../../explore_destination_img7.jpg";
import PassengerImg3 from "../../explore_destination_img4.jpg";
import PassengerImg4 from "../../explore_destination_img8.jpg";
import PassengerImg5 from "../../explore_destination_img3.jpg";
import passengerImg6 from "../../explore_destination_img5.jpg";
import { getApiHost } from '../../Constants/Environment';
import FullPageLoader from '../../components/FullPageLoader';
import FlightConfirmationEmailMarkup from "../../helpers/FlightConfirmationEmailMarkup";
import { getPriceMarkupPercentage } from '../../services/flightsServices';

let INCLUDED_CHECKED_BAGS_EACH_PSNGR_QUANTITY = {};
export default function CheckoutPage(props){

    const {
        payload,
        cancel_checkout,
        LogMeIn,
        paymentIntent,
        setPaymentIntent,
        bookingIntent,
        setBookingIntent,
        bookingEngine,
    } = props;

    // For Stripe
    const [ options, setOptions ] = useState();
    const API_HOST=getApiHost();

    const [ PRICES, SET_PRICES ] = useState(FLIGHT_DATA_ADAPTER.adaptPriceProps(payload));
    const [ overallTotal, setOverallTotal ] = useState(0);
    const [ activePage, setActivePage ] = useState(CONSTANTS.checkout_pages.info);
    const [ isBookingConfirmed, setIsBookingConfirmed] = useState(false);
    const [ comfirmedBookingResourceID, setComfirmedBookingResourceID ] = useState("");
    const [ completedOrderDetails, setCompletedOrderDetails ] = useState({});
    const [ checkoutConfirmation, setCheckoutConfirmation ] = useState({
        type: "server_error",
        isError: false,
        message: "",
    });
    const [ checkoutPayload, setcheckoutPayload ] = useState({
        meta: {},
        data: FLIGHT_DATA_ADAPTER.prepareCheckout(payload)
    });
    const [ stage, setStage ] = useState({percentage: 0, step: "", message: ""});
    const [ isLoading, setIsLoading ] = useState(false);

    // State for Including Checked Bags
    const [ includedCheckedBagsTotal, setIncludedCheckedBagsTotal] = useState(0);
    const [ includedCheckedBagsNumber, setIncludedCheckedBagsNumber ] = useState(0);
    const [ servicesForPost, setServicesForPost ] = useState([]);
    const [ includedCB, setIncludedCB ] = useState({});
    const [ PriceMarkupPercentage, setPriceMarkupPercentage ] = useState(0);
        
    useEffect(()=>{
        (async()=>{
            let perc = await getPriceMarkupPercentage();
            setPriceMarkupPercentage(parseInt(perc));
        })();
    }, []);

    useEffect(()=>{
        // These help incase a new flight was selected
        setPaymentIntent(null);
        setBookingIntent(null);
        setIncludedCB(INCLUDED_CHECKED_BAGS_EACH_PSNGR_QUANTITY);
        addApplicableDefaultFees();
    }, []);

    // code: const TOTAL_PRICE=checkoutPayload.data.payments[0].amount;
    useEffect(()=>{
        calcOverall_Total();
    });

    const endCheckoutProcessing = () => {
        setStage({percentage: 0, step: "", message: ""});
    }

    const PROCESSOR_INTERVAL = 500;
    const startProcessingPayment = () => {
        let i=0;
        setStage({percentage: 1, step: "Payment", message: "Processing Payment"});
        return new Promise((resolve)=>{
            const intvl = setInterval(()=>{
                i+=10;
                setStage({percentage: i, step: "Payment", message: "Processing Payment"});
                if(i===40){
                    clearInterval(intvl)
                    resolve(true);
                }
                if(i===100){
                    endCheckoutProcessing();
                    resolve(true);
                }
            }, PROCESSOR_INTERVAL);
        });
    }

    const startProcessingBookingOrder = () => {
        let i=40;
        return new Promise((resolve)=>{
            const intvl = setInterval(()=>{
                i+=10;
                setStage({percentage: i, step: "Order", message: "Ordering booking from the airline"});
                if(i===70){
                    clearInterval(intvl);
                    resolve(true);
                }
                if(i===100){
                    endCheckoutProcessing();
                    resolve(true);
                }
            }, PROCESSOR_INTERVAL);
        });
    }

    const startProcessingBookingOrderError = () => {
        let i=70;
        return new Promise((resolve)=>{
            const intvl = setInterval(()=>{
                i+=10;
                setStage({percentage: i, step: "Error", message: "Oops! An Error Occurred"});
                if(i===100){
                    endCheckoutProcessing();
                    clearInterval(intvl)
                    resolve(true);
                }
            }, PROCESSOR_INTERVAL);
        });
    }

    const startProcessingBookingLog = () => {
        let i=70;
        return new Promise((resolve)=>{
            const intvl = setInterval(()=>{
                i+=10;
                setStage({percentage: i, step: "Log", message: "Logging your booking"});
                if(i===90){
                    endCheckoutProcessing();
                    clearInterval(intvl)
                    resolve(true);
                }
            }, PROCESSOR_INTERVAL);
        });
    }

    const CompletedBookingCleanup = () => {
        // Reset Payment Intent
        setPaymentIntent(null);
        setBookingIntent(null);
        let i=90;
        return new Promise((resolve)=>{
            const intvl = setInterval(()=>{
                i+=10;
                setStage({percentage: i, step: "Redirecting", message: "Redirecting to Confirmation Page"});
                if(i===100){
                    endCheckoutProcessing();
                    clearInterval(intvl)
                    resolve(true);
                }
            }, PROCESSOR_INTERVAL);
        });
    }

    const calcOverall_Total = () => {
        let price = parseFloat(PRICES.total_amount);
        const { extras } = PRICES;
        extras.forEach(each=>{
            price=price+each.total;
        });
        setOverallTotal(price);
    }

    const AVAILABLE_SERVICES=FLIGHT_DATA_ADAPTER.return_available_services(payload);

    const resetCheckoutConfirmation = () => {
        setCheckoutConfirmation({
            type: "server_error",
            isError: false,
            message: "",
        });
    }

    const showInfoPage = () => {
        setActivePage(CONSTANTS.checkout_pages.info);
    }

    const showPNRPage = () => {
        saveAncillaries();
        setActivePage(CONSTANTS.checkout_pages.pnr);
    }

    let imgs = [PassengerImg, PassengerImg2, PassengerImg3, PassengerImg4, PassengerImg5, passengerImg6];
    const showPaymentPage = async () => {
        // First try to save the current Passenger PNR Form
        window.__saveCurrentPassengerPNRForm__ && window.__saveCurrentPassengerPNRForm__()
        if(is_passenger_data_all_set()){

            setIsLoading(true);

            // Reset payments amount in case function runs multiple times
            checkoutPayload.data.payments[0].amount=PRICES.total_amount;

            // 1. Including ancillaries totals into price
            const { extras } = PRICES;
            for(let i=0;i<extras.length;i++){
                let overallTotal = parseFloat(checkoutPayload.data.payments[0].amount);
                overallTotal=(overallTotal+extras[i].total).toFixed(2);
                checkoutPayload.data.payments[0].amount=overallTotal;
            }

            if(!paymentIntent?.id){
                // Creating payment intent
                const pi = await fetch((API_HOST+'/api/payment/secret/'), {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        amount: markup(overallTotal, PriceMarkupPercentage).new_price.toFixed(2),
                        currency: 'usd'
                    })
                }).then(res=>res.json()).then(data=>data).catch(e=>console.log(e));
                const {client_secret: clientSecret} = pi;

                // Creating booking intent with payment
                let agent_id = "";
                if(localStorage.getItem("agent"))
                    agent_id = localStorage.getItem("agent") || "";
                    
                let bookingItent = {
                    oc_user_id: agent_id,
                    payment_intent: pi,
                    booking_order: checkoutPayload,
                }
                const bi = await fetch((API_HOST+'/api/activities/booking-intent/'), {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(bookingItent)
                }).then(res=>res.json()).then(data=>data).catch(e=>console.log(e));

                // Setting state for re-use
                setBookingIntent(bi);
                setPaymentIntent(pi);

                // Render the form using the clientSecret
                setOptions({
                    // passing the client secret obtained from the server
                    ...options,
                    clientSecret,
                });
            }

            setIsLoading(false);
            setActivePage(CONSTANTS.checkout_pages.payment);
        }
        else
            show_prompt_on_Bot_AD_tips_popup(
                getBotResponse(CONSTANTS.bot.responses.uncompleted_pnr),
                CONSTANTS.bot.prompt_types.warn,
                100000,
                {
                    image: true,
                    data: {
                        img_url: imgs[Math.floor(Math.random() * imgs.length)],
                        icon_class: "far fa-address-card",
                        text: "Incomplete Passenger Form(s)...",
                    }
                }
            );
    }

    const savePassengerInfo = (new_info_obj, index) => {
        let { passengers } = checkoutPayload.data;
        passengers[index] = new_info_obj;
        setcheckoutPayload({
            ...checkoutPayload,
            data: {
                ...checkoutPayload.data,
                passengers
            }
        });
    }

    const setResponsibleAdultForInfant = (e) => {
        // vals = [infant_id, adult_id] after split function
        const vals = e.target.value.split(CONSTANTS.special_str_separator);
        let { passengers } = checkoutPayload.data;
        //Previous responsible adult
        let prev_adult = passengers.find(passenger=>passenger.infant_passenger_id===vals[0]);
        if(prev_adult){
            delete prev_adult.infant_passenger_id;
        }

        //New responsible adult
        let adult = passengers.find(passenger=>passenger.id===vals[1]);
        let adult_index = passengers.findIndex(passenger=>passenger.id===vals[1]);
        adult.infant_passenger_id=vals[0];
        passengers[adult_index]=adult;

        //Assigning adults phone and email to the infant
        let infant = passengers.find(passenger=>passenger.id===vals[0]);
        let infant_index = passengers.findIndex(passenger=>passenger.id===vals[0]);
        infant.phone_number=adult.phone_number;
        infant.email=adult.email;
        passengers[infant_index]=infant;

        setcheckoutPayload({
            ...checkoutPayload,
            data: {
                ...checkoutPayload.data,
                passengers
            }
        });
    }

    const is_passenger_data_all_set = () => {
        const { passengers } = checkoutPayload.data;
        let has_all_data = true;
        let all_infants_have_responsible_adults=true;
        for(let i=0; i<passengers.length; i++){
            if(obj_has_empty_prop(passengers[i])){
                has_all_data=false;
            }
            //Infant passengers
            if(calculate_age(passengers[i].born_on) <= CONSTANTS.infant_age_threshold){
                let id_found=false;
                for(let j=0; j < passengers.length; j++){
                    if(passengers[j]?.infant_passenger_id===passengers[i].id)
                        id_found=true;
                }
                if(!id_found)
                    all_infants_have_responsible_adults=false;
            }
        }
        if(!has_all_data){
            toast("Please complete all passenger forms to continue");
            return false;
        }
        if(!all_infants_have_responsible_adults){
            toast("All infant passengers must have responsible adults");
            return false;
        }

        return true;
    }

    const createOrderOnSubmit = async (payment_intent, booking_intent) => {

        // 1. Creating flight order
        await startProcessingBookingOrder();
        // Bind payment intent to checkout obj
        checkoutPayload.meta.paymentIntent=payment_intent;
        checkoutPayload.meta.bookingIntent=booking_intent;
        checkoutPayload.meta.totalFees=getTotalDefaultFees();
        let res=await createFlightOrder(checkoutPayload);
        if(res?.data?.id){
            let log=FLIGHT_DATA_ADAPTER.prepareFlightBookingLogObject(res.data);
            // 2. Adding to booking history
            await startProcessingBookingLog();
            const logged = await logFlightBooking(log);
            setIsBookingConfirmed(true);
            setCompletedOrderDetails(res.data);
            setComfirmedBookingResourceID(logged._id);
            // 3. Logging booking as user activity
            Logger.log_activity({
                title: "Flight Booking Confirmed",
                body: getBookingConfirmedLogMessage(res.data),
                resource_id: logged._id,
                resource_type: CONSTANTS.resource_types.booking_history,
            });

            //Seding email to customer
            const MSG = {
                to: res.data?.passengers[0]?.email,
                subject: "Welldugo.com - Flight Booking Confirmation",
                text: `
                Dear ${res.data?.passengers[0]?.given_name} ${res.data?.passengers[0]?.family_name},\n\n
                \tPlease view your booking confirmation details below:`,
                html: FlightConfirmationEmailMarkup(res.data),
            }
            const email_res = await fetch((API_HOST+'/api/email/send/'), {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(MSG)
            }).then(res=>res.json()).then(data=>data).catch(e=>console.log(e));
            console.log(email_res);

            // Redirecting to Confirmation Page and Cleaning up
            await CompletedBookingCleanup();
        }else{
            await startProcessingBookingOrderError();
            setCheckoutConfirmation({
                type: "server_error",
                isError: true,
                message: res.message,
            });
            //checkoutPayload.data.payments[0].amount=PRICES.total_amount;
        }

    }

    const pickAnotherFlightOnclick = () => {
        setIsBookingConfirmed(false);
        cancel_checkout();
        global.__unselectFlightOffer();
        global.hide_selected_ticket_details_pane();
        window.location.reload();
    }

    const goHome = () => {
        window.location.href="/"
    }

    const addApplicableDefaultFees = () => {
        CONSTANTS.customer_fees.flight_order.defaults.forEach(each=>{
            PRICES.extras.push({
                name: each?.name,
                quantity: (each?.quantity || 1),
                total: each?.total
            })
        });
        SET_PRICES({...PRICES});
    }

    const getTotalDefaultFees = () => {
        const FEES=CONSTANTS.customer_fees.flight_order.defaults;
        let total=0;
        for(let i=0; i<FEES.length; i++){
            total+=FEES[i].total;
        }
        return total;
    }

    const addServiceToPrices = (_name, _qunatity, _total) => {
        PRICES.extras.push({
            name: _name,
            quantity: _qunatity,
            total: _total
        });
        SET_PRICES({...PRICES});
    }

    const resetPriceExtras = () => {
        PRICES.extras=[];

        // Adding applicable fees
        addApplicableDefaultFees();

        // SET_PRICES({...PRICES}); --commented out since above function will set state
    }

    const saveAncillaries = () => {
        resetPriceExtras();
        // Including ancillary services in prices
        setTimeout(()=>{
            if(includedCheckedBagsNumber>0){
                addServiceToPrices(
                    "Checked bags",
                    includedCheckedBagsNumber,
                    includedCheckedBagsTotal
                );
                includeBookingAncillaries(servicesForPost)
            }
        }, 5);

    }

    const includeBookingAncillaries = (_services=[]) => {
        calcOverall_Total();
        const data_with_services_included = FLIGHT_DATA_ADAPTER.addServicesToCheckout(
                                                checkoutPayload.data,
                                                _services
                                            );
        setcheckoutPayload({
            ...checkoutPayload,
            data: {
                ...data_with_services_included
            }
        });
    }

    const removeAllBookingAncillaries = () => {
        calcOverall_Total()
        const data_with_all_services_removed = FLIGHT_DATA_ADAPTER.clearCheckoutIncludedServices(
                                                checkoutPayload.data
                                            );
        setcheckoutPayload({
            ...checkoutPayload,
            data: {
                ...data_with_all_services_removed
            }
        });
    }

    const nav_separator_style = {
        padding: 10,
        color: "rgba(0,0,0,0.2)"
    }

    console.log("checkout payload:", checkoutPayload);

    return (
        <div id="booking_start_checkout_page_container" className="flight_checkout_popup_cover_container" style={{display: "block"}}>
            {
                isLoading && <FullPageLoader />
            }
            {
                (stage.percentage) ?
                <SubmitCheckoutInProgress
                    stage={stage}
                    setStage={setStage}
                    endCheckoutProcessing={endCheckoutProcessing}
                /> : ""
            }
            <div className="wrapper">

                {
                    isBookingConfirmed ?
                    <OrderCompletedPage
                        bookingID={comfirmedBookingResourceID}
                        LogMeIn={LogMeIn}
                        pickAnotherFlightOnclick={pickAnotherFlightOnclick}
                        goHome={goHome}
                        completedOrderDetails={completedOrderDetails}
                        prices={PRICES}
                    /> :
                    <>
                        <div style={{paddingTop: 10, borderBottom: "1px solid rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                            <p className="pop-up-close-btn" onClick={()=>{
                              props.cancel_checkout();
                            }}
                                style={{cursor: "pointer", color: "rgba(0,0,0,0.6)", border: "1px solid rgba(0,0,0,0.1)", width: 40, height: 40, borderRadius: "100%", fontSize: 22, marginRight: 5, display: "flex", justifyContent: "center", alignItems: "center"}}>
                                &times;
                            </p>
                            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                                <div style={{display: "flex", flexDirection: "row"}}>
                                    <div onClick={showInfoPage} style={{cursor: "pointer", padding: 10,
                                            color: (
                                                    (activePage===CONSTANTS.checkout_pages.info)
                                                    || (activePage===CONSTANTS.checkout_pages.pnr)
                                                    || (activePage===CONSTANTS.checkout_pages.payment)
                                                ) ? "rgb(201, 0, 176)" : "rgba(0,0,0,0.6)"}}>
                                        <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 12}}>
                                            <i style={{marginRight: 10,
                                                opacity:
                                                (
                                                    (activePage===CONSTANTS.checkout_pages.info)
                                                    || (activePage===CONSTANTS.checkout_pages.pnr)
                                                    || (activePage===CONSTANTS.checkout_pages.payment)
                                                ) ? 1 : 0.3}} className='fa-solid fa-plane-departure' aria-hidden="false"></i>
                                            Flight</p>
                                    </div>
                                    <div style={nav_separator_style}>{">"}</div>
                                    <div onClick={showPNRPage} style={{cursor: "pointer", padding: 10,
                                        color: (
                                            (activePage===CONSTANTS.checkout_pages.pnr)
                                            || (activePage===CONSTANTS.checkout_pages.payment)
                                        ) ? "rgb(201, 0, 176)" : "rgba(0,0,0,0.6)"}}>
                                        <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 12}}>
                                            <i style={{marginRight: 10,
                                                 opacity: (
                                                    (activePage===CONSTANTS.checkout_pages.pnr)
                                                    || (activePage===CONSTANTS.checkout_pages.payment)
                                                ) ? 1 : 0.3}} className='fa-solid fa-users' aria-hidden="false"></i>
                                            Passengers</p>
                                    </div>
                                    <div style={nav_separator_style}>{">"}</div>
                                    <div onClick={showPaymentPage} style={{cursor: "pointer", padding: 10,
                                        color: (activePage===CONSTANTS.checkout_pages.payment)  ?
                                            "rgb(201, 0, 176)" : "rgba(0,0,0,0.6)"}}>
                                        <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 12}}>
                                            <i style={{marginRight: 10,
                                                opacity: (activePage===CONSTANTS.checkout_pages.payment
                                                    ) ? 1 : 0.3}} className='fa-solid fa-credit-card' aria-hidden="false"></i>
                                            Payment</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            (activePage===CONSTANTS.checkout_pages.info) ?
                                <CheckoutInfo
                                    bookingEngine={bookingEngine}
                                    cancel_checkout={props.cancel_checkout}
                                    flight={payload}
                                    showPNRPage={showPNRPage}
                                    prices={PRICES}
                                    addServiceToPrices={addServiceToPrices}
                                    resetPriceExtras={resetPriceExtras}
                                    includeBookingAncillaries={includeBookingAncillaries}
                                    removeAllBookingAncillaries={removeAllBookingAncillaries}
                                    adapted_available_services={AVAILABLE_SERVICES}
                                    includedCheckedBagsTotal={includedCheckedBagsTotal}
                                    setIncludedCheckedBagsTotal={setIncludedCheckedBagsTotal}
                                    includedCheckedBagsNumber={includedCheckedBagsNumber}
                                    setIncludedCheckedBagsNumber={setIncludedCheckedBagsNumber}
                                    servicesForPost={servicesForPost}
                                    setServicesForPost={setServicesForPost}
                                    includedCB={includedCB}
                                    setIncludedCB={setIncludedCB}
                                    saveAncillaries={saveAncillaries}
                                    paymentIntent={paymentIntent}
                                    setPaymentIntent={setPaymentIntent}
                                    bookingIntent={bookingIntent}
                                    setBookingIntent={setBookingIntent}
                                    INCLUDED_CHECKED_BAGS_EACH_PSNGR_QUANTITY={INCLUDED_CHECKED_BAGS_EACH_PSNGR_QUANTITY}
                                /> : ""
                        }
                        {
                            (activePage===CONSTANTS.checkout_pages.pnr) ?
                                <PassengerNameRecord
                                    bookingEngine={bookingEngine}
                                    showInfoPage={showInfoPage}
                                    setResponsibleAdultForInfant={setResponsibleAdultForInfant}
                                    savePassengerInfo={savePassengerInfo}
                                    passengers={checkoutPayload.data.passengers}
                                    resetCheckoutConfirmation={resetCheckoutConfirmation}
                                    showPaymentPage={showPaymentPage}
                                    prices={PRICES}
                                /> : ""
                        }
                        {
                            (activePage===CONSTANTS.checkout_pages.payment) ?
                                <PaymentPage
                                    bookingEngine={bookingEngine}
                                    loadingStages={stage}
                                    showPNRPage={showPNRPage}
                                    paymentIntent={paymentIntent}
                                    setPaymentIntent={setPaymentIntent}
                                    bookingIntent={bookingIntent}
                                    setBookingIntent={setBookingIntent}
                                    payments={checkoutPayload.data.payments}
                                    checkoutPayload={checkoutPayload}
                                    startProcessingPayment={startProcessingPayment}
                                    startProcessingBookingOrderError={startProcessingBookingOrderError}
                                    setCheckoutConfirmation={setCheckoutConfirmation}
                                    prices={PRICES}
                                    options={options} // For stripe
                                    checkoutConfirmation={checkoutConfirmation}
                                    createOrderOnSubmit={createOrderOnSubmit}
                                    total_travelers={checkoutPayload.data.passengers.length}
                                /> : ""
                        }
                    </>
                }
            </div>
        </div>
    );
}

const SubmitCheckoutInProgress = (props) => {

    const { stage, setStage, endCheckoutProcessing } = props;

    return <div style={{position: "fixed", zIndex: 1001, top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.3)"}}>
        <div style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <div style={{padding: "20px", backgroundColor: "white", borderRadius: 8}}>
                <p style={{fontSize: 13, fontFamily: "'Prompt', Sans-serif", marginBottom: 10}}>
                    {stage.percentage}% {stage.message}
                </p>
                <div style={{width: 300, background: "rgba(0,0,0,0.1)", borderRadius: 8, overflow: "hidden"}}>
                    <div style={{backgroundColor: ((stage.step.toLowerCase()==="error") ? "crimson" : "green"), width: (stage.percentage+"%"), padding: 5}}></div>
                </div>
                {
                    (stage.percentage===100) &&
                    <div onClick={endCheckoutProcessing}
                        style={{cursor: "pointer", boxShadow: "1px 2px 3px rgba(0,0,0,0.3)", textAlign: "center", fontFamily: "'Prompt', Sans-serif", fontSize: 14, padding: "10px 20px", marginTop: 15, borderRadius: 50,
                        backgroundColor: ((stage.step.toLowerCase()==="error") ? "crimson" : "green"), color: "white"}}>
                        <i style={{marginRight: 10}}
                            className={((stage.step.toLowerCase()==="error") ? "fa-solid fa-times" : "fa-solid fa-check")}></i>
                        {(stage.step.toLowerCase()==="error") ? "Close" : "Done"}</div>
                }
            </div>
        </div>
    </div>
}
