import smart_phone_img from "../../../smart_phone_img.jpg";

const DownloadApp = () => {
    return (
        <div style={{display: "none"}} className='between-jumbotron-and-subsections'>
            <div className="between-jumbotron-and-subsections_icon" style={{backgroundImage: `url('${smart_phone_img}')`}}></div>
            <div style={{height: "100%", padding: 20, display: "flex", flexDirection: "column", justifyContent: "center", textShadow: "1px 2px 3px rgba(0,0,0,0.2)"}}>
                <p style={{fontWeight: 1000, fontFamily: "'Prompt', sans-serif", fontSize: 38}}>
                    Get The App!</p>
                <p style={{marginTop: -9,fontWeight: 1000, fontFamily: "'Prompt', sans-serif", fontSize: 30 }}>
                    get better deals.</p>
                <p style={{maxWidth: 350, marginTop: 10, marginBottom: 10, fontFamily: "'Prompt', sans-serif", lineHeight: 1.1}}>
                    plus awsome user experience...
                </p>
                <div style={{paddingTop: 10, paddingLeft: 15, paddingBottom: 5}}>
                    <i style={{color: "darkslateblue"}} className='fa-solid fa-earth-americas'></i>
                    <select style={{border: "none", marginLeft: 5, color: "rgba(0,0,0,0.7)"}}>
                        <option value="1">(+1) United States</option>
                    </select>
                </div>
                <div style={{marginTop: 5, border: "1px solid rgba(0,0,0,0.1)", maxWidth: 300, paddingLeft: 15, borderRadius: 50}}>
                    <i style={{color: "darkslateblue"}} className="fa-solid fa-phone"></i>
                    <input style={{border: "none", padding: 15, width: "calc(100% - 20px)", background: "none"}} type="number" placeholder="Enter phone number"/>
                </div>
                <div style={{backgroundColor: "darkslateblue", textAlign: "center", boxShadow: "0 0 5px rgba(0,0,0,0.4)", padding: 14, color: "white", fontFamily: "'Prompt', sans-serif", cursor: "pointer", marginTop: 5, maxWidth: 300, borderRadius: 50}}>
                    Send Link to Phone
                </div>
            </div>
        </div> 
    );
}

export default DownloadApp;