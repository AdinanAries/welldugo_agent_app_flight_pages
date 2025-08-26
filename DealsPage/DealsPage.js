import NotLoggedIn from '../../components/NotLoggedIn';
import CONSTANTS from '../../Constants/Constants';
import Waiting from '../../components/Waiting';
import DealList from './Components/DealList';
import deals_page_icon from "../../icons/deals_page_icon.svg";
import { useEffect, useState } from 'react';
import ViewPackageDealDetails from './Components/ViewPackageDealDetails';
import { getApiHost } from '../../Constants/Environment';
import { 
    fetchDealPackageById, 
    fetchDealsPackagesByAgentID 
} from '../../services/agentServices';
import { 
    getTotalDefaultFees,
    getTotalDefaultFeesNames,
    returnTaxRate,
} from '../../helpers/Prices';
import AgentNotFoundHeader from '../../components/AgentNotFoundHeader';
import PriceSummary from '../CheckoutPage/Components/PriceSummary';
import CustomerForms from './Components/CustomerForms';
import PaymentPage from './Components/PaymentPage';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { 
    calculate_age,
    obj_has_empty_prop,
    has_atleast_adult_customer,
} from '../../helpers/general';
import { toast } from 'react-toastify';
import PackageConfirmationEmailMarkup from '../../helpers/PackageConfirmationEmailMarkup';
import ItineraryPreviewer from './Components/ItineraryPreviewer';
import { 
    createPackageOrder,
    fetchProductSpecificServiceFeesByAgentId,
} from '../../services/agentServices';
import SubmitCheckoutInProgress from '../../components/SubmitCheckoutInProgress';
import ConfirmedOrderDetails from './ConfirmedOrderDetails';

const stripePromise = loadStripe('pk_test_51OdjZ3An0YMgH2TtyCpkCBN4vDrMuQlwvmFSNKqBl9gJY996OXSpZ9QLz5dBGHLYLsa7QVvwY51I0DcLHErLxW7y00vjEWv9Lc');

