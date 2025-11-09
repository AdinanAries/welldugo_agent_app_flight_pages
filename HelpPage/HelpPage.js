import $ from "jquery";

import NotLoggedIn from '../../components/NotLoggedIn';
import { 
    fetchAccountInfo 
} from "../../services/accountServices";
import { 
    fetchSupportTicketById 
} from "../../services/agentServices";
import support_page_support_icon from "../../icons/support_page_support_icon.svg";
import CONSTANTS from "../../Constants/Constants";
import CreateNewTicket from "./Components/CreateNewTicket";
import LoginForm from "../LoginPage/Components/LoginForm";
import { useEffect, useState } from "react";
import SignupForm from "../LoginPage/Components/SignupForm";
import TicketSupportPage from "./Components/TicketSupportPage";
import TicketList from "./Components/TicketList";

function HelpPage(){

    const params = new URLSearchParams(window.location.search);
    let INITIAL_TICKET_ID = "";
    if(params.has("tcktid")){
        INITIAL_TICKET_ID = params.get("tcktid").trim();
    }

    const [ isCreateNewTicket, setIsCreateNewTicket ] = useState(false);
    const [ isShowTicketsList, setIsShowTicketsList ] = useState(false);
    const [ selectedSupportTicket, setSelectedSupportTicket ] = useState({});
    const [ isLoggedIn, setIsLoggedIn ] = useState(false);
    const [ user, setUser ] = useState({});
    const [ isLoading, setIsLoading ] = useState(false);
    const [ isShowSignUpForm, setIsShowSignUpForm ] = useState(false);
    const [ pageFilters, setPageFilters ] = useState({
        category: "",
        status: "",
    });

    const startCreateNewTicket = async (show_create_new_ticket_form=true) => {
        setIsLoading(true);
        if(show_create_new_ticket_form){
            setIsCreateNewTicket(true);
            setSelectedSupportTicket({});
            setIsShowTicketsList(false);
        }
        let _user=await fetchAccountInfo();
        if(_user._id){
            setUser(_user);
            setIsLoggedIn(true);
            setIsLoading(false);
            if(INITIAL_TICKET_ID){
                let __ticket = await fetchSupportTicketById(INITIAL_TICKET_ID);
                if(__ticket?._id)
                    selectTicket(__ticket);
            }
        }else{
            setIsLoading(false);
            setIsLoggedIn(false);
            //if(_user?.status && _user?.status === 401)   
        }
    }

    useEffect(()=>{
        startCreateNewTicket(false);
    }, []);

    const LogMeIn = async () => {
        localStorage.setItem(CONSTANTS.local_storage.logged_in_usr, true);
        if(INITIAL_TICKET_ID){
            let __ticket = await fetchSupportTicketById(INITIAL_TICKET_ID);
            if(__ticket?._id)
                selectTicket(__ticket);
        }
    }

    const selectTicket = (_ticket) => {
        setSelectedSupportTicket(_ticket);
        setIsCreateNewTicket(false);
        setIsShowTicketsList(false);
    }

    const goHomeFunction = () => {
        setSelectedSupportTicket({});
        setIsShowTicketsList(false);
        setIsCreateNewTicket(false);                                                   
    }

    const showTicketsList = () => {
        setSelectedSupportTicket({});
        setIsCreateNewTicket(false);
        setIsShowTicketsList(true);
    }

    return(
        <main id="help_page" style={{display: "none", minHeight: "calc(100vh - 45px)"}}>
            <div className="wrapper">
                {
                    isLoggedIn ?
                    <p style={{backgroundColor: "green", color: "white", fontSize: 13, padding: 10}}>
                        <i style={{color: "yellow", marginRight: 10}} className="fa-solid fa-info"></i>
                        You're Logged in!
                    </p> :
                    <p style={{backgroundColor: "crimson", color: "white", fontSize: 13, padding: 10}}>
                        <i style={{color: "orange", marginRight: 10}} className="fa-solid fa-exclamation-triangle"></i>
                        You're Not Logged in!
                    </p>
                }
                <div>
                    {
                        isLoading ? <div>

                        </div> :
                        <>
                            {
                                (!isCreateNewTicket && !isShowTicketsList && !selectedSupportTicket?._id) &&
                                <div style={{padding: 20, paddingTop: 40}}>
                                    <div>
                                        <p style={{fontSize: 16, fontWeight: "bolder", color: "rgba(0,0,0,0.8)"}}>
                                            Helpdesk: 
                                                <span onClick={startCreateNewTicket}
                                                    style={{fontSize: 13, marginLeft: 10, color: "blue", textDecoration: "underline", cursor: "pointer"}}>
                                                        Create A Ticket
                                                </span> /
                                                <span onClick={showTicketsList}
                                                    style={{fontSize: 13, marginLeft: 5, color: "blue", textDecoration: "underline", cursor: "pointer"}}>
                                                        View Your Tickets
                                                </span>
                                            </p>
                                        <div style={{display: "none"}}>
                                            <NotLoggedIn msg={"You must login to see your trips"}/>
                                        </div>
                                    </div>
                                    <div style={{width: 200, height: 200, marginBottom: 20, backgroundImage: `url(${support_page_support_icon})`, backgroundSize: "contain", backgroundRepeat: "no-repeat"}}>
                                    </div>
                                    <p style={{fontSize: 12, color: "rgba(0,0,0,0.7)", fontWeight: "bolder", fontFamily: "'Prompt', Sans-serif"}}>
                                        Other Contact:</p>
                                    <div style={{display: "flex", flexDirection: "row", padding: "20px 0"}}>
                                        <a href={`tel:${CONSTANTS.our_company.contacts.support.tel}`} style={{textDecoration: "none"}}>
                                            <div style={{cursor: "pointer", marginRight: 10, backgroundColor: "rgba(122,21,112)", padding: 20, borderRadius: 50, boxShadow: "0 0 5px rgba(0,0,0,0.5)"}}>
                                                <p style={{fontWeight: "bolder", fontFamily: "'Prompt', Sans-serif", color: 'white', letterSpacing: 1, fontSize: 13}}>
                                                    <i style={{marginRight: 10}} className="fa fa-phone"></i>
                                                    Call</p>
                                            </div>
                                        </a>
                                        <a href={`mailto:${CONSTANTS.our_company.contacts.support.email}`} style={{textDecoration: "none"}}>
                                            <div style={{cursor: "pointer", marginRight: 10, backgroundColor: "rgba(21,122,112)", padding: 20, borderRadius: 50, boxShadow: "0 0 5px rgba(0,0,0,0.5)"}}>
                                                <p style={{fontWeight: "bolder", fontFamily: "'Prompt', Sans-serif", color: 'white', letterSpacing: 1, fontSize: 13}}>
                                                    <i style={{marginRight: 10}} className="fa fa-envelope"></i>
                                                    Email</p>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            }
                            {
                                (isCreateNewTicket || isShowTicketsList  || selectedSupportTicket?._id) &&
                                <div>
                                    {
                                        !isLoggedIn ?
                                        <div>
                                            <LoginForm 
                                                isLoggedIn={isLoggedIn} 
                                                isShowSignUpForm={isShowSignUpForm}
                                                LogMeIn={LogMeIn}
                                                showSignupForm={()=>setIsShowSignUpForm(true)}
                                            /> 
                                            <SignupForm
                                                LogMeIn={LogMeIn}
                                                isLoggedIn={isLoggedIn}
                                                isShowSignUpForm={isShowSignUpForm}
                                                showLoginForm={()=>setIsShowSignUpForm(false)}
                                            />
                                        </div> :
                                        <>
                                            {
                                                isCreateNewTicket &&
                                                <CreateNewTicket
                                                    userDetails={user}
                                                    goBackFunction={()=>setIsCreateNewTicket(false)}
                                                    callbackFunction={selectTicket}
                                                />
                                            }
                                            {
                                                isShowTicketsList && 
                                                <div>
                                                    <TicketList 
                                                        pageFilters={pageFilters}
                                                        userDetails={user}
                                                        setSelectedTicket={selectTicket}
                                                    />
                                                </div>
                                            }
                                            {
                                                selectedSupportTicket?._id &&
                                                <div style={{paddingBottom: 400, backgroundColor: "white"}}>
                                                    <TicketSupportPage 
                                                        userDetails={user}
                                                        ticketInfo={selectedSupportTicket}
                                                        goBackFunction={goHomeFunction}
                                                    />
                                                </div>
                                            }
                                        </>
                                    }
                                </div>
                            }
                        </>
                    }
                </div>
            </div>
        </main>
    );
}

export default HelpPage;