import $ from "jquery";

import NotLoggedIn from '../../components/NotLoggedIn';

import support_page_support_icon from "../../icons/support_page_support_icon.svg";
import CONSTANTS from "../../Constants/Constants";

function HelpPage(){
    return(
        <main id="help_page" style={{display: "none"}}>
            <div className="wrapper">
                <div style={{padding: "40px 20px"}}>
                    <p style={{fontSize: 30, fontWeight: "bolder", color: "rgba(0,0,0,0.8)"}}>
                        Help and Support</p>
                    <div style={{display: "none"}}>
                        <NotLoggedIn msg={"You must login to see your trips"}/>
                    </div>
                    <div style={{marginTop: 20}}>
                        <div style={{width: 200, height: 200, marginBottom: 20, backgroundImage: `url(${support_page_support_icon})`, backgroundSize: "contain", backgroundRepeat: "no-repeat"}}>
                        </div>
                        <p style={{color: "rgba(0,0,0,0.7)", fontWeight: "bolder", fontFamily: "'Prompt', Sans-serif"}}>Pick your Channel</p>
                        <div style={{display: "flex", flexDirection: "row", padding: "20px 0"}}>
                            <a href={`tel:${CONSTANTS.our_company.contacts.support.tel}`} style={{textDecoration: "none"}}>
                                <div style={{cursor: "pointer", marginRight: 10, backgroundColor: "rgba(122,21,112)", padding: 20, borderRadius: 50, boxShadow: "0 0 5px rgba(0,0,0,0.5)"}}>
                                    <p style={{fontWeight: "bolder", fontFamily: "'Prompt', Sans-serif", color: 'white', letterSpacing: 1, fontSize: 14}}>
                                        <i style={{marginRight: 10}} className="fa fa-phone"></i>
                                        Call</p>
                                </div>
                            </a>
                            <a href={`mailto:${CONSTANTS.our_company.contacts.support.email}`} style={{textDecoration: "none"}}>
                                <div style={{cursor: "pointer", marginRight: 10, backgroundColor: "rgba(21,122,112)", padding: 20, borderRadius: 50, boxShadow: "0 0 5px rgba(0,0,0,0.5)"}}>
                                    <p style={{fontWeight: "bolder", fontFamily: "'Prompt', Sans-serif", color: 'white', letterSpacing: 1, fontSize: 14}}>
                                        <i style={{marginRight: 10}} className="fa fa-envelope"></i>
                                        Email</p>
                                </div>
                            </a>
                            <div id="main_supportpage_start_support_btn" style={{cursor: "pointer", backgroundColor: "rgba(122,112,21)", padding: 20, borderRadius: 50, boxShadow: "0 0 5px rgba(0,0,0,0.5)"}}>
                                <p style={{fontWeight: "bolder", fontFamily: "'Prompt', Sans-serif", color: 'white', letterSpacing: 1, fontSize: 14}}>
                                    <i style={{marginRight: 10}} className="fa-solid fa-ticket"></i>
                                    Send Ticket</p>
                            </div>
                        </div>
                        <div style={{marginTop: 10, backgroundColor: "white", padding: 15, borderRadius: 5, border: "1px solid rgba(0,0,0,0.1)"}}>
                            <p style={{color: 'rgba(0,0,0,0.7)', marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid rgba(0,0,0,0.1)"}}>
                                <i className="fa fa-exclamation-triangle" style={{color: "orangered", marginRight: 10, textShadow: "1px 2px 3px rgba(0,0,0,0.33)"}}></i>
                                Oops something went wrong</p>
                            <p style={{color: "rgba(0,0,0,0.7)", fontSize: 16, fontFamily: "'Prompt', sans-serif", fontWeight: "bolder", marginBottom: 10}}>
                                <i className="fa fa-wrench" style={{fontSize: 19, marginRight: 5}}></i>Maintenance Notice
                            </p>
                            <p style={{color: "rgba(0,0,0,0.7)", fontSize: 15}}>
                                Due to expansion of services and maintenance work, our automated support channels are temporarily closed.
                                You may call or email us using our provided manual channels above 
                                We apologize for any inconvenience
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default HelpPage;