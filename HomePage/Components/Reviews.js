import { useEffect, useState } from "react";
import { show_full_search_form } from "../../../helpers/PageRoutingFuncs";
import { 
    shuffle_array,
    get_horizontal_page_size,
    toggleAddRemoveCityInFavourites,
    startSearchToKnownCity 
} from "../../../helpers/general";
import { fetchRatedPlaces } from "../../../services/ratedPlacesServices";

import EachReviewer from "./EachReviewer";
import FullPageGallery from "../../../components/FullPageGallery";
import PlacesReviewsScores from "./PlacesReviewsScores";
import loading_icon from "../../../icons/loading.svg";

import reviews_icon from "../../../icons/reviews_icon.svg";
import reviews_icon2 from "../../../icons/reviews_icon2.svg";
import Reviewers from "../../../data/Reviewers";

let temp=0;

let favCts=[];
(localStorage.getItem("favCts")) ?
    favCts=JSON.parse(localStorage.getItem("favCts")) :
    localStorage.setItem("favCts", JSON.stringify([])) ;

const Reviews = () => {

    const PLACES_ADVISORS_PLACE_PICS_PAGE_SIZE = get_horizontal_page_size(150, 20, 3)

    const PAGE_SIZE = get_horizontal_page_size(60, 40, 6);
    const [ slice, setSlice ] = useState(0);
    const [ current, setCurrent ] = useState(slice);
    const [ currentCityIndex, setCurrentCityIndex ] = useState(0);
    const [ showPlaceMap, setShowPlaceMap ] = useState(false);
    const [ showAllActionIcons, setShowAllActionIcons ] = useState(false);
    const [ showGallery, setShowGallery ] = useState(false);
    const [ ratedPlaces, setRatedPlaces ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(true);

    const [ reviewers, setReviewers ] = useState([]);
    const [ CITY_NAME, setCityName ] = useState("");
    const [ TRAVEL_PRICE, setTravelPrice ] = useState("");
    const [ PICTURES, setPictures ] = useState({});
    const [ SCORES, setScores ] = useState(0);

    const [ favCities, setFavCities ] = useState(favCts);
    
    let current_reviewer = slice;
    //let current=slice;

    useEffect(()=>{
        (async function go(){
            //const places = shuffle_array(await fetchRatedPlaces());
            const places = shuffle_array(Reviewers)
            setReviewers(places[currentCityIndex].reviews);
            setCityName(places[currentCityIndex].place.name);
            setTravelPrice(places[currentCityIndex].place.price);
            setPictures(places[currentCityIndex].place.pictures);
            setScores(places[currentCityIndex].scores);
            console.log("RatedPlaces", places);
            if((Array.isArray(places) && places.length>0)){
                setRatedPlaces([...places]);
            }
            setIsLoading(false);
        })();
        //document.getElementById("main_all_ratings_dots").innerHTML = return_rating_markup(reviewers[0].rated);
    }, [currentCityIndex, current])
    
    function return_rating_markup(rating_num){
        if(rating_num === 5){
            return(
                <>
                    <div class="rating_dot"><div class="full"></div></div>
                    <div class="rating_dot"><div class="full"></div></div>
                    <div class="rating_dot"><div class="full"></div></div>
                    <div class="rating_dot"><div class="full"></div></div>
                    <div class="rating_dot"><div class="full"></div></div>
                </>
            )
            
        }else if(rating_num < 5 && rating_num >= 4.5){
            return (
                <>
                    <div class="rating_dot"><div class="full"></div></div>
                    <div class="rating_dot"><div class="full"></div></div>
                    <div class="rating_dot"><div class="full"></div></div>
                    <div class="rating_dot"><div class="full"></div></div>
                    <div class="rating_dot"><div class="half"></div></div>
                </>
            )
            
        }else if(rating_num < 4.5 && rating_num >= 4){
            return (
                <>
                    <div class="rating_dot"><div class="full"></div></div>
                    <div class="rating_dot"><div class="full"></div></div>
                    <div class="rating_dot"><div class="full"></div></div>
                    <div class="rating_dot"><div class="full"></div></div>
                    <div class="rating_dot"></div>
                </>
            )
        }else if(rating_num < 4 && rating_num >= 3.5){
            return (
                <>
                <div class="rating_dot"><div class="full"></div></div>
                    <div class="rating_dot"><div class="full"></div></div>
                    <div class="rating_dot"><div class="full"></div></div>
                    <div class="rating_dot"><div class="half"></div></div>
                    <div class="rating_dot"></div>
                </>
            )
        }else if(rating_num < 3.5 && rating_num >= 3){
            return (
                <>
                    <div class="rating_dot"><div class="full"></div></div>
                    <div class="rating_dot"><div class="full"></div></div>
                    <div class="rating_dot"><div class="full"></div></div>
                    <div class="rating_dot"></div>
                    <div class="rating_dot"></div>
                </>
            )
        }else if(rating_num < 3 && rating_num >= 2.5){
            return (
                <>
                    <div class="rating_dot"><div class="full"></div></div>
                    <div class="rating_dot"><div class="full"></div></div>
                    <div class="rating_dot"><div class="half"></div></div>
                    <div class="rating_dot"></div>
                    <div class="rating_dot"></div>
                </>
            )
        }else if(rating_num < 2.5 && rating_num >= 2){
            return (
                <>
                    <div class="rating_dot"><div class="full"></div></div>
                    <div class="rating_dot"><div class="full"></div></div>
                    <div class="rating_dot"></div>
                    <div class="rating_dot"></div>
                    <div class="rating_dot"></div>
                </>
            )
        }else if(rating_num < 2 && rating_num >= 1.5){
            return (
                <>
                    <div class="rating_dot"><div class="full"></div></div>
                    <div class="rating_dot"><div class="half"></div></div>
                    <div class="rating_dot"></div>
                    <div class="rating_dot"></div>
                    <div class="rating_dot"></div>
                </>
            )
        }else if(rating_num < 1.5 && rating_num >= 1){
            return (
                <>
                    <div class="rating_dot"><div class="full"></div></div>
                    <div class="rating_dot"></div>
                    <div class="rating_dot"></div>
                    <div class="rating_dot"></div>
                    <div class="rating_dot"></div>
                </>
            )
        }
    }

    function show_selected_review(index){
        let i = slice;
        if(reviewers.length > PAGE_SIZE){
            if(((i+PAGE_SIZE) < reviewers.length) && (index > temp)){
                setSlice(++i);
            }
            else if(((i+PAGE_SIZE) >= reviewers.length) && (index >= temp)){
                setSlice(reviewers.length-PAGE_SIZE-1);
            }else if(i>0){
                setSlice((--i));
            }
            setCurrent(index);
        } else {
            setCurrent(index);
        }
        temp = index;
    }

    function show_next_reviewer(){
        current_reviewer = current+1;
        if(current_reviewer >= reviewers.length){
            current_reviewer = (reviewers.length - 1);
            return null
        }
        show_selected_review(current_reviewer);
    }
    function show_previous_reviewer(){
        current_reviewer = current-1;
        if(current_reviewer < 0){
            current_reviewer = 0;
            return null;
        }
        show_selected_review(current_reviewer);
    }

    function show_next_city() {
        current_reviewer=0;
        setSlice(0);
        setCurrent(0);
        temp=0;
        if(currentCityIndex<(ratedPlaces.length-1))
            setCurrentCityIndex((currentCityIndex+1));
    }

    function show_prev_city() {
        current_reviewer=0;
        setSlice(0);
        setCurrent(0);
        temp=0;
        if(currentCityIndex>0)
            setCurrentCityIndex((currentCityIndex-1));
    }

    const addCityToTavourites = (city) => {
        toggleAddRemoveCityInFavourites(city, favCities, setFavCities);
    }

    const searchFlightsForRatedCity = (city_p) => {
        const  { city, airport_name, IATA ,ICAO } = city_p;
        startSearchToKnownCity(city, airport_name, IATA, ICAO);
    }

    const toggleShowRatedPlaceMap = () => {
        setShowPlaceMap(!showPlaceMap);
    }

    const toggleShowAllActionIcons = () => {
        setShowAllActionIcons(!showAllActionIcons);
    }

    const toggleShowGallery = () => {
        setShowGallery(!showGallery);
    }

    return (
        <>
            {   
                showGallery && <FullPageGallery photos={PICTURES} toggleShowGallery={toggleShowGallery}/>
            }
            {
                !isLoading  ?
                <div className="home_page_reviews_container">
                    <h1 className="page_title" style={{textAlign: "center", fontSize: 20, marginBottom: 10, letterSpacing: 1, color: "rgba(0,0,0,0.7)", fontWeight: 1000, fontFamily: "'Prompt', Sans-serif",}}
                    >Places Advisor</h1>
                    <h1 className="mobile_margin_bottom_20 title_desc" style={{textAlign: "center", marginTop: -10, letterSpacing: 1, fontSize: 16, color: "rgba(0,0,0,0.6)", fontWeight: "initial", fontFamily: "'Prompt', Sans-serif",}}
                    >travelers openions about places</h1>
                    <div className="home_page_reviews_wrapper">

                        <div onClick={show_full_search_form} style={{display: "none"}} className="home_page_reviews_start_search_btn">
                            <i style={{marginRight: 10, color: "#c751b9"}} className="fa fa-search"></i>
                            Book Yours Today...
                        </div>

                        <div style={{display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingBottom: 100, position: "absolute", zIndex: 1, height: "100%", left: 0}}>
                            <div onClick={show_previous_reviewer} style={{cursor: "pointer", width: 40, height: 40, borderRadius: "100%", backgroundColor: "rgb(43, 52, 61)", boxShadow: "1px 2px 4px rgba(0,0,0,0.4)", textAlign: "center", display: "flex", flexDirection: 'column', justifyContent: "center"}}>
                                <i style={{fontSize: 20, color: "white"}} className="fa fa-angle-left"></i>
                            </div>
                        </div>
                        <div style={{display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingBottom: 100, position: "absolute", zIndex: 1, height: "100%", right: 0}}>
                            <div onClick={show_next_reviewer} style={{cursor: "pointer", width: 40, height: 40, borderRadius: "100%", backgroundColor: "rgb(43, 52, 61)", boxShadow: "1px 2px 4px rgba(0,0,0,0.4)", textAlign: "center", display: "flex", flexDirection: 'column', justifyContent: "center"}}>
                                <i style={{fontSize: 20, color: "white"}} className="fa fa-angle-right"></i>
                            </div>
                        </div>
                        <div className="home_page_reviews_each_review">

                            <div className="reviews_watermark_icon" style={{backgroundImage: `url('${reviews_icon}')`}}></div>
                            <div className="reviews_watermark_icon2" style={{backgroundImage: `url('${reviews_icon2}')`}}></div>

                            <div className="home_page_reviews_each_reviewer_pic">
                                <div className="home_page_reviews_each_reviewer_pic_img_container" style={{display: "flex", flexDirection: "row"}}>
                                    <div style={{width: 110, height: 110, border: "4px solid #c751b9", overflow: 'hidden', borderRadius: "100%", backgroundColor: "rgba(0,0,0,0.2)", boxShadow: "1px 2px 4px rgba(0,0,0,0.4)"}}>
                                        <img id="home_page_reviews_selected_reviewer_img" src={reviewers[current]?.img} 
                                        style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: "center"}} 
                                        alt="SelectedReviwer"/>
                                    </div>
                                </div>
                                <p id="home_page_reviews_selected_reviewer_name" style={{marginTop: 15, fontFamily: "Courgette", color: "#c751b9", fontSize: 17, fontWeight: "bolder", fontFamily: "'Prompt', Sans-serif"}}>
                                    {reviewers[current]?.name}
                                </p>
                                <p  className="mobile_font_13" id="home_page_reviews_selected_reviewer_city" style={{marginBottom: 10,fontSize: 14, fontFamily: "'Prompt', Sans-serif", color: 'rgba(0,73,0,0.8)'}}>
                                    {reviewers[current]?.city}
                                </p>
                                <div className="reviews_rating" style={{display: "flex", flexDirection: "row"}}>
                                    <div id="main_all_ratings_dots" className="all_ratings_dotes">
                                        {return_rating_markup(reviewers[current]?.rated)}
                                    </div>
                                </div>
                                <p className="reviews_rating_number" style={{marginTop: 8, color: "rgba(0,0,0,0.7)", backgroundColor: "rgb(229, 233, 241)", fontSize: 17, fontFamily: "'Prompt', Sans-serif", padding: "10px", width: "fit-content"}}>
                                    <span>
                                        <i className="fa-solid fa-city" style={{marginRight: 10, color: "#c751b9"}}></i>
                                        {CITY_NAME} <span style={{color: "rgba(0,0,0,0.17)"}}>|</span>
                                    </span>
                                    <span style={{fontWeight: "initial", color: "green"}}>
                                        <span style={{fontSize: 14}} id="main_reviews_rating_number"> <i className="fa-solid fa-star" style={{marginRight: 4, fontSize: 11, color: "rbga(0,0,0,0.3)"}}></i>
                                            {parseFloat(reviewers[current]?.rated).toFixed(1)}</span>
                                        <span style={{fontSize: 14}}> <span style={{color: "rgba(0,0,0,0.17)"}}>|</span> </span>
                                        <span style={{fontSize: 14, color: "darkslateblue"}}>
                                            <i className="fa-solid fa-money-bills" style={{marginRight: 4, fontSize: 11, color: "rbga(0,0,0,0.3)"}}></i>
                                            ${TRAVEL_PRICE}</span>
                                    </span>
                                </p>
                                <div className="rated_places_photo_thumbs_container">
                                    {
                                        PICTURES.slice(0,PLACES_ADVISORS_PLACE_PICS_PAGE_SIZE).map( each => <div 
                                            key={each}
                                            onClick={toggleShowAllActionIcons}
                                            style={{backgroundImage: `url('${each}')`, 
                                            backgroundSize: "cover", backgroundPosition: "center", 
                                            width: (PLACES_ADVISORS_PLACE_PICS_PAGE_SIZE===2) ? "50%" : 160, height: 158}}>
                                        </div>)
                                    }
                                    
                                    <div style={{display: "none", backgroundImage: `url('${PICTURES[1]}')`, backgroundSize: "cover", backgroundPosition: "center", width: 160, height: 158}}>
                                    </div>
                                    <div style={{display: "none", backgroundImage: `url('${PICTURES[2]}')`, backgroundSize: "cover", backgroundPosition: "center", width: 160, height: 158}}>
                                        <div style={{color: "white", width: "100%", height: "100%", display: "none", justifyContent: "center", alignItems: "center", cursor: "pointer", background: "rgba(0,0,0,0.6)"}}>
                                            see all...
                                        </div>
                                    </div>
                                    <div onClick={toggleShowAllActionIcons} 
                                        style={{zIndex: 2, display: showPlaceMap ? "flex" : "none", alignItems: "center", justifyContent: "center", position: "absolute", top: 0, left: 0, background: "darkblue", width: "100%", height: "100%", boxShadow: "1px 2px 3px rgba(0,0,0,0.4)"}}>
                                        <p style={{textAlign: "center", color: "white"}}>MAP HERE</p>
                                    </div>
                                    <div className="places_reviewers_actions_container"> 
                                        <div style={{display: "flex", justifyContent: "space-between"}}>
                                            <div onClick={show_prev_city} style={{display: showAllActionIcons ? "block" : "none"}}>
                                                <p style={{width: 35, height: 35, borderRadius: "100%", cursor: "pointer", border: "1px solid rgba(0,0,0,0.1)", display: "flex", justifyContent: "center", alignItems: "center"}}>
                                                    <i style={{color: "#c751b9", fontSize: 18}} className="fa-solid fa-angle-left"></i>
                                                </p>
                                            </div>
                                            <div style={{display: showAllActionIcons ? "flex" : "none", marginLeft: 5}}>
                                                <p onClick={()=>addCityToTavourites(ratedPlaces[currentCityIndex].place)} style={{width: 35, height: 35, cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center"}}>
                                                    <i style={{color: "rgba(0,0,0,0.8)", fontSize: 18}} className={((favCities.includes(ratedPlaces[currentCityIndex].place.IATA)) ? "fa-solid" : "fa-regular") + " fa-heart"}></i>
                                                </p>
                                                <p onClick={()=>searchFlightsForRatedCity(ratedPlaces[currentCityIndex].place)} style={{marginLeft: 5, width: 35, height: 35, cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center"}}>
                                                    <i style={{color: "rgba(0,0,0,0.8)", fontSize: 18}} className="fa-solid fa-plane-departure"></i>
                                                </p>
                                                <p onClick={toggleShowRatedPlaceMap} style={{marginLeft: 5,width: 35, height: 35, cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center"}}>
                                                    <i style={{color: "green", fontSize: 18}} className={"fa-solid "+ (showPlaceMap ? "fa-image" : "fa-map-location-dot")}></i>
                                                </p>
                                            </div>
                                            <div onClick={show_next_city} style={{marginLeft: 5, display: showAllActionIcons ? "block" : "none"}}>
                                                <p style={{width: 35, height: 35, borderRadius: "100%", cursor: "pointer", border: "1px solid rgba(0,0,0,0.1)", display: "flex", justifyContent: "center", alignItems: "center"}}>
                                                    <i style={{color: "#c751b9", fontSize: 18}} className="fa-solid fa-angle-right"></i>
                                                </p>
                                            </div>
                                            <div onClick={toggleShowAllActionIcons} style={{display: showAllActionIcons ? "none" : "block"}} >
                                                <p style={{width: 35, height: 35, borderRadius: "100%", cursor: "pointer", border: "1px solid rgba(0,0,0,0.1)", display: "flex", justifyContent: "center", alignItems: "center"}}>
                                                    <i style={{color: "#c751b9", fontSize: 18}} className="fa-solid fa-arrow-left"></i>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div onClick={toggleShowGallery} className="places_reviewers_see_photos_btn" style={{cursor: "pointer", padding: 10, width: "100%", fontSize: 13, fontFamily: "'Prompt', Sans-serif", textAlign: "center", bottom: 0, left: 0, position: "absolute", background: "rgba(0,0,0,0.6)", color: "white"}}>
                                        See photos of <span style={{fontSize: 13, fontFamily: "'Prompt', Sans-serif", color: "orangered"}}>{CITY_NAME}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="home_page_reviews_each_review_details">
                                <p id="home_page_reviews_selected_reviewer_msg" style={{borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: 20,fontSize: 19, textAlign: "center", fontFamily: "'Prompt', Sans-serif", color: 'rgba(83,0,0,0.8)', letterSpacing: 1}}>
                                    <span style={{fontSize: 45, color: "#c751b9", marginRight: 10, fontFamily: "Courgette", position: "relative", zIndex: 3}}>"</span>
                                    {reviewers[current]?.msg}
                                </p>
                                <div style={{display: "flex", justifyContent: "center", marginTop: 10}}>
                                    {SCORES && <PlacesReviewsScores  scores={SCORES}/>}
                                </div>
                                <p style={{marginTop: 5, /*fontFamily: "Courgette",*/ color: "rgba(0,0,0,0.6)", textAlign: "center", fontSize: 14, fontFamily: "'Prompt', Sans-serif"}}>
                                    - {reviewers[current]?.name} -
                                </p>
                                <p className="mobile_font_13" id="home_page_reviews_selected_reviewer_date" style={{fontSize: 13, textAlign: "center", fontFamily: "'Prompt', Sans-serif", color: 'rgba(0,0,0,0.6)'}}>
                                    {reviewers[current]?.date}
                                </p>
                                <div style={{display: "flex", flexDirection: "row", justifyContent: "center", marginTop: 10}}>
                                    <div style={{display: "flex", flexDirection: "row"}}>
                                        {
                                            (reviewers.length > PAGE_SIZE) ?
                                            reviewers.slice(slice,slice+PAGE_SIZE).map((each, i) => ( 
                                                <EachReviewer 
                                                    key={each.name}
                                                    each={each}
                                                    i={(i+slice)}
                                                    show_selected_review={show_selected_review}
                                                />
                                            )) :
                                            reviewers.map((each, i) => (
                                                <EachReviewer 
                                                    key={each.name}
                                                    each={each}
                                                    i={i}
                                                    show_selected_review={show_selected_review}
                                                />
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> :
                <div style={{marginBottom: 20, padding: "20px"}}>
                    <h1 className="page_title" style={{textAlign: "center", fontSize: 20, marginBottom: 10, letterSpacing: 1, color: "rgba(0,0,0,0.7)", fontWeight: 1000, fontFamily: "'Prompt', Sans-serif",}}
                    >Places Advisor</h1>
                    <h1 className="mobile_margin_bottom_20 title_desc" style={{textAlign: "center", marginTop: -10, letterSpacing: 1, fontSize: 16, color: "rgba(0,0,0,0.6)", fontWeight: "initial", fontFamily: "'Prompt', Sans-serif",}}
                    >travelers openions about places</h1>
                    <div style={{backgroundImage: `url(${loading_icon})`, backgroundSize: "contain", backgroundRepeat: "no-repeat", width: 80, height: 80, margin: "auto"}}></div>
                    <p style={{color: "rgba(0,0,0,0.7)", fontFamily: "'Prompt', Sans-serif", textAlign: "center", marginTop: 20}}>
                        Please wait...</p>
                </div>
            }
        </>
    );
}

export default Reviews;