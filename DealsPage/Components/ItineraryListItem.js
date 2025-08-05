const ItineraryListItem = (props) => {

    const {
        all_info,
        setSelectedItinerary,
    } = props;

    const {
        purpose,
        destination,
        start_date,
        end_date,
        sent_email_title,
        is_sent_copy,
        sent_emails,
        createdAt,
        updatedAt
    } = all_info;

    let c_utc = new Date(createdAt);
    let c_offset = c_utc.getTimezoneOffset();
    const created_at_local = new Date(c_utc.getTime() + c_offset * 60000);

    let u_utc = new Date(createdAt);
    let u_offset = u_utc.getTimezoneOffset();
    const updated_at_local = new Date(u_utc.getTime() + u_offset * 60000);

    return <div style={{padding: 20, borderBottom: "1px dashed rgba(0,0,0,0.1)"}}>
        <div>
            <div onClick={()=>setSelectedItinerary(all_info)} style={{cursor: "pointer"}}>
                <h5 style={{marginBottom: 5, color: "darkslateblue"}} >
                    {purpose}
                </h5>
                <div>
                    <p style={{fontSize: 13, color: "rgba(0,0,0,0.8)"}}>
                        {destination} ({start_date} - {end_date})...
                    </p>
                    <p className="tooltip_parent"
                        style={{fontSize: 12, color: "rgba(0,0,0,0.6)"}}>
                        created: {created_at_local.toString().substring(0, 25)}- updated:  {updated_at_local.toString().substring(0, 25)}
                        <span style={{color: "black"}}
                            className="tooltip">
                            created: {created_at_local.toString()} - updated:  {updated_at_local.toString()}
                        </span>
                    </p>
                    {
                        is_sent_copy &&
                        <p style={{fontSize: 13, color: "rgb(0, 86, 108)", display: "flex", marginLeft: 10}}>
                            <span>
                                <i style={{marginRight: 10, color: "blue"}}
                                    className="fa-solid fa-envelope"></i>
                            </span>
                            <span>
                                <span style={{fontSize: 13, fontWeight: "bolder"}}>
                                    {sent_email_title}
                                </span>
                                {" to "} 
                                {
                                    (sent_emails?.length>0) &&
                                    sent_emails.map(each=>{
                                        const email = each?.email;
                                        const first_name = each?.first_name;
                                        const last_name = each?.last_name;
                                        return <span className="tooltip_parent">
                                            {email+", "}
                                            {
                                                (first_name || last_name) &&
                                                <span>
                                                    {first_name} {last_name}
                                                </span>
                                            }
                                        </span>
                                    })
                                }
                            </span>
                        </p>
                    }
                </div>
            </div>
        </div>
    </div>
}

export default ItineraryListItem;