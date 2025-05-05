import DealItem from "./DealItem";

const DealList = (props) => {
    const {
        deals
    } = props;
    return <div>
        <div style={{marginTop: 10, backgroundColor: "white", padding: 15, border: "1px solid rgba(0,0,0,0.1)"}}>
            <p style={{color: "rgba(0,0,0,0.7)", fontSize: 16, fontFamily: "'Prompt', sans-serif", fontWeight: "bolder", marginBottom: 10}}>
                <i className="fa fa-info-circle" style={{fontSize: 19, marginRight: 10}}></i>Important Notice
            </p>
            <p style={{color: "rgba(0,0,0,0.7)", fontSize: 15}}>
                The following deals shown below has been ... this is some information to be displayed for the customer
            </p>
        </div>
        <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
            {
                deals.map(each=><DealItem deal={each} />)
            }
        </div>
    </div>
}

export default DealList;