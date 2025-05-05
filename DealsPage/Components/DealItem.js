import coverImg from "../../../explore_destination_img9.jpg";

const DealItem = (props) => {
    return <div className="deals-list-item" style={{overflow: "hidden", cursor: "pointer", width: "calc(25% - 6px)", minHeight: 300, background: "rgb(46, 46, 46)", margin: 3, boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)"}}>
        <div style={{height: 150, backgroundImage: `url('${coverImg}')`, backgroundSize: "cover", backgroundRepeat: "no-repeat"}}>
        </div>
        <div style={{padding: 10}}>
            <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 13, color: "white"}}>
                <i style={{fontSize: 12, marginRight: 10, color: "orange"}} className="fa fa-map-marker"></i>
                New York
                <span style={{margin: 15}}>
                    <i style={{color: "rgba(255,255,255,0.5)", fontSize: 12}} 
                        className="fa-solid fa-exchange"></i>
                </span>
                London</p>
            
        </div>
    </div>
}

export default DealItem;