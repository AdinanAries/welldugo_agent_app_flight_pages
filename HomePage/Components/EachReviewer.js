
import { ellipsify } from "../../../helpers/general";

const EachReviewer = (props) => {
    const { each, show_selected_review, i } = props
    return (
        <div onClick={()=>show_selected_review(i)} style={{margin: "0 7.5px"}} className="home_page_other_reviewer">
            <div className="home_page_other_reviewer_bubble speech-bubble-bottom">
                <p style={{fontSize: 15, fontWeight: "bolder", textAlign: "center", fontFamily: "'Prompt', Sans-serif", color: '#c751b9'}}>
                    {each.name}
                </p>
                <p style={{fontSize: 13, textAlign: "center", fontFamily: "'Prompt', Sans-serif", color: 'rgba(0,83,0,0.7)'}}>
                    {each.date}
                </p>
                <p style={{fontSize: 13, marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid rgba(0,0,0,0.1)", textAlign: "center", fontFamily: "'Prompt', Sans-serif", color: 'rgba(0,83,0,0.7)'}}>
                    {each.city}
                </p>
                <p style={{color: "rgba(0,0,0,0.6)", fontFamily: "'Prompt', Sans-serif"}}>
                    {each.msg}
                </p>
            </div>
            <div style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                <div style={{width: 60, height: 60, overflow: 'hidden', borderRadius: "100%", backgroundColor: "rgba(0,0,0,0.2)", boxShadow: "1px 2px 4px rgba(0,0,0,0.4)"}}>
                    <img src={each.img} style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: "center"}} alt={"to do"} />
                </div>
            </div>
            <p style={{marginTop: 15, textAlign: "center", color: "rgba(0,0,0,0.6)", fontSize: 15, fontFamily: "'Prompt', Sans-serif"}}>
                {ellipsify(each.name.split(" ")[0], 5)}
            </p>
            <p style={{fontSize: 14, textAlign: "center", fontFamily: "'Prompt', Sans-serif", color: '#c751b9'}}>
                {parseFloat(each.rated).toFixed(1)}
            </p>
        </div>
    )
}

export default EachReviewer;