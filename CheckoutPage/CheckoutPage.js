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
import { fetchLoggedBookingByIdAndEmail, logFlightBooking } from "../../services/bookingHistoryServices";
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
import { fetchAgentPriceMarkupInfo } from '../../services/agentServices';
import { saveBookedItineraryItem } from '../../services/agentServices';

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
        hasNewMessageFromParent,
        currentParentMessge,
    } = props;

    // For Stripe
    const [ options, setOptions ] = useState();
    const API_HOST=getApiHost();

    const [ PRICES, SET_PRICES ] = useState(FLIGHT_DATA_ADAPTER.adaptPriceProps(payload));
    const [ overallTotal, setOverallTotal ] = useState(0);
    const [ activePage, setActivePage ] = useState(CONSTANTS.checkout_pages.info);
    const [ isBookingConfirmed, setIsBookingConfirmed] = useState(false); // To Do
    const [ getBookedFlightDetailsOnly, setGetBookedFlightDetailsOnly ] = useState(true);
    const [ comfirmedBookingResourceID, setComfirmedBookingResourceID ] = useState("");
    const [ completedOrderDetails, setCompletedOrderDetails ] = useState({});  // To Do
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
        
    const [ PriceMarkupValue, setPriceMarkupValue ] = useState({
        type: "",
        value: 0,
    });
    const [ canShowPrice, setCanShowPrice ] = useState({
        profit_type: "",
        with_price_bound_profit: false,
        show: false,
    });

    useEffect(()=>{
        (async()=>{
            let _pm_obj = {
                type: "",
                value: 0,
            }
            let _can_show_obj = {
                profit_type: "",
                with_price_bound_profit: false,
                show: false,
            }
            setCanShowPrice(_can_show_obj);
            setPriceMarkupValue(_pm_obj);
            if(
                hasNewMessageFromParent &&
                currentParentMessge?.from_welldugo_oc &&
                currentParentMessge?.type==="engine-parameters"
            ){
                if(currentParentMessge?.postBody?.apply_price_bound_profile){
                    _pm_obj.type = currentParentMessge?.postBody?.current_price_bound_profit_type;
                    _pm_obj.value = currentParentMessge?.postBody?.current_price_bound_profit_value;
                    _can_show_obj.with_price_bound_profit = true;
                    _can_show_obj.show = true;
                }else{
                    _can_show_obj.with_price_bound_profit = false;
                    _can_show_obj.show = true;
                }
                //currentParentMessge?.postBody?.current_price_bound_supplier: "duffel",
            }else if(localStorage.getItem("engine_parameters")){
                const engine_parameters = JSON.parse(localStorage.getItem("engine_parameters"));
                if(engine_parameters?.postBody?.apply_price_bound_profile){
                    _pm_obj.type = engine_parameters?.postBody?.current_price_bound_profit_type;
                    _pm_obj.value = engine_parameters?.postBody?.current_price_bound_profit_value;
                    _can_show_obj.with_price_bound_profit = true;
                    _can_show_obj.show = true;
                    console.log(engine_parameters);
                }else{
                    _can_show_obj.with_price_bound_profit = false;
                    _can_show_obj.show = true;
                }
            }else {
                if(localStorage.getItem("agent")){
                    const agent_id = localStorage.getItem("agent");
                    if(agent_id || agent_id!=="undefined"){
                        let _pm_res = await fetchAgentPriceMarkupInfo(agent_id);
                        _pm_obj.type = _pm_res?.type;
                        _pm_obj.value = _pm_res?.value;
                        _can_show_obj.with_price_bound_profit = true;
                        _can_show_obj.show = true;
                    }
                }
            }

            // Update State Here
            setPriceMarkupValue({
                type: _pm_obj?.type,
                value: parseFloat(_pm_obj?.value),
            });
            setCanShowPrice({
                ...canShowPrice,
                with_price_bound_profit: _can_show_obj?.with_price_bound_profit,
                show: _can_show_obj?.show,
            });
        })();
    }, [currentParentMessge]);

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

    useEffect(()=>{
        (async()=>{
            // Only Showing Booking Details
            // @wdg_client_domain_url/search?product=0&booking_id=logged_booking_id&cust_eml=customer_email&ag=agent_id
            const params = new URLSearchParams(window.location.search);
            if(
                params.has("booking_id") &&
                params.has("cust_eml")
            ){
                if(
                    params.has('product') && 
                    parseInt(params.get('product')) === CONSTANTS?.product_types?.flights
                ){
                    let _b_id = params.get("booking_id").trim();
                    let __email = params.get("cust_eml").trim();
                    let _b_res = await fetchLoggedBookingByIdAndEmail(_b_id, __email);
                    console.log(_b_res)
                    if(_b_res?._id){
                        const _payload = _b_res?.originPayloads[0];
                        setIsBookingConfirmed(true);
                        setComfirmedBookingResourceID(_b_res?._id);
                        setCompletedOrderDetails(_payload);
                        SET_PRICES(FLIGHT_DATA_ADAPTER.adaptPriceProps(_payload));
                    }
                }
            }else{
                setGetBookedFlightDetailsOnly(false);
            }
        })()
    }, []);

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
                        amount: markup(overallTotal, PriceMarkupValue?.value, PriceMarkupValue?.type)?.new_price.toFixed(2),
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

            // If Itinerary Item Booking
            if(localStorage.getItem("book_itinerary_item")){
                const __obj = JSON.parse(localStorage.getItem("book_itinerary_item"))?.postBody?.item;
                const agentToKen = __obj?.userToken;
                const __obj_to_save = {
                    user_id: __obj?.user_id,
                    itinerary_id: __obj?.itinerary_id, 
                    booking_id: logged._id,
                    confirmation_number: res.data?.booking_reference,
                    app_url: __obj?.app_url,
                    product_type: __obj?.product_type,
                    prod_index: __obj?.prod_index,
                    item_index: __obj?.item_index,
                    item_id: __obj?.item_id,
                    item_details: __obj?.item_details,
                    link_type: "booking_id", 
                    url_link: `${__obj?.app_url}/search?product=0&booking_id=${logged._id}&cust_eml=${res.data?.passengers[0]?.email}&ag=${__obj?.user_id}`, // to do (Also, wdg_client_domain=>placeholder to be replaced with actual domain url)
                                               //search?product=0&booking_id=676b5fb6cffcb2b26efec8b2&cust_eml=adinanaries@gmail.com&ag=67fdc8bc45641576b851aafd
                    is_booked: true, 
                    customer_email: res.data?.passengers[0]?.email,
                    is_verified: true,
                }
                const booked_itin_item_res = await saveBookedItineraryItem(__obj_to_save, agentToKen);
                if(booked_itin_item_res?._id){
                    alert("You have completed itinerary item booking!");
                }else{
                    alert("You're booking was completed successfully! However, linking it to the itinerary item returned an error. Please manually search the booking on your Operational Center and Link it or Contact support for help!");
                }
                if(booked_itin_item_res?._id){
                    const _msg_to_send = {
                        from_welldugo_agent_app: true,
                        type: "completed-itinerary-item-booking",
                        postBody: {
                            item: {
                                ...__obj_to_save,
                                link: __obj_to_save?.url_link,
                                booked_itin_item_id: booked_itin_item_res?._id,
                                booking_details: res.data,
                                log_details: logged,
                            }
                        }
                    }
                    window.parent.postMessage(JSON.stringify(_msg_to_send), "*");

                }
            }

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
                    hasNewMessageFromParent={hasNewMessageFromParent}
                    currentParentMessge={currentParentMessge}
                /> : ""
            }
            <div className="wrapper">

                {
                    (isBookingConfirmed || getBookedFlightDetailsOnly) ?
                    <>
                        {
                            isBookingConfirmed ?
                            <OrderCompletedPage
                                bookingID={comfirmedBookingResourceID}
                                LogMeIn={LogMeIn}
                                pickAnotherFlightOnclick={pickAnotherFlightOnclick}
                                goHome={goHome}
                                completedOrderDetails={completedOrderDetails}
                                prices={PRICES}
                                hasNewMessageFromParent={hasNewMessageFromParent}
                                currentParentMessge={currentParentMessge}
                                getBookedFlightDetailsOnly={getBookedFlightDetailsOnly}
                            /> :
                            <div>
                                <p onClick={()=>{
                                    window.location.href="/search";
                                }}
                                    style={{fontSize: 13, textDecoration: "underline", cursor: "pointer", margin: 20}}>
                                    <i style={{marginRight: 10, color: "crimson"}} className='fa-solid fa-arrow-left'></i>
                                    Exit
                                </p>
                                <div style={{padding: 20, marginTop: 20, backgroundColor: "black"}}>
                                    <p style={{color: "white", fontSize: 13}}>
                                        <i style={{marginRight: 10, color: "yellow"}}
                                            className='fa-solid fa-exclamation-triangle'></i>
                                        No booking details to show at the moment
                                    </p>
                                </div>  
                            </div>
                        }
                    </> :
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
                            (activePage===CONSTANTS.checkout_pages.info && !getBookedFlightDetailsOnly) ?
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
                                    hasNewMessageFromParent={hasNewMessageFromParent}
                                    currentParentMessge={currentParentMessge}
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
                                    hasNewMessageFromParent={hasNewMessageFromParent}
                                    currentParentMessge={currentParentMessge}
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
                                    hasNewMessageFromParent={hasNewMessageFromParent}
                                    currentParentMessge={currentParentMessge}
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
