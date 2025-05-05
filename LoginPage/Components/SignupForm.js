import { useState } from "react";
import FormErrorCard from "../../../components/FormErrorCard";
import FullPageLoader from "../../../components/FullPageLoader";
import { registerPost } from "../../../services/accountServices";

function SignupForm(props){

    const {
        LogMeIn, 
        isLoggedIn, 
        isShowSignUpForm, 
        showLoginForm 
    } = props;

    const [ isLoading, setIsLoading ] = useState(false);

    const [ formData, setFormData ] = useState({
        first_name: "",
        middle_name: "",
        last_name: "",
        dob: "",
        email: "",
        phone: "",
        gender: "",
        password: "",
        confirm_password: "",
    });

    const [ formValidation, setFormValidation ] = useState({
        type: "warning",
        isError: false,
        message: "",
    });

    const resetFormValidation = () => {
        setFormValidation({
            type: "warning",
            isError: false,
            message: "",
        });
    }

    const setFirstName = (e) => {
        resetFormValidation();
        setFormData({
            ...formData,
            first_name: e.target.value
        });
    }

    const setLastName = (e) => {
        resetFormValidation();
        setFormData({
            ...formData,
            last_name: e.target.value
        })
    }

    const setEmail = (e) => {
        resetFormValidation();
        setFormData({
            ...formData,
            email: e.target.value
        })
    }

    const setPhone = (e) => {
        resetFormValidation();
        setFormData({
            ...formData,
            phone: e.target.value
        })
    }

    const setPassword = (e) => {
        resetFormValidation();
        setFormData({
            ...formData,
            password: e.target.value
        });
    }

    const setConfirmPassword = (e) => {
        resetFormValidation();
        setFormData({
            ...formData,
            confirm_password: e.target.value
        });
    }

    const signup_onclick = async () => {
        setIsLoading(true);
        if(
            !formData.email ||
            !formData.first_name ||
            !formData.last_name ||
            !formData.password ||
            !formData.phone
        ) {
            setFormValidation({
                type: "error",
                isError: true,
                message: "Please provide all form fields",
            });
            setIsLoading(false);
            return
        }
        if(formData.password !== formData.confirm_password) {
            setFormValidation({
                type: "error",
                isError: true,
                message: "Password and confirm password values are not the same",
            });
            setIsLoading(false)
            return
        }
        let res = await registerPost(formData);
        if(res.token){
            localStorage.setItem("user_token", res.token);
            LogMeIn();
            window.location.reload();
        }else{
            setFormValidation({
                type: "error",
                isError: true,
                message: res.message,
            })
        }
        setIsLoading(false);
        
    }

    function show_login_form(){
        showLoginForm();
    }

    return (
        <div id="main_signup_form" style={{display: ((!isLoggedIn && isShowSignUpForm) ? "block" : "none"), padding: "30px 5px"}}>
            {
                isLoading && <FullPageLoader />
            }
            <div className="login_page_form_container" style={{maxWidth: "600px", margin: "auto", backgroundColor: "white", boxShadow: "1px 2px 3px rgba(0,0,0,0.3)", borderRadius: 9, overflow: "hidden"}}>
                <p style={{padding: "0 20px", paddingTop: 20, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)", fontSize: 16, fontWeight: "bolder", letterSpacing: 1, marginBottom: 10,}}>
                    Register</p>
                <div style={{padding: "10px",}}>
                    <div style={{marginBottom: 5, backgroundColor: "rgba(0,0,0,0.07)", padding: 10, borderRadius: 8}}>
                        <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif", fontSize: 14}}>
                            <i className="fa fa-user" style={{marginRight: 10, color: "rgb(43, 52, 61)"}}></i>
                            First Name</p>
                        <div style={{border: "none", borderTop: "1px solid rgba(0,0,0,0.1)", marginTop: 10}}>
                            <input 
                                onInput={setFirstName}
                                value={formData.first_name}
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
                                value={formData.last_name}
                                type="text" placeholder="type here..."
                                style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", width: "calc(100% - 20px)", padding: 10, background: "none", border: "none"}}/>
                        </div>
                    </div>
                    <div style={{marginBottom: 5, backgroundColor: "rgba(0,0,0,0.07)", padding: 10, borderRadius: 8}}>
                        <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif", fontSize: 14}}>
                            <i className="fa-solid fa-envelope" style={{marginRight: 10, color: "rgb(43, 52, 61)"}}></i>
                            Email</p>
                        <div style={{border: "none", borderTop: "1px solid rgba(0,0,0,0.1)", marginTop: 10}}>
                            <input 
                                onInput={setEmail}
                                value={formData.email}
                                type="text" placeholder="type here..."
                                style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", width: "calc(100% - 20px)", padding: 10, background: "none", border: "none"}}/>
                        </div>
                    </div>
                    <div style={{marginBottom: 5, backgroundColor: "rgba(0,0,0,0.07)", padding: 10, borderRadius: 8}}>
                        <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif", fontSize: 14}}>
                            <i className="fa-solid fa-mobile" style={{marginRight: 10, color: "rgb(43, 52, 61)"}}></i>
                            Phone</p>
                        <div style={{border: "none", borderTop: "1px solid rgba(0,0,0,0.1)", marginTop: 10}}>
                            <input 
                                onInput={setPhone}
                                value={formData.phone}
                                type="text" placeholder="type here..."
                                style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", width: "calc(100% - 20px)", padding: 10, background: "none", border: "none"}}/>
                        </div>
                    </div>
                    <div style={{marginBottom: 5, backgroundColor: "rgba(0,0,0,0.07)", padding: 10, borderRadius: 8}}>
                        <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif", fontSize: 14}}>
                            <i className="fa-solid fa-key" style={{marginRight: 10, color: "rgb(43, 52, 61)"}}></i>
                            Password</p>
                        <div style={{border: "none", borderTop: "1px solid rgba(0,0,0,0.1)", marginTop: 10}}>
                            <input 
                                onInput={setPassword}
                                value={formData.password}
                                type="password" placeholder="type here..."
                                style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", width: "calc(100% - 20px)", padding: 10, background: "none", border: "none"}}/>
                        </div>
                    </div>
                    <div style={{marginBottom: 5, backgroundColor: "rgba(0,0,0,0.07)", padding: 10, borderRadius: 8}}>
                        <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif", fontSize: 14}}>
                            <i className="fa-solid fa-key" style={{marginRight: 10, color: "rgb(43, 52, 61)"}}></i>
                            Confirm Password</p>
                        <div style={{border: "none", borderTop: "1px solid rgba(0,0,0,0.1)", marginTop: 10}}>
                            <input 
                                onInput={setConfirmPassword}
                                value={formData.confirm_password}
                                type="password" placeholder="type here..."
                                style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", width: "calc(100% - 20px)", padding: 10, background: "none", border: "none"}}/>
                        </div>
                    </div>
                    {
                        formValidation.isError && <FormErrorCard 
                            message={formValidation.message} 
                            type={formValidation.type}
                        />
                    }
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "flex-end"}}>
                        <div onClick={signup_onclick} style={{fontFamily: "'Prompt', Sans-serif", color: "white", cursor: "pointer", backgroundColor: "rgb(24, 67, 98)", boxShadow: "0 0 5px rgba(0,0,0,0.5)", textAlign: "center", padding: 14, borderRadius: 50}}>
                            <i style={{marginRight: 10, fontSize: 20, color: "rgba(255,255,255,0.5)"}} className="fa fa-check-square-o"></i>
                            Register
                        </div>
                    </div>
                    <div style={{marginTop: 10}}>
                        <p onClick={show_login_form} style={{width: "320px", textAlign: "center", margin: 'auto', marginTop: 5, padding: "15px", fontSize: 14, fontFamily: "'Prompt', Sans-serif", cursor: "pointer"}}>
                            <i style={{marginRight: 5, color: "rgb(43, 52, 61)"}} className="fa fa-sign-in"></i>
                            Already have an account? 
                            <span style={{fontFamily: "'Prompt', Sans-serif", fontSize: 14, color: "brown", marginLeft: 5}}>
                            Login</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignupForm;