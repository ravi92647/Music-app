import React from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import Header from "../Header";
import UserData from "./user";
import Songs from "./songs";
import Artist from "./artist";
import Album from "./album";
import DashboardHome from "./dashboardhome";
import NewSongs from "./NewSongs";

const Dashboard = () => {
  const isActiveStyles =
    "text-lg text-headingColor font-semibold hover:text-headingColor duration-100 transition-all ease-in-out";
  const isNotActiveStyles =
    "text-lg text-textColor hover:text-headingColor duration-100 transition-all ease-in-out";
  return (
    <div className="h-auto flex items-center justify-center min-w-[680px]">
      <div className="w-full h-auto flex flex-col items-center justify-center ">
        <Header />
        <div className="w-[60%] my-2 p-4 flex items-center justify-evenly">
          {/* prettier-ignore */}
          <NavLink to={"/dashboard/homes"}  className={({ isActive }) => isActive ? isActiveStyles : isNotActiveStyles }><IoHome className="text-2xl text-textColor" /></NavLink>
          {/* prettier-ignore */}
          <NavLink to={"/dashboard/user"} className={({ isActive }) => isActive ? isActiveStyles : isNotActiveStyles }> Users </NavLink>

          {/* prettier-ignore */}
          <NavLink to={"/dashboard/songs"} className={({ isActive }) => isActive ? isActiveStyles : isNotActiveStyles }> Songs </NavLink>

          {/* prettier-ignore */}
          <NavLink to={"/dashboard/artist"} className={({ isActive }) => isActive ? isActiveStyles : isNotActiveStyles }> Artist </NavLink>

          {/* prettier-ignore */}
          <NavLink to={"/dashboard/albums"} className={({ isActive }) => isActive ? isActiveStyles : isNotActiveStyles }> Albums </NavLink>
        </div>
        <div className="my-4 w-full p-4">
          <Routes>
            <Route path="/homes" element={<DashboardHome />} />
            <Route path="/user" element={<UserData />} />
            <Route path="/songs" element={<Songs />} />
            <Route path="/artist" element={<Artist />} />
            <Route path="/albums" element={<Album />} />
            <Route path="/newSong" element={<NewSongs />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
