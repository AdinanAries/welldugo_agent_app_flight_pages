const EachPopularCityMore = (prop) => {
    const { city, searchFlightsForPopularCity, addCityToTavourites, fav } = prop;
    return (
        <div className="each_more_popular_city" style={{postion: "relative", cursor: "pointer", color: "rgb(223, 157, 0)", textAlign: "center", margin: "auto", fontFamily: "'Prompt', Sans-serif"}}>
            <div id={("each_more_popular_city_popup_"+city.city)} className="each_more_popular_city_popup">
                <p onClick={()=>document.getElementById(("each_more_popular_city_popup_"+city.city)).style.display="none"}
                    style={{position: "absolute", top: 10, right: 10, zIndex: 1, display: "flex", 
                    justifyContent: "center", alignItems: "center", color: "red",
                    borderRadius: "100%", width: 37, height: 37, cursor: "pointer", backgroundColor: "rgba(0,0,0,0.5)"}}>
                    x</p>
                <div style={{width: "100%", marginBottom: 0}}  className="home_page_each_most_visited_cities">
                    <div className="home_page_each_most_visited_cities_top" style={{backgroundImage: `url('${city.picture}')`}}>

                    </div>
                    <div className="home_page_each_most_visited_cities_btn"
                        onClick={()=>searchFlightsForPopularCity(city)} >
                        <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 14, textAlign: "center", color: "rgb(0,0,0,0.8)"}}>
                            {city.city}</p>
                        <p style={{fontFamily: "'Prompt', Sans-serif", fontWeight: "initial", fontSize: 12, textAlign: "center", color: "rgb(0,0,0,0.8)", marginTop: 0}}>
                            - {city.country} -</p>
                        <p style={{display: "none", fontFamily: "'Prompt', Sans-serif", fontWeight: "initial", fontSize: 12, textAlign: "center", color: "rgb(0,0,0,0.8)", marginTop: 0}}>
                            $168, 1h 40m ({city.country})</p>
                    </div>
                    <div className="home_page_each_most_visited_cities_bottom">
                        
                    </div>
                </div>
            </div>
            <div style={{display: "flex", justifyContent: "space-between", padding: "0 10px", paddingBottom: 4, marginBottom: 5, borderBottom: "1px solid rgba(0,0,0,0.1)"}}>
                <div  onClick={()=>document.getElementById(("each_more_popular_city_popup_"+city.city)).style.display="block"} style={{textAlign: "initial", color: "rgb(174, 101, 0)", fontFamily: "'Prompt', Sans-serif", fontSize: 14}}>
                    {city.city} - <span style={{fontFamily: "'Prompt', Sans-serif", fontSize: 13, color: "rgba(0,0,0,0.8)"}}>
                    {city.country}</span>
                    
                </div>
                <div style={{position: "absolute", right: 10, top: 0, display: "flex"}}>
                    <div onClick={()=>addCityToTavourites(city)} style={{}}>
                        <i style={{color: (fav ? "rgb(23, 87, 148)" : "rgba(0,0,0,0.6)"), cursor: "pointer", fontSize: 17}} className={((fav ? "fa-solid fa-heart-circle-check" : "fa-regular fa-heart"))} aria-hidden={true}></i>
                    </div>
                    <div style={{marginLeft: 15}} onClick={()=>searchFlightsForPopularCity(city)}>
                        <i style={{color: "green", cursor: "pointer", fontSize: 17}} className="fa-regular fa-circle-check" aria-hidden={true}></i>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EachPopularCityMore;