import React, { useState, useEffect } from "react";
import { IoAdd, IoTrash } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { AiOutlineClear } from "react-icons/ai";
import axios from "axios";
import { actionType } from "../../context/reducer";
import { useStateValue } from "../../context/stateProvider";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "../../config/firebase";

const Songs = () => {
  const [songFilter, setSongFilter] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [filteredSongs, setFilteredSongs] = useState(null);

  const [{ allSongs }, dispatch] = useStateValue();

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
    <div>
      <div className="w-full p-4 flex items-center justify-center flex-col">
        <div className="w-full flex justify-center items-center gap-24">
          <NavLink
            to={"/dashboard/newSong"}
            className="flex items-center px-4 py-3 border rounded-md border-gray-300 hover:border-gray-400 hover:shadow-md cursor-pointer"
          >
            <IoAdd />
            <div>ADD FILES</div>
          </NavLink>
          <input
            type="text"
            placeholder="Search here"
            className={`w-52 px-4 py-2 border ${
              isFocus ? "border-gray-500 shadow-md" : "border-gray-300"
            } rounded-md bg-transparent outline-none duration-150 transition-all ease-in-out text-base text-textColor font-semibold`}
            value={songFilter}
            onChange={(e) => setSongFilter(e.target.value)}
            onBlur={() => setIsFocus(false)}
            onFocus={() => setIsFocus(true)}
          />
          <motion.i
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileTap={{ scale: 0.75 }}
            onClick={() => {
              setSongFilter("");
            }}
          >
            <AiOutlineClear className="text-3xl text-textColor cursor-pointer" />
          </motion.i>
        </div>
        <div className="relative w-full  my-4 p-4 py-12 border border-gray-300 rounded-md">
          {/* <div className="absolute top-4 left-4">
            <p className="text-xl font-bold">
              <span className="text-sm font-semibold text-textColor">
                Count :
              </span>
              {filteredSongs ? filteredSongs?.length : allSongs?.length}
            </p>
          </div> */}
          <SongContainer data={filteredSongs ? filteredSongs : allSongs} />
        </div>
      </div>
    </div>
  );
};

export default Songs;

export const SongContainer = ({ data }) => {
  return (
    <div className=" w-full  flex flex-wrap gap-3  items-center justify-evenly">
      {data &&
        data.map((song, i) => (
          <AlbumCard key={song._id} data={song} index={i} type="song" />
        ))}
    </div>
  );
};

//////////////////////////////
export const AlbumCard = ({ data, type, index }) => {
  const [isDeleted, setIsDeleted] = useState(false);
  const [
    {
      allArtists,
      allAlbums,
      albumFilter,
      artistFilter,
      filterTerm,
      languageFilter,
      allSongs,
      isSongPlaying,
      songIndex,
    },
    dispath,
  ] = useStateValue();

  //
  const deleteSongById = async (id) => {
    try {
      const res = await axios.delete(
        `https://online-music-app.onrender.com/songs/delete/${id}`
      );
      return res;
    } catch (error) {
      return null;
    }
  };
  const deleteArtistById = async (id) => {
    try {
      const res = await axios.delete(
        `https://online-music-app.onrender.com/artist/delete/${id}`
      );
      return res;
    } catch (error) {
      return null;
    }
  };
  const deleteAlbumById = async (id) => {
    try {
      const res = await axios.delete(
        `https://online-music-app.onrender.com/album/delete/${id}`
      );
      return res;
    } catch (error) {
      return null;
    }
  };
  //
  const deleteData = (data) => {
    if (type === "album") {
      const deleteRef = ref(storage, data.imageURL);
      deleteObject(deleteRef).then(() => {});
      window.location.reload();
      deleteAlbumById(data._id);
    }
    if (type === "song") {
      const deleteRef = ref(storage, data.imageURL);
      deleteObject(deleteRef).then(() => {});
      deleteSongById(data._id);
    }
    if (type === "artist") {
      const deleteRef = ref(storage, data.imageURL);
      deleteObject(deleteRef).then(() => {});
      deleteArtistById(data._id);
    }
  };
  const addToContext = () => {
    // console.log(type);
    if (!isSongPlaying) {
      //console.log(isSongPlaying);
      dispath({
        type: actionType.SET_ISSONG_PLAYING,
        isSongPlaying: true,
      });
    }
    if (songIndex !== index) {
      //console.log(index);
      dispath({
        type: actionType.SET_SONG_INDEX,
        songIndex: index,
      });
    }
  };
  return (
    <motion.div
      whileTap={{ scale: 0.8 }}
      initial={{ opacity: 0, translateX: -50 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      onClick={type === "song" && addToContext}
      className="relative w-40 min-w-210 px-2 py-4 cursor-pointer hover:shadow-xl hover:bg-card bg-gray-100 shadow-md rounded-lg flex flex-col items-center"
    >
      {isDeleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          className="absolute z-10 p-2 inset-0 bg-card backdrop-blur-md flex flex-col gap-6 items-center justify-center"
        >
          <p className="text-sm text-center text-textColor font-semibold">
            Are you sure do you want to delete this song?
          </p>

          <div className="flex items-center gap-3">
            <button
              className="text-sm px-4 py-1 rounded-md text-white hover:shadow-md bg-teal-400"
              onClick={() => deleteData(data)}
            >
              Yes
            </button>
            <button
              className="text-sm px-4 py-1 rounded-md text-white hover:shadow-md bg-gray-400"
              onClick={() => setIsDeleted(false)}
            >
              No
            </button>
          </div>
        </motion.div>
      )}{" "}
      <div className="w-40 min-w-[160px] h-40 min-h-[160px] rounded-lg drop-shadow-lg relative overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={data.imageURL}
          className=" w-full h-full rounded-lg object-cover"
        />
      </div>
      <p className="text-base text-headingColor font-semibold my-2">
        {data.name.length > 25 ? `${data.name.slice(0, 25)}` : data.name}
        <span className="block text-sm text-gray-400 my-1">
          {data.name.length > 25 ? `${data.name.slice(0, 25)}` : data.name}
        </span>
      </p>
      <div className="w-full absolute bottom-2 right-2 flex items-center justify-between px-4">
        <motion.div
          whileTap={{ scale: 0.75 }}
          onClick={() => setIsDeleted(true)}
        >
          <IoTrash className="text-base text-red-400 drop-shadow-md hover:text-red-600" />
        </motion.div>
      </div>
    </motion.div>
  );
};
