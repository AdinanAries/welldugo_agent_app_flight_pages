import RichTextEditorQuill from "../../../components/RichTextEditorQuill";
import ResponseItem from "./ReponseItem";
import DragAndDropFileInput from "../../../components/DragAndDropFileInput";
import { saveSupportTicket } from "../../../services/agentServices";
import { useState } from "react";

const TicketSupportPage = (props) => {

    const {
        userDetails,
        ticketInfo,
        goBackFunction,
    } = props;

    const Test_Customer_Objs = []

    /**
     * agent_id: userDetails?._id,
        ticket_number: "",
        customer_user_id: "",
        customer_email: "",
        title: "",
        category: "Uncategorized",
        status: "New Ticket",
        messages: [{
            who: "customer", //["customer", "agent"]
            from: [], 
            to: [], 
            to_cc: [], 
            to_bcc: [], 
            text_content: "", 
            attachments: [], 
            time_stamp: ""
        }],
        reply_draft: {},
     */

    const _last_response_message = {...(ticketInfo?.messages[(ticketInfo?.messages?.length - 1)])};
    const [ data, setData ] = useState(ticketInfo);
    const [ replyMessage, setReplyMessage ] = useState("");
    const [ showAttachments, setShowAttachments ] = useState(false);
    const [ minimzeEditor, setMinimzeEditor ] = useState(false);
    const [ showReplyToContacts, setShowReplyToContacts ] = useState(false);
    const [ customerFieldInput, setCustomerFieldInput ] = useState({
        include_cc: (_last_response_message?.to_cc?.length>0),
        include_bcc: (_last_response_message?.to_bcc?.length>0),
        selected_to: _last_response_message?.to,
        show_input_text_auto_complete: false,
        input_text: "",
        auto_complete_list: [],
        selected_cc: _last_response_message?.to_cc,
        show_cc_input_text_auto_complete: false,
        cc_input_text: "",
        cc_auto_complete_list: [],
        selected_bcc: _last_response_message?.to_bcc,
        show_bcc_input_text_auto_complete: false,
        bcc_input_text: "",
        bcc_auto_complete_list: [],
    });
    const [ currentReply, setCurrentReply ] = useState(_last_response_message/*{
        who, //["customer", "agent"]
        from, 
        to, 
        to_cc, 
        to_bcc, 
        text_content, 
        attachments, 
        time_stamp
    }*/);

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

    const returnAutoCompleteListItems = (input_txt) => {
        let names_list = input_txt?.split(" ");
        let _last_name = (names_list?.length>1 ? names_list[1] : "");
        return Test_Customer_Objs?.filter(each=>(
                each?.email?.toLocaleLowerCase()?.trim()?.includes(input_txt?.toLocaleLowerCase()?.trim()) ||
                each?.first_name?.toLocaleLowerCase()?.trim()?.includes(input_txt?.toLocaleLowerCase()?.trim()) ||
                each?.last_name?.toLocaleLowerCase()?.trim()?.includes(input_txt?.toLocaleLowerCase()?.trim()) ||
                (each?.first_name?.toLocaleLowerCase()?.trim()?.includes(names_list[0]?.toLocaleLowerCase()?.trim()) && each?.last_name?.toLocaleLowerCase()?.trim()?.includes(_last_name?.toLocaleLowerCase()?.trim()))
            ))
    }

    // to
    const customerOnInput = (e) => {
        let _val = e.target.value;
        
        let _list = returnAutoCompleteListItems(_val);
        let auto_complete_list = [
            {first_name: "", last_name: "", email: _val},
            ..._list,
        ]
        setCustomerFieldInput({
            ...customerFieldInput,
            input_text: _val,
            auto_complete_list
        });
    }

    const customerOnInputSelect = (cust_obj) => {
        let selected_to = customerFieldInput?.selected_to;
        if(selected_to?.filter(each=>each?.email===cust_obj?.email)?.length<1){
            selected_to?.push(cust_obj);
        }
        setCustomerFieldInput({
            ...customerFieldInput,
            selected_to,
        });
        let _cr = currentReply;
        if(_cr.to?.filter(each=>each?.email===cust_obj?.email)?.length<1){
            _cr.to?.push(cust_obj);
        }
        setCurrentReply({..._cr});
    }

    const removeCustomerFromToList = (cust_obj) => {
        let selected_to = customerFieldInput?.selected_to?.filter(each=>each?.email!==cust_obj?.email);
        setCustomerFieldInput({
            ...customerFieldInput,
            selected_to,
        });
        let _cr = currentReply;
        _cr.to = _cr.to.filter(each=>each?.email!==cust_obj?.email);
        setCurrentReply({..._cr});
    }

    const toggleShowCustomerInputTextAutoComplete = (__bool) => {
        setCustomerFieldInput(prevState=>({
            ...prevState,
            input_text: "",
            auto_complete_list: [],
            show_input_text_auto_complete: __bool,
        }))
    }

    // cc
    const ccCustomerOnInput = (e) => {
        let _val = e.target.value;
        
        let _list = returnAutoCompleteListItems(_val);
        let cc_auto_complete_list = [
            {first_name: "", last_name: "", email: _val},
            ..._list,
        ]
        setCustomerFieldInput({
            ...customerFieldInput,
            cc_input_text: _val,
            cc_auto_complete_list
        });
    }

    const ccCustomerOnInputSelect = (cust_obj) => {
        let selected_cc = customerFieldInput?.selected_cc;
        if(selected_cc?.filter(each=>each?.email===cust_obj?.email)?.length<1){
            selected_cc?.push(cust_obj);
        }
        setCustomerFieldInput({
            ...customerFieldInput,
            selected_cc,
        });
        let _cr = currentReply;
        if(_cr?.to_cc?.filter(each=>each?.email===cust_obj?.email)?.length<1){
            _cr?.to_cc?.push(cust_obj);
        }
        setCurrentReply({..._cr});
        
    }

    const removeCcCustomerFromToList = (cust_obj) => {
        let selected_cc = customerFieldInput?.selected_cc?.filter(each=>each?.email!==cust_obj?.email);
        setCustomerFieldInput({
            ...customerFieldInput,
            selected_cc,
        });
        let _cr = currentReply;
        _cr.to_cc = _cr.to_cc.filter(each=>each?.email!==cust_obj?.email);
        setCurrentReply({..._cr});
    }

    const toggleShowCcCustomerInputTextAutoComplete = (__bool) => {
        setCustomerFieldInput(prevState=>({
            ...prevState,
            cc_input_text: "",
            cc_auto_complete_list: [],
            show_cc_input_text_auto_complete: __bool,
        }))
    }

    // bcc
    const bccCustomerOnInput = (e) => {
        let _val = e.target.value;
        
        let _list = returnAutoCompleteListItems(_val);
        let bcc_auto_complete_list = [
            {first_name: "", last_name: "", email: _val},
            ..._list,
        ]
        setCustomerFieldInput({
            ...customerFieldInput,
            bcc_input_text: _val,
            bcc_auto_complete_list
        });
    }

    const bccCustomerOnInputSelect = (cust_obj) => {
        let selected_bcc = customerFieldInput?.selected_bcc;
        if(selected_bcc?.filter(each=>each?.email===cust_obj?.email)?.length<1){
            selected_bcc?.push(cust_obj);
        }
        setCustomerFieldInput({
            ...customerFieldInput,
            selected_bcc,
        });
        let _cr = currentReply;
        if(_cr.to_bcc?.filter(each=>each?.email===cust_obj?.email)?.length<1){
            _cr.to_bcc?.push(cust_obj);
        }
        setCurrentReply({..._cr});
    }

    const removeBccCustomerFromToList = (cust_obj) => {
        let selected_bcc = customerFieldInput?.selected_bcc?.filter(each=>each?.email!==cust_obj?.email);
        setCustomerFieldInput({
            ...customerFieldInput,
            selected_bcc,
        });
        let _cr = currentReply;
        _cr.to_bcc = _cr.to_bcc.filter(each=>each?.email!==cust_obj?.email);
        setCurrentReply({..._cr});
    }

    const toggleShowBccCustomerInputTextAutoComplete = (__bool) => {
        setCustomerFieldInput(prevState=>({
            ...prevState,
            bcc_input_text: "",
            bcc_auto_complete_list: [],
            show_bcc_input_text_auto_complete: __bool,
        }));
    }

    const bodyMsgOnInput = (__html_text) => {
        setReplyMessage(__html_text);
    }

    const replyMessageOnSend = async () => {
        if(replyMessage?.trim()?.replaceAll("<p></p>", "")===""){
            alert("Please add reply message!");
            return;
        }
        const _ticket = data; // From Component State
        const _all_messages = _ticket?.messages;
        const _message = currentReply; // From Component State
        _message.text_content=replyMessage;
        if(_all_messages?.length===1 && _message.who==="agent"){
            _message.to=_message.to.filter(each=>each.email!==userDetails?.email);
        }
        _message.who="customer";
        _message.from=[
            {
                first_name: userDetails?.first_name,
                last_name: userDetails?.last_name,
                email: userDetails?.email,
            }
        ];
        _all_messages.push(_message);
        _ticket.messages=_all_messages;
        let __res = await saveSupportTicket(_ticket);
        if(__res?._id){
            setData({...__res});
        }else {
            alert("Error occurred during update!")
        }
    }

    return <div style={{position: "relative", height: "calc(100vh - 150px)", padding: 10, backgroundColor: "white"}}>
        <div>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed rgba(0,0,0,0.1)", paddingBottom: 10}}>
                <div style={{display: "flex", alignItems: "center"}}>
                    <div onClick={goBackFunction} style={{width: 35, height: 35, minWidth: 35, display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.1)", cursor: "pointer", borderRadius: "100%", marginRight: 20}}>
                        <i className="fa-solid fa-angle-left"></i>
                    </div>
                    <div style={{marginRight: 20}}>
                        <h4 style={{color: "rgba(0,0,0,0.8)"}}>
                            {
                                status?.toLowerCase()==="resolved" &&
                                <i className="fa-solid fa-check" style={{color: "green", marginRight: 10}}></i>
                            }
                            {
                                status?.toLowerCase()==="new ticket" &&
                                <i className="fa-solid fa-circle" style={{color: "crimson", marginRight: 10}}></i>
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
                                status?.toLowerCase()==="unresolved" &&
                                <i className="fa-solid fa-exclamation-triangle" style={{color: "crimson", marginRight: 10}}></i>
                            }
                            <i style={{marginRight: 20, color: "rgba(0,0,0,0.6)"}}
                                className="fa-solid fa-ticket"></i>
                            <span style={{marginRight: 10, color: status?.toLowerCase()==="unresolved" ? "crimson" : "blue"}}>
                                #{ticket_number}</span>
                            {title}</h4>
                            <p style={{fontSize: 13}} 
                                className="show_at_500">
                                {status}, {category}
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
            <div>
                {
                    messages?.map(each=>{
                        return <ResponseItem 
                            customer_first_name={customer_first_name}
                            customer_last_name={customer_last_name}
                            customer_email={customer_email}
                            message={each}
                        />
                    })
                    
                }
            </div>
        </div>    
        <div className="view_support_ticket_reply_form_container" style={{display: minimzeEditor ? "none" : "block", position: "fixed", bottom: 10, left: -7, width: "100vw", zIndex: 3}}>
            <div className="wrapper" style={{backgroundColor: "white", padding: 5, position: "relative"}}>
                <div onClick={()=>setMinimzeEditor(true)} style={{backgroundColor: "black", zIndex: 2, position: "absolute", top: -25, right: 20, width: 40, height: 40, color: "rgba(255,255,255,0.6)", marginLeft: 20, display: "flex", justifyContent: "center", alignItems: "center", border: "2px solid rgba(255,255,255,0.2)", boxShadow: "1px 2px 3px rgba(0,0,0,0.3)",}}
                    className="tooltip_parent">
                    <i style={{fontSize: 13}} className="fa-solid fa-angle-down"></i>
                    <span style={{color: "black", fontSize: 13, textAlign: "center", left: -120, top: -35, left: "50%"}} 
                        className="tooltip">
                        hide editor
                    </span>
                </div>
                <div style={{color: !showReplyToContacts ? "red" : "green", backgroundColor: "white", zIndex: 2, position: "absolute", top: -20, left: 10, display: "flex", justifyContent: "center", alignItems: "center"}}
                    className="tooltip_parent">
                    <i onClick={()=>setShowReplyToContacts(!showReplyToContacts)}
                        style={{textShadow: "1px 2px 3px rgba(0,0,0,0.3)", fontSize: 20}} className="fa-solid fa-user-pen"></i>
                    <span style={{color: "black", fontSize: 13, textAlign: "center", left: -120, top: -35, left: "50%"}} 
                        className="tooltip">
                        {
                            showReplyToContacts ? "hide " : "show "
                        }Receipient
                    </span>
                </div>
                {
                    showReplyToContacts &&
                    <div style={{border: "1px solid rgba(0,0,0,0.1)", borderBottom: "none", backgroundColor: "rgba(0,0,0,0.07)", padding: 15}}>
                        <div style={{position: "relative", zIndex: 5}}>
                            <p style={{fontSize: 13, margin: 10}}>
                                <i style={{marginRight: 10, color: "rgba(0,0,0,0.5)"}}
                                    className="fa-solid fa-envelope"></i>
                                Contact (Email)
                                {
                                    !customerFieldInput?.include_cc ?
                                    <span onClick={()=>setCustomerFieldInput({
                                        ...customerFieldInput,
                                        include_cc: !customerFieldInput?.include_cc,
                                    })}
                                        style={{marginLeft: 20, textDecoration: "underline", color: "green", cursor: "pointer"}}>
                                            <i style={{marginRight: 10, color: "rgba(0,0,0,0.5)"}}
                                                className="fa-solid fa-plus"></i>
                                            Add cc</span> :
                                    <span onClick={()=>setCustomerFieldInput({
                                        ...customerFieldInput,
                                        include_cc: !customerFieldInput?.include_cc,
                                    })} 
                                        style={{marginLeft: 30, textDecoration: "underline", color: "crimson", cursor: "pointer"}}>
                                            <i style={{marginRight: 10, color: "rgba(0,0,0,0.5)"}}
                                                className="fa-solid fa-minus"></i>
                                            Remove cc</span>
                                }
                                {
                                    !customerFieldInput?.include_bcc ?
                                    <span onClick={()=>setCustomerFieldInput({
                                        ...customerFieldInput,
                                        include_bcc: !customerFieldInput?.include_bcc,
                                    })}
                                        style={{marginLeft: 20, textDecoration: "underline", color: "green", cursor: "pointer"}}>
                                            <i style={{marginRight: 10, color: "rgba(0,0,0,0.5)"}}
                                                className="fa-solid fa-plus"></i>
                                        Add bcc</span> :
                                    <span onClick={()=>setCustomerFieldInput({
                                        ...customerFieldInput,
                                        include_bcc: !customerFieldInput?.include_bcc,
                                    })} 
                                        style={{marginLeft: 20, textDecoration: "underline", color: "crimson", cursor: "pointer"}}>
                                            <i style={{marginRight: 10, color: "rgba(0,0,0,0.5)"}}
                                                className="fa-solid fa-minus"></i>
                                        Remove bcc</span>
                                }
                            </p>
                            <div style={{display: "flex"}}>
                                <span style={{color: "rgba(0,0,0,0.5)", fontSize: 13, margin: 8}}>
                                    To:</span>
                                <div style={{display: "flex", flexWrap: "wrap"}}>
                                {
                                    customerFieldInput?.selected_to?.map(each=>{
                                        return <span className="tooltip_parent" style={{padding: "5px 10px", borderRadius: 50, color: "rgba(0,0,0,0.7)", backgroundColor: "rgba(255, 255, 255, 0.76)", border: "1px solid rgba(0,0,0,0.1)", fontSize: 13, whiteSpace: "nowrap", margin: 2}}>
                                            {
                                                (each?.first_name || each?.last_name) ?
                                                `${each?.first_name} ${each?.last_name}` :
                                                each?.email
                                            } 
                                            <i onClick={()=>removeCustomerFromToList(each)}
                                                className="fa-solid fa-times"
                                                style={{marginLeft: 10, color: "red", cursor: "pointer"}}
                                            ></i>
                                            <span className="tooltip" style={{textAlign: "center", top: "calc(100% - 2px)"}}>
                                                {each?.email}
                                            </span>
                                        </span>
                                    })
                                }
                                <input onInput={customerOnInput}
                                    onFocus={()=>toggleShowCustomerInputTextAutoComplete(true)}
                                    onBlur={()=>{
                                        setTimeout(()=>{
                                            toggleShowCustomerInputTextAutoComplete(false);
                                        }, 500);
                                    }}
                                    value={customerFieldInput?.input_text}
                                    style={{background: "none", border: "none", margin: 5}}
                                    placeholder="type here..."
                                />
                                </div>
                            </div>
                            {
                                customerFieldInput?.show_input_text_auto_complete &&
                                <div style={{position: "absolute", width: "100%", top: "calc(100% - 10px)", left: 0, padding: 20, backgroundColor: "#eee", boxShadow: "1px 2px 3px rgba(0,0,0,0.3)", borderBottomLeftRadius: 8, borderBottomRightRadius: 8, borderTop: "1px solid rgba(0,0,0,0.1)"}}>
                                    <i onClick={()=>toggleShowCustomerInputTextAutoComplete(false)}
                                        style={{position: "absolute", top: 20, right: 20, fontSize: 13, color: "rgba(0,0,0,0.6)", cursor: "pointer"}}
                                        className="fa-solid fa-times"
                                    ></i>
                                    <ul>
                                        {
                                            customerFieldInput?.auto_complete_list?.map(each=>{
                                                return <li onClick={()=>customerOnInputSelect(each)}
                                                    style={{color: "rgba(0,0,0,0.7)", fontSize: 13, cursor: "pointer", marginBottom: 5}}>
                                                <i style={{marginRight: 10, color: "rgba(0,0,0,0.6)"}}
                                                    className="fa-solid fa-user"></i>
                                                {each?.first_name} {each?.last_name} - {each?.email}</li>
                                            })
                                        }
                                        {
                                            customerFieldInput?.auto_complete_list?.length<1 &&
                                            <p style={{padding: 10, fontSize: 13, color: "rgba(0,0,0,0.7)"}}>
                                                <i style={{marginRight: 10, color: "orange"}}
                                                    className="fa-solid fa-exclamation-triangle"></i>
                                                please enter email...
                                            </p>
                                        }
                                    </ul>
                                </div>
                            }
                        </div>
                        {
                            customerFieldInput?.include_cc &&
                            <div style={{position: "relative", zIndex: 4}}>
                                <div style={{display: "flex"}}>
                                    <span style={{color: "rgba(0,0,0,0.5)", fontSize: 13, margin: 8}}>
                                        CC:</span>
                                    <div style={{display: "flex", flexWrap: "wrap"}}>
                                    {
                                        customerFieldInput?.selected_cc?.map(each=>{
                                            return <span className="tooltip_parent" style={{padding: "5px 10px", borderRadius: 50, color: "rgba(0,0,0,0.7)", backgroundColor: "rgba(255, 255, 255, 0.76)", border: "1px solid rgba(0,0,0,0.1)", fontSize: 13, whiteSpace: "nowrap", margin: 2}}>
                                                {
                                                    (each?.first_name || each?.last_name) ?
                                                    `${each?.first_name} ${each?.last_name}` :
                                                    each?.email
                                                } 
                                                <i onClick={()=>removeCcCustomerFromToList(each)}
                                                    className="fa-solid fa-times"
                                                    style={{marginLeft: 10, color: "red", cursor: "pointer"}}
                                                ></i>
                                                <span className="tooltip" style={{textAlign: "center", top: "calc(100% - 2px)"}}>
                                                    {each?.email}
                                                </span>
                                            </span>
                                        })
                                    }
                                    <input onInput={ccCustomerOnInput}
                                        onFocus={()=>toggleShowCcCustomerInputTextAutoComplete(true)}
                                        onBlur={()=>{
                                            setTimeout(()=>{
                                                toggleShowCcCustomerInputTextAutoComplete(false);
                                            }, 500);
                                        }}
                                        value={customerFieldInput?.cc_input_text}
                                        style={{background: "none", border: "none", margin: 5}}
                                        placeholder="type here..."
                                    />
                                    </div>
                                </div>
                                {
                                    customerFieldInput?.show_cc_input_text_auto_complete &&
                                    <div style={{position: "absolute", width: "100%", top: "calc(100% - 10px)", left: 0, padding: 20, backgroundColor: "#eee", boxShadow: "1px 2px 3px rgba(0,0,0,0.3)", borderBottomLeftRadius: 8, borderBottomRightRadius: 8, borderTop: "1px solid rgba(0,0,0,0.1)"}}>
                                        <i onClick={()=>toggleShowCcCustomerInputTextAutoComplete(false)}
                                            style={{position: "absolute", top: 20, right: 20, fontSize: 13, color: "rgba(0,0,0,0.6)", cursor: "pointer"}}
                                            className="fa-solid fa-times"
                                        ></i>
                                        <ul>
                                            {
                                                customerFieldInput?.cc_auto_complete_list?.map(each=>{
                                                    return <li onClick={()=>ccCustomerOnInputSelect(each)}
                                                        style={{color: "rgba(0,0,0,0.7)", fontSize: 13, cursor: "pointer", marginBottom: 5}}>
                                                    <i style={{marginRight: 10, color: "rgba(0,0,0,0.6)"}}
                                                        className="fa-solid fa-user"></i>
                                                    {each?.first_name} {each?.last_name} - {each?.email}</li>
                                                })
                                            }
                                            {
                                                customerFieldInput?.cc_auto_complete_list?.length<1 &&
                                                <p style={{padding: 10, fontSize: 13, color: "rgba(0,0,0,0.7)"}}>
                                                    <i style={{marginRight: 10, color: "orange"}}
                                                        className="fa-solid fa-exclamation-triangle"></i>
                                                    please enter email...
                                                </p>
                                            }
                                        </ul>
                                    </div>
                                }
                            </div>
                        }
                        {
                            customerFieldInput?.include_bcc &&
                            <div style={{position: "relative", zIndex: 3}}>
                                <div style={{display: "flex"}}>
                                    <span style={{color: "rgba(0,0,0,0.5)", fontSize: 13, margin: 8}}>
                                        BCC:</span>
                                    <div style={{display: "flex", flexWrap: "wrap"}}>
                                    {
                                        customerFieldInput?.selected_bcc?.map(each=>{
                                            return <span className="tooltip_parent" style={{padding: "5px 10px", borderRadius: 50, color: "rgba(0,0,0,0.7)", backgroundColor: "rgba(255, 255, 255, 0.76)", border: "1px solid rgba(0,0,0,0.1)", fontSize: 13, whiteSpace: "nowrap", margin: 2}}>
                                                {
                                                    (each?.first_name || each?.last_name) ?
                                                    `${each?.first_name} ${each?.last_name}` :
                                                    each?.email
                                                } 
                                                <i onClick={()=>removeBccCustomerFromToList(each)}
                                                    className="fa-solid fa-times"
                                                    style={{marginLeft: 10, color: "red", cursor: "pointer"}}
                                                ></i>
                                                <span className="tooltip" style={{textAlign: "center", top: "calc(100% - 2px)"}}>
                                                    {each?.email}
                                                </span>
                                            </span>
                                        })
                                    }
                                    <input onInput={bccCustomerOnInput}
                                        onFocus={()=>toggleShowBccCustomerInputTextAutoComplete(true)}
                                        onBlur={()=>{
                                            setTimeout(()=>{
                                                toggleShowBccCustomerInputTextAutoComplete(false);
                                            }, 500);
                                        }}
                                        value={customerFieldInput?.bcc_input_text}
                                        style={{background: "none", border: "none", margin: 5}}
                                        placeholder="type here..."
                                    />
                                    </div>
                                </div>
                                {
                                    customerFieldInput?.show_bcc_input_text_auto_complete &&
                                    <div style={{position: "absolute", width: "100%", top: "calc(100% - 10px)", left: 0, padding: 20, backgroundColor: "#eee", boxShadow: "1px 2px 3px rgba(0,0,0,0.3)", borderBottomLeftRadius: 8, borderBottomRightRadius: 8, borderTop: "1px solid rgba(0,0,0,0.1)"}}>
                                        <i onClick={()=>toggleShowBccCustomerInputTextAutoComplete(false)}
                                            style={{position: "absolute", top: 20, right: 20, fontSize: 13, color: "rgba(0,0,0,0.6)", cursor: "pointer"}}
                                            className="fa-solid fa-times"
                                        ></i>
                                        <ul>
                                            {
                                                customerFieldInput?.bcc_auto_complete_list?.map(each=>{
                                                    return <li onClick={()=>bccCustomerOnInputSelect(each)}
                                                        style={{color: "rgba(0,0,0,0.7)", fontSize: 13, cursor: "pointer", marginBottom: 5}}>
                                                    <i style={{marginRight: 10, color: "rgba(0,0,0,0.6)"}}
                                                        className="fa-solid fa-user"></i>
                                                    {each?.first_name} {each?.last_name} - {each?.email}</li>
                                                })
                                            }
                                            {
                                                customerFieldInput?.bcc_auto_complete_list?.length<1 &&
                                                <p style={{padding: 10, fontSize: 13, color: "rgba(0,0,0,0.7)"}}>
                                                    <i style={{marginRight: 10, color: "orange"}}
                                                        className="fa-solid fa-exclamation-triangle"></i>
                                                    please enter email...
                                                </p>
                                            }
                                        </ul>
                                    </div>
                                }
                            </div>
                        }
                    </div>
                }
                <div style={{maxHeight: 550}}>
                    <RichTextEditorQuill 
                        currentContent={{}}
                        setContent={bodyMsgOnInput}
                        isSemanticHTMLContent={true}
                        elem_id="existing_support_ticket_reply_body_message_editor"
                    />
                </div>
                {
                    showAttachments &&
                    <div>
                        <DragAndDropFileInput 
                            input_elem_id="reply_ticket_file_attachments_input"
                            is_minimized_view={true}
                            onFilesSelected={()=>{}} />
                    </div>
                }
                <div style={{display: "flex", marginTop: 10, height: 35}}>
                    <div onClick={replyMessageOnSend} style={{backgroundColor: "darkslateblue", color: "white", width: 55, display: "flex", justifyContent: "center", alignItems: "center"}}
                        className="tooltip_parent">
                        <i style={{fontSize: 13}} className="fa-solid fa-paper-plane"></i>
                        <span style={{color: "black", fontSize: 13, textAlign: "center", left: -120, top: -35, left: "50%"}} 
                            className="tooltip">
                            Send
                        </span>
                    </div>
                    <div style={{color: "crimson", marginLeft: 20, display: "flex", justifyContent: "center", alignItems: "center"}}
                        className="tooltip_parent">
                        <i style={{fontSize: 13}} className="fa-solid fa-trash-can"></i>
                        <span style={{color: "black", fontSize: 13, textAlign: "center", left: -120, top: -35, left: "50%"}} 
                            className="tooltip">
                            delete draft
                        </span>
                    </div>
                    <div style={{color: "rgba(0,0,0,0.8)", marginLeft: 20, display: "flex", justifyContent: "center", alignItems: "center"}}
                        className="tooltip_parent">
                        <i onClick={()=>setShowAttachments(!showAttachments)}
                            style={{fontSize: 13}} className="fa-solid fa-paperclip"></i>
                        <span style={{color: "black", fontSize: 13, textAlign: "center", left: -120, top: -35, left: "50%"}} 
                            className="tooltip">
                            {
                                showAttachments ? "hide " : "show "
                            }attachments
                        </span>
                    </div>
                </div>
            </div>
        </div>
        {
            minimzeEditor &&
            <div  onClick={()=>setMinimzeEditor(false)} style={{position: "fixed", zIndex: 3, bottom: 10, left: 10, width: 40, height: 40, borderRadius: 8, backgroundColor: "black", cursor: "pointer", boxShadow: "1px 2px 3px rgba(0,0,0,0.3)", display: "flex", justifyContent: "center", alignItems: "center", border: "2px solid rgba(255,255,255,0.2)"}}>
                <i style={{color: "rgba(255,255,255,0.6)"}} className="fa-solid fa-keyboard"></i>
            </div>
        }
    </div>
}

export default TicketSupportPage;