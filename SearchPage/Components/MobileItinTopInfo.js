import CONSTANTS from "../../../Constants/Constants";
import { get_short_date_MMMDD } from "../../../helpers/general";

const MobileItinTopInfo = (props) => {
    const { SEARCH_OBJ } = props;

    let is_one_way=true;
    if(SEARCH_OBJ.type===CONSTANTS.round_trip.toLocaleLowerCase()){
        is_one_way=false;
    }
    let s_date = SEARCH_OBJ.itinerary.departure.date + " 12:00:00";
    const START_DATE=get_short_date_MMMDD(s_date);
    let e_date = SEARCH_OBJ.itinerary.arrival.date + " 12:00:00";
    let END_DATE;
    if(!is_one_way)
        END_DATE=get_short_date_MMMDD(e_date);

    return (
        <div id="itinerary_and_filter_icon">
            <div>
                <p style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.7)", fontWeight: "bolder"}}>
                    {SEARCH_OBJ.origin_city}
                    <span style={{margin: "0 10px", color: "rgba(0,0,0,0.4)"}}>
                        <i className={is_one_way?"fa-solid fa-arrow-right":"fa-solid fa-exchange"}></i></span>
                    {SEARCH_OBJ.destination_city}
                </p>
                <p style={{fontSize: 13, color: "rgba(0,0,0,0.7)", marginTop: 2}}>
                    {START_DATE}{!is_one_way && ` - ${END_DATE}`}</p>
            </div>
            <div onClick={()=>document.getElementById('search_list_main__settings_section').style.display='block'}
                style={{display: "flex", alignItems: "center"}}>
                <p style={{marginRight: 10, display: "flex", justifyContent: "center", alignItems: "center", width: 34, height: 34, backgroundColor: "rgba(0,0,0,0.1)", borderRadius: "100%"}}>
                    <i className="fa fa-sliders" aria-hidden="true"></i>
                </p>
                <div>
                    <p style={{fontFamily: "'Prompt', Sans-serif", color: "rgb(11, 71, 95)", fontSize: 14}}>
                        Filters</p>
                    <p style={{fontFamily: "'Prompt', Sans-serif", color: "rgb(11, 71, 95)", fontSize: 13}}>
                        & Sorting</p>
                </div>
            </div>
        </div>
    );
}

export default MobileItinTopInfo;