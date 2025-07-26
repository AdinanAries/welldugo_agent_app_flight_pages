import PriceSummary from "./PriceSummary";
import FormErrorCard from "../../../components/FormErrorCard";
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CheckoutForm from "./CheckoutForm";
import CONSTANTS from "../../../Constants/Constants";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_51OdjZ3An0YMgH2TtyCpkCBN4vDrMuQlwvmFSNKqBl9gJY996OXSpZ9QLz5dBGHLYLsa7QVvwY51I0DcLHErLxW7y00vjEWv9Lc');


const PaymentPage = (props) => {

    const { 
        payments, 
        prices, 
        total_travelers, 
        checkoutConfirmation,
        createOrderOnSubmit,
        startProcessingPayment,
        startProcessingBookingOrderError,
        setCheckoutConfirmation,
        options, // For stripe
        paymentIntent, 
        setPaymentIntent,
        bookingIntent, 
        setBookingIntent,
        checkoutPayload,
        showPNRPage,
        loadingStages,
        bookingEngine,
        hasNewMessageFromParent,
        currentParentMessge,
    } = props;
    
    return (
        <div>
            <div className="checkout_page_all_info_flex_container">
                <div className="checkout_page_all_info_flex_left">
                    <div style={{padding: 10}}>
                        {   (!paymentIntent?.id || paymentIntent?.status==="requires_payment_method") ?
                            <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 13, color: "rgba(0,0,0,0.8)", marginBottom: 20}}>
                                <i style={{marginRight: 10, color: "rgba(0,0,0,0.3)"}} className="fa-solid fa-credit-card"></i>
                                Enter your card details below
                            </p> : <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 13, color: "green", marginBottom: 20}}>
                                <i style={{marginRight: 10}} className="fa-solid fa-check"></i>
                                Your payment details was confirmed
                            </p>
                        }
                        {
                            (!CONSTANTS.disabled_features.payment && options?.clientSecret) && <div style={{marginTop: 10}}>
                                <Elements stripe={stripePromise} options={options}>
                                    <CheckoutForm 
                                        bookingEngine={bookingEngine}
                                        paymentIntent={paymentIntent}
                                        setPaymentIntent={setPaymentIntent}
                                        bookingIntent={bookingIntent}
                                        setBookingIntent={setBookingIntent}
                                        createOrderOnSubmit={createOrderOnSubmit} 
                                        startProcessingPayment={startProcessingPayment}
                                        startProcessingBookingOrderError={startProcessingBookingOrderError}
                                        checkoutConfirmation={checkoutConfirmation}
                                        setCheckoutConfirmation={setCheckoutConfirmation}
                                        checkoutPayload={checkoutPayload}
                                        loadingStages={loadingStages}
                                        hasNewMessageFromParent={hasNewMessageFromParent}
                                        currentParentMessge={currentParentMessge}
                                    />
                                </Elements>
                            </div>
                        }
                        {
                            checkoutConfirmation.isError && <div 
                                style={{backgroundColor: "rgba(255,0,0,0.1)", border: "1px solid rgba(255,0,0,0.1)"}}>
                                <FormErrorCard 
                                    fontSize={14}
                                    message={checkoutConfirmation.message} 
                                    type={checkoutConfirmation.type}
                                />
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
                        {
                            (!CONSTANTS.disabled_features.payment && CONSTANTS.is_test_mode) && <div style={{padding: 10, marginTop: 10, minHeight: 100, background: "rgba(0,0,0,0.1)"}}>
                                <p style={{marginBottom: 10, fontFamily: "'Prompt', Sans-serif", fontSize: 14, textAlign: "center", color: "rgba(0,0,0,0.6)"}}>
                                    <i style={{marginRight: 10, color: "orange"}} className="fa-solid fa-exclamation-triangle"></i>
                                    TEST PAYMENT CARD
                                </p>
                                <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 12, textAlign: "center", color: "rgba(0,0,0,0.6)"}}>
                                    This app is still in test mode! You may use Card No. Below for Testing
                                    <br/>
                                    <span style={{color: "blue", fontFamily: "'Prompt', Sans-serif", fontSize: 12}}>
                                        Number: 4242 4242 4242 4242
                                    </span>
                                    <br/>
                                    <span style={{color: "blue", fontFamily: "'Prompt', Sans-serif", fontSize: 12}}>
                                        Any valid CVC, Expiration, and Zip Code can be entered for testing...
                                    </span>
                                </p>
                            </div>
                        }
                        {
                            (CONSTANTS.disabled_features.payment) && <div style={{padding: 10, marginTop: 10, minHeight: 100, background: "rgba(0,0,0,0.1)"}}>
                                <p style={{marginBottom: 10, fontFamily: "'Prompt', Sans-serif", fontSize: 14, textAlign: "center", color: "rgba(0,0,0,0.6)"}}>
                                    <i style={{marginRight: 10, color: "orange"}} className="fa-solid fa-exclamation-triangle"></i>
                                    PAYMENT HAS BEEN DISABLED
                                </p>
                                <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 12, textAlign: "center", color: "rgba(0,0,0,0.6)"}}>
                                    You are currently using the Demo version. Or payment processing has been disabled for other reason...
                                </p>
                            </div>
                        }
                    </div>
                    
                </div>
                <div className="checkout_page_all_info_flex_right">
                    <PriceSummary 
                        bookingEngine={bookingEngine}
                        prices={prices} 
                        payments={payments} 
                        buttonFunction={()=>{alert("I dont work")}}//createOrderOnSubmit} 
                        backButtonFunction={showPNRPage}
                        buttonText="" 
                        isPaymentPage={true} 
                        total_travelers={total_travelers}
                        hasNewMessageFromParent={hasNewMessageFromParent}
                        currentParentMessge={currentParentMessge}
                    />
                </div>
            </div>
        </div>
    );
}

export default PaymentPage;