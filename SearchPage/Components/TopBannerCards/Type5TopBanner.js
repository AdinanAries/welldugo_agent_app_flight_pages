import { MapPin, Calendar, Users } from 'lucide-react';

export default function Type5TopBanner(props) {

    const {
        showSearchPageForm,
        setShowSearchPageForm,
    } = props;

  return (
    <div className="bg-blue-600 text-white" style={{marginBottom: 10, display: showSearchPageForm && "none", marginTop: -30}}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <MapPin style={{ width: "16px", height: "16px" }} />
            <div>
              <div className="text-blue-100 text-sm">From</div>
              <div>New York (JFK)</div>
            </div>
          </div>
          
          <div className="text-2xl">→</div>
          
          <div className="flex items-center gap-2">
            <MapPin style={{ width: "16px", height: "16px" }} />
            <div>
              <div className="text-blue-100 text-sm">To</div>
              <div>London (LHR)</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-8">
            <Calendar style={{ width: "16px", height: "16px" }} />
            <div>
              <div className="text-blue-100 text-sm">Departure</div>
              <div>Jan 22, 2024</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Users style={{ width: "16px", height: "16px" }} />
            <div>
              <div className="text-blue-100 text-sm">Passengers</div>
              <div>1 Adult</div>
            </div>
          </div>
          
          <button onClick={()=>setShowSearchPageForm(!showSearchPageForm)}
            className="ml-auto bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors">
            Modify Search
          </button>
        </div>
      </div>
    </div>
  );
}