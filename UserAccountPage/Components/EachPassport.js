import { useState } from "react";
import ConfirmDelete from "../../../components/ConfirmDelete";

const EachPassport = (props) => {

    const { index,
        each,
        show_more_passport_info,
        hide_more_passport_info,
        DeletePassport,
        startPassportEdit,
        show_add_new_passport_form
    } = props;

    const [ isToDelete, setIsToDelete ]= useState(false);

    const cancelDelete = () => {
        setIsToDelete(false);
    }

    const beginDelteAction = () => {
        setIsToDelete(true);
    }

    const confirmDeletePassport = () => {
        DeletePassport(each);
    }

    const editPassport = () => {
        startPassportEdit(each);
        show_add_new_passport_form();
    }

    return (
        <div style={{padding: 10}}>
            <div id={"show_more_passport_info_btn"+index}>
                <p style={{fontFamily: "'Prompt', sans-serif", fontSize: 13, color: "rgb(12, 109, 133)"}}>
                    <i style={{marginRight: 10, color: "rgba(0,0,0,0.4)"}} className="fa fa-passport"></i>
                    {each.holder_name}
                    <span style={{fontFamily: "'Prompt', sans-serif", fontSize: 13, color: "rgba(0,0,0,0.7)"}}
                    > , {each.passport_number}</span>
                    <span style={{fontFamily: "'Prompt', sans-serif", fontSize: 13, color: "rgba(0,0,0,0.7)"}}
                    > , {each.city} - {each.country} ...</span>
                </p>
                <p onClick={()=>show_more_passport_info(index)} 
                    style={{fontFamily: "'Prompt', Sans-serif", cursor: "pointer", fontSize: 13, borderRadius: 6, margin: "5px 0", color: "#c751b9"}}>
                    view more ...
                </p>
            </div>
            <div  id={"show_more_passport_info_container"+index} style={{display: "none"}}>
                <p style={{fontFamily: "'Prompt', sans-serif", color: "rgb(12, 109, 133)", fontSize: 13}}>
                    <i style={{marginRight: 10, color: "rgba(0,0,0,0.4)"}} className="fa fa-passport"></i>
                    {each.passport_number}</p>
                <div style={{marginLeft: 10, marginTop: 10}}>
                    <p style={{fontFamily: "'Prompt', sans-serif", fontSize: 13, color: "rgb(12, 109, 133)"}}>
                        <span style={{fontFamily: "'Prompt', sans-serif", fontSize: 13, color: "rgba(0,0,0,0.7)"}}>
                            Issued:</span> {each.issue_date}</p>
                    <p style={{fontFamily: "'Prompt', sans-serif", fontSize: 13, color: "rgb(12, 109, 133)"}}>
                        <span style={{fontFamily: "'Prompt', sans-serif", fontSize: 13, color: "rgba(0,0,0,0.7)"}}>
                            Expires:</span> {each.exp_date}</p>
                    <p style={{fontFamily: "'Prompt', sans-serif", fontSize: 13, color: "rgb(12, 109, 133)"}}>
                        <span style={{fontFamily: "'Prompt', sans-serif", fontSize: 13, color: "rgba(0,0,0,0.7)"}}>
                            Country:</span> {each.country}</p>
                    <p style={{fontFamily: "'Prompt', sans-serif", fontSize: 13, color: "rgb(12, 109, 133)"}}>
                        <span style={{fontFamily: "'Prompt', sans-serif", fontSize: 13, color: "rgba(0,0,0,0.7)"}}>
                            City:</span> {each.city}</p>
                </div>
                <div style={{marginLeft: 10, marginTop: 10, borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: 10}}>
                    <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 12, fontWeight: "bolder", marginBottom: 5, color: "rgba(0,0,0,0.7)", letterSpacing: 1}}>
                        Holder information</p>
                    <p style={{fontFamily: "'Prompt', sans-serif", fontSize: 13, color: "rgb(12, 109, 133)"}}>
                        <span style={{fontFamily: "'Prompt', sans-serif", fontSize: 13, color: "rgba(0,0,0,0.7)"}}>
                            Name:</span> {each.holder_name}</p>
                    <p style={{fontFamily: "'Prompt', sans-serif", fontSize: 13, color: "rgb(12, 109, 133)"}}>
                    <span style={{fontFamily: "'Prompt', sans-serif", fontSize: 13, color: "rgba(0,0,0,0.7)"}}>
                        DOB:</span> {each.holder_dob}</p>
                    <p style={{fontFamily: "'Prompt', sans-serif", fontSize: 13, color: "rgb(12, 109, 133)"}}>
                    <span style={{fontFamily: "'Prompt', sans-serif", fontSize: 13, color: "rgba(0,0,0,0.7)"}}>
                        Gender:</span> {each.holder_gender}</p>
                    <p style={{fontFamily: "'Prompt', sans-serif", fontSize: 13, color: "rgb(12, 109, 133)"}}>
                    <span style={{fontFamily: "'Prompt', sans-serif", fontSize: 13, color: "rgba(0,0,0,0.7)"}}>
                        Birth City:</span> {each.holder_birth_city}</p>
                </div>
                <p onClick={()=>hide_more_passport_info(index)} 
                    style={{fontFamily: "'Prompt', Sans-serif", cursor: "pointer", fontSize: 13, borderRadius: 6, margin: "5px 0", color: "#c751b9"}}>
                    view less ...
                </p>
                {
                    isToDelete &&
                    <ConfirmDelete 
                        submitFunction={confirmDeletePassport}
                        cancelFunction={cancelDelete}
                    />
                }
                {
                    !isToDelete &&
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", paddingTop: 10}}>
                        <div onClick={beginDelteAction} className="searchBtn" style={{backgroundColor: "crimson", boxShadow: "0 0 5px rgba(0,0,0,0.3)", border: "none", fontSize: 14, borderRadius: 50}}>
                            <i className="fa fa-trash" style={{marginRight: 5, color: "rgba(255,255,255,0.5)"}}></i>Delete
                        </div>
                        <div onClick={editPassport} className="searchBtn" style={{boxShadow: "0 0 5px rgba(0,0,0,0.3)", border: "none", fontSize: 14, backgroundColor: "green", borderRadius: 50}}>
                            <i className="fa fa-pencil" style={{marginRight: 5, color: "rgba(255,255,255,0.4)"}}></i>Edit
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export default EachPassport;