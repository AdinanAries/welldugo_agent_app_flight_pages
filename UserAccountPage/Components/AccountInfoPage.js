import { useState } from "react";
import FormErrorCard from "../../../components/FormErrorCard";
import FullPageLoader from "../../../components/FullPageLoader";
import VerifyContact from "../../../components/VerifyContact";
import { validateYYYYMMDDInputDates, confirmYYYMMDDDateValidity } from "../../../helpers/general";
import CONSTANTS from "../../../Constants/Constants";

const AccountInfoPage = (props) => {

    const { user,
        show_edit_profile_form,
        setEditDOB,
        setEditGender,
        editDOB,
        editGender,
        logoutOnclick,
        userForm,
        setUserForm,
        updateUserOnSubmit
    } = props;

    const email_verified = user.email_verified;
    const phone_verified = true; //user.phone_verified;
    const [ isCloseContactVerification, setIsCloseContactVerification ] = useState(false);

    const [ formValidation, setFormValidation ] = useState({
        type: "warning",
        isError: false,
        message: "",
    });

    const [ isLoading, setIsLoading ] = useState(false);

    const resetFormValidation = () => {
        setFormValidation({
            type: "warning",
            isError: false,
            message: "",
        });
    }

    const setUserGender = (e) => {
        resetFormValidation();
        setUserForm({
            ...userForm,
            gender: e.target.value
        })
    }

    const setDob = (e) => {
        resetFormValidation();
        setUserForm({
            ...userForm,
            dob: validateYYYYMMDDInputDates(e.target.value, e.nativeEvent.data)
        });
        console.log(userForm);
    }

    const closeVerifyContactPane = () => {
      setIsCloseContactVerification(true);
    }

    const submitUpdate = async () => {
        if(
            !userForm.last_name ||
            !userForm.dob
        ){
            setFormValidation({
                type: "error",
                isError: true,
                message: "Please make sure the form is completed",
            });
            return;
        }
        if(!confirmYYYMMDDDateValidity(userForm.dob)){
            setFormValidation({
                type: "error",
                isError: true,
                message: "Wrong date of brith format",
            });
            return;
        }
        setIsLoading(true);
        await updateUserOnSubmit(userForm);
        window.location.reload();
        /*setEditDOB(false);
        setEditGender(false);
        setIsLoading(false);*/
    }

    return (
        <div id="user_account_main_account_pane" style={{marginTop: 10}}>
            {
              (!email_verified || !phone_verified) ?
                !isCloseContactVerification && <VerifyContact
                        email_verified={email_verified}
                        phone_verified={phone_verified}
                        closeVerifyContactPane={closeVerifyContactPane}
                        email={user.email}
                        phone={user.phone}
                  /> : ""
            }
            {
                isLoading && <FullPageLoader />
            }
            <div style={{display: "flex", flexDirection: "row", position: "relative"}}>
                <div className="account_page_profile_pic_container" style={{marginRight: 20, borderRadius: "100%", width: 80, height: 80, boxShadow: "0 0 5px rgba(0,0,0,0.5)", backgroundColor: "rgba(0,0,0,0.1)", overflow: "hidden", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                    <i style={{fontSize: 50, color: "rgba(0,0,0,0.4)"}} className="fa fa-user"></i>
                </div>
                <div style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
                    <p className="account_page_user_name_display" style={{fontFamily: "'Prompt', Sans-serif", fontSize: 15, fontWeight: "bolder", color: "rgba(0,0,0,0.7)"}}>
                        {user.first_name} {user.last_name}</p>
                    <p onClick={()=>document.getElementById("profile_view_more_options_drop_down").style.display="block"} style={{fontFamily: "'Prompt', Sans-serif", fontSize: 13, color: "rgba(0,0,0,0.7)", cursor: "pointer"}}>
                        more options
                        <i style={{marginLeft: 10}} className="fa fa-angle-right"></i>
                    </p>
                    <div id="profile_view_more_options_drop_down" style={{display: "none", overflow: "hidden", position: "absolute", top: "calc(100% - 10px)", left: 0, zIndex: 1, borderRadius: 6, backgroundColor: "white", boxShadow: "1px 2px 3px rgba(0,0,0,0.33)", animation: "pop-in 0.2s ease-out"}}>
                        <p onClick={()=>document.getElementById("profile_view_more_options_drop_down").style.display="none"} style={{fontSize: 30, marginBottom: 5, borderBottom: "1px solid rgba(0,0,0,0.1)", padding: "0 10px", cursor: "pointer", textAlign: "right"}}>
                            &times;
                        </p>
                        <p onClick={show_edit_profile_form} style={{whiteSpace: "nowrap", fontFamily: "'Prompt', Sans-serif", fontSize: 13, padding: "10px 20px", color: "rgba(0,0,0,0.7)", cursor: "pointer"}}>
                            <i style={{marginRight: 5}} className="fa fa-pencil"></i>
                            edit profile
                        </p>
                        <p onClick={()=>{
                            logoutOnclick();
                            setTimeout(()=>{
                                window.location.reload();
                            }, 100);
                             document.getElementById("profile_view_more_options_drop_down").style.display="none"
                        }} style={{textAling: "center", fontFamily: "'Prompt', Sans-serif", marginTop: 10, backgroundColor: "crimson", fontSize: 13, padding: "10px 20px", color: "white", cursor: "pointer"}}>
                            <i style={{marginRight: 5}} className="fa fa-sign-out"></i>
                            logout
                        </p>
                    </div>
                </div>
            </div>
            <div style={{marginTop: 20}}>
                <div style={{marginBottom: 20}}>
                    <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 13, fontWeight: "bolder", marginBottom: 5, color: "rgba(0,0,0,0.8)", letterSpacing: 1}}>
                        Contact</p>
                    <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 13, marginBottom: 2, color: "rgba(0,0,0,0.7)"}}>
                        Email: {user.email}</p>
                        <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 13, marginBottom: 2, color: "rgba(0,0,0,0.7)"}}>
                        Phone: {user.phone}</p>
                </div>
                <div style={{marginBottom: 20}}>
                    <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 13, fontWeight: "bolder", marginBottom: 5, color: "rgba(0,0,0,0.8)", letterSpacing: 1}}>
                        Other</p>
                    <p style={{display: (user.dob && !editDOB ? "block" : "none"), fontFamily: "'Prompt', Sans-serif", fontSize: 13, marginBottom: 2, color: "rgba(0,0,0,0.7)"}}>
                        DOB: {user.dob}
                        <span onClick={()=>{setEditDOB(true)}}>
                            <i style={{marginLeft: 20, cursor: "pointer"}} className="fa-solid fa-pencil"></i></span>
                    </p>
                    <div style={{display: (!user.dob || editDOB ? "block" : "none"), borderBottom: "1px solid rgba(0,0,0,0.1)", maxWidth: 250}}>
                        <p style={{marginTop: 10, fontFamily: "'Prompt', Sans-serif", fontSize: 13, color: "rgba(0,0,0,0.8)"}}>
                            <i style={{color: "rgba(0,0,0,0.6)", marginRight: 10}} className="fa fa-calendar"></i>
                            Your Birth Date <span style={{color: "rgba(0,0,0,0.6)", fontSize: 13, fontFamily: "'Prompt', Sans-serif"}}>
                                (YYYY-MM-DD)</span>
                        </p>
                        <p>
                            <input
                                onInput={setDob}
                                value={userForm.dob}
                                style={{fontSize: 13, padding: 10, border: "none", width: "calc(100% - 40px)"}}
                                type="text" placeholder="YYYY-MM-DD" />
                            {
                                (user.dob) &&
                                <span onClick={()=>{setEditDOB(false)}}>
                                    <i style={{marginLeft: 20, cursor: "pointer", color: "crimson"}} className="fa-solid fa-times"></i>
                                </span>
                            }
                        </p>
                    </div>
                    <p style={{display: (user.gender && !editGender ? "block" : "none"), fontFamily: "'Prompt', Sans-serif", fontSize: 13, marginBottom: 2, marginTop: 5, color: "rgba(0,0,0,0.7)"}}>
                        Gender: {user.gender}
                        <span onClick={()=>{setEditGender(true)}}>
                            <i style={{marginLeft: 20, cursor: "pointer"}} className="fa-solid fa-pencil"></i></span>
                        </p>
                    <div style={{display: (!user.gender || editGender ? "block" : "none"), borderBottom: "1px solid rgba(0,0,0,0.1)", maxWidth: 250}}>
                        <p style={{marginTop: 15, fontFamily: "'Prompt', Sans-serif", fontSize: 13, color: "rgba(0,0,0,0.8)"}}>
                            <i style={{color: "rgba(0,0,0,0.6)", marginRight: 10}} className="fa fa-user"></i>
                            Gender:
                        </p>
                        <select
                            onChange={setUserGender}
                            value={userForm.gender}
                            style={{padding: 10, fontSize: 13, border: "none", color: "rgba(0,0,0,0.7)", background: "none", width: "calc(100% - 40px)"}} type="text" placeholder="add your date of birth">
                            <option value="">Select here...</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        {
                            (user.gender) &&
                            <span onClick={()=>{setEditGender(false)}}>
                                <i style={{marginLeft: 20, cursor: "pointer", color: "crimson"}} className="fa-solid fa-times"></i>
                            </span>
                        }
                    </div>
                    {
                        formValidation.isError && <FormErrorCard
                            message={formValidation.message}
                            type={formValidation.type}
                        />
                    }
                    <div onClick={submitUpdate} style={{display: ((user.gender && user.dob) && (!editDOB && !editGender) ? "none" : "block"),cursor: "pointer", padding: 10, backgroundColor: "rgb(23, 87, 148)", color: "white", boxShadow: "1px 2px 3px rgba(0,0,0,0.3)", textAlign: "center", borderRadius: 50, width: 130, fontSize: 14, marginTop: 10}}>
                        <i className="fa fa-save" style={{color: "rgba(255,255,255,0.6)", marginRight: 10}}></i>
                        Save
                    </div>
                </div>
                <p onClick={()=>{
                    if(CONSTANTS.disabled_features.user_account.frequent_flyer_and_membership){
                        alert("Maintenance Notice: This feature is temporarily disabled!");
                    }else{
                        // TO DO: actual funtion here
                    }
                }} style={{fontFamily: "'Prompt', Sans-serif", cursor: "pointer", fontSize: 13, color: "blue", textDecoration: "underline"}}>
                    <i class="fa-solid fa-wallet" style={{marginRight: 10, color: "rgba(0,0,0,0.7)"}}></i>
                    Frequent Flyer and Membership</p>
            </div>
        </div>
    )
}

export default AccountInfoPage;