function DealsPage(props){

    const {
        bookingEngine,
        hasNewMessageFromParent,
        currentParentMessge,
    } = props;

    let agent_id="";
    if(localStorage.getItem("agent")){
        agent_id = localStorage.getItem("agent");
    }

    const API_HOST=getApiHost();

    const ERROR_CODES = {
        no_error: -1,
        agent_not_found: 0,
        package_deal_item_not_found: 1,
        package_deal_items_list_empty: 1,
    }

    const __STAGES = {
        preview: 0,
        preview_txt: "Preview",
        pnr: 1,
        pnr_txt: "Passengers",
        payment: 2,
        payment_txt: "Payment",
    }

    const PAGI_LIMIT = 9;
    const CUSTOMER_OBJ = {
        title: "",
        phone_number: "",
        identity_documents: [
            {
                unique_identifier: "",
                type: "",
                issuing_country_code: "",
                expires_on: ""
            }
        ],
        id: "",
        given_name: "",
        gender: "",
        type: "adult",
        family_name: "",
        email: "",
        born_on: ""
    }

    // For Stripe
    const [ options, setOptions ] = useState();
    const [ paymentIntent, setPaymentIntent ] = useState({});
    const [ prices, setPrices ] = useState({
        total_amount: 0, // Base + Tax only
        extras: []
    });
    const [ stage, setStage ] = useState({percentage: 0, step: "", message: ""});
    const [ bookingIntent, setBookingIntent ] = useState({});
    const [ passengers, setPassengers ] = useState([CUSTOMER_OBJ]);
    const [ isBookingConfirmed, setIsBookingConfirmed] = useState(false);
    const [ bookPackageDetails, setBookPackageDetails ] = useState({
        oc_user_id: agent_id,
        package_info: {},
        payment_intent: {},
        booking_intent: {},
        passengers: [],
        prices: {}
    });
    const [ completedOrderDetails, setCompletedOrderDetails ] = useState({});
    const [ isLoading, setIsLoading ] = useState(false);
    const [ isError, setIsError ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState("Unkown Error: Please contact support for assitance.");
    const [ dealsList, setDealsList ] = useState([]);
    const [ selectedPackageDeal, setSelectedPackageDeal ] = useState({});
    const [ errorCode, setErrorCode ] = useState(ERROR_CODES.no_error);
    const [ currentStage, setCurrentStage ] = useState(__STAGES?.preview);
    const [ stageNextButtonText, setstageNextButtonText ] = useState(__STAGES?.pnr_txt);
    const [ checkoutConfirmation, setCheckoutConfirmation ] = useState({
        type: "server_error",
        isError: false,
        message: "",
    });
    const [ totalItems, setTotalItems ] = useState(0);
    const [ pagiCurrentPage, setpagiCurrentPage ] = useState(1);
    const [ searchQuery, setSearchQuery ] = useState("");
    const [ pageFilters, setPageFilters ] = useState({
        // Filters yet to be defined
    });
    const [ isItinPage, setIsItinPage ] = useState(false);

    useEffect(()=>{
        // Setting Page for either Itinerary or Package view!
        const params = new URLSearchParams(window.location.search);
        if(params.has("view_itin")){
            if(JSON.parse(params.get("view_itin"))){
                setIsItinPage(true);
            }
        }
    }, []);

    useEffect(()=>{
        if(currentStage===__STAGES?.payment){
            (async()=>{
                let total_to_charge = prices?.total_amount; 
                let extras = prices?.extras;
                // Remember Services Fees, Welldudo Charges, Stripe and Taxes
                if(!total_to_charge){
                    return;
                }
                for(let ext=0; ext<extras?.length; ext++){
                    total_to_charge+=extras[ext].total;
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
                            amount: total_to_charge,
                            currency: 'usd'
                        })
                    }).then(res=>res.json()).then(data=>data).catch(e=>console.log(e));
                    const {client_secret: clientSecret} = pi;

                    setPaymentIntent(pi);

                    // Creating booking intent with payment
                    let bookingItent = {
                        oc_user_id: agent_id,
                        product_type: "package",
                        payment_intent: pi,
                        booking_order: {
                            data: {
                                selectedPackageDeal,
                                passengers
                            },
                            id: "", // Will be set to bookedPackage?._id on booking success.
                        },
                        profits: {
                            price_markup: {
                                type: "",
                                value: 0,
                            },
                            can_show: {
                                profit_type: "",
                                with_price_bound_profit: false,
                                show: false,
                            },
                        },
                        prices: prices,
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

                    // Render the form using the clientSecret
                    setOptions({
                        // passing the client secret obtained from the server
                        ...options,
                        clientSecret,
                    });
                }
            })();

            setBookPackageDetails({
                ...bookPackageDetails,
                prices: prices,
            });
        }

        if(currentStage===__STAGES?.preview){
            setstageNextButtonText(__STAGES?.pnr_txt);
        }else if(currentStage===__STAGES?.pnr){
            setstageNextButtonText(__STAGES?.payment_txt);
        }else if(currentStage===__STAGES?.payment){
            setstageNextButtonText("");
        }
        window.scrollTo(0, 0);
    }, [ selectedPackageDeal, currentStage, prices ]);

    useEffect(()=>{
        (async()=>{
            if(selectedPackageDeal?._id){
                // 1. Getting Prices
                const base_amount = parseFloat(selectedPackageDeal?.total_price);
                const tax_amount = (base_amount*returnTaxRate().rate);
                const total_amount = parseFloat(tax_amount+base_amount);
                const extras = [];
                // 2. Adding Agent Services Fees
                let agent_service_fees = await fetchProductSpecificServiceFeesByAgentId(agent_id, CONSTANTS?.app_services_fees?.types?.packages);
                for(let sv=0; sv<agent_service_fees?.length; sv++){
                    let total = agent_service_fees[sv]?.price;
                    let name = agent_service_fees[sv]?.name;
                    extras.push({
                        name,
                        total,
                        quantity: 1,
                        total_currency: "usd",
                    });
                }
                // 3. Adding Welldugo Related Fees
                /*let wdg_total_services_fees = getTotalDefaultFees("package_order");
                let wdg_total_services_fees_names = getTotalDefaultFeesNames("package_order");
                extras.push({
                    name: wdg_total_services_fees_names,
                    total: wdg_total_services_fees,
                    quantity: 1,
                    total_currency: "usd",
                });*/
                // 4. Bind all of it together and set state
                let _prices = {
                    total_amount,
                    base_amount,
                    tax_amount,
                    extras,
                    total_currency: "usd",
                    base_currency: "usd",
                    tax_currency: "usd",
                }
                setPrices(_prices);
                setPaymentIntent({});
                setBookPackageDetails({
                    ...bookPackageDetails,
                    package_info: selectedPackageDeal,
                });
            }
        })();
    }, [ selectedPackageDeal ]);

    useEffect(()=>{
        let page = window.location.pathname.substring(1);
        if(CONSTANTS.site_pages.deals===page){
            init_deals();
        }
    }, [ pagiCurrentPage ]);

    useEffect(()=>{
        setBookPackageDetails({
            ...bookPackageDetails,
            payment_intent: paymentIntent,
            booking_intent: bookingIntent,
            passengers: passengers,
        });
    }, [paymentIntent, bookingIntent, passengers]);

    const init_deals = async () => {
        const params = new URLSearchParams(window.location.search);
        // 1. Resets
        setIsLoading(true);
        setDealsList([]);
        setIsError(false);

        // 2. Fetching Deals
        if(localStorage.getItem("agent")){
            let agent_id = localStorage.getItem("agent");
            if(params.has("dlid")){
                let package_deal_id = params.get('dlid').trim();
                let deal_res = await fetchDealPackageById(agent_id, package_deal_id);
                if(deal_res?._id){
                    setSelectedPackageDeal(deal_res);
                    setBookPackageDetails({
                        ...bookPackageDetails,
                        package_info: deal_res,
                        
                    });
                    setErrorMessage("");
                    setIsError(false);
                }else {
                    setErrorCode(ERROR_CODES?.package_deal_item_not_found);
                    setErrorMessage("Package not found for specified link");
                    setIsError(true);
                }
            }else{
                let deal_list_res = await fetchDealsPackagesByAgentID(agent_id, pageFilters, setTotalItems, pagiCurrentPage, PAGI_LIMIT);
                if(Array.isArray(deal_list_res) && deal_list_res?.length>1){
                    setDealsList(deal_list_res)
                }else{
                    setErrorCode(ERROR_CODES?.package_deal_items_list_empty);
                    setErrorMessage("No packages or Deals found for this agent");
                    setIsError(true);
                }
            }
        }else{
            setErrorCode(ERROR_CODES?.agent_not_found);
            setErrorMessage("Travel agent details not found!");
            setIsError(true);
        }
        setIsLoading(false);
        
        //setDealsList([1,2,3,4,5,6,7,8,9,10])
        
    }

    window.__InitDealsPage = init_deals;

    let __NEXT_STAGE_FUNCTION=null;
    let __PREVIOUS_STAGE_FUNCTION=null;
    if(currentStage===__STAGES?.preview){
        __NEXT_STAGE_FUNCTION = ()=>{
            setCurrentStage(__STAGES?.pnr);
        }
        __PREVIOUS_STAGE_FUNCTION = ()=>{
            window.location.href=`/deals?&ag=${agent_id}`;
        }
    }else if(currentStage===__STAGES?.pnr){
        __NEXT_STAGE_FUNCTION = ()=>{
            if(!is_passenger_data_all_set())
                return
            setCurrentStage(__STAGES?.payment);
        }
        __PREVIOUS_STAGE_FUNCTION = ()=>{
            setCurrentStage(__STAGES?.preview);
        }
    }else if(currentStage===__STAGES?.payment){
        __NEXT_STAGE_FUNCTION = ()=>{}
        __PREVIOUS_STAGE_FUNCTION = ()=>{
            setCurrentStage(__STAGES?.pnr);
            setstageNextButtonText(__STAGES?.pnr_txt);
        }
    }

    const resetCheckoutConfirmation = () => {
        setCheckoutConfirmation({
            type: "server_error",
            isError: false,
            message: "",
        });
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
                setStage({percentage: i, step: "Order", message: "Ordering your Package from Agent"});
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

     const endCheckoutProcessing = () => {
        setStage({percentage: 0, step: "", message: ""});
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

    const createOrderOnSubmit = async () => {

        // 1. Creating flight order
        await startProcessingBookingOrder();
        console.log(bookPackageDetails);
        let res = await createPackageOrder(bookPackageDetails);
        if(res?._id){
            console.log(res);
            setIsBookingConfirmed(true);
            setCompletedOrderDetails(res);

            // 2. Seding email to customer
            const MSG = {
                to: res.data?.passengers[0]?.email,
                subject: " - Package Booking Confirmation",
                text: `
                Dear ${res?.passengers[0]?.given_name} ${res?.passengers[0]?.family_name},\n\n
                \tPlease view your booking confirmation details below:`,
                html: PackageConfirmationEmailMarkup(res),
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

            // 3. Redirecting to Confirmation Page and Cleaning up
            await CompletedBookingCleanup();
        }else{
            await startProcessingBookingOrderError();
            setCheckoutConfirmation({
                type: "server_error",
                isError: true,
                message: res.message,
            });
        }

    }

    const addCustomer = (type) => {
        let _psngrs = passengers;
        _psngrs.push({...CUSTOMER_OBJ, type});
        setPassengers([..._psngrs]);
    }

    const removeCustomer = (index) => {
        let _psngrs = [
            ...passengers
        ];
        let _rm_psngr = _psngrs.splice(index, 1);
        if(_rm_psngr[0]?.type==="adult"){
            if(!has_atleast_adult_customer(_psngrs)){
                alert("You must have atleast one adult passenger!")
                return;
            }
        }
        setPassengers([..._psngrs]);
    }

    const savePassengerInfo = (new_info_obj, index) => {
        let _passengers = passengers;
        _passengers[index] = new_info_obj;
        setPassengers(_passengers);
    }

    const setResponsibleAdultForInfant = (e) => {
        let __passengers = passengers;
        // vals = [infant_id, adult_id] after split function
        const vals = e.target.value.split(CONSTANTS.special_str_separator);
        //Previous responsible adult
        let prev_adult = __passengers.find(passenger=>passenger.infant_passenger_id===vals[0]);
        if(prev_adult){
            delete prev_adult.infant_passenger_id;
        }

        //New responsible adult
        let adult = __passengers.find(passenger=>passenger.id===vals[1]);
        let adult_index = __passengers.findIndex(passenger=>passenger.id===vals[1]);
        adult.infant_passenger_id=vals[0];
        __passengers[adult_index]=adult;

        //Assigning adults phone and email to the infant
        let infant = __passengers.find(passenger=>passenger.id===vals[0]);
        let infant_index = __passengers.findIndex(passenger=>passenger.id===vals[0]);
        infant.phone_number=adult.phone_number;
        infant.email=adult.email;
        __passengers[infant_index]=infant;

        setPassengers(__passengers);
    }

    const is_passenger_data_all_set = () => {
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

    return(
        <main id="deals_page" style={{display: "none"}}>
            {
                (errorCode===ERROR_CODES?.agent_not_found) &&
                <AgentNotFoundHeader />
            }
            {
                isItinPage ?
                <ItineraryPreviewer 
                
                /> :
                <>
                    {
                        (stage.percentage) ?
                        <SubmitCheckoutInProgress
                            stage={stage}
                            endCheckoutProcessing={endCheckoutProcessing}
                            hasNewMessageFromParent={hasNewMessageFromParent}
                            currentParentMessge={currentParentMessge}
                        /> : ""
                    }
                    <div className="wrapper">
                        {
                            
                            (isBookingConfirmed && completedOrderDetails?._id) ?
                            <ConfirmedOrderDetails 
                                data={completedOrderDetails}
                            /> :
                            <div>
                                {
                                    (!selectedPackageDeal?._id && dealsList?.length < 1) &&
                                    <p style={{marginLeft: 20, fontSize: 30, marginTop: 40, fontWeight: "bolder", color: "rgba(0,0,0,0.8)"}}>
                                        Deals</p>
                                }
                                <div style={{display: "none"}}>
                                    <NotLoggedIn msg={"You must login to see your trips"}/>
                                </div>
                                <div>
                                    {(isLoading || isError) && 
                                        <div style={{width: 200, height: 200, backgroundImage: `url(${deals_page_icon})`, backgroundSize: "contain", backgroundRepeat: "no-repeat"}}>
                                        </div>
                                    }
                                    {isLoading && <Waiting />}
                                    { (!isLoading && isError) &&
                                        <div style={{marginTop: 10, backgroundColor: "white", padding: 15, marginBottom: 40, borderRadius: 5, border: "1px solid rgba(0,0,0,0.1)"}}>
                                            <p style={{color: 'rgba(0,0,0,0.7)', marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid rgba(0,0,0,0.1)"}}>
                                                <i className="fa fa-exclamation-triangle" style={{color: "orangered", marginRight: 10, textShadow: "1px 2px 3px rgba(0,0,0,0.33)"}}></i>
                                                Oops something went wrong</p>
                                            <p style={{color: "rgba(0,0,0,0.7)", fontSize: 15}}>
                                                {errorMessage}
                                            </p>
                                        </div>
                                    }
                                    {   (!isLoading && !isError && dealsList.length>0) &&
                                        <DealList 
                                            deals={dealsList}
                                            PAGI_LIMIT={PAGI_LIMIT}
                                            totalItems={totalItems}
                                            setpagiCurrentPage={setpagiCurrentPage}
                                            pagiCurrentPage={pagiCurrentPage}
                                        />
                                    }
                                    {
                                        (!isLoading && !isError && selectedPackageDeal?._id) &&
                                        <div className="checkout_page_all_info_flex_container" style={{justifyContent: "center"}}>
                                            <div className="checkout_page_all_info_flex_left" >
                                                <div style={{display: "flex", padding: 20, backgroundColor: "#eee", alignItems: "center"}}>
                                                    <p style={{fontSize: 13, color: (currentStage > -1) ? "black" : "rgba(0,0,0,0.5)"}}>
                                                        {
                                                            currentStage > -1 &&
                                                            <i style={{marginRight: 5, color: "green"}}
                                                                className="fa-solid fa-circle-check"></i>
                                                        }
                                                        Preview</p>
                                                    <p style={{fontSize: 13, color: "rgba(0,0,0,0.2)", margin: "0 20px"}}>
                                                        <i className="fa-solid fa-angles-right"></i></p>
                                                    <p style={{fontSize: 13, color: (currentStage > __STAGES?.preview) ? "black" : "rgba(0,0,0,0.5)"}}>
                                                        {
                                                            currentStage > __STAGES?.preview &&
                                                            <i style={{marginRight: 5, color: "green"}}
                                                                className="fa-solid fa-circle-check"></i>
                                                        }
                                                        Passengers</p>
                                                    <p style={{fontSize: 13, color: "rgba(0,0,0,0.2)", margin: "0 20px"}}>
                                                        <i className="fa-solid fa-angles-right"></i></p>
                                                    <p style={{fontSize: 13, color: (currentStage > __STAGES?.pnr) ? "black" : "rgba(0,0,0,0.5)"}}>
                                                        {
                                                            currentStage > __STAGES?.pnr &&
                                                            <i style={{marginRight: 5, color: "green"}}
                                                                className="fa-solid fa-circle-check"></i>
                                                        }
                                                        Checkout</p>
                                                </div>
                                                {
                                                    currentStage===__STAGES?.preview &&
                                                    <ViewPackageDealDetails
                                                        data={selectedPackageDeal} 
                                                    />
                                                }
                                                {
                                                    currentStage===__STAGES?.pnr &&
                                                    <div style={{backgroundColor: "white", padding: 10, minHeight: "100vh"}}>
                                                        <CustomerForms 
                                                            prices={prices}
                                                            bookingEngine={bookingEngine}
                                                            setResponsibleAdultForInfant={setResponsibleAdultForInfant}
                                                            savePassengerInfo={savePassengerInfo}
                                                            passengers={passengers}
                                                            resetCheckoutConfirmation={resetCheckoutConfirmation}
                                                            hasNewMessageFromParent={hasNewMessageFromParent}
                                                            currentParentMessge={currentParentMessge}
                                                            removeCustomer={removeCustomer}
                                                            addCustomer={addCustomer}
                                                        />
                                                    </div>
                                                }
                                                {
                                                    currentStage===__STAGES?.payment &&
                                                    <div style={{backgroundColor: "white", padding: 10, minHeight: "100vh"}}>
                                                        {
                                                            (options?.clientSecret) &&
                                                            <Elements stripe={stripePromise} options={options}>
                                                                <PaymentPage 
                                                                    loadingStages={stage}
                                                                    createOrderOnSubmit={createOrderOnSubmit}
                                                                    startProcessingPayment={startProcessingPayment}
                                                                    startProcessingBookingOrderError={startProcessingBookingOrderError}
                                                                    checkoutConfirmation={checkoutConfirmation}
                                                                    setCheckoutConfirmation={setCheckoutConfirmation}
                                                                    selectedPackageDeal={selectedPackageDeal}
                                                                    paymentIntent={paymentIntent}
                                                                    setPaymentIntent={setPaymentIntent}
                                                                    bookingIntent={bookingIntent}
                                                                    bookingEngine={bookingEngine}
                                                                    setBookingIntent={setBookingIntent}
                                                                    setOptions={setOptions}
                                                                    options={options}
                                                                />
                                                            </Elements>
                                                        }
                                                        {
                                                            !selectedPackageDeal?.total_price &&
                                                            <div>
                                                                <div style={{padding: 20, marginBottom: 10, backgroundColor: "black"}}>
                                                                    <p style={{color: "white", fontSize: 13}}>
                                                                        <i style={{marginRight: 10, color: "yellow"}}
                                                                            className='fa-solid fa-exclamation-triangle'></i>
                                                                        No price information available!
                                                                    </p>
                                                                </div>
                                                                <div style={{padding: 10, borderTop: "1px solid rgba(0,0,0,0.1)"}}>
                                                                    <p  style={{marginBottom: 8, color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sanserif", fontWeight: "bolder", fontSize: 13}}>
                                                                        Emergency Contact</p>
                                                                    <p style={{fontFamily: "'Prompt', Sanserif", fontSize: 13}}>
                                                                        Call: <span style={{letterSpacing: 1, color: "green",fontFamily: "'Prompt', Sanserif", fontSize: 13}}>
                                                                            +1 7327999546 </span>
                                                                    </p>
                                                                    <p style={{fontFamily: "'Prompt', Sanserif", fontSize: 13}}>
                                                                        Email: <span style={{letterSpacing: 1, color: "green",fontFamily: "'Prompt', Sanserif", fontSize: 13}}>
                                                                        adinanaries@outlook.com </span>
                                                                    </p>
                                                                    <div style={{display: "flex", alignItems: "center", marginTop: 10}}>
                                                                        <div style={{marginRight: 10, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "100%", minWidth: 57, height: 57, backgroundColor: "rgba(0,0,0,0.1)", border: "1px solid rgba(0,0,0,0.1)"}}>
                                                                            <div>
                                                                                <p style={{textAlign: "center", fontSize: 22, marginTop: -5}}>
                                                                                    <i style={{color: "rgba(0,0,0,0.7)"}} className="fa-solid fa-robot"></i>
                                                                                </p>
                                                                                <p style={{fontSize: 9, fontFamily: "'Prompt', Sanserif"}}>
                                                                                    Bot AD</p>
                                                                            </div>
                                                                        </div>
                                                                        <p style={{fontFamily: "'Prompt', Sanserif", fontSize: 13}}>
                                                                            Hey! we're with you every step of the way. Please reach out...
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>
                                                }
                                            </div>
                                            <div className="checkout_page_all_info_flex_right" style={{backgroundColor: "#eee", borderLeft: "1px solid rgba(0,0,0,0.1)"}}>
                                                <PriceSummary 
                                                    prices={prices}
                                                    bookingEngine={bookingEngine}
                                                    buttonFunction={__NEXT_STAGE_FUNCTION}
                                                    backButtonFunction={__PREVIOUS_STAGE_FUNCTION}
                                                    buttonText={stageNextButtonText}
                                                    total_travelers={(parseInt(selectedPackageDeal?.max_num_of_adults)
                                                                    +parseInt(selectedPackageDeal?.max_num_of_children)
                                                                    +parseInt(selectedPackageDeal?.max_num_of_infants))}
                                                    disregard_markup={true}
                                                    item_type={"Package"}
                                                    isPaymentPage={(currentStage===__STAGES?.payment)}
                                                />
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </>
            }
        </main>
    );
}

export default DealsPage;