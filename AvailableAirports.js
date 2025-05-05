import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import FullPageLoader from "../components/FullPageLoader";
import FormErrorCard from "../components/FormErrorCard";
import WillgoLogo from '../WillgoLogo.png';
import Airports from '../helpers/Airports';

const AvailableAirports = (props) => {

    const [ filteredAirports, setFilteredAirports ] = useState(Airports);
    const [ isSeeAll, setIsSeeAll ] = useState(true);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ formValidation, setFormValidation ] = useState({
        type: "warning",
        isError: false,
        message: "",
    });

    const AirportsInputOnChange = (e) => {
      const elem_value = e.target.value;
      const results = Airports.filter(each => {
          return (
          each.city.toLowerCase().replaceAll(" ", "").includes(elem_value.toLowerCase().replaceAll(" ", ""))
          || each.name.toLowerCase().replaceAll(" ", "").includes(elem_value.toLowerCase().replaceAll(" ", ""))
          || each.IATA.toLowerCase().replaceAll(" ", "").includes(elem_value.toLowerCase().replaceAll(" ", ""))
          || each.country.toLowerCase().replaceAll(" ", "").includes(elem_value.toLowerCase().replaceAll(" ", ""))
          || (each.city + each.name).toLowerCase().replaceAll(" ", "").includes(elem_value.toLowerCase().replaceAll(" ", ""))
          || (each.city + each.country).toLowerCase().replaceAll(" ", "").includes(elem_value.toLowerCase().replaceAll(" ", ""))
          || (each.city + each.country + each.name + each.IATA).toLowerCase().replaceAll(" ", "").includes(elem_value.toLowerCase().replaceAll(" ", ""))
          || (each.country + each.city + each.name + each.IATA).toLowerCase().replaceAll(" ", "").includes(elem_value.toLowerCase().replaceAll(" ", ""))
          || (each.name + each.city + each.country + each.IATA).toLowerCase().replaceAll(" ", "").includes(elem_value.toLowerCase().replaceAll(" ", ""))
          || (each.name + each.IATA + each.city + each.country).toLowerCase().replaceAll(" ", "").includes(elem_value.toLowerCase().replaceAll(" ", ""))
          || (each.IATA + each.name + each.city + each.country).toLowerCase().replaceAll(" ", "").includes(elem_value.toLowerCase().replaceAll(" ", ""))
          || (each.IATA + each.city + each.name + each.country).toLowerCase().replaceAll(" ", "").includes(elem_value.toLowerCase().replaceAll(" ", ""))
          || (each.IATA + each.city + each.country + each.name).toLowerCase().replaceAll(" ", "").includes(elem_value.toLowerCase().replaceAll(" ", ""))
          || (each.IATA + each.country + each.city + each.name).toLowerCase().replaceAll(" ", "").includes(elem_value.toLowerCase().replaceAll(" ", ""))
        )
      });
      setFilteredAirports(results);
    }

    const toggleSeeAll = () => {
      setFilteredAirports(Airports)
      setIsSeeAll(!isSeeAll);
    }

    let limit = isSeeAll ? Airports.length : 100;

    return <div>
        <main>
            <div style={{backgroundColor: "#121212", padding: "0 15px"}}>
                <div className="wrapper">
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <div style={{height: "60px", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                            <div className="site-logo">
                                <p className="site-logo-img">
                                    <img src={WillgoLogo} alt={"to do"} /></p>
                                <div className="site-logo-txt">
                                    <p>
                                        welldugo
                                        <span>.com</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{maxWidth: 1200, margin: "auto", marginTop: 10}}>
              <p style={{fontSize: 12}}>
               We have {Airports.length} total airports & your search matches {filteredAirports.length} airport(s) @ {new Date().toString()}
              </p>
            </div>
            <div style={{padding: "30px 5px", paddingTop: 10}}>
                {
                    isLoading && <FullPageLoader />
                }
                {
                    <div  className="login_page_form_container" style={{maxWidth: "1200px", margin: "auto", border: "1px solid rgba(0,0,0,0.1)", overflow: "hidden"}}>
                        <div style={{padding: "10px",}}>
                            {
                                (!isSeeAll) && <div style={{marginBottom: 5, backgroundColor: "rgba(0,0,0,0.07)", padding: 10, borderRadius: 8, display: "flex"}}>
                                  <div style={{display: "flex", alignItems: "center", marginLeft: 10}}>
                                    <i className="fa-solid fa-search" style={{marginRight: 10, color: "rgb(43, 52, 61)"}}></i>
                                  </div>
                                  <div style={{border: "none", width: "calc(100% - 20px)" }}>
                                      <input
                                          onChange={AirportsInputOnChange}
                                          type="text" placeholder="type airport, city, or country name here..."
                                          style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", width: "calc(100% - 20px)", padding: 10, background: "none", border: "none"}}/>
                                  </div>
                              </div>
                            }
                            {
                                formValidation.isError && <FormErrorCard
                                    message={formValidation.message}
                                    type={formValidation.type}
                                />
                            }
                            <div>
                              {
                                (filteredAirports.length > 99 && !isSeeAll) &&
                                <p style={{color: "rgba(0,0,0,0.7)", backgroundColor: "rgba(255,0,0,0.1)", border: "1px solid rgba(255,0,0,0.1)", padding: 10, fontFamily: "'Prompt', Sans-serif", fontSize: 11}}>
                                  <i className="fa-solid fa-exclamation-triangle" style={{marginRight: 10, color: "orangered"}}></i>
                                  Showing only first 100 airports. Please enter specific airport in the search box above
                                </p>
                              }
                              <p style={{width: 200,  textAlign: "center", fontSize: 12, cursor: "pointer", padding: 10, marginTop: 10, backgroundColor: (isSeeAll) ? "darkslateblue" : "crimson", color: "white", borderRadius: 9}}
                                onClick={toggleSeeAll}>{!isSeeAll ? "See all airports" : "Search airport"}</p>
                              <div style={{padding: 10}}>
                                {
                                  /*"name": "Goroka ", "city": "Goroka", "country": "Papua New Guinea", "IATA": "GKA", "ICAO": "AYGA", "lat": "-6.081689834590001", "lon": "145.391998291", "timezone": "10"*/
                                  filteredAirports.map((airport, i) => {
                                    return (i < limit) && <div style={{padding: "5px 0", borderBottom: "1px solid rgba(0,0,0,0.1)"}}>
                                      <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif", fontSize: 13}}>
                                        {(i+1)}. {airport.name}</p>
                                        <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif", fontSize: 12}}>
                                          <span style={{color: "rgba(0,0,0,0.3)", fontSize: 11}}>
                                            IATA:</span> {airport.IATA}
                                          <span style={{color: "rgba(0,0,0,0.3)", fontSize: 11, marginLeft: 10}}>
                                            ICAO:</span> {airport.ICAO}</p>
                                      <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif", fontSize: 12}}>
                                        <span style={{color: "rgba(0,0,0,0.3)", fontSize: 11}}>
                                          City:</span> {airport.city}
                                        <span style={{color: "rgba(0,0,0,0.3)", fontSize: 11, marginLeft: 10}}>
                                          Country:</span> {airport.country}
                                        <span style={{color: "rgba(0,0,0,0.3)", fontSize: 11, marginLeft: 10}}>
                                          TimeZone:</span> {airport.timezone}</p>
                                      <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif", fontSize: 12}}>
                                        <span style={{color: "rgba(0,0,0,0.3)", fontSize: 11}}>
                                          Lat:</span> {airport.lat}
                                        <span style={{color: "rgba(0,0,0,0.3)", fontSize: 11, marginLeft: 10}}>
                                          Lon:</span> {airport.lon}</p>
                                    </div>
                                  })
                                }
                              </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
            <Footer />
        </main>
    </div>
}

export default AvailableAirports;
