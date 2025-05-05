import PaginationButtons from "../../../components/PaginationButtons";
import EachPassport from "./EachPassport";
import PassportsForm from "../../../components/PassportsForm";
import not_found_icon from "../../../icons/not_found_icon.svg";
import nothing_found_icon from "../../../icons/nothing_found_icon.svg";
import loading_icon from "../../../icons/loading.svg";
import { useState } from "react";

const PassportsPage = (props) => {

    const {
        isPassportsLoading,
        passports,
        show_more_passport_info,
        hide_more_passport_info,
        show_add_new_passport_form,
        DeletePassport,
        AddPassport,
        SubmitEditPassport
    } = props;

    const NEW_PASSPORT = {
        _id: "",
        passport_number: "",
        issue_date: "",
        exp_date: "",
        city: "",
        country: "",
        holder_name: "",
        holder_gender: "",
        holder_nationality: "",
        holder_dob: "",
        holder_birth_city: "",
    };

    const [ isEdit, setIsEdit ] = useState(false);
    let [passportForm, setPassportForm] = useState(NEW_PASSPORT);
    const [pagination, setPagination] = useState({
        CURRENT_PAGE: 1,
        PAGE_SIZE: 4,
        TOTAL_PAGES: 0,
    });

    function nextPage() {
        if(
            (((pagination.CURRENT_PAGE - 1) * pagination.PAGE_SIZE)+pagination.PAGE_SIZE)
            > passports.length
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
        setPassportForm(NEW_PASSPORT);
    }

    const startPassportEdit = (obj) => {
        setIsEdit(true);
        setPassportForm(obj);
    }

    const passportFormOnSubmit = () => {
        if(!isEdit){
            AddPassport(passportForm);
        }else{
            SubmitEditPassport(passportForm);
        }
    }

    const passportFormStateChangeWrapper = (field, value) => {
        passportForm[field]=value;
        setPassportForm({
            ...passportForm
        })
    }

    let begin = ((pagination.CURRENT_PAGE - 1) * pagination.PAGE_SIZE);
    let end = begin + pagination.PAGE_SIZE;
    return (
        <div id="user_account_main_passports_pane" style={{display: "none", marginTop: 10}}>
            <p style={{fontWeight: "bolder", fontSize: 14, color: "rgba(0,0,0,0.7)", marginBottom: 10, fontFamily: "'Prompt', Sans-serif"}}>
                Travel Passports</p>
            {   
                isPassportsLoading ? <div style={{marginBottom: 20, padding: "20px"}}>
                        <div style={{backgroundImage: `url(${loading_icon})`, backgroundSize: "contain", backgroundRepeat: "no-repeat", width: 150, height: 150, margin: "auto"}}></div>
                        <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif", textAlign: "center", marginTop: 20}}>
                            Please wait...</p>
                    </div> :
                    <>
                        {
                            !passports.isError && passports.length < 1 &&
                            <div style={{marginBottom: 20, padding: "20px"}}>
                                <div style={{backgroundImage: `url(${not_found_icon})`, backgroundSize: "contain", backgroundRepeat: "no-repeat", width: 150, height: 150, margin: "auto"}}></div>
                                <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif", textAlign: "center", marginTop: 20}}>
                                    <i style={{marginRight: 15, fontSize: 19, color: "orangered", textShadow: "1px 2px 3px rgba(0,0,0,0.2)"}} className="fa fa-exclamation-triangle"></i>
                                    No passport added</p>
                            </div>
                        }
                        {
                            passports.isError && <div style={{marginBottom: 20, padding: "20px"}}>
                                <div style={{backgroundImage: `url(${nothing_found_icon})`, backgroundSize: "contain", backgroundRepeat: "no-repeat", width: 150, height: 150, margin: "auto"}}></div>
                                <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif", textAlign: "center", marginTop: 20}}>
                                    <i style={{marginRight: 15, fontSize: 19, color: "orangered", textShadow: "1px 2px 3px rgba(0,0,0,0.2)"}} className="fa fa-exclamation-triangle"></i>
                                    Oop! Error on server</p>
                            </div>
                        }
                        {(!passports.isError) && passports.slice(begin, end).map((each, index)=>(
                            <EachPassport
                                DeletePassport={DeletePassport}
                                key={each.id}
                                index={index} 
                                each={each} 
                                show_add_new_passport_form={show_add_new_passport_form}
                                startPassportEdit={startPassportEdit}
                                show_more_passport_info={show_more_passport_info}
                                hide_more_passport_info={hide_more_passport_info}
                            />
                        ))}
                        {(passports.length>pagination.PAGE_SIZE) && <div style={{paddingTop: 20}}>
                                <PaginationButtons 
                                    pageSize={pagination.PAGE_SIZE} 
                                    currentPage={pagination.CURRENT_PAGE} 
                                    totalItems={passports.length}
                                    nextPage={nextPage}
                                    prevPage={prevPage}
                                    setPage={setPage}
                                />
                            </div>
                        }
                        <div onClick={show_add_new_passport_form} 
                            style={{fontSize: 13, width: 170, marginTop: 10, padding: 10, cursor: "pointer", background: "rgb(23, 87, 148)", color: "white", borderRadius: 50, boxShadow: "1px 2px 3px rgba(0,0,0,0.33)", textAlign: "center"}}>
                            <i style={{marginRight: 10, color: "rgba(255,255,255,0.5)"}} className="fa fa-plus"></i>
                            Add Passport
                        </div>
                        <PassportsForm
                            stateChange={passportFormStateChangeWrapper}
                            cancelIsEdit={cancelIsEdit}
                            isEdit={isEdit}
                            passportForm={passportForm}
                            submitFunction={passportFormOnSubmit}
                        />
                    </>
            }
        </div>
        
    )
}

export default PassportsPage