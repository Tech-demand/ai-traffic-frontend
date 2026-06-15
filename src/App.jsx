import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import "./app.css";

import Sidebar        from "./components/Sidebar";
import Navbar         from "./components/Navbar";
import Footer         from "./components/Footer";
import Dashboard      from "./components/Dashboard";
import Analytics      from "./pages/Analytics";
import QTablePage     from "./pages/QTablePage";
import SimulationPage from "./pages/SimulationPage";
import LearnPage      from "./pages/LearnPage";

import { useEffect, useState } from "react";
import { getLiveData } from "./services/api";

function Layout({ children, data }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">
        <Navbar data={data} />
        {children}
        <Footer />
      </div>
    </div>
  );
}

function App() {
  const [liveData, setLiveData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const d = await getLiveData();
        if (d && !d.status) setLiveData(d);
      } catch (_) {}
    };
    load();
    const t = setInterval(load, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div className="app-layout">
            <Sidebar />
            <div className="app-main">
              <Dashboard />
              <Footer />
            </div>
          </div>
        } />
        <Route path="/analytics"  element={<Layout data={liveData}><Analytics /></Layout>} />
        <Route path="/qtable"     element={<Layout data={liveData}><QTablePage /></Layout>} />
        <Route path="/simulation" element={<Layout data={liveData}><SimulationPage /></Layout>} />
        <Route path="/learn"      element={<Layout data={liveData}><LearnPage /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;