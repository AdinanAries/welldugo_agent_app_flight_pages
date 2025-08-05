import { useState, useEffect } from "react";
import ItineraryList from "./ItineraryList";
import SelectedItinerary from "./SelectedItinerary";
import LoginForm from "../../LoginPage/Components/LoginForm";
import SignupForm from "../../LoginPage/Components/SignupForm";
import { fetchAccountInfo } from "../../../services/accountServices";
import CONSTANTS from "../../../Constants/Constants";

const ItineraryPreviewer = (props) => {

    const {
    } = props;

    const _SUB_PAGES = {
        view_list: 0,
        view_details: 1,
    }

    const [ currentPage, setCurrentPage ] = useState(_SUB_PAGES?.view_list);
    const [ selectedItinerary, setSelectedItinerary ] = useState({});
    const [ isLoggedIn, setIsLoggedIn ] = useState(false);
    const [ user, setUser ] = useState({});
    const [ isLoading, setIsLoading ] = useState(false);
    const [ isShowSignUpForm, setIsShowSignUpForm ] = useState(false);
    const [ pageFilters, setPageFilters ] = useState({
        category: "",
        status: "",
    });

    const verifyLogin = async (show_create_new_ticket_form=true) => {
        setIsLoading(true);
        let _user=await fetchAccountInfo();
        if(_user._id){
            setUser(_user);
            setIsLoggedIn(true);
            setIsLoading(false);
            const params = new URLSearchParams(window.location.search);
            if(params.has("itin_id") && params.get("itin_id")){
                setCurrentPage(_SUB_PAGES?.view_details);
            }
        }else{
            setIsLoading(false);
            setIsLoggedIn(false);
        }
    }

    useEffect(()=>{
        verifyLogin();
    }, []);
    
    const LogMeIn = () => {
        localStorage.setItem(CONSTANTS.local_storage.logged_in_usr, true);
    }

    const goHomeFunction = () => {
        setSelectedItinerary({});                                               
    }

    const showItineraryList = () => {
        setSelectedItinerary({});
    }


    return <div className="wrapper" style={{backgroundColor: "white"}}>
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
                    (currentPage===_SUB_PAGES?.view_list) &&
                    <ItineraryList 
                        pageFilters={pageFilters}
                        userDetails={user}
                        setSelectedItinerary={(_itin_item)=>{
                            setSelectedItinerary(_itin_item);
                            setCurrentPage(_SUB_PAGES?.view_details);
                        }}
                    />
                }
                {
                    (currentPage!==_SUB_PAGES?.view_list && selectedItinerary?._id) &&
                    <SelectedItinerary 
                        itinerary={selectedItinerary}
                    />
                }
            </>
        }
    </div>
}

export default ItineraryPreviewer;