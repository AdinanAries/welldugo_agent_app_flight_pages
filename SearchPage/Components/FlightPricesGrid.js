import { useEffect, useState } from "react";

const FlightPricesGrid = (props) => {
    
    const { hidePricesGrid } = props;

    const [ isLoading, setIsLoading ] = useState(true);
    const [ isError, setIsError ] = useState(false);

    useEffect(()=>{
        setTimeout(()=>{
            setIsLoading(false);
            setIsError(true);
        }, 7000);
    }, []);
    
    /**
     * To be used jsx
     * <div className="prices-grid-items-container">
            <div className="each-grid-item tooltip_parent">
                <div className="tooltip" 
                    style={{background: "white", textAlign: "center", top: "initial", bottom: "calc(100% + 1px)", width: 90}}>
                    Mon, Feb 2
                </div>
                <div>
                    <p>$120</p>
                </div>
            </div>
        </div>
     */


    return <div className="classic_popup_pane" style={{right: -10}}>
            <p onClick={hidePricesGrid} className="hover_bg-grey"
                style={{zIndex: 1, cursor: "pointer", fontFamily: "'Pompt', Sans-serif", position: "absolute", top: 4, right: 10, fontSize: 20, color: "rgba(0,0,0,0.7)", width: 35, height: 35, borderRadius: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                x</p>
            <div>
            <div style={{padding: 10, paddingTop: 0, marginBottom: 10, borderBottom: "1px solid rgba(0,0,0,0.1)"}}>
                <p style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", fontWeight: "bolder"}}>
                    Prices 
                    <span style={{fontSize: 13, fontWeight: "initial", fontFamily: "'Prompt', Sans-serif", marginLeft: 10}}>
                        (Feb 2 - Feb 6)</span>
                </p>
            </div>
            {
                isLoading && <LoaderCard />
            }
            {
                isError && <ErrorCard />
            }
            
        </div>
    </div>
}

const ErrorCard = () => {
    return <div style={{padding: "30px 10px"}}>
        <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 13, textAlign: "center"}}>
            <i style={{marginRight: 10, color: "orange"}} className="fa-solid fa-exclamation-triangle"></i>
            No data available</p>
    </div>
}

const LoaderCard = () => {
    return <div className="prices-grid-items-container">
        <div className="each-grid-item info_item_loader" style={{background: "rgba(0,0,0,0.4)", maxWidth: 50}}>
            <div>
                <p style={{color: "rgba(0,0,0,0.0)"}}>$120</p>
            </div>
        </div>
        <div className="each-grid-item info_item_loader" style={{background: "rgba(0,0,0,0.4)", maxWidth: 50}}>
            <div>
                <p style={{color: "rgba(0,0,0,0.0)"}}>$120</p>
            </div>
        </div>
        <div className="each-grid-item info_item_loader" style={{background: "rgba(0,0,0,0.4)", maxWidth: 50}}>
            <div>
                <p style={{color: "rgba(0,0,0,0.0)"}}>$120</p>
            </div>
        </div>
        <div className="each-grid-item info_item_loader" style={{background: "rgba(0,0,0,0.4)", maxWidth: 50}}>
            <div>
                <p style={{color: "rgba(0,0,0,0.0)"}}>$120</p>
            </div>
        </div>
        <div className="each-grid-item info_item_loader" style={{background: "rgba(0,0,0,0.4)", maxWidth: 50}}>
            <div>
                <p style={{color: "rgba(0,0,0,0.0)"}}>$120</p>
            </div>
        </div>
        <div className="each-grid-item info_item_loader" style={{background: "rgba(0,0,0,0.4)", maxWidth: 50}}>
            <div>
                <p style={{color: "rgba(0,0,0,0.0)"}}>$120</p>
            </div>
        </div>
        <div className="each-grid-item info_item_loader" style={{background: "rgba(0,0,0,0.4)", maxWidth: 50}}>
            <div>
                <p style={{color: "rgba(0,0,0,0.0)"}}>$120</p>
            </div>
        </div>
        <div className="each-grid-item info_item_loader" style={{background: "rgba(0,0,0,0.4)", maxWidth: 50}}>
            <div>
                <p style={{color: "rgba(0,0,0,0.0)"}}>$120</p>
            </div>
        </div>
        <div className="each-grid-item info_item_loader" style={{background: "rgba(0,0,0,0.4)", maxWidth: 50}}>
            <div>
                <p style={{color: "rgba(0,0,0,0.0)"}}>$120</p>
            </div>
        </div>
        <div className="each-grid-item info_item_loader" style={{background: "rgba(0,0,0,0.4)", maxWidth: 50}}>
            <div>
                <p style={{color: "rgba(0,0,0,0.0)"}}>$120</p>
            </div>
        </div>
        <div className="each-grid-item info_item_loader" style={{background: "rgba(0,0,0,0.4)", maxWidth: 50}}>
            <div>
                <p style={{color: "rgba(0,0,0,0.0)"}}>$120</p>
            </div>
        </div>
        <div className="each-grid-item info_item_loader" style={{background: "rgba(0,0,0,0.4)", maxWidth: 50}}>
            <div>
                <p style={{color: "rgba(0,0,0,0.0)"}}>$120</p>
            </div>
        </div>
        <div className="each-grid-item info_item_loader" style={{background: "rgba(0,0,0,0.4)", maxWidth: 50}}>
            <div>
                <p style={{color: "rgba(0,0,0,0.0)"}}>$120</p>
            </div>
        </div>
        <div className="each-grid-item info_item_loader" style={{background: "rgba(0,0,0,0.4)", maxWidth: 50}}>
            <div>
                <p style={{color: "rgba(0,0,0,0.0)"}}>$120</p>
            </div>
        </div>
        <div className="each-grid-item info_item_loader" style={{background: "rgba(0,0,0,0.4)", maxWidth: 50}}>
            <div>
                <p style={{color: "rgba(0,0,0,0.0)"}}>$120</p>
            </div>
        </div>
    </div>
}

export default FlightPricesGrid;