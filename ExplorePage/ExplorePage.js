import explore_page_hero from "../../explore_destination_img2.jpg";
import { show_home_page } from "../../helpers/PageRoutingFuncs";

export default function ExplorePage(){
    return (
        <main className="explore_page_main" style={{display: "none", backgroundImage: `url('${explore_page_hero}')`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center"}} id="explore_page">
            <div className="wrapper">
                <div style={{margin: 10, backgroundColor: "white", padding: 10, borderRadius: 5, border: "1px solid rgba(255,0,0,0.1)"}}>
                    <p style={{color: "rgba(0,0,0,0.7)", fontSize: 16, fontFamily: "'Prompt', sans-serif", fontWeight: "bolder", marginBottom: 10}}>
                        <i className="fa fa-wrench" style={{fontSize: 19, marginRight: 5}}></i>Maintenance Notice
                    </p>
                    <p style={{color: "rgba(0,0,0,0.7)", fontSize: 15}}>
                        Due to expansion of services and maintenance work, we are unable to show trip destinations at this moment. 
                        We apologize for any inconvenience
                    </p>
                </div>
                <div style={{height: 500, padding: 20, display: "flex", flexDirection: "column", justifyContent: "center", textShadow: "1px 2px 3px rgba(0,0,0,0.3)"}}>
                    <p style={{color: "white", fontWeight: 1000, fontFamily: "'Prompt', sans-serif", fontSize: 38}}>
                        Read, Travel,</p>
                    <p style={{marginTop: -9,color: "white", fontWeight: 1000, fontFamily: "'Prompt', sans-serif", fontSize: 30 }}>
                        and Become.</p>
                    <p style={{color: "white", maxWidth: 350, marginTop: 10, marginBottom: 10, fontFamily: "'Prompt', sans-serif", lineHeight: 1.1}}>
                        We've got trip ideas for you...
                    </p>
                    <div style={{backgroundColor: "rgba(0,0,0,0.4)", fontFamily: "'Prompt', sans-serif", color: "white", padding: 14}}>
                        <i className="fa fa-exclamation-triangle" style={{color: "yellow", marginRight: 10}}></i>
                        Opps! something went wrong
                    </div>
                    <div onClick={show_home_page} style={{backgroundColor: "darkslateblue", padding: 14, color: "white", cursor: "pointer", marginTop: 20, width: "fit-content", borderRadius: 50}}>
                        <i className="fa fa-home" style={{marginRight: 5, fontSize: 20,color: "rgba(255,255,255,0.4)"}}></i>Home page
                    </div>
                </div>
            </div>
        </main>
    );
}