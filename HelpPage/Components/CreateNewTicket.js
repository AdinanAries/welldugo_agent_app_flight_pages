import RichTextEditorQuill from "../../../components/RichTextEditorQuill";
import DragAndDropFileInput from "../../../components/DragAndDropFileInput";
import { saveSupportTicket } from "../../../services/agentServices";
import { useState } from "react";

const CreateNewTicket = (props) => {

    const {
        goBackFunction,
        userDetails,
        callbackFunction,
    } = props;

    const EmailAutoCompleteList = []

    let agent_id = "";
    if(window.localStorage.getItem("agent"))
        agent_id = window.localStorage.getItem("agent");

    const [ customerFieldInput, setCustomerFieldInput ] = useState({
        include_cc: false,
        include_bcc: false,
        selected_to: [],
        show_input_text_auto_complete: false,
        input_text: "",
        auto_complete_list: [],
        selected_cc: [],
        show_cc_input_text_auto_complete: false,
        cc_input_text: "",
        cc_auto_complete_list: [],
        selected_bcc: [],
        show_bcc_input_text_auto_complete: false,
        bcc_input_text: "",
        bcc_auto_complete_list: [],
    });
    const [ formData, setFormData ] = useState({
        agent_id: agent_id,
        ticket_number: "",
        customer_user_id: userDetails?._id,
        customer_first_name: userDetails?.first_name,
        customer_last_name: userDetails?.last_name,
        customer_email: userDetails?.email,
        title: "",
        category: "Uncategorized",
        status: "New Ticket",
        messages: [{
            who: "customer", //["customer", "agent"]
            from: [{
                first_name: userDetails?.first_name,
                last_name: userDetails?.last_name,
                email: userDetails?.email,
            }], 
            to: [], 
            to_cc: [], 
            to_bcc: [], 
            text_content: "", 
            attachments: [], 
            time_stamp: ""
        }],
        reply_draft: {},
    });

    const returnAutoCompleteListItems = (input_txt) => {
        let names_list = input_txt?.split(" ");
        let _last_name = (names_list?.length>1 ? names_list[1] : "");
        return EmailAutoCompleteList?.filter(each=>(
                each?.email?.toLocaleLowerCase()?.trim()?.includes(input_txt?.toLocaleLowerCase()?.trim()) ||
                each?.first_name?.toLocaleLowerCase()?.trim()?.includes(input_txt?.toLocaleLowerCase()?.trim()) ||
                each?.last_name?.toLocaleLowerCase()?.trim()?.includes(input_txt?.toLocaleLowerCase()?.trim()) ||
                (each?.first_name?.toLocaleLowerCase()?.trim()?.includes(names_list[0]?.toLocaleLowerCase()?.trim()) && each?.last_name?.toLocaleLowerCase()?.trim()?.includes(_last_name?.toLocaleLowerCase()?.trim()))
            ))
    }

    // title
    const titleOnInput = (e) => {
        setFormData(prevState=>({
            ...prevState,
            title: e.target.value
        }));
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
        // Post Data
        let customer_user_id = formData?.customer_user_id;
        let customer_first_name = formData?.customer_user_id;
        let customer_last_name = formData?.customer_user_id;
        let customer_email = formData?.customer_email;
        if(!customer_email){
            customer_user_id = (cust_obj?._id || "");
            customer_first_name = (cust_obj?.first_name || "");
            customer_last_name = (cust_obj?.last_name || "");
            customer_email = (cust_obj?.email || "");
        }
        let messages = formData?.messages;
        if(messages[0].to?.filter(each=>each?.email===cust_obj?.email)?.length<1){
            messages[0].to?.push(cust_obj);
        }
        setFormData({
            ...formData,
            customer_first_name,
            customer_last_name,
            customer_user_id,
            customer_email,
            messages
        });
    }

    const removeCustomerFromToList = (cust_obj) => {
        let selected_to = customerFieldInput?.selected_to?.filter(each=>each?.email!==cust_obj?.email);
        setCustomerFieldInput({
            ...customerFieldInput,
            selected_to,
        });
        // Post Data
        let messages = formData?.messages;
        messages[0].to = messages[0].to.filter(each=>each?.email!==cust_obj?.email);
        if(messages[0].to.length<1){
            setFormData(prevState=>({
                ...prevState,
                customer_first_name: "",
                customer_last_name: "",
                customer_user_id: "",
                customer_email: "",
                messages,
            }));
        }else{
            setFormData(prevState=>({
                ...prevState,
                messages,
            }));
        }
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
        // Post Data
        let messages = formData?.messages;
        if(messages[0].to_cc?.filter(each=>each?.email===cust_obj?.email)?.length<1){
            messages[0].to_cc?.push(cust_obj);
        }
        setFormData({
            ...formData,
            messages
        });
        
    }

    const removeCcCustomerFromToList = (cust_obj) => {
        let selected_cc = customerFieldInput?.selected_cc?.filter(each=>each?.email!==cust_obj?.email);
        setCustomerFieldInput({
            ...customerFieldInput,
            selected_cc,
        });
        // Post Data
        let messages = formData?.messages;
        messages[0].to_cc = messages[0].to_cc.filter(each=>each?.email!==cust_obj?.email);
        setFormData(prevState=>({
            ...prevState,
            messages,
        }));
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
        // Post Data
        let messages = formData?.messages;
        if(messages[0].to_bcc?.filter(each=>each?.email===cust_obj?.email)?.length<1){
            messages[0].to_bcc?.push(cust_obj);
        }
        setFormData({
            ...formData,
            messages
        });
        
    }

    const removeBccCustomerFromToList = (cust_obj) => {
        let selected_bcc = customerFieldInput?.selected_bcc?.filter(each=>each?.email!==cust_obj?.email);
        setCustomerFieldInput({
            ...customerFieldInput,
            selected_bcc,
        });
        // Post Data
        let messages = formData?.messages;
        messages[0].to_bcc = messages[0].to_bcc.filter(each=>each?.email!==cust_obj?.email);
        setFormData(prevState=>({
            ...prevState,
            messages,
        }));
    }

    const toggleShowBccCustomerInputTextAutoComplete = (__bool) => {
        setCustomerFieldInput(prevState=>({
            ...prevState,
            bcc_input_text: "",
            bcc_auto_complete_list: [],
            show_bcc_input_text_auto_complete: __bool,
        }));
    }

    // category
    const categoryOnInput = (e) => {
        setFormData(prevState=>({
            ...prevState,
            category: e.target?.value
        }));
    }

    // status
    const statusOnInput = (e) => {
        setFormData(prevState=>({
            ...prevState,
            status: e.target?.value
        }));
    }

    // ticket body message
    const bodyMsgOnInput = (__editor_content) => {
        let messages = formData?.messages;
        messages[0].text_content = __editor_content;
        setFormData(prevState=>({
            ...prevState,
            messages
        }));
    }

    const createTicketOnSubmit =  async () => {
        console.log(formData);
        if(
            !formData?.title ||
            !formData?.customer_email ||
            !formData?.category ||
            !formData?.status ||
            formData?.messages?.length < 1
        ){
            alert("Please make sure to add Title, Receipient Email Address, Category, Status, and Body Message")
            return;
        }
        let _res = await saveSupportTicket(formData);
        if(_res?._id){
            console.log(_res);
            callbackFunction(_res);
        }
    }

    return <div style={{backgroundColor: "white", minHeight: "100vh"}}>
        <div style={{padding: 20}}>
            <span onClick={goBackFunction} style={{textDecoration: "underline", cursor: "pointer", fontSize: 13, color: "green"}}>
                <i style={{marginRight: 10}}
                    className="fa-solid fa-arrow-left"></i>
                Go Back
            </span>
        </div>
        <div style={{padding: 5}}>
            <div style={{backgroundColor: "rgba(0,0,0,0.07)", padding: 20, borderRadius: 8, position: "relative", zIndex: 5}}>
                <p style={{fontSize: 13, marginBottom: 10}}>
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
                        <span className="tooltip_parent" style={{padding: "5px 10px", borderRadius: 50, color: "rgba(0,0,0,0.7)", backgroundColor: "rgba(255, 255, 255, 0.76)", border: "1px solid rgba(0,0,0,0.1)", fontSize: 13, whiteSpace: "nowrap", margin: 2}}>
                            Support Helpdesk
                            <span className="tooltip" style={{textAlign: "center", top: "calc(100% - 2px)"}}>
                                support@email.com
                            </span>
                        </span>
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
                <div style={{backgroundColor: "rgba(0,0,0,0.07)", padding: "10px 20px", borderRadius: 8, marginTop: 5, position: "relative", zIndex: 4}}>
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
                <div style={{backgroundColor: "rgba(0,0,0,0.07)", padding: "10px 20px", borderRadius: 8, marginTop: 5, position: "relative", zIndex: 3}}>
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
            <div style={{marginTop: 5, backgroundColor: "rgba(0,0,0,0.07)", padding: 20, borderRadius: 8}}>
                <p style={{fontSize: 13, marginBottom: 10}}>
                    <i style={{marginRight: 10, color: "rgba(0,0,0,0.5)"}}
                        className="fa-solid fa-list-check"></i>
                    Category</p>
                <select onInput={categoryOnInput} 
                    value={formData?.category}
                    style={{border: "none", fontSize: 13, background: "none", width: "100%"}}>
                    <option>Uncategorized</option>
                    <option>Failed Booking</option>
                    <option>Payment Issues</option>
                    <option>General Question</option>
                </select>
            </div>
            <div style={{backgroundColor: "rgba(0,0,0,0.07)", padding: 20, borderRadius: 8, marginTop: 5}}>
                <p style={{fontSize: 13, marginBottom: 10}}>
                    <i style={{marginRight: 10, color: "rgba(0,0,0,0.5)"}}
                        className="fa-solid fa-header"></i>
                    Title</p>
                <input onInput={titleOnInput}
                    value={customerFieldInput?.title}
                    style={{background: "none", border: "none", margin: 5, width: "100%"}}
                    placeholder="type here..."
                />
            </div>
            <div style={{marginTop: 20}}>
                <p style={{fontSize: 13, marginBottom: 10, marginLeft: 15}}>
                    <i style={{marginRight: 10, color: "rgba(0,0,0,0.5)"}}
                        className="fa-solid fa-paragraph"></i>
                    Description</p>
                <RichTextEditorQuill 
                    currentContent={{}}
                    setContent={bodyMsgOnInput}
                    isSemanticHTMLContent={true}
                    elem_id="new_support_ticket_body_message_editor" 
                />
            </div>
            <div style={{marginTop: 5}}>
                <DragAndDropFileInput 
                    input_elem_id="create_new_ticket_file_attachments_input"
                    onFilesSelected={()=>{}} />
            </div>
            <div style={{display: "flex", justifyContent: "space-between", marginTop: 10}}>
                <div onClick={createTicketOnSubmit} className="standard-button" style={{padding: 20, color: "white", cursor: "pointer", borderRadius: 0, backgroundColor: "darkblue"}}>
                    <i style={{marginRight: 10, color: "rgba(255,255,255,0.5)"}}
                        className="fa-solid fa-plus"></i>
                    Create
                </div>
                <div onClick={goBackFunction} className="standard-button" style={{backgroundColor: "crimson", color: "white", cursor: "pointer", padding: 20, borderRadius: 0}}>
                    Cancel
                </div>
            </div>
        </div>
    </div>
}

export default CreateNewTicket;