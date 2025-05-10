import {useStripe, useElements, PaymentElement} from '@stripe/react-stripe-js';
import { getApiHost } from '../../../Constants/Environment';

const CheckoutForm = (props) => {

  const { 
    createOrderOnSubmit,
    startProcessingPayment,
    startProcessingBookingOrderError,
    checkoutConfirmation,
    setCheckoutConfirmation,
    paymentIntent, 
    setPaymentIntent,
    bookingIntent, 
    loadingStages,
    setBookingIntent,
    checkoutPayload,
    bookingEngine,
  } = props;

  const API_HOST=getApiHost();

  const stripe = useStripe();
  const elements = useElements();

  const CheckoutOnSubmit = async (event) => {

    event.preventDefault();

    // 1. Processing Payment
    await startProcessingPayment();
    
    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    let result;
    if(!paymentIntent?.id || paymentIntent?.status==="requires_payment_method"){
      result = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
          return_url: "https://willgo-test.herokuapp.com",
      },
      redirect: "if_required",
      });

      if (result?.error) {
      await startProcessingBookingOrderError();
      setCheckoutConfirmation({
          type: "server_error",
          isError: true,
          message: result?.error?.message,
      });
      return;
      } else if (result?.paymentIntent && result?.paymentIntent?.status === "requires_capture"){
        // Updating booking intent with new payment status
        bookingIntent.payment_intent = result?.paymentIntent;
        let bi = await fetch((API_HOST+'/api/activities/add-booking-intent-update/'), {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingIntent)
        }).then(res=>res.json()).then(data=>data).catch(e=>console.log(e));
        // Setting new payment intent
        setPaymentIntent(result?.paymentIntent);
      } else {
        await startProcessingBookingOrderError();
        setCheckoutConfirmation({
            type: "server_error",
            isError: true,
            message: "Payment failed",
        });
        return;
      }
    }
    
    // 3. Creating the Booking Order
    // Security - Server checks payment Status using payment intent before ordering booking
    let pi=((result?.paymentIntent) || paymentIntent);
    createOrderOnSubmit(pi, bookingIntent);
  };

  return (
    <form onSubmit={CheckoutOnSubmit}>
      {
        (!paymentIntent?.id || paymentIntent?.status==="requires_payment_method") && <PaymentElement />
      }
      { ((paymentIntent?.id && paymentIntent?.status==="requires_capture") && (loadingStages?.percentage===0 || loadingStages?.percentage===100)) &&
        <div style={{padding: 10, border: "1px solid rgba(0,255,0,0.1)", background: "rgba(0,255,0,0.1)"}}>
          <div>
            <div style={{display: "flex"}}>
              <p style={{fontSize: 12}}> 
                <i style={{fontSize: 12, marginRight: 10, color: "green"}} className="fa-solid fa-info"></i>
              </p>
              <p style={{fontSize: 12, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.8)"}}>
                <span style={{fontSize: 12, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.8)"}}>
                  Important Notice:</span> We 
                have not charged you anything! However, your payment details have been captured. You only need to re-submit the order to comfirm the booking.
              </p>
            </div>
            { checkoutConfirmation?.isError &&
              <div style={{marginTop: 10, borderTop: "1px dashed rgba(0,0,0,0.1)", paddingTop: 10}}>
                <p style={{fontSize: 12, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.8)"}}>
                  The server returned the following error message: 
                  <span style={{fontSize: 12, fontFamily: "'Prompt', Sans-serif", padding: "0 5px", margin: 5, backgroundColor: "crimson", color: "white"}}>
                    "{checkoutConfirmation.message}".</span>
                  <b/>
                    Please go back one step and check your passenger details by clicking on 
                    <span style={{fontSize: 12, fontFamily: "'Prompt', Sans-serif", padding: "0 5px", margin: 5, backgroundColor: "crimson", color: "white"}}>
                      "Passengers"</span> at the top.
                  <b/> Then open the passenger forms to confirm their details are correct
                </p>
              </div>
            }
          </div>
        </div>
      }
      <button className='checkout_page_main_checkout_btn'
        style={{
              backgroundColor: bookingEngine?.actionButtonsBg,
              color: bookingEngine?.actionButtonsTxtColor, 
              borderRadius: bookingEngine?.actionButtonBorderRadius,
              width: "100%", margin: "10px 0", border: "none", fontFamily: "'Prompt', Sans-serif"}} disabled={!stripe}>
          {
            (!paymentIntent?.id || paymentIntent?.status==="requires_payment_method") ? <>
              <i style={{marginRight: 10, color: "rgba(255,255,255,0.5)"}} className="fa fa-credit-card"></i>
              Checkout</> : <>
              Submit
              <i style={{marginLeft: 10, color: "rgba(255,255,255,0.5)"}} className="fa-solid fa-arrow-right"></i>
            </>
          }
      </button>
    </form>
  )
};

export default CheckoutForm;