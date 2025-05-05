import mobile_app_iconsvg from "../../../icons/mobile_app_icon.svg";
import { show_prompt_on_Bot_AD_tips_popup } from "../../../components/HPSupport";
import CONSTANTS from "../../../Constants/Constants";

function DownloadMobileApp(){
    const msgs = [
        "Let me reach out to IT about this one",
    ]
    return (
        <div className="wrapper">
            <div className="download_mobile_section">
                <div className="download_mobile_app_section_container">
                    <div style={{backgroundImage: `url('${mobile_app_iconsvg}')`, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center",
                        height: 70, width: 70, marginTop: 5, marginBottom: 5}}>

                    </div>
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "flex-end"}}>
                        <p className="download_mobile_app_title" style={{color: "#c751b9", fontWeight: "bolder", marginBottom: 5, fontFamily: "Courgette", fontFamily: "'Prompt', Sans-serif"}}>
                            Get Our Mobile App</p>
                        <p style={{color: "rgba(0,0,0,0.6)", fontWeight: "bolder", fontSize: 15}}>
                            For better user experience, we recommend that you download our mobile app.</p>
                    </div>
                    <div onClick={()=>show_prompt_on_Bot_AD_tips_popup(msgs[Math.floor(Math.random() * msgs.length)], CONSTANTS.bot.prompt_types.warn)} className="download_mobile_app_btn_container">
                        <div style={{cursor: "pointer", textAlign: "center", color: "white", backgroundColor: "rgb(43, 52, 61)", padding: "14px", borderRadius: 50, minWidth: 120, boxShadow: "1px 2px 5px rgba(0,0,0,0.5)"}}>
                            <i className="fa fa-download" style={{marginRight: 7, color: "rgba(255,255,255,0.4)"}}></i>
                            get the app
                        </div>
                    </div>
                </div>
                <div style={{padding: 20, margin: 10, borderRadius: 20, border: "1px solid rgba(255,0,0,0.2)", backgroundColor: "rgba(255,0,0,0.2)", }}>
                    <p style={{color: "rgba(0,0,0,0.7)", fontSize: 16, fontFamily: "'Prompt', sans-serif", fontWeight: "bolder", marginBottom: 10}}>
                        <i className="fa fa-wrench" style={{fontSize: 19, marginRight: 5}}></i>Maintenance Notice
                    </p>
                    <p style={{color: "rgba(0,0,0,0.7)", fontSize: 15}}>
                        Due to expansion of services and maintenance work, Some site features are disabled at the moment.
                        Our goal is to provide you with the best experience while you shop flights on our portal.
                        We are constantly working hard on our products and technologies to ensure seamless workflows.
                        We apologize for any inconvenience!
                    </p>
                </div>
            </div>
        </div>
    );
}

export default DownloadMobileApp;