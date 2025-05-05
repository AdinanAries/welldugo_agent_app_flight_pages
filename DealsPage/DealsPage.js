import NotLoggedIn from '../../components/NotLoggedIn';
import Waiting from '../../components/Waiting';
import DealList from './Components/DealList';


import deals_page_icon from "../../icons/deals_page_icon.svg";
import { useEffect, useState } from 'react';

function DealsPage(){

    const [ isLoading, setIsLoading ] = useState(false);
    const [ isError, setIsError ] = useState(false);
    const [dealsList, setDealsList ] = useState([]);

    const init_deals = () => {
        // 1. Resets
        setIsLoading(true);
        setDealsList([]);
        setIsError(false);
        // 2. Fetching Deals
        setTimeout(()=>{
            setIsLoading(false);
            setIsError(true);
            //setDealsList([1,2,3,4,5,6,7,8,9,10])
        }, 15000);
    }
    window.__InitDealsPage = init_deals;

    return(
        <main id="deals_page" style={{display: "none"}}>
            <div className="wrapper">
                <div style={{padding: "40px 5px"}}>
                    <p style={{marginLeft: 20, fontSize: 30, fontWeight: "bolder", color: "rgba(0,0,0,0.8)"}}>Deals</p>
                    <div style={{display: "none"}}>
                        <NotLoggedIn msg={"You must login to see your trips"}/>
                    </div>
                    <div style={{marginTop: 20}}>
                        {(isLoading || isError) && 
                            <div style={{width: 200, height: 200, backgroundImage: `url(${deals_page_icon})`, backgroundSize: "contain", backgroundRepeat: "no-repeat"}}>
                            </div>
                        }
                        {isLoading && <Waiting />}
                        { (!isLoading && isError) &&
                            <div style={{marginTop: 10, backgroundColor: "white", padding: 15, borderRadius: 5, border: "1px solid rgba(0,0,0,0.1)"}}>
                                <p style={{color: 'rgba(0,0,0,0.7)', marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid rgba(0,0,0,0.1)"}}>
                                    <i className="fa fa-exclamation-triangle" style={{color: "orangered", marginRight: 10, textShadow: "1px 2px 3px rgba(0,0,0,0.33)"}}></i>
                                    Oops something went wrong</p>
                                <p style={{color: "rgba(0,0,0,0.7)", fontSize: 16, fontFamily: "'Prompt', sans-serif", fontWeight: "bolder", marginBottom: 10}}>
                                    <i className="fa fa-wrench" style={{fontSize: 19, marginRight: 5}}></i>Maintenance Notice
                                </p>
                                <p style={{color: "rgba(0,0,0,0.7)", fontSize: 15}}>
                                    Due to expansion of services and maintenance work, we are unable to show any deals at this moment. 
                                    We apologize for any inconvenience
                                </p>
                            </div>
                        }
                        {   (!isLoading && !isError && dealsList.length>0) &&
                            <DealList deals={dealsList} />
                        }
                    </div>
                </div>
            </div>
        </main>
    );
}

export default DealsPage;