import "./styles.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import UI03 from "./UI03";
import UI04 from "./UI04";
import UI05 from "./UI05";
import UI06 from "./UI06";
import UI07 from "./UI07";
import UI08 from "./UI08";
import UI09 from "./UI09";
import UI11 from "./UI11";
import UI12 from "./UI12";
import UI13 from "./UI13";
import UI14 from "./UI14";
import UI16 from "./UI16";
import UI17 from "./UI17";
import UI18 from "./UI18";
import UI19 from "./UI19";

export default function App() {
  return (
    <Router>
      <div className="App">
        <nav
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          <Link style={{ color: "#fff" }} to="/UI03">
            UI03
          </Link>
          <Link style={{ color: "#fff" }} to="/UI04">
            UI04
          </Link>
          <Link style={{ color: "#fff" }} to="/UI05">
            UI05
          </Link>
          <Link style={{ color: "#fff" }} to="/UI06">
            UI06
          </Link>
          <Link style={{ color: "#fff" }} to="/UI07">
            UI07
          </Link>
          <Link style={{ color: "#fff" }} to="/UI08">
            UI08
          </Link>
          <Link style={{ color: "#fff" }} to="/UI09">
            UI09
          </Link>
          <Link style={{ color: "#fff" }} to="/UI11">
            UI11
          </Link>
          <Link style={{ color: "#fff" }} to="/UI12">
            UI12
          </Link>
          <Link style={{ color: "#fff" }} to="/UI13">
            UI13
          </Link>
          <Link style={{ color: "#fff" }} to="/UI14">
            UI14
          </Link>
          <Link style={{ color: "#fff" }} to="/UI16">
            UI16
          </Link>
          <Link style={{ color: "#fff" }} to="/UI17">
            UI17
          </Link>
          <Link style={{ color: "#fff" }} to="/UI18">
            UI18
          </Link>
          <Link style={{ color: "#fff" }} to="/UI19">
            UI19
          </Link>
        </nav>

        <Routes>
          <Route path="/UI03" element={<UI03 />} />
          <Route path="/UI04" element={<UI04 />} />
          <Route path="/UI05" element={<UI05 />} />
          <Route path="/UI06" element={<UI06 />} />
          <Route path="/UI07" element={<UI07 />} />
          <Route path="/UI08" element={<UI08 />} />
          <Route path="/UI09" element={<UI09 />} />
          <Route path="/UI11" element={<UI11 />} />
          <Route path="/UI12" element={<UI12 />} />
          <Route path="/UI13" element={<UI13 />} />
          <Route path="/UI14" element={<UI14 />} />
          <Route path="/UI16" element={<UI16 />} />
          <Route path="/UI17" element={<UI17 />} />
          <Route path="/UI18" element={<UI18 />} />
          <Route path="/UI19" element={<UI19 />} />
        </Routes>
      </div>
    </Router>
  );
}
