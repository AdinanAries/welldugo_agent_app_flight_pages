import { useState } from "react";
import FormErrorCard from "../../../components/FormErrorCard";
import FullPageLoader from "../../../components/FullPageLoader";
import { getApiHost } from "../../../Constants/Environment";
import { loginPost, requestPasswordReset } from "../../../services/accountServices";

function LoginForm(props){

    const { isLoggedIn, isShowSignUpForm, LogMeIn, showSignupForm } = props;
    const [ isLoading, setIsLoading ] = useState(false);
    const [ isForgotPasswordForm, setIsForgotPasswordForm ] = useState(false);

    const [ forgotPasswordFormData, setForgotPasswordFormData ] = useState({
        emai: ""
    });
    const [ isSuccessAfterPasswordResetFormSubmit, setIsSuccessAfterPasswordResetFormSubmit ] = useState(false);

    const [ formData, setFormData ] = useState({
        email: "",
        password: "",
    });

    const [ formValidation, setFormValidation ] = useState({
        type: "warning",
        isError: false,
        message: "",
    });

    const emailOnInput = (e) => {
        setFormValidation({
            type: "warning",
            isError: false,
            message: "",
        });
        setFormData({
            ...formData,
            email: e.target.value
        });
    }

    const passwordOnInput = (e) => {
        setFormValidation({
            type: "warning",
            isError: false,
            message: "",
        });
        setFormData({
            ...formData,
            password: e.target.value
        });
    }

    const setForgotPasswordEmail = (e) => {
        setFormValidation({
            type: "warning",
            isError: false,
            message: "",
        });
        setForgotPasswordFormData({
            ...forgotPasswordFormData,
            email: e.target.value
        });
    }

    const login_onclick = async () => {
        setIsLoading(true);
        if(!formData.email) {
            setFormValidation({
                type: "error",
                isError: true,
                message: "please enter email",
            });
            setIsLoading(false);
            return
        }
        if(!formData.password) {
            setFormValidation({
                type: "error",
                isError: true,
                message: "please enter password",
            });
            setIsLoading(false)
            return
        }
        let res = await loginPost(formData);
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

    function show_signup_form(){
        showSignupForm();
    }

    const sendPasswordResetLinkOnclick = async () => {
      setIsLoading(true);
      if(!forgotPasswordFormData.email){
        setFormValidation({
            type: "warning",
            isError: true,
            message: "Please enter your email",
        });
        setIsLoading(false);
        return;
      }
      const res = await requestPasswordReset(forgotPasswordFormData);
      console.log(res);
      setIsLoading(false);
      if(res?.isError || !res?.isSuccess){
        setFormValidation({
            type: "warning",
            isError: true,
            message: res.message,
        });
        return;
      }
      setIsSuccessAfterPasswordResetFormSubmit(true);
    }

    return (
        <div id="main_login_form" style={{display: ((!isLoggedIn && !isShowSignUpForm) ? "block" : "none"), padding: "30px 5px"}}>
            {
                isLoading && <FullPageLoader />
            }
            {
                !isForgotPasswordForm ?
                <div className="login_page_form_container" style={{maxWidth: "600px", margin: "auto", backgroundColor: "white", boxShadow: "1px 2px 3px rgba(0,0,0,0.3)", borderRadius: 9, overflow: "hidden"}}>
                    <p style={{padding: "0 20px", paddingTop: 20, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)", fontSize: 16, fontWeight: "bolder", letterSpacing: 1, marginBottom: 10,}}>
                        Login</p>
                    <div style={{padding: "10px",}}>
                        <div style={{marginBottom: 5, backgroundColor: "rgba(0,0,0,0.07)", padding: 10, borderRadius: 8}}>
                            <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif", fontSize: 14}}>
                                <i className="fa-solid fa-envelope" style={{marginRight: 10, color: "rgb(43, 52, 61)"}}></i>
                                Email</p>
                            <div style={{border: "none", borderTop: "1px solid rgba(0,0,0,0.1)", marginTop: 10}}>
                                <input
                                    onInput={emailOnInput}
                                    value={formData.email}
                                    type="email" placeholder="type here..."
                                    style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", width: "calc(100% - 20px)", padding: 10, background: "none", border: "none"}}/>
                            </div>
                        </div>
                        <div style={{marginBottom: 5, backgroundColor: "rgba(0,0,0,0.07)", padding: 10, borderRadius: 8}}>
                            <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif", fontSize: 14}}>
                                <i className="fa-solid fa-key" style={{marginRight: 10, color: "rgb(43, 52, 61)"}}></i>
                                Password</p>
                            <div style={{border: "none", borderTop: "1px solid rgba(0,0,0,0.1)", marginTop: 10}}>
                                <input
                                    onInput={passwordOnInput}
                                    value={formData.password}
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
                            <div onClick={login_onclick} style={{fontFamily: "'Prompt', Sans-serif", color: "white", cursor: "pointer", width: "fit-content", backgroundColor: "rgb(24, 67, 98)", boxShadow: "0 0 5px rgba(0,0,0,0.5)", textAlign: "center", padding: 14, borderRadius: 50}}>
                                <i style={{marginRight: 10, fontSize: 20, color: "rgba(255,255,255,0.5)"}} className="fa fa-sign-in"></i>
                                Login
                            </div>
                        </div>
                        <div style={{marginTop: 10}}>
                            <p onClick={()=>setIsForgotPasswordForm(true)} style={{fontFamily: "'Prompt', Sans-serif", width: 180, textAlign: "center", margin: "auto", marginTop: 5, padding: 10, color: "darkcyan", cursor: "pointer", fontSize: 14}}>
                                Forgot your password?</p>
                            <p onClick={show_signup_form} style={{fontFamily: "'Prompt', Sans-serif", padding: 10, textAlign: "center", margin: "auto", marginTop: 5, marginBottom: 5, fontSize: 14, borderRadius: 5, cursor: "pointer", width: 170}}>
                                <i style={{marginRight: 5, color: "rgb(43, 52, 61)"}} className="fa fa-user"></i>
                                Create an Account</p>
                        </div>
                    </div>
                </div> :
                <div  className="login_page_form_container" style={{maxWidth: "600px", margin: "auto", backgroundColor: "white", boxShadow: "1px 2px 3px rgba(0,0,0,0.3)", borderRadius: 9, overflow: "hidden"}}>
                    <p style={{padding: "0 20px", paddingTop: 20, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)", fontSize: 16, fontWeight: "bolder", letterSpacing: 1, marginBottom: 10,}}>
                        Forgot Password</p>
                    {
                      !isSuccessAfterPasswordResetFormSubmit ?
                      <div style={{padding: "10px",}}>
                          <div style={{marginBottom: 5, backgroundColor: "rgba(0,0,0,0.07)", padding: 10, borderRadius: 8}}>
                              <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif", fontSize: 14}}>
                                  <i className="fa-solid fa-envelope" style={{marginRight: 10, color: "rgb(43, 52, 61)"}}></i>
                                  Enter your email address below</p>
                              <div style={{border: "none", borderTop: "1px solid rgba(0,0,0,0.1)", marginTop: 10}}>
                                  <input
                                      onInput={setForgotPasswordEmail}
                                      value={forgotPasswordFormData.email}
                                      type="email" placeholder="type here..."
                                      style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", width: "calc(100% - 20px)", padding: 10, background: "none", border: "none"}}/>
                              </div>
                          </div>
                          {
                              formValidation.isError && <FormErrorCard
                                  message={formValidation.message}
                                  type={formValidation.type}
                              />
                          }
                          <div style={{marginTop: 5}}>
                              <div onClick={sendPasswordResetLinkOnclick} style={{fontFamily: "'Prompt', Sans-serif", color: "white", cursor: "pointer", backgroundColor: "rgb(24, 67, 98)", textAlign: "center", padding: 14, borderRadius: 8}}>
                                  Send password reset link
                              </div>
                          </div>
                          <div style={{marginTop: 10}}>
                              <p onClick={()=>setIsForgotPasswordForm(false)} style={{fontFamily: "'Prompt', Sans-serif", width: "165px", textAlign: "center", margin: "auto", marginTop: 5, padding: 10, color: "darkcyan", cursor: "pointer", fontSize: 14}}>
                                  Login/Signup</p>
                          </div>
                      </div> :
                      <div style={{padding: 10, borderLeft: "5px solid rgba(0,255,0,0.2)", background: "rgba(0,255,0,0.1)", margin: 10}}>
                        <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                          <p style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", marginRight: 15}}>
                            <i className="fa-solid fa-exclamation-triangle" style={{color: "orange"}}></i></p>
                          <p style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif"}}>
                            We have sent you an email with instructions to reset your password.
                            Please check your inbox/spam folder to complete your password reset</p>
                        </div>
                      </div>
                    }
                </div>
            }
        </div>
    );
};

export default LoginForm;
