const EachPopularCity = (props) => {
    const { city, searchFlightsForPopularCity, addCityToTavourites, fav, PAGE_SIZE } = props;
    let a_width = 100/PAGE_SIZE;

    return (
        <div className="home_page_each_most_visited_cities" style={{width: ("calc("+a_width+"% - 5px)")}}>
            <div className="home_page_each_most_visited_cities_top" style={{position: "relative", backgroundImage: `url('${city.picture}')`}} >    
                <div style={{position: "absolute", paddingRight: 30, right: 0, top: 0, display: "flex", marginTop: 20}}>
                    <div onClick={()=>addCityToTavourites(city)} style={{padding: "10px", width: 40, textAlign: "center", backgroundColor: "rgba(0,0,0,0.5)", borderRadius: 8 }}>
                        <i style={{color: "orange", cursor: "pointer"}} className={((fav ? "fa-solid" : "fa-regular") + " fa-heart")} aria-hidden={true}></i>
                    </div>
                    <div onClick={()=>searchFlightsForPopularCity(city)} style={{padding: "10px", width: 40, textAlign: "center", marginLeft: 10,  backgroundColor: "rgba(0,0,0,0.5)", borderRadius: 8}}>
                        <i style={{color: "orange", cursor: "pointer"}} className="fa-solid fa-plane-departure" aria-hidden={true}></i>
                    </div>
                </div>
            </div>
            <div className="home_page_each_most_visited_cities_btn">
                <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 17, textAlign: "center", color: "rgb(0,0,0,0.8)", fontWeight: "bolder", letterSpacing: 1}}>
                    {city.city}</p>
                <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 14, textAlign: "center", color: "rgb(0,0,0,0.8)", marginTop: -3, letterSpacing: 1}}>
                    {city.country}, <span style={{color: "blue", fontSize: 14}}>
                        $34.20</span></p>
                
            </div>
            <div className="home_page_each_most_visited_cities_bottom">
                
            </div>
        </div>
    );
}

export default EachPopularCity;