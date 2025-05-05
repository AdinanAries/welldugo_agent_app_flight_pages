import NotLoggedIn from '../../components/NotLoggedIn';

import trips_page_bg from "../../icons/trips_page_bg.svg";

function TripsPage(){
    return(
        <main id="trips_page" style={{display: "none"}}>
            <div className="wrapper">
                <div style={{padding: "40px 5px"}}>
                    <p style={{marginLeft: 20, fontSize: 30, fontWeight: "bolder", color: "rgba(0,0,0,0.8)"}}>Trips</p>
                    <div style={{display: "none"}}>
                        <NotLoggedIn msg={"You must login to see your trips"}/>
                    </div>
                    <div style={{marginTop: 20}}>
                        <div style={{width: 200, height: 200, backgroundImage: `url(${trips_page_bg})`, backgroundSize: "contain", backgroundRepeat: "no-repeat"}}>
                        </div>
                        <div style={{marginTop: 10, backgroundColor: "white", padding: 15, borderRadius: 5, border: "1px solid rgba(0,0,0,0.1)"}}>
                            <p style={{color: 'rgba(0,0,0,0.7)', marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid rgba(0,0,0,0.1)"}}>
                                <i className="fa fa-exclamation-triangle" style={{color: "orangered", marginRight: 10, textShadow: "1px 2px 3px rgba(0,0,0,0.33)"}}></i>
                                Oops something went wrong</p>
                            <p style={{color: "rgba(0,0,0,0.7)", fontSize: 16, fontFamily: "'Prompt', sans-serif", fontWeight: "bolder", marginBottom: 10}}>
                                <i className="fa fa-wrench" style={{fontSize: 19, marginRight: 5}}></i>Maintenance Notice
                            </p>
                            <p style={{color: "rgba(0,0,0,0.7)", fontSize: 15}}>
                                Due to expansion of services and maintenance work, we are unable to show trips at this moment. 
                                We apologize for any inconvenience
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default TripsPage;