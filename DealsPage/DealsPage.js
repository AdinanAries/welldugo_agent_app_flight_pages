import NotLoggedIn from '../../components/NotLoggedIn';
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
import AgentNotFoundHeader from '../../components/AgentNotFoundHeader';
import PriceSummary from '../CheckoutPage/Components/PriceSummary';
import CustomerForms from './Components/CustomerForms';
import PaymentPage from './Components/PaymentPage';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import {useStripe, useElements, PaymentElement} from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51OdjZ3An0YMgH2TtyCpkCBN4vDrMuQlwvmFSNKqBl9gJY996OXSpZ9QLz5dBGHLYLsa7QVvwY51I0DcLHErLxW7y00vjEWv9Lc');

function DealsPage(props){

    const {
        bookingEngine,
        hasNewMessageFromParent,
        currentParentMessge,
    } = props;

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

    const PAGI_LIMIT = 10;

    // For Stripe
    const [ options, setOptions ] = useState();
    const [ paymentIntent, setPaymentIntent ] = useState({});
    const [ bookingIntent, setBookingIntent ] = useState({});
    const [ passengers, setPassengers ] = useState([
        {
                "title": "",
                "phone_number": "",
                "identity_documents": [
                    {
                        "unique_identifier": "",
                        "type": "",
                        "issuing_country_code": "",
                        "expires_on": ""
                    }
                ],
                "id": "pas_0000AeVUZWXhEs7Ejp1B1t",
                "given_name": "",
                "gender": "",
                "type": "adult",
                "family_name": "",
                "email": "",
                "born_on": ""
            }
    ]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ isError, setIsError ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState("Unkown Error: Please contact support for assitance.");
    const [ dealsList, setDealsList ] = useState([]);
    const [ selectedPackageDeal, setSelectedPackageDeal ] = useState({});
    const [ errorCode, setErrorCode ] = useState(ERROR_CODES.no_error);
    const [ currentStage, setCurrentStage ] = useState(__STAGES?.preview);
    const [ stageNextButtonText, setstageNextButtonText ] = useState(__STAGES?.pnr_txt);

    const [ totalItems, setTotalItems ] = useState(0);
    const [ pagiCurrentPage, setpagiCurrentPage ] = useState(1);
    const [ searchQuery, setSearchQuery ] = useState("");
    const [ pageFilters, setPageFilters ] = useState({
        // Filters yet to be defined
    });

    let agent_id="";
    if(localStorage.getItem("agent")){
        agent_id = localStorage.getItem("agent");
    }

    const API_HOST=getApiHost();

    useEffect(()=>{
        (async()=>{
            
            if(!paymentIntent?.id){
                    // Creating payment intent
                const pi = await fetch((API_HOST+'/api/payment/secret/'), {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        amount: 2000,//markup(overallTotal, PriceMarkupValue?.value, PriceMarkupValue?.type)?.new_price.toFixed(2),
                        currency: 'usd'
                    })
                }).then(res=>res.json()).then(data=>data).catch(e=>console.log(e));
                const {client_secret: clientSecret} = pi;

                /*/ Creating booking intent with payment
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
                setBookingIntent(bi);*/
                setPaymentIntent(pi);

                // Render the form using the clientSecret
                setOptions({
                    // passing the client secret obtained from the server
                    ...options,
                    clientSecret,
                });
            }
        })()
    }, []);

    useEffect(()=>{
        if(currentStage===__STAGES?.preview){
            setstageNextButtonText(__STAGES?.pnr_txt);
        }else if(currentStage===__STAGES?.pnr){
            setstageNextButtonText(__STAGES?.payment_txt);
        }else if(currentStage===__STAGES?.payment_txt){
            setstageNextButtonText("");
        }
    }, [currentStage]);

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

    }
    
    const savePassengerInfo = () => {

    }
    const setResponsibleAdultForInfant = () => {

    }

    return(
        <main id="deals_page" style={{display: "none"}}>
            {
                (errorCode===ERROR_CODES?.agent_not_found) &&
                <AgentNotFoundHeader />
            }
            <div className="wrapper">
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
                                                prices={{
                                                    total_amount: 1200,
                                                    extras: []
                                                }}
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
                                    {
                                        currentStage===__STAGES?.payment &&
                                        <div style={{backgroundColor: "white", padding: 10, minHeight: "100vh"}}>
                                            {
                                                (options?.clientSecret) &&
                                                <Elements stripe={stripePromise} options={options}>
                                                    <PaymentPage 
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
                                        </div>
                                    }
                                </div>
                                <div className="checkout_page_all_info_flex_right" style={{backgroundColor: "#eee", borderLeft: "1px solid rgba(0,0,0,0.1)"}}>
                                    <PriceSummary 
                                        prices={{
                                            total_amount: 1200,
                                            extras: []
                                        }}
                                        bookingEngine={bookingEngine}
                                        buttonFunction={__NEXT_STAGE_FUNCTION}
                                        backButtonFunction={__PREVIOUS_STAGE_FUNCTION}
                                        buttonText={stageNextButtonText}
                                        total_travelers={12}
                                    />
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </main>
    );
}

export default DealsPage;