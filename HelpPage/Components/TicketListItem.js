import { useEffect, useState } from "react";
import { saveSupportTicket } from "../../../services/agentServices";

const TicketListItem = (props) => {

    const {
        ticketInfo,
        setSelectedTicket,
    } = props;

    const [ data, setData ] = useState(ticketInfo);

    const {
        ticket_number,
        customer_first_name,
        customer_last_name,
        customer_user_id,
        customer_email,
        title,
        messages,
        category,
        status,
        updatedAt,
    } = data;

    const setTicketStatus = async (_status) => {
        let _ticket = data;
        _ticket.status = _status;
        let __res = await saveSupportTicket(_ticket);
        if(__res?._id){
            setData({...__res});
        }else {
            alert("Error occurred during update!")
        }
    }

    const setTicketCategory = async (_category) => {
        let _ticket = data;
        _ticket.category = _category;
        let __res = await saveSupportTicket(_ticket);
        if(__res?._id){
            setData({...__res});
        }else {
            alert("Error occurred during update!")
        }
    }

    return <div style={{padding: 20, borderBottom: "1px dashed rgba(0,0,0,0.1)"}}>
        <div style={{backgroundColor: "white", display: "flex", justifyContent: "space-between"}}>
            <div style={{opacity: (status?.toLowerCase()==="resolved" || status?.toLowerCase()==="unresolved") ? 0.4 : 1, display: "flex", alignItems: "center"}}>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", width: 55, minWidth: 55, height: 55, backgroundColor: "#eee", marginRight: 20, borderRadius: "100%"}}>
                    <i style={{color: "rgba(0,0,0,0.7)"}} className="fa-solid fa-user"></i>
                </div>
                <div>
                    <h5 onClick={()=>setSelectedTicket(data)}
                        className="support-ticket-item-title"
                        style={{cursor: "pointer", color: "rgba(0,0,0,0.8)"}}>
                        <span style={{marginRight: 10, color: status?.toLowerCase()==="unresolved" ? "crimson" : "blue"}}>
                            {
                                status?.toLowerCase()==="resolved" &&
                                <i className="fa-solid fa-check" style={{color: "green", marginRight: 10}}></i>
                            }
                            {
                                status?.toLowerCase()==="new ticket" &&
                                <i className="fa-solid fa-circle" style={{color: "crimson", marginRight: 10, fontSize: 7, marginTop: -20}}></i>
                            }
                            {
                                status?.toLowerCase()==="in progress" &&
                                <i className="fa-solid fa-play" style={{color: "rgb(148, 23, 119)", marginRight: 10}}></i>
                            }
                            {
                                status?.toLowerCase()==="paused" &&
                                <i className="fa-solid fa-pause" style={{color: "orange", marginRight: 10}}></i>
                            }
                            {
                                status?.toLowerCase()==="waiting reply" &&
                                <i className="fa-solid fa-pause" style={{color: "orange", marginRight: 10}}></i>
                            }
                            {
                                status?.toLowerCase()==="unresolved" &&
                                <i className="fa-solid fa-exclamation-triangle" style={{color: "crimson", marginRight: 10}}></i>
                            }
                            #{ticket_number}</span>
                        {title}</h5>
                    <p style={{fontSize: 13, color: "rgba(0,0,0,0.7)"}} className="tooltip_parent">
                        {
                            (customer_first_name || customer_last_name) ?
                            <>
                                {customer_first_name} {customer_last_name}
                            </> : <>
                                {customer_email}
                            </>
                        }
                        <span style={{textAlign: "center", top: "100%"}} 
                            className="tooltip">
                            {customer_email}
                        </span>
                    </p>
                    <p style={{fontSize: 12, color: "rgba(0,0,0,0.7)"}}>
                        Updated: {updatedAt}
                    </p>
                </div>
            </div>
            <div className="hide_at_500" style={{display: "flex"}}>
                <div style={{marginRight: 20, padding: "0 20px", borderRight: "1px dashed rgba(0,0,0,0.1)", borderLeft: "1px dashed rgba(0,0,0,0.1)"}}>
                    <p style={{color: "rgba(0,0,0,0.7)", fontSize: 11, fontWeight: "bolder"}}>
                        Category:</p>
                    <p style={{fontSize: 13}}>
                        {category}
                    </p>
                </div>
                <div>
                    <p style={{color: "rgba(0,0,0,0.7)", fontSize: 11, fontWeight: "bolder"}}>
                        Status:</p>
                    <p style={{fontSize: 13}}>
                        {status}
                    </p>
                </div>
            </div>
        </div>
        <p style={{marginTop: 2, marginLeft: 75, fontSize: 12, color: "rgba(0,0,0,0.7)"}} 
            className="show_at_500">
            {status}, {category}
        </p>
    </div>
}

export default TicketListItem;