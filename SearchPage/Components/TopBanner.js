import { useEffect } from "react";

import Type1TopBanner from "./TopBannerCards/Type1TopBanner";
import Type4TopBanner from "./TopBannerCards/Type4TopBanner";
import Type5TopBanner from "./TopBannerCards/Type5TopBanner";

const TopBanner = (props) => {

    const {
        flights,
        filteredFlights,
        showSearchPageForm,
        setShowSearchPageForm,
    } = props;

    const bannerType = 5;

    useEffect(()=>{
        if(bannerType===4 || bannerType===5){
            setShowSearchPageForm(false);
        }
    }, []);

    return <div>
        {
            (bannerType === 1) && 
            <Type1TopBanner 
                flights={flights}
                filteredFlights={filteredFlights}
            />
        }
        {
            (bannerType === 4) && 
            <Type4TopBanner 
                flights={flights}
                filteredFlights={filteredFlights}
                showSearchPageForm={showSearchPageForm}
                setShowSearchPageForm={setShowSearchPageForm}
            />
        }
        {
            (bannerType === 5) && 
            <Type5TopBanner 
                flights={flights}
                filteredFlights={filteredFlights}
                showSearchPageForm={showSearchPageForm}
                setShowSearchPageForm={setShowSearchPageForm}
            />
        }
    </div>
}

export default TopBanner;