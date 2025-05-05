const MobileItinTopInfoLoader = () => {
    return (
        <div style={{animation: "item_slide_down 0.5s ease-in"}} id="itinerary_and_filter_icon">
            <div>
                <p className="info_item_loader" 
                    style={{fontSize: 16, fontFamily: "'Prompt', Sans-serif", color: "rgba(0,0,0,0.0)", fontWeight: "bolder", maxWidth: 130}}>
                    New York
                    <span style={{margin: "0 10px", color: "rgba(0,0,0,0.0)"}}>
                        <i className="fa fa-exchange"></i></span>
                    Canada
                </p>
                <p className="info_item_loader"  style={{fontSize: 13, color: "rgba(0,0,0,0.0)", marginTop: 2, maxWidth: 130}}>
                    Nov 25 - Nov 27</p>
            </div>
            <p class="info_item_loader" style={{fontWeight: "bolder", fontSize: 17, maxWidth: 120}}>
                <i style={{marginRight: 7}} className="fa fa-sliders" aria-hidden="true"></i>
                Filters</p>
        </div>
    )
}

export default MobileItinTopInfoLoader;