import NotLoggedIn from '../../components/NotLoggedIn';
import Waiting from '../../components/Waiting';
import DealList from './Components/DealList';
import deals_page_icon from "../../icons/deals_page_icon.svg";
import { useEffect, useState } from 'react';
import ViewPackageDealDetails from './Components/ViewPackageDealDetails';
import { fetchDealPackageById } from '../../services/agentServices';
import AgentNotFoundHeader from '../../components/AgentNotFoundHeader';
import PriceSummary from '../CheckoutPage/Components/PriceSummary';

function DealsPage(props){

    const {
        bookingEngine
    } = props;

    const ERROR_CODES = {
        no_error: -1,
        agent_not_found: 0,
        package_deal_item_not_found: 1,
        package_deal_items_list_empty: 1,
    }

    const [ isLoading, setIsLoading ] = useState(false);
    const [ isError, setIsError ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState("Unkown Error: Please contact support for assitance.");
    const [ dealsList, setDealsList ] = useState([]);
    const [ selectedPackageDeal, setSelectedPackageDeal ] = useState({});
    const [ errorCode, setErrorCode ] = useState(ERROR_CODES.no_error);

    const init_deals = async () => {
        const params = new URLSearchParams(window.location.search);
        // 1. Resets
        setIsLoading(true);
        setDealsList([]);
        setIsError(false);

        // 2. Fetching Deals
        if(localStorage.getItem("agent")){
            let agent_id = localStorage.getItem("agent");
            if(params.has("dlid")){
                let package_deal_id = params.get('dlid').trim();
                let deal_res = await fetchDealPackageById(agent_id, package_deal_id);
                if(deal_res?._id){
                    setSelectedPackageDeal(deal_res);
                    setErrorMessage("");
                    setIsError(false);
                }else {
                    setErrorCode(ERROR_CODES?.package_deal_item_not_found);
                    setErrorMessage("Package not found for specified link");
                    setIsError(true);
                }
            }else{
                // get all packages and deals of travel agent here
                let deal_list_res = []// make server call here
                if(deal_list_res?.length>1){
                    // Set deals list state here
                }else{
                    setErrorCode(ERROR_CODES?.package_deal_items_list_empty);
                    setErrorMessage("No packages or Deals found for this agent");
                    setIsError(true);
                }
            }
        }else{
            setErrorCode(ERROR_CODES?.agent_not_found);
            setErrorMessage("Travel agent details not found!");
            setIsError(true);
        }
        setIsLoading(false);
        
        
        //setDealsList([1,2,3,4,5,6,7,8,9,10])
        
    }

    window.__InitDealsPage = init_deals;

    return(
        <main id="deals_page" style={{display: "none"}}>
            {
                (errorCode===ERROR_CODES?.agent_not_found) &&
                <AgentNotFoundHeader />
            }
            <div className="wrapper">
                <div>
                    {
                        !selectedPackageDeal?._id &&
                        <p style={{marginLeft: 20, fontSize: 30, marginTop: 40, fontWeight: "bolder", color: "rgba(0,0,0,0.8)"}}>Deals</p>
                    }
                    <div style={{display: "none"}}>
                        <NotLoggedIn msg={"You must login to see your trips"}/>
                    </div>
                    <div>
                        {(isLoading || isError) && 
                            <div style={{width: 200, height: 200, backgroundImage: `url(${deals_page_icon})`, backgroundSize: "contain", backgroundRepeat: "no-repeat"}}>
                            </div>
                        }
                        {isLoading && <Waiting />}
                        { (!isLoading && isError) &&
                            <div style={{marginTop: 10, backgroundColor: "white", padding: 15, marginBottom: 40, borderRadius: 5, border: "1px solid rgba(0,0,0,0.1)"}}>
                                <p style={{color: 'rgba(0,0,0,0.7)', marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid rgba(0,0,0,0.1)"}}>
                                    <i className="fa fa-exclamation-triangle" style={{color: "orangered", marginRight: 10, textShadow: "1px 2px 3px rgba(0,0,0,0.33)"}}></i>
                                    Oops something went wrong</p>
                                <p style={{color: "rgba(0,0,0,0.7)", fontSize: 15}}>
                                    {errorMessage}
                                </p>
                            </div>
                        }
                        {   (!isLoading && !isError && dealsList.length>0) &&
                            <DealList deals={dealsList} />
                        }
                        {
                            (!isLoading && !isError && selectedPackageDeal?._id) &&
                            <div style={{display: "flex", justifyContent: "center"}}>
                                <div style={{width: "calc(100% - 400px"}}>
                                    <ViewPackageDealDetails
                                        data={selectedPackageDeal} 
                                    />
                                </div>
                                <div style={{width: 400, backgroundColor: "white", borderLeft: "1px solid rgba(0,0,0,0.1)"}}>
                                    <PriceSummary 
                                        prices={{
                                            total_amount: 1200,
                                            extras: []
                                        }}
                                        bookingEngine={bookingEngine}
                                        buttonFunction={()=>alert("here")}
                                        backButtonFunction={()=>alert("here")}
                                        buttonText="Passengers"
                                        total_travelers={12}
                                    />
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </main>
    );
}

export default DealsPage;