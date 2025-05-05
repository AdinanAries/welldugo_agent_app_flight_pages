import PaginationButtons from "../../../components/PaginationButtons";
import EachPaymentCard from "./EachPaymentCard";
import PaymentsForm from "../../../components/PaymentsForm";
import loading_icon from "../../../icons/loading.svg";
import nothing_found_icon from "../../../icons/nothing_found_icon.svg";

import { useState } from "react";

const PaymentCardsPage = (props) => {

    const {
        isLoading,
        payments,
        card_not_found,
        show_more_payment_method_info,
        hide_more_payment_method_info,
        show_add_new_payment_form,
        AddPaymentCard,
        SubmitEditPaymentCard,
        DeletePaymentCard
    } = props;

    const NEW_CARD = {
        id: "",
        user_id: "",
        card_number: "",
        holder_name: "",
        exp_date: "",
        sec_code: "",
        billing: {
            street: "",
            city: "",
            state: "",
            country: "",
            zip_code: ""
        }
    };

    const [ isEdit, setIsEdit ] = useState(false);
    let [ paymentForm, setPaymentForm ] = useState(NEW_CARD);
    const [pagination, setPagination] = useState({
        CURRENT_PAGE: 1,
        PAGE_SIZE: 4,
        TOTAL_PAGES: 0,
    });

    function nextPage() {
        if(
            (((pagination.CURRENT_PAGE - 1) * pagination.PAGE_SIZE)+pagination.PAGE_SIZE)
            > payments.length
        ) return;
        ++pagination.CURRENT_PAGE;
        setPagination({...pagination});
    }

    function prevPage() {
        if((pagination.CURRENT_PAGE-1) < 1) return;
        --pagination.CURRENT_PAGE;
        setPagination({...pagination});
    }

    function setPage(num) {
        setPagination({...pagination, CURRENT_PAGE: num});
    }

    const cancelIsEdit = () => {
        setIsEdit(false);
        setPaymentForm(NEW_CARD);
    }

    const startPaymentCardEdit = (obj) => {
        setIsEdit(true);
        setPaymentForm(obj);
    }

    const paymentCardFormOnSubmit = () => {
        if(!isEdit){
            AddPaymentCard(paymentForm);
        }else{
            SubmitEditPaymentCard(paymentForm);
        }
    }

    const paymentCardFormStateChangeWrapper = (field, value, isBilling=false) => {
        if(isBilling){
            paymentForm.billing[field]=value;
        }else{
            paymentForm[field]=value;
        }
        setPaymentForm({
            ...paymentForm
        })
    }

    let begin = ((pagination.CURRENT_PAGE - 1) * pagination.PAGE_SIZE);
    let end = begin + pagination.PAGE_SIZE;
    return (
        <div id="user_account_main_payment_pane" style={{display: "none", marginTop: 10}}>
            <p style={{fontWeight: "bolder", fontSize: 14, color: "rgba(0,0,0,0.7)", marginBottom: 10, fontFamily: "'Prompt', Sans-serif"}}>
                Debit/Credit Cards</p>
            {isLoading && 
                <div style={{marginBottom: 20, padding: "20px"}}>
                    <div style={{backgroundImage: `url(${loading_icon})`, backgroundSize: "contain", backgroundRepeat: "no-repeat", width: 150, height: 150, margin: "auto"}}></div>
                    <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif", textAlign: "center", marginTop: 20}}>
                        Please wait...</p>
                </div>
            }
            {
                (!isLoading && payments.isError) && 
                    <div style={{marginBottom: 20, padding: "20px"}}>
                        <div style={{backgroundImage: `url(${nothing_found_icon})`, backgroundSize: "contain", backgroundRepeat: "no-repeat", width: 150, height: 150, margin: "auto"}}></div>
                        <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif", textAlign: "center", marginTop: 20}}>
                            <i style={{marginRight: 15, fontSize: 19, color: "orangered", textShadow: "1px 2px 3px rgba(0,0,0,0.2)"}} className="fa fa-exclamation-triangle"></i>
                            Oop! Error on server</p>
                    </div>
            }
            {   
                (!isLoading && !payments.isError) &&
                    <>
                        <div style={{overflowY: "auto"}}>
                            { 
                                payments.length < 1 &&
                                <div style={{marginBottom: 20, padding: "20px"}}>
                                    <div style={{backgroundImage: `url(${card_not_found})`, backgroundSize: "contain", backgroundRepeat: "no-repeat", width: 150, height: 150, margin: "auto"}}></div>
                                    <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif", textAlign: "center", marginTop: 20}}>
                                        <i style={{marginRight: 15, fontSize: 19, color: "orangered", textShadow: "1px 2px 3px rgba(0,0,0,0.2)"}} className="fa fa-exclamation-triangle"></i>
                                        No payment method added</p>
                                </div>
                            }
                            {
                                payments.slice(begin, end).map((each, index)=>(
                                    (payments.length > 0) && <EachPaymentCard 
                                        index={index} 
                                        each={each}
                                        show_add_new_payment_form={show_add_new_payment_form}
                                        DeletePaymentCard={DeletePaymentCard}
                                        startPaymentCardEdit={startPaymentCardEdit}
                                        show_more_payment_method_info={show_more_payment_method_info} 
                                        hide_more_payment_method_info={hide_more_payment_method_info}
                                    />
                                ))
                            
                            }
                        </div>
                        {
                            (payments.length>pagination.PAGE_SIZE) && <div style={{paddingTop: 20}}>
                                <PaginationButtons 
                                    pageSize={pagination.PAGE_SIZE} 
                                    currentPage={pagination.CURRENT_PAGE} 
                                    totalItems={payments.length}
                                    nextPage={nextPage}
                                    prevPage={prevPage}
                                    setPage={setPage}
                                />
                            </div>
                        }
                        <div onClick={show_add_new_payment_form} 
                            style={{fontSize: 13, marginTop: 10, padding: 10, cursor: "pointer", width: 150, background: "rgb(23, 87, 148)", color: "white", borderRadius: 50, boxShadow: "1px 2px 3px rgba(0,0,0,0.33)", textAlign: "center"}}>
                            <i style={{marginRight: 10, color: "rgba(255,255,255,0.5)"}} className="fa fa-plus"></i>
                            Add Card
                        </div>
                        <PaymentsForm
                            isEdit={isEdit}
                            stateChange={paymentCardFormStateChangeWrapper}
                            submitFunction={paymentCardFormOnSubmit}
                            paymentForm={paymentForm}
                            cancelIsEdit={cancelIsEdit}
                        />
                </>
            }
        </div>
    )
}

export default PaymentCardsPage;