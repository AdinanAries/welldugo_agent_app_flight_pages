import explore_page_hero from "../../../explore_page_hero.jpg";
import { show_explore_page } from "../../../helpers/PageRoutingFuncs";

const Ads = () => {
    return (
        <div style={{position: "relative", padding: 20, paddingTop: 70}}>
            <p style={{fontSize: 12, backgroundColor: "rgba(0,0,0,0.07)", width: 40, textAlign: "center", borderRadius: 20, padding: 5, fontWeight: "bolder", position: "absolute", top: 30, left: 10}}>
                AD</p>
            <p style={{fontWeight: 1000, fontFamily: "'Prompt', sans-serif", fontSize: 19}}>
                Independent,</p>
            <p style={{marginTop: -5, fontWeight: 1000, fontFamily: "'Prompt', sans-serif", fontSize: 17 }}>
                Trave, Agent.</p>
            <p style={{maxWidth: 350, marginTop: 30, marginBottom: 10, fontFamily: "'Prompt', sans-serif", lineHeight: 1.1}}>
                You're indeed independent with,
            </p>
            <p style={{maxWidth: 350, marginBottom: 10, fontFamily: "'Prompt', sans-serif", lineHeight: 1.1}}>
                Your own prices, operational center, booking engine,
            </p>
            <p style={{maxWidth: 350, marginBottom: 20, fontFamily: "'Prompt', sans-serif", lineHeight: 1.1}}>
                and many more...
            </p>
            <div style={{textAlign: "center", fontWeight: "bolder", textDecoration: "underline", cursor: "pointer", textAlign: "center", fontSize: 16, fontFamily: "'Prompt', sans-serif"}}>
                Sign-up now
            </div>
        </div>
    )
}

export default Ads;