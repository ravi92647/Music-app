import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/dashboard/Dashboard";
import Home from "./components/Home";
import Login from "./components/registration";
import { AnimatePresence, motion } from "framer-motion";

import { useStateValue } from "./context/stateProvider";
import MusicPlayer from "./components/musicplayer/MusicPlayer";

function App() {
  const [{ isSongPlaying }, dispath] = useStateValue();
  return (
    <AnimatePresence exitBeforeEnter>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
      {/* <div className="h-auto flex items-center justify-center min-w-[680px]"> */}
      {isSongPlaying && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`fixed  h-26  inset-x-0 bottom-0  bg-cardOverlay drop-shadow-2xl backdrop-blur-md flex  items-center `}
        >
          <MusicPlayer />
        </motion.div>
      )}
      {/* </div> */}
    </AnimatePresence>
  );
}

export default App;
