import React, { useEffect } from "react";
import { useStateValue } from "../context/stateProvider";
import { motion } from "framer-motion";

import Header from "./Header";
import { actionType } from "../context/reducer";
import axios from "axios";

const Home = () => {
  const [
    {
      searchTerm,
      isSongPlaying,
      song,
      allSongs,
      artistFilter,
      filterTerm,
      albumFilter,
      languageFilter,
    },
    dispatch,
  ] = useStateValue();
  const getAllSongs = async () => {
    try {
      const res = await axios.get(
        `https://online-music-app.onrender.com/songs/getall`
      );
      //  console.log(res.data);
      dispatch({
        type: actionType.SET_ALL_SONGS,
        allSongs: res.data.data,
      });
    } catch (error) {
      return null;
    }
  };
  useEffect(() => {
    getAllSongs();
  }, []);
  return (
    <div className="h-auto  flex-col flex items-center justify-center min-w-[680px]">
      <div className="w-full  bg-orange-100">
        <Header />{" "}
      </div>
      <div className="w-full h-auto flex items-center justify-evenly gap-4 flex-wrap p-4">
        <HomeSongContainer musics={allSongs} />
      </div>
    </div>
  );
};

export default Home;

export const HomeSongContainer = ({ musics }) => {
  const [{ allSongs, isSongPlaying, songIndex }, dispatch] = useStateValue();

  const addSongToContext = (index) => {
    if (!isSongPlaying) {
      dispatch({
        type: actionType.SET_ISSONG_PLAYING,
        isSongPlaying: true,
      });
    }
    if (songIndex !== index) {
      dispatch({
        type: actionType.SET_SONG_INDEX,
        songIndex: index,
      });
    }
  };
  return (
    <>
      {musics?.map((data, index) => (
        <motion.div
          key={data._id}
          whileTap={{ scale: 0.8 }}
          initial={{ opacity: 0, translateX: -50 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="relative w-40 min-w-210 px-2 py-4 cursor-pointer hover:shadow-xl hover:bg-card bg-gray-100 shadow-md rounded-lg flex flex-col items-center"
          onClick={() => addSongToContext(index)}
        >
          <div className="w-40 min-w-[160px] h-40 min-h-[160px] rounded-lg drop-shadow-lg relative overflow-hidden">
            <motion.img
              whileHover={{ scale: 1.05 }}
              src={data.imageURL}
              alt=""
              className=" w-full h-full rounded-lg object-cover"
            />
          </div>

          <p className="text-base text-headingColor font-semibold my-2">
            {data.name.length > 25 ? `${data.name.slice(0, 25)}` : data.name}
            <span className="block text-sm text-gray-400 my-1">
              {data.artist}
            </span>
          </p>
        </motion.div>
      ))}
    </>
  );
};
