const PlacesReviewsScores = (props) => {
    const { scores } = props;
    /*scores: {
        subway: {
            rating: 8,
            notes: ""
        },
        taxi: {
            rating: 5,
            desc: ""
        },
        bus: {
            rating: 8,
            desc: ""
        },
        cost: {
            rating: 4,
            desc: ""
        },
        urbanization: {
            rating: 7,
            desc: ""
        }
    },*/
    return (
        <div style={{padding: 10}}>
            <div style={{display: "flex"}}>
                <div className="tooltip_parent" style={{marginRight: 5}}>
                    <div className="tooltip" style={{top: "initial", bottom: "calc(100% + 4px)", zIndex: 3, left: "-50%", borderRadius: 5, padding: 10, minWidth: 200,}}>
                        <p style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", textAlign: "center"}}>
                            <span style={{marginRight: 5, fontWeight: "bolder", fontSize: 14, fontFamily: "'Prompt', Sans-serif",}}>
                                Safety:</span>
                                {scores.safety.rating}/10
                        </p>
                        <p style={{fontSize: 14, borderTop: "1px solid rgba(0,0,0,0.1)", marginTop: 5, paddingTop: 5, fontFamily: "'Prompt', Sans-serif", textAlign: "center"}}>
                            {scores.safety.notes}
                        </p>
                        <p style={{fontSize: 14, color: "brown", textDecoration: "underline", cursor: "pointer", paddingTop: 5, fontFamily: "'Prompt', Sans-serif", textAlign: "center"}}>
                            read more...
                        </p>
                    </div>
                    <div style={{fontFamily: "'Prompt', Sans-serif", textAlign: "center", position: "relative", display: "flex", justifyContent: "center", alignItems: "center", width: 50, height: 50, borderRadius: "100%", border: "1px solid rgba(0,0,0,0.1)"}}>
                        <i style={{fontSize: 22, color: "rgb(199, 81, 185)"}} className="fa-solid fa-shield-halved"></i>
                        <p style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", width: 22, height: 22, boxShadow: "1px 2px 3px rgba(0,0,0,0.3)", borderRadius: "100%", position: "absolute", top: 0, right: -7, color: "white", backgroundColor: "rgb(199, 81, 185)"}}>
                            {scores.safety.rating}</p>
                    </div>
                </div>
                <div className="tooltip_parent" style={{marginRight: 5}}>
                    <div className="tooltip" style={{top: "initial", bottom: "calc(100% + 4px)", zIndex: 3, left: "-50%", borderRadius: 5, padding: 10, minWidth: 200,}}>
                        <p style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", textAlign: "center"}}>
                            <span style={{marginRight: 5, fontWeight: "bolder", fontSize: 14, fontFamily: "'Prompt', Sans-serif",}}>
                                Cost of living:</span>
                                {scores.cost.rating}/10
                        </p>
                        <p style={{fontSize: 14, borderTop: "1px solid rgba(0,0,0,0.1)", marginTop: 5, paddingTop: 5, fontFamily: "'Prompt', Sans-serif", textAlign: "center"}}>
                            {scores.cost.notes}
                        </p>
                        <p style={{fontSize: 14, color: "brown", textDecoration: "underline", cursor: "pointer", paddingTop: 5, fontFamily: "'Prompt', Sans-serif", textAlign: "center"}}>
                            read more...
                        </p>
                    </div>
                    <div style={{fontFamily: "'Prompt', Sans-serif", textAlign: "center", position: "relative", display: "flex", justifyContent: "center", alignItems: "center", width: 50, height: 50, borderRadius: "100%", border: "1px solid rgba(0,0,0,0.1)"}}>
                        <i style={{fontSize: 23, color: "rgb(199, 81, 185)"}} className="fa-solid fa-comment-dollar"></i>
                        <p style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", width: 22, height: 22, boxShadow: "1px 2px 3px rgba(0,0,0,0.3)", borderRadius: "100%", position: "absolute", top: 0, right: -7, color: "white", backgroundColor: "rgb(199, 81, 185)"}}>
                            {scores.cost.rating}</p>
                    </div>
                </div>
                <div className="tooltip_parent" style={{marginRight: 5}}>
                    <div className="tooltip" style={{top: "initial", bottom: "calc(100% + 4px)", zIndex: 3, left: "-50%", borderRadius: 5, padding: 10, minWidth: 200,}}>
                        <p style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", textAlign: "center"}}>
                            <span style={{marginRight: 5, fontWeight: "bolder", fontSize: 14, fontFamily: "'Prompt', Sans-serif",}}>
                                Urbanization:</span>
                                {scores.urbanization.rating}/10
                        </p>
                        <p style={{fontSize: 14, borderTop: "1px solid rgba(0,0,0,0.1)", marginTop: 5, paddingTop: 5, fontFamily: "'Prompt', Sans-serif", textAlign: "center"}}>
                            {scores.urbanization.notes}
                        </p>
                        <p style={{fontSize: 14, color: "brown", textDecoration: "underline", cursor: "pointer", paddingTop: 5, fontFamily: "'Prompt', Sans-serif", textAlign: "center"}}>
                            read more...
                        </p>
                    </div>
                    <div style={{fontFamily: "'Prompt', Sans-serif", textAlign: "center", position: "relative", display: "flex", justifyContent: "center", alignItems: "center", width: 50, height: 50, borderRadius: "100%", border: "1px solid rgba(0,0,0,0.1)"}}>
                        <i style={{fontSize: 20, color: "rgb(199, 81, 185)"}} className="fa-solid fa-city"></i>
                        <p style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", width: 22, height: 22, boxShadow: "1px 2px 3px rgba(0,0,0,0.3)", borderRadius: "100%", position: "absolute", top: 0, right: -7, color: "white", backgroundColor: "rgb(199, 81, 185)"}}>
                            {scores.urbanization.rating}</p>
                    </div>
                </div>
                <div className="tooltip_parent" style={{marginRight: 5}}>
                    <div className="tooltip" style={{top: "initial", bottom: "calc(100% + 4px)", zIndex: 3, left: "-50%", borderRadius: 5, padding: 10, minWidth: 200,}}>
                        <p style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", textAlign: "center"}}>
                            <span style={{marginRight: 5, fontWeight: "bolder", fontSize: 14, fontFamily: "'Prompt', Sans-serif",}}>
                                Subway:</span>
                                {scores.subway.rating}/10
                        </p>
                        <p style={{fontSize: 14, borderTop: "1px solid rgba(0,0,0,0.1)", marginTop: 5, paddingTop: 5, fontFamily: "'Prompt', Sans-serif", textAlign: "center"}}>
                            {scores.subway.notes}
                        </p>
                        <p style={{fontSize: 14, color: "brown", textDecoration: "underline", cursor: "pointer", paddingTop: 5, fontFamily: "'Prompt', Sans-serif", textAlign: "center"}}>
                            read more...
                        </p>
                    </div>
                    <div style={{fontFamily: "'Prompt', Sans-serif", textAlign: "center", position: "relative", display: "flex", justifyContent: "center", alignItems: "center", width: 50, height: 50, borderRadius: "100%", border: "1px solid rgba(0,0,0,0.1)"}}>
                        <i style={{fontSize: 20, color: scores.subway.rating ? "rgb(199, 81, 185)" : "rgba(0,0,0,0.4)"}} className="fa-solid fa-train-subway"></i>
                        <p style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", width: 22, height: 22, boxShadow: "1px 2px 3px rgba(0,0,0,0.3)", borderRadius: "100%", position: "absolute", top: 0, right: -7, color: "white", backgroundColor: scores.subway.rating ? "rgb(199, 81, 185)" : "rgba(0,0,0,0.4)"}}>
                            {scores.subway.rating}</p>
                    </div>
                </div>
                <div className="tooltip_parent" style={{marginRight: 5}}>
                    <div className="tooltip" style={{top: "initial", bottom: "calc(100% + 4px)", zIndex: 3, left: "-50%", borderRadius: 5, padding: 10, minWidth: 200,}}>
                        <p style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", textAlign: "center"}}>
                            <span style={{marginRight: 5, fontWeight: "bolder", fontSize: 14, fontFamily: "'Prompt', Sans-serif",}}>
                                Bus:</span>
                                {scores.bus.rating}/10
                        </p>
                        <p style={{fontSize: 14, borderTop: "1px solid rgba(0,0,0,0.1)", marginTop: 5, paddingTop: 5, fontFamily: "'Prompt', Sans-serif", textAlign: "center"}}>
                            {scores.bus.notes}
                        </p>
                        <p style={{fontSize: 14, color: "brown", textDecoration: "underline", cursor: "pointer", paddingTop: 5, fontFamily: "'Prompt', Sans-serif", textAlign: "center"}}>
                            read more...
                        </p>
                    </div>
                    <div style={{fontFamily: "'Prompt', Sans-serif", textAlign: "center", position: "relative", display: "flex", justifyContent: "center", alignItems: "center", width: 50, height: 50, borderRadius: "100%", border: "1px solid rgba(0,0,0,0.1)"}}>
                        <i style={{fontSize: 20, color: "rgb(199, 81, 185)"}} className="fa-solid fa-bus"></i>
                        <p style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", width: 22, height: 22, boxShadow: "1px 2px 3px rgba(0,0,0,0.3)", borderRadius: "100%", position: "absolute", top: 0, right: -7, color: "white", backgroundColor: "rgb(199, 81, 185)"}}>
                            {scores.bus.rating}</p>
                    </div>
                </div>
                <div className="tooltip_parent" style={{marginRight: 5}}>
                    <div className="tooltip" style={{top: "initial", bottom: "calc(100% + 4px)", zIndex: 3, left: "-50%", borderRadius: 5, padding: 10, minWidth: 200,}}>
                        <p style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", textAlign: "center"}}>
                            <span style={{marginRight: 5, fontWeight: "bolder", fontSize: 14, fontFamily: "'Prompt', Sans-serif",}}>
                                Taxi:</span>
                                {scores.taxi.rating}/10
                        </p>
                        <p style={{fontSize: 14, borderTop: "1px solid rgba(0,0,0,0.1)", marginTop: 5, paddingTop: 5, fontFamily: "'Prompt', Sans-serif", textAlign: "center"}}>
                            {scores.taxi.notes}
                        </p>
                        <p style={{fontSize: 14, color: "brown", textDecoration: "underline", cursor: "pointer", paddingTop: 5, fontFamily: "'Prompt', Sans-serif", textAlign: "center"}}>
                            read more...
                        </p>
                    </div>
                    <div style={{fontFamily: "'Prompt', Sans-serif", textAlign: "center", position: "relative", display: "flex", justifyContent: "center", alignItems: "center", width: 50, height: 50, borderRadius: "100%", border: "1px solid rgba(0,0,0,0.1)"}}>
                        <i style={{fontSize: 20, color: "rgb(199, 81, 185)"}} className="fa-solid fa-taxi"></i>
                        <p style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", width: 22, height: 22, boxShadow: "1px 2px 3px rgba(0,0,0,0.3)", borderRadius: "100%", position: "absolute", top: 0, right: -7, color: "white", backgroundColor: "rgb(199, 81, 185)"}}>
                            {scores.taxi.rating}</p>
                    </div>
                </div>
            </div> 
        </div>
    );
}

export default PlacesReviewsScores;