import axios from "axios";
import React, { useEffect } from "react";
import { actionType } from "../../context/reducer";
import { useStateValue } from "../../context/stateProvider";
import { FaUsers } from "react-icons/fa";
import { GiLoveSong, GiMusicalNotes } from "react-icons/gi";
import { RiUserStarFill } from "react-icons/ri";

export const DashboardCard = ({ icon, name, count }) => {
  const bgColors = [
    "#E9E2FF",
    "#FAE2FF",
    "#FFE2E6",
    "#E2FFE9",
    "#E2F4FF",
    "#FFFFE2",
  ];
  const bg_color = bgColors[parseInt(Math.random() * bgColors.length)];

  return (
    <div
      style={{ background: `${bg_color}` }}
      className={`p-4 w-40 gap-3 h-auto rounded-lg shadow-md flex flex-col items-center justify-center`}
    >
      {icon}
      <p className="text-xl text-textColor font-semibold">{name}</p>
      <p className="text-sm text-textColor">{count}</p>
    </div>
  );
};

const DashboardHome = () => {
  const [{ allUsers, allSongs, allArtists, allAlbums }, dispatch] =
    useStateValue();

  const getAllUsers = async () => {
    try {
      const res = await axios.get(
        `https://online-music-app.onrender.com/register/getall`
      );
      //console.log(res.data);
      dispatch({
        type: actionType.SET_ALL_USERS,
        allUsers: res.data.data,
      });
    } catch (error) {
      return null;
    }
  };
  const getAllArtist = async () => {
    try {
      const res = await axios.get(
        `https://online-music-app.onrender.com/artist/getall`
      );
      // console.log(res.data);
      dispatch({
        type: actionType.SET_ALL_ARTISTS,
        allArtists: res.data.data,
      });
    } catch (error) {
      return null;
    }
  };
  const getAllSongs = async () => {
    try {
      const res = await axios.get(
        `https://online-music-app.onrender.com/songs/getall`
      );
      // console.log(res.data);
      dispatch({
        type: actionType.SET_ALL_SONGS,
        allSongs: res.data.data,
      });
    } catch (error) {
      return null;
    }
  };
  const getAllAlbum = async () => {
    try {
      const res = await axios.get(
        `https://online-music-app.onrender.com/album/getall`
      );
      //console.log(res.data);
      dispatch({
        type: actionType.SET_ALL_ALBUMS,
        allAlbums: res.data.data,
      });
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    getAllUsers();
    getAllAlbum();
    getAllArtist();
    getAllSongs();
  }, []);

  return (
    <div>
      <div className="w-full p-6 flex items-center justify-evenly flex-wrap">
        <DashboardCard
          icon={<FaUsers className="text-3xl text-textColor" />}
          name={"Users"}
          count={allUsers?.length > 0 ? allUsers?.length : 0}
        />

        {/* prettier-ignore */}
        <DashboardCard icon={<GiLoveSong className="text-3xl text-textColor" />} name={"Songs"} count={allSongs?.length > 0 ? allSongs?.length : 0} />

        {/* prettier-ignore */}
        <DashboardCard icon={<RiUserStarFill className="text-3xl text-textColor" />} name={"Artist"} count={allArtists?.length > 0 ?allArtists?.length : 0} />

        {/* prettier-ignore */}
        <DashboardCard icon={<GiMusicalNotes className="text-3xl text-textColor" />} name={"Album"} count={allAlbums?.length > 0 ? allAlbums?.length : 0} />
      </div>
    </div>
  );
};

export default DashboardHome;
