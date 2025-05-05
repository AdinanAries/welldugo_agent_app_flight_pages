import securepaymentssvg from '../../../icons/securepayments.svg';
import bestdealssvg from '../../../icons/bestdeals.svg';
import customersupportsvg from '../../../icons/customersupport.svg';

const OurPromises = () => {
    return (
        <div className="get_best_deals_container" style={{padding: "20px 0"}}>
            <h1 className="page_title" style={{textAlign: "center", fontSize: 20, marginTop: 10, color: "rgba(0,0,0,0.7)", marginBottom: "10px", fontWeight: 1000, fontFamily: "'Prompt', Sans-serif",}}
            >Get the best deals at the best prices!</h1>
            <h1 className="title_desc" style={{textAlign: "center", marginTop: -10, letterSpacing: 1, fontSize: 16, color: "rgba(0,0,0,0.6)", fontWeight: 1000, fontFamily: "'Prompt', Sans-serif",}}
            ></h1>
            <div className="why-choose-us-container" >
                <div className="each-choose-us-container">
                    
                    <div style={{backgroundImage: `url('${bestdealssvg}')`, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center",
                        height: 150, marginTop: 5, marginBottom: 5}}>

                    </div>
                    <p style={{color: "rgba(0,0,0,0.7)", fontWeight: "bolder", textAlign: "center", marginBottom: 5, fontFamily: "Courgette", fontFamily: "'Prompt', Sans-serif"}}>
                        Best Deals</p>
                    <p style={{color: "rgba(0,0,0,0.7)", textAlign: "center", fontSize: 15, fontFamily: "'Prompt', sans-serif"}}>
                        1. We strive to get you the best deals and prices more than the others...</p>
                </div>
                <div className="each-choose-us-container">
                    
                    <div style={{backgroundImage: `url('${securepaymentssvg}')`, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center",
                        height: 150, marginTop: 5, marginBottom: 5}}>

                    </div>
                    <p style={{color: "rgba(0,0,0,0.7)", fontWeight: "bolder", textAlign: "center", marginBottom: 5, fontFamily: "Courgette", fontFamily: "'Prompt', Sans-serif"}}>
                        Secure Payment</p>
                    <p style={{color: "rgba(0,0,0,0.7)", textAlign: "center", fontSize: 15, fontFamily: "'Prompt', sans-serif"}}>
                        2. Then provide you with effective security protocols to protect your data...</p>
                </div>
                <div className="each-choose-us-container">
                    
                    <div style={{backgroundImage: `url('${customersupportsvg}')`, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center",
                        height: 150, marginTop: 5, marginBottom: 5}}>

                    </div>
                    <p style={{color: "rgba(0,0,0,0.7)", fontWeight: "bolder", textAlign: "center", marginBottom: 5, fontFamily: "Courgette", fontFamily: "'Prompt', Sans-serif"}}>
                        Customer Support</p>
                    <p style={{color: "rgba(0,0,0,0.7)", textAlign: "center", fontSize: 15, fontFamily: "'Prompt', sans-serif"}}>
                        3. Our helpdesk will be here at all times waiting to support you...</p>
                </div>
            </div>
        </div>
    );
}

export default OurPromises;