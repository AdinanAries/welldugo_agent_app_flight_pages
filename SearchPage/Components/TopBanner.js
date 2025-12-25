import Type1TopBanner from "./TopBannerCards/Type1TopBanner";
import Type4TopBanner from "./TopBannerCards/Type4TopBanner";

const TopBanner = (props) => {

    const {
        flights,
        filteredFlights,
    } = props;

    const bannerType = 4;

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
            />
        }
    </div>
}

export default TopBanner;