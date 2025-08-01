import coverImg from "../../../explore_destination_img9.jpg";

const DealItem = (props) => {
    const {
        data,
    } = props;

    const {
        _id,
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
    } = data;

    let agent_id="";
    if(localStorage.getItem("agent")){
        agent_id = localStorage.getItem("agent");
    }

    const INCLUDED_ITEMS_NAME_ARRAY = data.items?.map(each=>each.name);

    return <div className="deals-list-item" style={{overflow: "hidden", cursor: "pointer", width: "calc(33% - 6px)", minHeight: 300, background: "rgb(46, 46, 46)", margin: 3, boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)"}}>
        <div style={{height: 250, backgroundImage: `url('${coverImg}')`, backgroundSize: "cover", backgroundRepeat: "no-repeat"}}>
        </div>
        <div style={{padding: 20}}>
            <h5 style={{color: "white"}}>
                {title}
            </h5>
            <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 13, color: "rgba(255,255,255,0.8)"}}>
                <i style={{fontSize: 12, marginRight: 10, color: "orange"}} className="fa fa-map-marker"></i>
                {/*<span style={{margin: 15}}>
                    <i style={{color: "rgba(255,255,255,0.5)", fontSize: 12}} 
                        className="fa-solid fa-exchange"></i>
                </span>*/}
                {travel_destination}</p>
            <a href={`/deals?&ag=${agent_id}&dlid=${_id}`} style={{textDecoration: "none"}}>
                <p style={{color: "orange", textDecoration: "underline", marginTop: 10,  fontSize: 13, cursor: "pointer"}}>
                    View Details
                    <i style={{marginLeft: 10, color: "rgba(255,255,255,0.6)"}}
                        className="fa-solid fa-arrow-right"></i>
                </p>
            </a>
            <div style={{borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: 10, paddingTop: 10}}>
                <h4 style={{fontFamily: "'Prompt', Sans-serif", color: "skyblue"}}>
                    $ {total_price?.toFixed(2)}</h4>
                <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 13, color: "rgba(255,255,255,0.8)"}}>
                    {max_num_of_adults} adult(s), {max_num_of_children} child(ren), {max_num_of_infants} infants</p>
                <div>
                    <p style={{color: "rgba(255,255,255,0.6)", fontSize: 13}}>
                        Includes:</p>
                    <div style={{display: "flex", justifyContent: "center", flexWrap: "wrap"}}>
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
                                        <div>
                                            <p style={{textAlign: "center", margin: 5, color: "orange", fontSize: 12}}>
                                                {each?.toString().replaceAll("_", " ")}</p>
                                            <div style={{width: 50, height: 50, borderRadius: "100%", backgroundColor: "white", display: "flex", justifyContent: "center", alignItems: "center", margin: 5}}>
                                                <i style={{fontSize: 20}} className={('fa-solid fa-'+_icon)}></i>
                                            </div>
                                        </div>
                                    }
                                </>
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default DealItem;