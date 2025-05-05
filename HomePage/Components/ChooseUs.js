import DownloadMobileApp from "./DownloadMobileApp";
import DownloadApp from "./DownloadApp";
import Reviews from "./Reviews";
import OurPromises from "./OurPromises";
import PopularCities from "./PopularCities";

var ChooseUs = ()=>{
    return (
        <div>
            <div style={{marginBottom: 0, padding: "10px 0", backgroundColor: "rgb(229, 233, 241)",}}>
                <div className="wrapper">
                    <DownloadApp />
                    <div style={{width: 90, margin: "auto", marginBottom: 0, marginTop: 5, height: 5, backgroundColor: "rgba(0,0,0,0.8)", borderRadius: 500}}></div>
                    {/*<Reviews />*/}
                    <PopularCities />
                    {/*<OurPromises />*/}
                    {/*<DownloadMobileApp />*/}
                </div>
            </div>
        </div>
    );
}

export default ChooseUs;

/*setTimeout(()=>{
    document.getElementById("main_all_ratings_dots").innerHTML = return_rating_markup(3.9);
}, 500)*/
