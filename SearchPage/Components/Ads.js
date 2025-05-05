import explore_page_hero from "../../../explore_page_hero.jpg";
import { show_explore_page } from "../../../helpers/PageRoutingFuncs";

const Ads = () => {
    return (
        <div style={{height: 500, backgroundImage: `url('${explore_page_hero}')`, backgroundSize: "cover", position: "relative", backgroundRepeat: "no-repeat", backgroundPosition: "center", padding: 20, display: "flex", flexDirection: "column", justifyContent: "center"}}>
            <p style={{fontSize: 12, backgroundColor: "white", width: 40, textAlign: "center", borderRadius: 20, padding: 5, fontWeight: "bolder", position: "absolute", top: 10, right: 10}}>AD</p>
            <p style={{color: "white", fontWeight: 1000, fontFamily: "'Prompt', sans-serif", fontSize: 19}}>
                Read, Travel,</p>
            <p style={{marginTop: -5,color: "white", fontWeight: 1000, fontFamily: "'Prompt', sans-serif", fontSize: 17 }}>
                and Become.</p>
            <p style={{color: "white", maxWidth: 350, marginTop: 10, marginBottom: 10, fontFamily: "'Prompt', sans-serif", lineHeight: 1.1}}>
                We've got trip ideas for you...
            </p>
            <div onClick={show_explore_page} style={{textAlign: "center", cursor: "pointer", width:"fit-content", backgroundColor: "#c900b0", fontSize: 14, fontFamily: "'Prompt', sans-serif", color: "white", padding: 14, borderRadius: 50}}>
                <i className="fa fa-globe" style={{marginRight: 5, color: "rgba(255,255,255,0.5)"}}></i>
                Explore now
            </div>
        </div>
    )
}

export default Ads;