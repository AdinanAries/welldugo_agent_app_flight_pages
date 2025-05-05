import { useEffect } from "react";
import { obj_has_empty_prop } from "../../../helpers/general";
import CONSTANTS from "../../../Constants/Constants";

const PassengerCard = (props) => {
    const { given_name, family_name, id, infant_passenger_id, born_on } = props.passenger;
    let passenger_type = props?.passenger?.type;
    let incomplete_passenger = obj_has_empty_prop(props.passenger);
    let adults_arr_infants_select=Array.from(props.availableAdultPassengersForInfants);

    //For adult passengers
    const infant = props.allInfantsPassengers.find( psngr => psngr.id === infant_passenger_id);
    //For infant passengers
    const adult = adults_arr_infants_select.find( psngr => psngr.infant_passenger_id === id);
    if(adult){
        let i = adults_arr_infants_select.findIndex( psngr => psngr.id === adult.id );
        adults_arr_infants_select.splice(i,1);
        adults_arr_infants_select.unshift(adult);
    }

    useEffect(() => {

    }, []);

    return (
        <div className="checkout_passenger_card" style={{position: "relative", border: "1px dashed rgba(0,0,0,0.2)", width: "calc(50% - 5px)", borderRadius: 8, marginTop: 7}}>
            <div onClick={()=>props.selectPassengerCard(props.index)} style={{cursor: "pointer", padding: 10, backgroundColor: "rgba(0,0,0,0.07)"}}>
                <p style={{position: "absolute", top: -5, right: -12, color: "rgba(0,0,0,0.2)", background: "white"}}>
                    <i className="fa-solid fa-pencil" style={{marginRight: 10}}></i></p>
                {
                    passenger_type &&
                    <div style={{marginBottom: 10, display: "flex", alignItems: "center"}}>
                        <p>
                            <i style={{color: "green", marginRight: 10, fontSize: 12}} className="fa-solid fa-check"></i>
                        </p>
                        <p style={{fontSize: 12, color: "rgba(0,0,0,0.6)", fontFamily: "'Prompt', Sans-serif"}}>
                            {passenger_type.replaceAll("_", " ")}:
                            {(passenger_type.trim()==="adult") && " 18+ years"}
                            {(passenger_type.trim()==="child") && " 2 - 17 years"}
                            {(passenger_type.trim()==="infant_without_seat") && " younger than 2"}
                        </p>
                    </div>
                }
                <p style={{fontSize: 14, color: "darkslateblue", fontFamily: "'Prompt', Sans-serif"}}>
                { 
                    ((born_on && props.age <= CONSTANTS.infant_age_threshold) 
                    || (passenger_type && passenger_type.trim()==="infant_without_seat")) ?
                        <i className="fa-solid fa-baby" 
                            style={{marginRight: 10, fontSize: 18, color: "rgba(0,0,0,0.4)"}}></i> : 
                        <i className="fa-solid fa-user" 
                            style={{marginRight: 10, color: "rgba(0,0,0,0.4)"}}></i>
                }
                    {given_name || "First and"} {family_name || "Last name"} 
                    <span style={{color: "rgba(0,0,0,0.5)", fontSize: 13}}> {(props?.age) ? `, ${props?.age} year(s)`: ""}</span>
                </p>
                <p style={{padding: 10, textAlign: "center", borderRadius: 50, boxShadow: "1px 2px 3px rgba(0,0,0,0.3)", backgroundColor: "rgb(23, 87, 148)", color: "white", fontFamily: "'Prompt', Sans-serif", fontSize: 12, marginTop: 10}}>
                    Click here to open this passenger's form
                </p>
            </div>
            {
                incomplete_passenger ? 
                    <div style={{padding: 10, textAlign: "center", color: "rgba(0,0,0,0.6)", borderTop: "1px solid rgba(0,0,0,0.1)", background: "rgba(255,0,0,0.1)", fontSize: 13, fontFamily: "'Prompt', Sans-serif"}}>
                        <i style={{marginRight: 10, color: "crimson"}} className="fa-solid fa-exclamation-triangle"></i>
                        Uncompleted form. Please edit.
                    </div> :
                    <div style={{paddingTop: 10, padding: 10, textAlign: "center", color: "rgba(0,0,0,0.6)", borderTop: "1px solid rgba(0,0,0,0.1)", background: "rgba(0,255,0,0.1)", fontSize: 13, fontFamily: "'Prompt', Sans-serif"}}>
                        <i style={{marginRight: 10, color: "green"}} className="fa-solid fa-check"></i>
                        Form has been completed
                    </div>
            }{
                (infant_passenger_id && infant) ?
                    (infant?.given_name) && <div style={{textAlign: "center", marginBottom: 10, color: "rgba(0,0,0,0.6)", fontSize: 13, fontFamily: "'Prompt', Sans-serif"}}>
                        <i style={{marginRight: 10, color: "green", fontSize: 18}} className="fa-solid fa-baby"></i>
                        Responsible for <span style={{color: "darkslateblue", fontSize: 14, fontFamily: "'Prompt', Sans-serif"}}>
                            {infant?.given_name} {infant?.family_name}</span>
                    </div> : ""
            }{ 
                ((born_on && props.age <= CONSTANTS.infant_age_threshold) ||
                (passenger_type.trim()==="infant_without_seat")) ?  
                    <div style={{backgroundColor: "rgba(0,0,0,0.07)"}}>
                        <p style={{padding: 10, fontFamily: "'Prompt', Sans-serif"}}>
                            <span style={{color: "rgba(0,0,0,0.7)", fontSize: 13, fontFamily: "'Prompt', Sans-serif"}}>
                                Select adult responsible:
                            </span>
                        </p>
                        {(!adult) ? <select
                                onChange={props.setResponsibleAdultForInfant} 
                                style={{width: "calc(100%)", background: "none", color: "rgba(255,0,0,0.6)", textAlign: "center", padding: 10, border: "1px solid rgba(0,0,0,0.1)", fontFamily: "'Prompt', Sans-serif", fontSize: 14}}>
                                <option>Select Adult</option>
                                { adults_arr_infants_select.map( (each, i) => (each.given_name) && <option key={each.id} 
                                    value={`${id}${CONSTANTS.special_str_separator}${each.id}`}>
                                    {each.given_name} {each.family_name}</option>) }
                                
                            </select> : <select
                                onChange={props.setResponsibleAdultForInfant} 
                                style={{width: "calc(100%)", background: "none", color: "rgba(255,0,0,0.6)", textAlign: "center", padding: 10, border: "1px solid rgba(0,0,0,0.1)", fontFamily: "'Prompt', Sans-serif", fontSize: 14}}>
                                { adults_arr_infants_select.map( (each, i) =>  (each.given_name) && <option key={each.id} 
                                    value={`${id}${CONSTANTS.special_str_separator}${each.id}`}>
                                    {each.given_name} {each.family_name}</option>) }
                                
                            </select>
                        }
                    </div>
                        
                    : "" 
            }
        </div>
    );
}

export default PassengerCard;