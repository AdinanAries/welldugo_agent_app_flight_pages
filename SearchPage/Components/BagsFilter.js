const BagsFilter = (props) => {
    
    const { 
        hideBagsFilter,
        checkedBagsFilterQuantity,
        carryOnBagsFilterQuantity,
        setCheckedBagsFilterQuantity,
        setCarryOnBagsFilterQuantity,
        maxCheckedBagsFilter,
        maxCarryOnBagsFilter,
        filterBags,
    } = props;

    const increaseCheckedBags = () => {
        if(checkedBagsFilterQuantity<maxCheckedBagsFilter){
            setCheckedBagsFilterQuantity(checkedBagsFilterQuantity+1);
            filterBags((checkedBagsFilterQuantity+1), carryOnBagsFilterQuantity);
        } else {
            alert("only a maximum of "+maxCheckedBagsFilter);
        }
    }

    const decreaseCheckedBags = () => {
        if(checkedBagsFilterQuantity>0){
            setCheckedBagsFilterQuantity(checkedBagsFilterQuantity-1);
            filterBags((checkedBagsFilterQuantity-1), carryOnBagsFilterQuantity);
        }
    }

    const increaseCarryOnBags = () => {
        if(carryOnBagsFilterQuantity<maxCarryOnBagsFilter){
            setCarryOnBagsFilterQuantity(carryOnBagsFilterQuantity+1);
            filterBags(checkedBagsFilterQuantity, (carryOnBagsFilterQuantity+1));
        } else {
            alert("only a maximum of "+maxCarryOnBagsFilter);
        }
    }

    const decreaseCarryOnBags = () => {
        if(carryOnBagsFilterQuantity>0){
            setCarryOnBagsFilterQuantity(carryOnBagsFilterQuantity-1);
            filterBags(checkedBagsFilterQuantity, (carryOnBagsFilterQuantity-1));
        }
    }

    return <div className="classic_popup_pane" style={{right: -19}}>
        <p onClick={hideBagsFilter} className="hover_bg-grey"
            style={{zIndex: 1, cursor: "pointer", fontFamily: "'Pompt', Sans-serif", position: "absolute", top: 4, right: 10, fontSize: 20, color: "rgba(0,0,0,0.7)", width: 35, height: 35, borderRadius: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
            x</p>
        <div style={{padding: 10, paddingTop: 0, marginBottom: 10}}>
            <p style={{fontSize: 14, fontFamily: "'Prompt', Sans-serif", fontWeight: "bolder"}}>
                Bags
            </p>
        </div>
        <div>
            <div style={{marginBottom: 20}}>
                <div style={{display: "flex", paddingBottom: 10}}>
                    <p style={{marginRight: 10}}>
                        <i style={{color: "green"}} className="fa-solid fa-info"></i>
                    </p>
                    <p style={{fontSize: 11, color: "rgba(0,0,0,0.7)"}}>
                        Available bags include only carry-on bags and free checked-bags allowed on your departure flight
                    </p>
                </div>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 5}}>
                    <div>
                        <p style={{fontSize: 14, color: "rgba(0,0,0,0.7)", fontWeight: "bolder"}}>
                            Carry-on bag</p>
                        <p style={{fontSize: 12, color: "rgba(0,0,0,0.7)"}}>
                            max: {maxCarryOnBagsFilter}</p>
                    </div>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <div onClick={decreaseCarryOnBags} className="hover_bg-grey" style={{cursor: "pointer", width: 35, height: 35, borderRadius: 5, border: "1px solid rgba(0,0,0,0.1)", display: "flex", justifyContent: "center", alignItems: "center"}}>
                            -
                        </div>
                        <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 14, margin: "0 10px", color: "rgba(0,0,0,0.7)"}}>
                            {carryOnBagsFilterQuantity}
                        </p>
                        <div onClick={increaseCarryOnBags} className="hover_bg-grey" style={{cursor: "pointer", width: 35, height: 35, borderRadius: 5, border: "1px solid rgba(0,0,0,0.1)", display: "flex", justifyContent: "center", alignItems: "center"}}>
                            +
                        </div>
                    </div>
                </div>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 25}}>
                    <div>
                        <p style={{fontSize: 14, color: "rgba(0,0,0,0.7)", fontWeight: "bolder"}}>
                            Checked bag</p>
                        <p style={{fontSize: 12, color: "rgba(0,0,0,0.7)"}}>
                            max: {maxCheckedBagsFilter}</p>
                    </div>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <div onClick={decreaseCheckedBags} className="hover_bg-grey" style={{cursor: "pointer", width: 35, height: 35, borderRadius: 5, border: "1px solid rgba(0,0,0,0.1)", display: "flex", justifyContent: "center", alignItems: "center"}}>
                            -
                        </div>
                        <p style={{fontFamily: "'Prompt', Sans-serif", fontSize: 14, margin: "0 10px", color: "rgba(0,0,0,0.7)"}}>
                            {checkedBagsFilterQuantity}
                        </p>
                        <div onClick={increaseCheckedBags} className="hover_bg-grey" style={{cursor: "pointer", width: 35, height: 35, borderRadius: 5, border: "1px solid rgba(0,0,0,0.1)", display: "flex", justifyContent: "center", alignItems: "center"}}>
                            +
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default BagsFilter;