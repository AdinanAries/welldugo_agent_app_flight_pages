import { useState, useEffect } from "react";
import ItineraryListItem from "./ItineraryListItem";
import { 
    fetchItinerariesByCustomerEmail, 
    fetchItineraryById,
} from "../../../services/agentServices";

const ItineraryList = (props) => {
    
    const {
            userDetails,
            setSelectedItinerary,
            pageFilters,
        } = props;
    
        const PAGI_LIMIT = 10;
        
        const [ isLoading, setIsLoading ] = useState(false);
        const [ itinerariesList, setItinerariesList ] = useState([]);
        const [ totalItems, setTotalItems ] = useState(0);
        const [ pagiCurrentPage, setpagiCurrentPage ] = useState(1);
    
        useEffect(()=>{
            initPageData();
        }, [pagiCurrentPage, pageFilters]);
    
        const initPageData = async () => {
            setIsLoading(true);
            const params = new URLSearchParams(window.location.search);
            if(params.has("itin_id") && params.get("itin_id")){
                let _itin_id = params.get("itin_id");
                const _res = await fetchItineraryById(_itin_id);
                if(_res?._id)
                    setSelectedItinerary(_res);
            }else{
                const _res = await fetchItinerariesByCustomerEmail(userDetails?.email, pageFilters, setTotalItems, pagiCurrentPage, PAGI_LIMIT);
                if(Array.isArray(_res))
                    setItinerariesList(_res);
            }
            setIsLoading(false);
        }
    
        const all_pages = [];
        let i=1;
        while(true){
            all_pages.push(i);
            if(i>=totalItems){
                break
            }
            i+=PAGI_LIMIT;
        }
    
    
    return <div>
        <div style={{padding: "5px 10px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(0,0,0,0.07)", borderBottom: "1px dashed rgba(0,0,0,0.1)"}}>
            <div>
                <p style={{color: "grey", fontSize: 12}}>
                    <span style={{margin: 10, color: "rgba(0,0,0,0.7)", fontSize: 15}}>-</span>
                    Total: 
                    <span style={{color: "blue", margin: 5, fontSize: 13}}>{totalItems}</span> 
                    ticket(s)
                    <span style={{margin: 10, color: "rgba(0,0,0,0.7)", fontSize: 15}}>-</span>
                </p>
            </div>
            <div>   
                <select onInput={e=>setpagiCurrentPage(e.target.value)}
                    value={pagiCurrentPage}
                    className="select-input-paginator"
                    style={{padding: "10px 30px"}}
                >
                    {
                        all_pages?.map((each, i)=>{
                            return <option
                                value={each}
                            >{each} - {(each+PAGI_LIMIT-1)}</option>
                                
                        })  
                    }
                </select>
            </div>
        </div>
        <div>
            {
                isLoading ?
                <div style={{backgroundColor: "green", padding: 20, textAlign: "center",
                    fontSize: 12, color: "lightgreen", margin: 10, marginBottom: 20, cursor: "pointer"}}>
                    <i style={{marginRight: 10, color: "yellow"}} className="fa fa-spinner"></i>
                    Loading.. Please Wait
                </div> : 
                <div>
                    {
                        (itinerariesList?.length < 1) ?
                        <div style={{margin: 10, padding: 20, backgroundColor: "rgb(79, 0, 0)"}}>
                            <p style={{color: "white", fontSize: 13, textAlign: "center"}}>
                                <i style={{color: "yellow", marginRight: 10}} className="fa-solid fa-exclamation-triangle"></i>
                                Nothing to show...
                            </p>
                        </div> :
                        <>
                            {
                                itinerariesList?.map(each=>{
                                    return <ItineraryListItem  
                                        all_info={each}
                                        setSelectedItinerary={setSelectedItinerary}
                                    />
                                })
                            }
                        </>
                    }
                </div>
            }
        </div>
    </div>
}

export default ItineraryList;