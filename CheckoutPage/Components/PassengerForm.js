import { useEffect, useState } from "react";
import { 
    calculate_age, 
    validateYYYYMMDDInputDates, 
    confirmYYYMMDDDateValidity, 
    add_months_to_date, 
} from "../../../helpers/general";
import CONSTANTS from "../../../Constants/Constants";
import FormErrorCard from "../../../components/FormErrorCard";
import { bind_calling_codes, return_calling_option_components } from "../../../helpers/country_calling_codes";
import { return_country_alpha_option_components } from "../../../helpers/world_country_codes";

const PassengerForm = (props) => {
    
    const { 
        resetCheckoutConfirmation, 
        bookingEngine,
        data_provider,
    } = props;

    const [passenger, setPassenger] = useState(props.passenger);
    const [ age, setAge ]=useState(calculate_age(passenger.born_on));
    const [ phoneSuffix, setPhoneSuffix ] = useState("");
    const [ phonePrefix, setPhonePrefix ] = useState("");
    const [ formValidation, setFormValidation ] = useState({
        type: "warning",
        isError: false,
        message: "",
        isDateFormat: false,
    });
    let passenger_type = passenger?.type;
 
    const resetFormValidation = () => {
        setFormValidation({
            type: "warning",
            isError: false,
            message: "",
            isDateFormat: false
        });
    }

    useEffect(()=>{
        //bind_calling_codes("passenger_form_call_code_select");
    });

    const setFirstName = (e) => {
        resetCheckoutConfirmation();
        resetFormValidation();
        setPassenger({...passenger, given_name: e.target.value});
    }

    const setLastName = (e) => {
        resetCheckoutConfirmation();
        resetFormValidation();
        setPassenger({...passenger, family_name: e.target.value});
    }

    const setEmail = (e) => {
        resetCheckoutConfirmation();
        resetFormValidation();
        setPassenger({...passenger, email: e.target.value});
    }
    const setGender = (e) => {
        resetCheckoutConfirmation();
        resetFormValidation();
        setPassenger({...passenger, gender: e.target.value});
    }
    const setDOB = (e) => {
        resetCheckoutConfirmation();
        resetFormValidation();
        setPassenger({...passenger, born_on: validateYYYYMMDDInputDates(e.target.value, e.nativeEvent.data)});
    }
    const setTitle = (e) => {
        resetCheckoutConfirmation();
        resetFormValidation();
        setPassenger({...passenger, title: e.target.value});
    }
    const setCountryCallingCode = (e) => {
        resetCheckoutConfirmation();
        resetFormValidation();
        setPassenger({...passenger, phone_number: (e.target.value+phoneSuffix)});
        setPhonePrefix(e.target.value);
    }
    const setPhoneNumber = (e) => {
        resetCheckoutConfirmation();
        resetFormValidation();
        setPassenger({...passenger, phone_number: (phonePrefix+e.target.value)});
        setPhoneSuffix(e.target.value);
    }
    
    const setTravelDocID = (e) => {
        resetCheckoutConfirmation();
        resetFormValidation();
        setPassenger({...passenger, identity_documents: [
            { ...passenger.identity_documents[0], unique_identifier: e.target.value }
        ]});
    }
    const setTravelDocExpiration = (e) => {
        resetCheckoutConfirmation();
        resetFormValidation();
        setPassenger({...passenger, identity_documents: [
            { ...passenger.identity_documents[0], expires_on: validateYYYYMMDDInputDates(e.target.value, e.nativeEvent.data) }
        ]});
    }
    const setTravelDocCountry = (e) => {
        resetCheckoutConfirmation();
        resetFormValidation();
        setPassenger({...passenger, identity_documents: [
            { ...passenger.identity_documents[0], issuing_country_code: e.target.value }
        ]});
    }
    const setTravelValidityCountry = (e) => {
        resetCheckoutConfirmation();
        resetFormValidation();
        setPassenger({...passenger, identity_documents: [
            { ...passenger.identity_documents[0], validity_country: e.target.value }
        ]});
    }
    const setNationality = (e) => {
        resetCheckoutConfirmation();
        resetFormValidation();
        setPassenger({...passenger, identity_documents: [
            { ...passenger.identity_documents[0], nationality: e.target.value }
        ]});
    }
    const setIssuanceDate = (e) => {
        resetCheckoutConfirmation();
        resetFormValidation();
        setPassenger({...passenger, identity_documents: [
            { ...passenger.identity_documents[0], issuance_date: e.target.value }
        ]});
    }
    const setBirthCity = (e) => {
        resetCheckoutConfirmation();
        resetFormValidation();
        setPassenger({...passenger, identity_documents: [
            { ...passenger.identity_documents[0], birth_city: e.target.value }
        ]});
    }
    const setIssuanceCity = (e) => {
        resetCheckoutConfirmation();
        resetFormValidation();
        setPassenger({...passenger, identity_documents: [
            { ...passenger.identity_documents[0], issuance_city: e.target.value }
        ]});
    }
    const setTravelDocType = (e) => {
        resetCheckoutConfirmation();
        resetFormValidation();
        setPassenger({...passenger, identity_documents: [
            { ...passenger.identity_documents[0], type: e.target.value }
        ]});
    }

    /*
        data_provider

        -documentType: "PASSPORT",
        -birthPlace: "Madrid",
        -issuanceLocation: "Madrid",
        issuanceDate: "2015-04-14",
        -number: unique_identifier,
        -expiryDate: expires_on,
        -issuanceCountry: issuing_country_code,
        validityCountry: "ES",
        nationality: "ES",
        holder: true,
    */

    const setPassengerAge = (e) => {
        resetCheckoutConfirmation();
        resetFormValidation();
        setAge(calculate_age(e.target.value));
    }

    const setInfantPassengerId = (e) => {
        resetCheckoutConfirmation();
        resetFormValidation();
        setPassenger({ ...passenger, infant_passenger_id: e.target.value });
    }

    // Search object
    const SEARCH_OBJ=window._getSearchObj();

    const onSubmit = () => {
        if(!confirmYYYMMDDDateValidity(passenger.born_on)){
            setFormValidation({
                type: "error",
                isError: true,
                message: "Date of birth is not in correct format",
                isDateFormat: true,
                isDateOfBirthFormat: true,
            });
            return;
        }
        if(!confirmYYYMMDDDateValidity(passenger.identity_documents[0].expires_on)){
            setFormValidation({
                type: "error",
                isError: true,
                message: "Document expiration date is not in correct format",
                isDateFormat: true,
                isPassportExpDateFormat: true,
            });
            return;
        }
        
        if((age || age===0) && passenger_type){
            if((passenger_type.trim()==="adult") 
                && (age < 18)){
                setFormValidation({
                    type: "error",
                    isError: true,
                    message: "Adult passenger must be 18 years and above",
                    isDateFormat: false
                });
                return;
            }
            if((passenger_type.trim()==="child") 
                && (age < 2 || age > 17)){
                setFormValidation({
                    type: "error",
                    isError: true,
                    message: "Child passenger must be from 2 to 17 years",
                    isDateFormat: false
                });
                return;
            }
            if((passenger_type.trim()==="infant_without_seat") 
                && (age > 1)){
                setFormValidation({
                    type: "error",
                    isError: true,
                    message: "Infant passenger must be less than 2 years",
                    isDateFormat: false
                });
                return;
            }
        }

        // Checking passport expiration date
        const ADDED_MONTHS=2;
        const PASSPORT_VALIDITY_DATE=add_months_to_date(new Date((SEARCH_OBJ?.itinerary?.departure?.date+"T00:00:00")), ADDED_MONTHS);
        const PASSPORT_EXPIRATION_DATE=new Date((passenger?.identity_documents[0]?.expires_on+"T00:00:00"));
        if(passenger?.identity_documents[0]?.expires_on){
            if(PASSPORT_EXPIRATION_DATE < PASSPORT_VALIDITY_DATE){
                setFormValidation({
                    type: "error",
                    isError: true,
                    message: `Passport must be valid until: ${PASSPORT_VALIDITY_DATE.toISOString().split("T")[0]}`,
                    isDateFormat: false
                });
                return;
            }
        }
        props.savePassengerInfo(passenger, props.index)
    }
    window.__saveCurrentPassengerPNRForm__ = onSubmit;

    return (
        <div style={{width: "calc(100%)"}}>
            <div style={{padding: "10px 0"}}>
                <p style={{color: "rgba(0,0,0,0.7)", textAlign: "center", fontFamily: "'Prompt', Sans-serif", fontSize: 14, padding: 10, paddingTop: 0}}>
                    TRAVELER DETAILS</p>
                <div style={{marginBottom: 5, backgroundColor: "rgba(0,0,0,0.07)", padding: 10, borderRadius: 8}}>
                    <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif", fontSize: 14}}>
                        <i className="fa-solid fa-check" style={{marginRight: 10, color: "rgb(43, 52, 61)"}}></i>
                        Title</p>
                    <div style={{border: "none", borderTop: "1px solid rgba(0,0,0,0.1)", marginTop: 10}}>
                        <select 
                            onChange={setTitle} 
                            value={passenger.title}
                            style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", width: "calc(100% - 20px)", padding: 10, background: "none", border: "none"}}>
                            <option value="">Select here...</option>
                            <option value="Mr">Mr</option>
                            <option value="Ms">Ms</option>
                        </select>
                    </div>
                </div>
                <div style={{marginBottom: 5, backgroundColor: "rgba(0,0,0,0.07)", padding: 10, borderRadius: 8}}>
                    <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif", fontSize: 14}}>
                        <i className="fa fa-user" style={{marginRight: 10, color: "rgb(43, 52, 61)"}}></i>
                        First Name</p>
                    <div style={{border: "none", borderTop: "1px solid rgba(0,0,0,0.1)", marginTop: 10}}>
                        <input 
                            onInput={setFirstName}
                            value={passenger.given_name}
                            type="text" placeholder="type here..."  
                            style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", width: "calc(100% - 20px)", padding: 10, background: "none", border: "none"}}/>
                    </div>
                </div>
                <div style={{marginBottom: 5, backgroundColor: "rgba(0,0,0,0.07)", padding: 10, borderRadius: 8}}>
                    <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif", fontSize: 14}}>
                        <i className="fa fa-user" style={{marginRight: 10, color: "rgb(43, 52, 61)"}}></i>
                        Last Name</p>
                    <div style={{border: "none", borderTop: "1px solid rgba(0,0,0,0.1)", marginTop: 10}}>
                        <input 
                            onInput={setLastName}
                            value={passenger.family_name}
                            type="text" placeholder="type here..."  
                            style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", width: "calc(100% - 20px)", padding: 10, background: "none", border: "none"}}/>
                    </div>
                </div>
                <div style={{marginBottom: 5, 
                        backgroundColor: ((formValidation.isError && formValidation.isDateFormat && formValidation?.isDateOfBirthFormat) 
                        ? "rgba(255,0,0,0.2)" : "rgba(0,0,0,0.07)"), padding: 10, borderRadius: 8}}>
                    <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif", fontSize: 14}}>
                        <i className="fa-solid fa-calendar" style={{marginRight: 10, color: "rgb(43, 52, 61)"}}></i>
                        Birth Date (YYYY-MM-DD)
                        <span style={{fontFamily: "'Prompt', Sans-serif", margin: "0 10px", color: "rgba(0,0,0,0.7)", fontSize: 11}}>
                            &#8226;
                        </span>
                        <span style={{fontSize: 12, color: "rgba(0,0,0,0.6)", fontFamily: "'Prompt', Sans-serif"}}>
                            {(passenger_type.trim()==="adult") && "18+ years"}
                            {(passenger_type.trim()==="child") && "2 - 17 years"}
                            {(passenger_type.trim()==="infant_without_seat") && "0 - 1 year"}
                        </span>
                    </p>
                    <div style={{border: "none", borderTop: "1px solid rgba(0,0,0,0.1)", marginTop: 10}}>
                        <input 
                            onBlur={setPassengerAge}
                            onInput={setDOB}
                            value={passenger.born_on}
                            type="text" placeholder="YYYY-MM-DD"  
                            style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", width: "calc(100% - 20px)", padding: 10, background: "none", border: "none"}}/>
                    </div>
                </div>
                <div style={{marginBottom: 5, backgroundColor: "rgba(0,0,0,0.07)", padding: 10, borderRadius: 8}}>
                    <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif", fontSize: 14}}>
                        <i className="fa-solid fa-person-half-dress" style={{marginRight: 10, color: "rgb(43, 52, 61)"}}></i>
                        Gender</p>
                    <div style={{border: "none", borderTop: "1px solid rgba(0,0,0,0.1)", marginTop: 10}}>
                        <select 
                            onChange={setGender} 
                            value={passenger.gender}
                            style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", width: "calc(100% - 20px)", padding: 10, background: "none", border: "none"}}>
                            <option value="">Select here...</option>
                            <option value="m">Male</option>
                            <option value="f">Female</option>
                        </select>
                    </div>
                </div>
                {
                    (passenger.born_on && (age > CONSTANTS.infant_age_threshold)) &&
                    <div style={{marginBottom: 5, backgroundColor: "rgba(0,0,0,0.07)", padding: 10, borderRadius: 8}}>
                        <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif", fontSize: 14}}>
                            <i className="fa-solid fa-envelope" style={{marginRight: 10, color: "rgb(43, 52, 61)"}}></i>
                            Email</p>
                        <div style={{border: "none", borderTop: "1px solid rgba(0,0,0,0.1)", marginTop: 10}}>
                            <input 
                                onInput={setEmail} 
                                value={passenger.email}
                                type="email" placeholder="type here..."
                                style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", width: "calc(100% - 20px)", padding: 10, background: "none", border: "none"}}/>
                        </div>
                    </div>
                }
                {
                    (passenger.born_on && (age >= CONSTANTS.infant_age_threshold)) &&
                    <div style={{marginBottom: 5, backgroundColor: "rgba(0,0,0,0.07)", padding: 10, borderRadius: 8}}>
                        <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif", fontSize: 14}}>
                            <i className="fa-solid fa-mobile" style={{marginRight: 10, color: "rgb(43, 52, 61)"}}></i>
                            Phone</p>
                        {
                            passenger.phone_number &&
                            <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 13, color: "rgba(0,0,0,0.5)"}}>
                                Phone is set to: {passenger.phone_number}</p>
                        }
                        <div style={{border: "none", borderTop: "1px solid rgba(0,0,0,0.1)", marginTop: 10}}>
                            <select id="passenger_form_call_code_select"
                                onChange={setCountryCallingCode}
                                value={phonePrefix}
                                style={{border: "none", background: "none", padding: 10, width: "90px"}}>
                                    {return_calling_option_components()}
                            </select>
                            <input 
                                onInput={setPhoneNumber}
                                value={phoneSuffix}
                                type="number" placeholder="type here..."  
                                style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", 
                                width: "calc(100% - 100px)", padding: 10, background: "none", border: "none"}}/>
                        </div>
                    </div>
                }
                <p style={{color: "rgba(0,0,0,0.7)", textAlign: "center", fontFamily: "'Prompt', Sans-serif", fontSize: 14, padding: 10, marginTop: 20}}>
                    TRAVEL DOCUMENT</p>
                <div style={{marginBottom: 5, backgroundColor: "rgba(0,0,0,0.07)", padding: 10, borderRadius: 8}}>
                    <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif", fontSize: 14}}>
                        <i className="fa-solid fa-id-card" style={{marginRight: 10, color: "rgb(43, 52, 61)"}}></i>
                        Document Type</p>
                    <div style={{border: "none", borderTop: "1px solid rgba(0,0,0,0.1)", marginTop: 10}}>
                        <select 
                            onChange={setTravelDocType} 
                            value={passenger.identity_documents[0].type}
                            style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", width: "calc(100% - 20px)", padding: 10, background: "none", border: "none"}}>
                            <option value="">Select here...</option>
                            <option value="passport">Passport</option>
                        </select>
                    </div>
                </div>
                <div style={{marginBottom: 5, backgroundColor: "rgba(0,0,0,0.07)", padding: 10, borderRadius: 8}}>
                    <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif", fontSize: 14}}>
                        <i className="fa-solid fa-passport" style={{marginRight: 10, color: "rgb(43, 52, 61)"}}></i>
                        Passport/Document ID</p>
                    <div style={{border: "none", borderTop: "1px solid rgba(0,0,0,0.1)", marginTop: 10}}>
                        <input 
                            onInput={setTravelDocID}
                            value={passenger.identity_documents[0].unique_identifier}
                            type="text" placeholder="type here..."  
                            style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", width: "calc(100% - 20px)", padding: 10, background: "none", border: "none"}}/>
                    </div>
                </div>
                <div style={{marginBottom: 5, backgroundColor: (formValidation.isError && formValidation.isDateFormat && formValidation?.isPassportExpDateFormat)
                 ? "rgba(255,0,0,0.2)" : "rgba(0,0,0,0.07)", padding: 10, borderRadius: 8}}>
                    <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif", fontSize: 14}}>
                        <i className="fa-solid fa-calendar" style={{marginRight: 10, color: "rgb(43, 52, 61)"}}></i>
                        Document Expiration (YYYY-MM-DD)</p>
                    <div style={{border: "none", borderTop: "1px solid rgba(0,0,0,0.1)", marginTop: 10}}>
                        <input 
                            onInput={setTravelDocExpiration}
                            value={passenger.identity_documents[0].expires_on}
                            type="text" placeholder="YYYY-MM-DD"  
                            style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", width: "calc(100% - 20px)", padding: 10, background: "none", border: "none"}}/>
                    </div>
                </div>
                <div style={{marginBottom: 5, backgroundColor: "rgba(0,0,0,0.07)", padding: 10, borderRadius: 8}}>
                    <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif", fontSize: 14}}>
                        <i className="fa-solid fa-id-card" style={{marginRight: 10, color: "rgb(43, 52, 61)"}}></i>
                        Issue Country</p>
                    <div style={{border: "none", borderTop: "1px solid rgba(0,0,0,0.1)", marginTop: 10}}>
                        <select 
                            onChange={setTravelDocCountry} 
                            value={passenger.identity_documents[0].issuing_country_code}
                            style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", width: "calc(100% - 20px)", padding: 10, background: "none", border: "none"}}>
                            <option value="">Select here...</option>
                            {return_country_alpha_option_components()}
                        </select>
                    </div>
                </div>
                {
                    (data_provider?.toUpperCase()===CONSTANTS?.amadeus) &&
                    <>
                        <div style={{marginBottom: 5, backgroundColor: "rgba(0,0,0,0.07)", padding: 10, borderRadius: 8}}>
                            <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif", fontSize: 14}}>
                                <i className="fa-solid fa-id-card" style={{marginRight: 10, color: "rgb(43, 52, 61)"}}></i>
                                Validity Country</p>
                            <div style={{border: "none", borderTop: "1px solid rgba(0,0,0,0.1)", marginTop: 10}}>
                                <select 
                                    onChange={setTravelValidityCountry} 
                                    value={passenger.identity_documents[0].validity_country}
                                    style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", width: "calc(100% - 20px)", padding: 10, background: "none", border: "none"}}>
                                    <option value="">Select here...</option>
                                    {return_country_alpha_option_components()}
                                </select>
                            </div>
                        </div>
                        <div style={{marginBottom: 5, backgroundColor: "rgba(0,0,0,0.07)", padding: 10, borderRadius: 8}}>
                            <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif", fontSize: 14}}>
                                <i className="fa-solid fa-id-card" style={{marginRight: 10, color: "rgb(43, 52, 61)"}}></i>
                                Nationality</p>
                            <div style={{border: "none", borderTop: "1px solid rgba(0,0,0,0.1)", marginTop: 10}}>
                                <select 
                                    onChange={setNationality} 
                                    value={passenger.identity_documents[0].nationality}
                                    style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", width: "calc(100% - 20px)", padding: 10, background: "none", border: "none"}}>
                                    <option value="">Select here...</option>
                                    {return_country_alpha_option_components()}
                                </select>
                            </div>
                        </div>
                        <div style={{marginBottom: 5, backgroundColor: "rgba(0,0,0,0.07)", padding: 10, borderRadius: 8}}>
                            <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif", fontSize: 14}}>
                                <i className="fa-solid fa-passport" style={{marginRight: 10, color: "rgb(43, 52, 61)"}}></i>
                                Birth City</p>
                            <div style={{border: "none", borderTop: "1px solid rgba(0,0,0,0.1)", marginTop: 10}}>
                                <input 
                                    onInput={setBirthCity}
                                    value={passenger.identity_documents[0].birth_city}
                                    type="text" placeholder="type here..."  
                                    style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", width: "calc(100% - 20px)", padding: 10, background: "none", border: "none"}}/>
                            </div>
                        </div>
                        <div style={{marginBottom: 5, backgroundColor: "rgba(0,0,0,0.07)", padding: 10, borderRadius: 8}}>
                            <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif", fontSize: 14}}>
                                <i className="fa-solid fa-passport" style={{marginRight: 10, color: "rgb(43, 52, 61)"}}></i>
                                Issuance City</p>
                            <div style={{border: "none", borderTop: "1px solid rgba(0,0,0,0.1)", marginTop: 10}}>
                                <input 
                                    onInput={setIssuanceCity}
                                    value={passenger.identity_documents[0].issuance_city}
                                    type="text" placeholder="type here..."  
                                    style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", width: "calc(100% - 20px)", padding: 10, background: "none", border: "none"}}/>
                            </div>
                        </div>
                        <div style={{marginBottom: 5, backgroundColor: "rgba(0,0,0,0.07)", padding: 10, borderRadius: 8}}>
                            <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif", fontSize: 14}}>
                                <i className="fa-solid fa-passport" style={{marginRight: 10, color: "rgb(43, 52, 61)"}}></i>
                                Issuance Date</p>
                            <div style={{border: "none", borderTop: "1px solid rgba(0,0,0,0.1)", marginTop: 10}}>
                                <input 
                                    onInput={setIssuanceDate}
                                    value={passenger.identity_documents[0].issuance_date}
                                    type="text" placeholder="type here..."  
                                    style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", width: "calc(100% - 20px)", padding: 10, background: "none", border: "none"}}/>
                            </div>
                        </div>
                        holder: true,
                    </>
                }
            </div>
            {
                formValidation.isError && <FormErrorCard 
                    message={formValidation.message} 
                    type={formValidation.type}
                />
            }
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <div style={{width: "calc(50% - 5px)", 
                    backgroundColor: bookingEngine?.closeButtonBgColor,
                    color: bookingEngine?.closeButtonIconColor, 
                    borderRadius: bookingEngine?.actionButtonBorderRadius,
                    cursor: "pointer", fontSize: 14, fontFamily: "'Prompt', Sans-serif", padding: 10, textAlign: "center", boxShadow: "1px 2px 3px rgba(0,0,0,0.3"}}
                    onClick={props.unSelectPassengerCard}
                >Cancel</div>
                <div style={{width: "calc(50% - 5px)", 
                    backgroundColor: bookingEngine?.actionButtonsBg,
                    color: bookingEngine?.actionButtonsTxtColor, 
                    borderRadius: bookingEngine?.actionButtonBorderRadius, 
                    cursor: "pointer", fontSize: 14, fontFamily: "'Prompt', Sans-serif", padding: 10, textAlign: "center", boxShadow: "1px 2px 3px rgba(0,0,0,0.3"}}
                    onClick={onSubmit} 
                >Save</div>
            </div>
        </div>
    )
}

export default PassengerForm;