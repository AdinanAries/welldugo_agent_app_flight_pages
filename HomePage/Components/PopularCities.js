import { useState, useEffect } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

import citiesIcon from "../../../icons/citiesIcon.svg";

import PaginationButtons from '../../../components/PaginationButtons';

import { shuffle_array,
        get_horizontal_page_size,
        toggleAddRemoveCityInFavourites,
        startSearchToKnownCity } from '../../../helpers/general';
        
import EachPopularCity from "./EachPopularCity";
import EachPopularCityMore from "./EachPopularCityMore";
import { show_full_search_form } from '../../../helpers/PageRoutingFuncs';
import PopularCitiesList from "../../../data/PopularCitiesList";
let cities=shuffle_array(PopularCitiesList);
let favCts=[];
(localStorage.getItem("favCts")) ?
    favCts=JSON.parse(localStorage.getItem("favCts")) :
    localStorage.setItem("favCts", JSON.stringify([])) ;


const PopularCities = () => {

    const PAGE_SIZE = get_horizontal_page_size(300, 40, 3);

    const [data, setData] = useState({
        exploreCities: {
            pagination: {
                currentPage: 1,
                numberPerPage: 4,
                numberOfPages: 0,
            },
            cities
        }
    });

    const [ favCities, setFavCities ] = useState(favCts);

    function nextPage() {
        if(
            (((data.exploreCities.pagination.currentPage - 1) * data.exploreCities.pagination.numberPerPage)+data.exploreCities.pagination.numberPerPage)
            > data.exploreCities.cities.length
        )return;
        ++data.exploreCities.pagination.currentPage;
        setData({
            exploreCities: {
                ...data.exploreCities,
                pagination: {
                    ...data.exploreCities.pagination
                }
            }
        })
    }

    function prevPage() {
        if((data.exploreCities.pagination.currentPage-1) < 1)return;
        --data.exploreCities.pagination.currentPage;
        setData({
            exploreCities: {
                ...data.exploreCities,
                pagination: {
                    ...data.exploreCities.pagination
                }
            }
        })
    }

    function setPage(num) {
        setData({
            exploreCities: {
                ...data.exploreCities,
                pagination: {
                    ...data.exploreCities.pagination,
                    currentPage: num,
                }
            }
        });
    }

    const searchFlightsForPopularCity = (city_p) => {
        const  { city, name, IATA ,ICAO } = city_p;
        startSearchToKnownCity(city, name, IATA, ICAO);
    }

    const addCityToTavourites = (city) => {
        toggleAddRemoveCityInFavourites(city, favCities, setFavCities);
    }

    useEffect(() => {
        setData({
            exploreCities: {
                ...data.exploreCities,
                pagination: {
                    currentPage: 1,
                    numberPerPage: 4,
                    numberOfPages: Math.ceil(data.exploreCities.cities.length / data.exploreCities.pagination.numberPerPage),
                }
            }
        })
    }, []);

    let begin = ((data.exploreCities.pagination.currentPage - 1) * data.exploreCities.pagination.numberPerPage);
    let end = begin + data.exploreCities.pagination.numberPerPage;
    return (
        <div className="home_page_most_visited_cities" style={{paddingTop: 10}}>
            <h1 className="page_title" style={{textAlign: "center", fontSize: 15, marginBottom: 10, marginTop: 20, letterSpacing: 1, color: "rgba(0,0,0,0.7)", fontWeight: 1000, fontFamily: "'Prompt', Sans-serif",}}
                >Suggested Trips</h1>
            <h1 className="mobile_margin_bottom_20 title_desc" style={{textAlign: "center", marginTop: -10, letterSpacing: 1, fontSize: 13, color: "rgba(0,0,0,0.6)", fontWeight: "initial", fontFamily: "'Prompt', Sans-serif", marginBottom: 30}}
                >some suggested trips for you</h1>
            <div className="home_page_most_visited_cities_list" style={{display: "none"}}>
                {
                    data.exploreCities.cities.slice(0,PAGE_SIZE).map(each=>
                        (
                            
                                <EachPopularCity 
                                    city={each} 
                                    fav={(favCities.includes(each.IATA))}
                                    searchFlightsForPopularCity={searchFlightsForPopularCity} 
                                    addCityToTavourites={addCityToTavourites}
                                    key={each.IATA}
                                    PAGE_SIZE={PAGE_SIZE}
                                />
                            
                        )
                    )
                }
            </div>
            <div className="mobile_home_page_most_visited_cities_list" style={{display: "none"}}>
                <Carousel >
                    {
                        data.exploreCities.cities.map( each =>
                            (
                                
                                    <EachPopularCity 
                                        city={each} 
                                        fav={(favCities.includes(each.IATA))}
                                        searchFlightsForPopularCity={searchFlightsForPopularCity} 
                                        addCityToTavourites={addCityToTavourites}
                                        key={each.IATA}
                                        PAGE_SIZE={PAGE_SIZE}
                                    />
                                
                            )
                        )
                    }
                </Carousel>
            </div>
            <h1 className="page_title" style={{display: "none", textAlign: "center", fontSize: 20, marginBottom: 10, marginTop: 10, letterSpacing: 1, color: "rgba(0,0,0,0.7)", fontWeight: 1000, fontFamily: "'Prompt', Sans-serif",}}
                >More To Explore</h1>
            <div style={{position: "relative", borderTop: "4px solid orange", padding: "25px 5px", background: "rgba(255,255,255)"}}>
                <div className="more_popular_cities_svg_img" style={{height: 150, width: 150, backgroundImage: `url('${citiesIcon}')`, backgroundRepeat: "no-repeat", backgroundSize: "contain", position: "absolute", top: -60, left: 20, zIndex: 1}}>
                </div>
                <div style={{position: "relative", maxWidth: 500, margin: "auto"}}>
                    <div className="more_to_explore_top_next_prev_btn" onClick={prevPage} style={{display: "flex", display: "none", flexDirection: "column", justifyContent: "center", position: "absolute", zIndex: 1, height: "100%", left: 0}}>
                        <div style={{cursor: "pointer", width: 40, height: 40, borderRadius: "100%", backgroundColor: "#db7fd0", boxShadow: "1px 2px 4px rgba(0,0,0,0.4)", textAlign: "center", display: "flex", flexDirection: 'column', justifyContent: "center"}}>
                            <i style={{fontSize: 20, color: "white"}} className="fa fa-angle-left"></i>
                        </div>
                    </div>
                    <div className="more_to_explore_top_next_prev_btn" onClick={nextPage} style={{display: "flex", display: "none", flexDirection: "column", justifyContent: "center", position: "absolute", zIndex: 1, height: "100%", right: 0}}>
                        <div style={{cursor: "pointer", width: 40, height: 40, borderRadius: "100%", backgroundColor: "#db7fd0", boxShadow: "1px 2px 4px rgba(0,0,0,0.4)", textAlign: "center", display: "flex", flexDirection: 'column', justifyContent: "center"}}>
                            <i style={{fontSize: 20, color: "white"}} className="fa fa-angle-right"></i>
                        </div>
                    </div>
                    {
                        data.exploreCities.cities.slice(begin, end).map(each=>(
                            <EachPopularCityMore 
                                city={each}
                                fav={(favCities.includes(each.IATA))}
                                searchFlightsForPopularCity={searchFlightsForPopularCity} 
                                addCityToTavourites={addCityToTavourites}
                                key={each.IATA}
                            />)
                    )}
                </div>
                <div style={{paddingTop: 20}}>
                    <PaginationButtons 
                        pageSize={data.exploreCities.pagination.numberPerPage} 
                        currentPage={data.exploreCities.pagination.currentPage} 
                        totalItems={data.exploreCities.cities.length}
                        nextPage={nextPage}
                        prevPage={prevPage}
                        setPage={setPage}
                    />
                </div>
            </div>
        </div>
    );
}

export default PopularCities;