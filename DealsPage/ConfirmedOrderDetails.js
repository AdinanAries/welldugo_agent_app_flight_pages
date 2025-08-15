import { calculate_age } from "../../helpers/general";

const ConfirmedOrderDetails = (props) => {

    const {
        data
    } = props;

    console.log(data);

    const {
        _id,
        ref_number,
        oc_user_id,
        package_info,
        payment_intent,
        booking_intent,
        passengers,
        prices,
    } = data;

    const {
        title,
        travel_destination,
        total_price,
        cover_picture,
        html_description,
        items,
        max_num_of_adults,
        max_num_of_children,
        max_num_of_infants,
        type,
        view_template,
        view_theme,
        price_currency,
        start_date,
        end_date,
        include_adults,
        include_children,
        include_infants,
        text_editor_content,
    } = package_info;

    const {
        total_amount,
        base_amount,
        tax_amount,
        extras,
        total_currency,
        base_currency,
        tax_currency,
    } = prices;

    let prices_overall_total = total_amount;
    for(let p=0; p<extras.length; p++){
        prices_overall_total+=extras[p].total;
    }

    const INCLUDED_ITEMS_NAME_ARRAY = items?.map(each=>each.name);

    return <div style={{position: "fixed", top: 69, left: 0, height: "calc(100vh - 69px)", width: "100vw", background: "white", zIndex: 100}}>
            <div className="wrapper">
                <div style={{padding: "0 10px"}}>
                    {
                        <p className="pop-up-close-btn" onClick={()=>window.location.reload()} 
                            style={{cursor: "pointer", zIndex: 1, color: "rgb(255,0,0)", fontSize: 33, position: "absolute", right: 10, top: 10}}>
                            &times;
                        </p>
                    }
                    <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 14, fontWeight: "bolder", marginTop: 20}}>
                        <i style={{marginRight: 10, color: "orange"}} className="fa-solid fa-ticket"></i>
                        Reference Number:
                        <span style={{fontFamily: "'Prompt', Sans-serif", marginLeft: 5, color: "rgba(0,0,0,0.7)", fontSize: 13}}>
                            {ref_number}
                        </span>
                    </p>
                    <p style={{display: "none", fontFamily: "'Prompt', Sans-serif", fontSize: 13}}>
                        <i style={{color: "rgba(0,0,0,0.5)", marginRight: 10}}
                            className="fa-solid fa-temperature-high"></i>
                        New York (Thu Mar 23) -
                        <span style={{margin: "0 5px", fontSize: 14, fontFamily: "'Prompt', Sans-serif", fontWeight: "bolder"}}>
                            56°</span>
                        <span style={{margin: "0 5px", fontSize: 14, fontFamily: "'Prompt', Sans-serif"}}>
                            | heavy rain</span>
                    </p>
                </div>
                <div>
                    <div style={{borderBottom: "1px dashed rgba(0,0,0,0.2)", padding: 10, marginTop: 10}}>
                        <p style={{fontSize: 13, fontWeight: "bolder", color: "rgba(0,0,0,0.7)", marginBottom: 10}}>
                            <i style={{marginRight: 10, color: "rgba(0,0,0,0.5)", fontSize: 13}}
                                className='fa-solid fa-list'></i>
                            Package Details
                        </p>
                        <div>
                            <p style={{fontSize: 13, color: "rgba(0,0,0.0.7)"}}>
                                <span style={{fontSize: 13, fontWeight: "bolder"}}>
                                    Title:</span>
                                <span style={{marginLeft: 10, fontSize: 13}}>
                                    {title}</span>
                            </p>
                            <p style={{fontSize: 13, color: "rgba(0,0,0.0.7)"}}>
                                <span style={{fontSize: 13, fontWeight: "bolder"}}>
                                    Destinaton:</span>
                                <span style={{marginLeft: 10, fontSize: 13}}>
                                    {travel_destination}</span>
                            </p>
                            <p style={{fontSize: 13, color: "rgba(0,0,0.0.7)"}}>
                                <span style={{fontSize: 13, fontWeight: "bolder"}}>
                                    Start Date:</span>
                                <span style={{marginLeft: 10, fontSize: 13}}>
                                    {start_date}</span>
                            </p>
                            <p style={{fontSize: 13, color: "rgba(0,0,0.0.7)"}}>
                                <span style={{fontSize: 13, fontWeight: "bolder"}}>
                                    End Date:</span>
                                <span style={{marginLeft: 10, fontSize: 13}}>
                                    {end_date}</span>
                            </p>
                            <p style={{fontSize: 13, color: "rgba(0,0,0.0.7)", display: "flex", marginTop: 10}}>
                                <span style={{fontSize: 13, fontWeight: "bolder"}}>
                                    Includes:</span>
                                <span style={{fontSize: 13}}>
                                   {
                                        INCLUDED_ITEMS_NAME_ARRAY?.map(each=>{
                                            
                                            let all_icons = {
                                                flight: "plane",
                                                stay: "hotel",
                                                rental_car: "car",
                                                event: "ticket",
                                                cruise: "ship",
                                                bus_tour: "bus",
                                                restaurant: "spoon",
                                                other: "list-ol"
                                            };
                                            let _icon = all_icons[each];
                                            return <>
                                                {
                                                    each &&
                                                    <span style={{marginLeft: 10, fontSize: 13}}>
                                                        <i style={{marginRight: 5, color: "rgba(0,0,0,0.5)"}} className={('fa-solid fa-'+_icon)}></i>
                                                        {each?.toString().replaceAll("_", " ")},
                                                    </span>
                                                }
                                            </>
                                        })
                                    }
                                </span>
                            </p>
                        </div>
                    </div>
                    <div style={{borderBottom: "1px dashed rgba(0,0,0,0.2)", padding: 10, marginTop: 10}}>
                        <p style={{fontSize: 13, fontWeight: "bolder", color: "rgba(0,0,0,0.7)", marginBottom: 10}}>
                            <i style={{marginRight: 10, color: "rgba(0,0,0,0.5)", fontSize: 13}}
                                className='fa-solid fa-users'></i>
                            Customer Details
                        </p>
                        <div>
                            {
                                passengers.map(each=>{
                                    return <p style={{fontSize: 13, color: "rgba(0,0,0.0.7)", display: "flex"}}>
                                        <span style={{fontSize: 13, fontWeight: "bolder"}}>
                                            {each?.family_name} {each?.given_name}:</span>
                                        <span style={{marginLeft: 10, fontSize: 13}}>
                                            {each?.email}<br/>
                                            {each?.phone_number}<br/>
                                            {calculate_age(each.born_on)} year(s), {each?.gender}
                                        </span>
                                    </p>
                                })
                                
                            }
                        </div>
                    </div>
                    <div style={{borderBottom: "1px dashed rgba(0,0,0,0.2)", padding: 10, marginTop: 10}}>
                        <p style={{fontSize: 13, fontWeight: "bolder", color: "rgba(0,0,0,0.7)", marginBottom: 10}}>
                            <i style={{marginRight: 10, color: "rgba(0,0,0,0.5)", fontSize: 13}}
                                className='fa-solid fa-credit-card'></i>
                            Payment Details
                        </p>
                        <div>
                            <p style={{fontSize: 13, color: "rgba(0,0,0.0.7)"}}>
                                <span style={{fontSize: 13, fontWeight: "bolder"}}>
                                    Base Price:</span>
                                <span style={{marginLeft: 10, fontSize: 13}}>
                                    ${base_amount}</span>
                            </p>
                            <p style={{fontSize: 13, color: "rgba(0,0,0.0.7)"}}>
                                <span style={{fontSize: 13, fontWeight: "bolder"}}>
                                    Tex:</span>
                                <span style={{marginLeft: 10, fontSize: 13}}>
                                    ${tax_amount}</span>
                            </p>
                            <p style={{fontSize: 13, color: "rgba(0,0,0.0.7)"}}>
                                <span style={{fontSize: 13, fontWeight: "bolder"}}>
                                    Sub Total:</span>
                                <span style={{marginLeft: 10, fontSize: 13}}>
                                    ${total_amount}</span>
                            </p>
                            <div style={{paddingLeft: 20}}>
                                <p style={{fontSize: 13, color: "rgba(0,0,0,0.6)"}}>
                                    <span style={{fontSize: 13, fontWeight: "bolder"}}>
                                        Extra Fees:</span>
                                </p>
                                {
                                    extras.map(each=>{
                                        return <p style={{fontSize: 13, color: "rgba(0,0,0.0.7)"}}>
                                            <span style={{fontSize: 13}}>
                                                {each.name}:</span>
                                            <span style={{marginLeft: 10, fontSize: 13}}>
                                                ${each.total}</span>
                                        </p>
                                    })
                                }
                            </div>
                            <p style={{fontSize: 14, color: "blue", marginTop: 5}}>
                                <span style={{fontSize: 14, fontWeight: "bolder"}}>
                                    Total:</span>
                                <span style={{marginLeft: 10, fontSize: 14}}>
                                    ${prices_overall_total}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
}

export default ConfirmedOrderDetails;