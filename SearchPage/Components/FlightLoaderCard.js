const FlightLoaderCard = (props) => {
    return (
        <div style={{cursor: "pointer", backgroundColor: "rgba(255,255,255,0.7)", borderRadius: 9, marginBottom: 5, padding: "15px 10px", animation: "item_slide_down 0.5s ease-in"}}>
            <div className="each_ticket_upper_flex" style={{flexDirection: "row", justifyContent: "space-between"}}>
                <div className="ticket_loader_info_1">
                    <p className="info_item_loader" style={{borderRadius: 50, fontSize: 12, height: 40}}>
                        Montreal (YUB) - New York (LGA)</p>
                </div>
                <div className="ticket_loader_info_2">
                    <p className="info_item_loader" style={{fontSize: 12, height: 40}}>
                        2h 1m in Toronto(yyz)</p>
                </div>
                <div className="each_ticket_price_display_container  ticket_loader_info_3">
                    <p className="each_ticket_price_display info_item_loader" style={{fontWeight: 1000, fontSize: 27, fontFamily: "'Prompt', Sans-serif", marginBottom: 2}}>
                        $335</p>
                </div>
            </div>
            <div className="ticket_loader_info_4" style={{marginTop: 5}}>
                <p className="info_item_loader" style={{color: "rgba(0,0,0,0)", fontSize: 12, height: 30}}>
                    Delta &#8226;
                    Delta 7204 and 7138 operated by WestJet
                </p>
            </div>
        </div>
    );
}

export default FlightLoaderCard;