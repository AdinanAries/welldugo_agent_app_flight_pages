const ResponseItem = (props) => {
    
    const {
        customer_first_name,
        customer_last_name,
        customer_email,
        message,
    } = props;

    const {
        who, //["customer", "agent"]
        from, 
        to, 
        to_cc, 
        to_bcc, 
        text_content, 
        attachments, 
        time_stamp
    } = message;

    let _process_content = text_content?.replaceAll("<p></p>", "<br/>");

    const from_first_name = from[0].first_name;
    const from_last_name = from[0].last_name;
    const from_email = from[0].email;

    return <div>
        <div style={{display: "flex", alignItems: "center", padding: 20}}>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", width: 40, minWidth: 40, height: 40, backgroundColor: "#eee", marginRight: 20, borderRadius: "100%"}}>
                {
                    who==="agent" ?
                    <i style={{color: "rgba(0,0,0,0.7)"}} className="fa-solid fa-headset"></i> :
                    <i style={{color: "rgba(0,0,0,0.7)"}} className="fa-solid fa-user"></i>
                }
            </div>
            <div>
                {
                    <p className="tooltip_parent"
                        style={{fontSize: 13, color: "blue", fontWeight: "bolder"}}>
                        {
                            (from_first_name || from_last_name) ?
                            <>
                                {from_first_name} {from_last_name}
                            </> : <>
                                {from_email}
                            </>
                        }
                        <span style={{textAlign: "center", top: "100%", fontWeight: "initial", color: "rgba(0,0,0,0.7)"}} 
                            className="tooltip">
                            {from_email}
                        </span>
                        <span style={{marginLeft: 5, fontSize: 11, color: "rgba(0,0,0,0.7)", fontWeight: "initial"}}>
                            reported via help desk</span>
                    </p>
                }
                <p style={{fontSize: 12, color: "rgba(0,0,0,0.7)"}}>
                    <span style={{fontSize: 12}}>
                        To: </span>
                    {
                        who==="customer" &&
                        "helpdesk email <email@address.com>"
                    }
                    {
                        to?.map(each=>{
                            return <span className="tooltip_parent" style={{color: "rgba(0,0,0,0.7)",  fontSize: 12, whiteSpace: "nowrap"}}>
                                {
                                    (each?.first_name || each?.last_name) ?
                                    `${each?.first_name} ${each?.last_name}, ` :
                                    `${each?.email}, `
                                }
                                <span className="tooltip" style={{textAlign: "center", top: "calc(100% - 2px)"}}>
                                    {each?.email}
                                </span>
                            </span>
                        })
                    }
                    {
                        to_cc?.length>0 &&
                        <span style={{fontSize: 12, marginLeft: 5}}>
                            cc: </span>
                    }
                    {
                        to_cc?.map(each=>{
                            return <span className="tooltip_parent" style={{color: "rgba(0,0,0,0.7)",  fontSize: 12, whiteSpace: "nowrap"}}>
                                {
                                    (each?.first_name || each?.last_name) ?
                                    `${each?.first_name} ${each?.last_name}, ` :
                                    `${each?.email}, `
                                }
                                <span className="tooltip" style={{textAlign: "center", top: "calc(100% - 2px)"}}>
                                    {each?.email}
                                </span>
                            </span>
                        })
                    }
                    {
                        to_bcc?.length>0 &&
                        <span style={{fontSize: 12, marginLeft: 5}}>
                            bcc: </span>
                    }
                    {
                        to_bcc?.map(each=>{
                            return <span className="tooltip_parent" style={{color: "rgba(0,0,0,0.7)",  fontSize: 12, whiteSpace: "nowrap"}}>
                                {
                                    (each?.first_name || each?.last_name) ?
                                    `${each?.first_name} ${each?.last_name}, ` :
                                    `${each?.email}, `
                                }
                                <span className="tooltip" style={{textAlign: "center", top: "calc(100% - 2px)"}}>
                                    {each?.email}
                                </span>
                            </span>
                        })
                    }
                </p>
            </div>
        </div>
        <div style={{padding: 20, paddingTop: 0}}>
            <div className="view_support_ticket_response_item_body_text_container" style={{fontSize: 13}} dangerouslySetInnerHTML={{ __html: _process_content }}/>
        </div>
    </div>
}

export default ResponseItem;