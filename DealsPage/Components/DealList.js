import DealItem from "./DealItem";

const DealList = (props) => {

    const {
        deals,
        PAGI_LIMIT,
        totalItems,
        setpagiCurrentPage,
        pagiCurrentPage,
    } = props;

    const all_pages = [];
    let i=1;
    while(true){
        all_pages.push(i);
        if(i>=totalItems){
            break
        }
        i+=PAGI_LIMIT;
    }

    return <div>
        <div style={{padding: "5px 10px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#eee"}}>
            <div>
                <p style={{color: "grey", fontSize: 12}}>
                    <span style={{margin: 10, color: "rgba(0,0,0,0.7)", fontSize: 15}}>-</span>
                    Total: 
                    <span style={{color: "blue", margin: 5, fontSize: 13}}>{totalItems}</span> 
                    item(s)
                    <span style={{margin: 10, color: "rgba(0,0,0,0.7)", fontSize: 15}}>-</span>
                </p>
            </div>
            <div>
                {
                    totalItems > PAGI_LIMIT &&
                    <select onInput={e=>setpagiCurrentPage(e.target.value)}
                        value={pagiCurrentPage}
                        className="select-input-paginator"
                    >
                        {
                            all_pages?.map((each, i)=>{
                                return <option
                                    value={each}
                                >{each} - {(each+PAGI_LIMIT-1)}</option>
                                    
                            })  
                        }
                    </select>
                }
            </div>
        </div>
        <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
            {
                deals.map(each=><DealItem 
                        data={each}
                    />)
            }
        </div>
    </div>
}

export default DealList;