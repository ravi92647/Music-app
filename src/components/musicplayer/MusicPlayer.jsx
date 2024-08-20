import React, { useState, useEffect } from "react";
import { useStateValue } from "../../context/stateProvider";
import { motion } from "framer-motion";
import { RiPlayListFill } from "react-icons/ri";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import axios from "axios";
import { actionType } from "../../context/reducer";
import { IoArrowRedo, IoMusicalNote } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import "./index.css";

const MusicPlayer = () => {
  const [isPlayList, setIsPlayList] = useState(false);
  const [{ allSongs, isSongPlaying, songIndex, miniPlayer }, dispath] =
    useStateValue();
  ///
  useEffect(() => {
    if (songIndex > allSongs.length) {
      dispath({
        type: actionType.SET_SONG,
        songIndex: 0,
      });
    }
  }, [songIndex]);
  //
  const closeMusicPlayer = () => {
    if (isSongPlaying) {
      dispath({
        type: actionType.SET_ISSONG_PLAYING,
        isSongPlaying: false,
      });
    }
  };

  const togglePlayer = () => {
    if (miniPlayer) {
      dispath({
        type: actionType.SET_MINI_PLAYER,
        miniPlayer: false,
      });
    } else {
      dispath({
        type: actionType.SET_MINI_PLAYER,
        miniPlayer: true,
      });
    }
  };
  const nextTrack = () => {
    // console.log(songIndex > allSongs.length - 1);
    // console.log(songIndex, allSongs.length - 2);
    if (songIndex > allSongs.length - 1) {
      dispath({
        type: actionType.SET_SONG_INDEX,
        songIndex: 0,
      });
    } else {
      dispath({
        type: actionType.SET_SONG_INDEX,
        songIndex: songIndex + 1,
      });
    }
  };

  const previousTrack = () => {
    if (songIndex === 0) {
      dispath({
        type: actionType.SET_SONG_INDEX,
        songIndex: 0,
      });
    } else {
      dispath({
        type: actionType.SET_SONG_INDEX,
        songIndex: songIndex - 1,
      });
    }
  };

  return (
    <>
      <div className="w-full full flex items-center gap-3 ">
        <div
          className={`w-full full items-center gap-3 p-4 ${
            miniPlayer ? "absolute top-40" : "flex relative"
          }`}
        >
          <img
            src={allSongs[songIndex]?.imageURL}
            className="w-40 h-20 object-cover rounded-md"
            alt=""
          />
          <div className="flex items-start flex-col">
            <p className="text-xl text-headingColor font-semibold">
              {`${
                allSongs[songIndex]?.name.length > 20
                  ? allSongs[songIndex]?.name.slice(0, 20)
                  : allSongs[songIndex]?.name
              }`}
              <span className="text-base">({allSongs[songIndex]?.album})</span>
            </p>
            <p className="text-textColor">
              {allSongs[songIndex]?.artist}
              <span className="text-sm text-textColor font-semibold">
                ({allSongs[songIndex]?.category})
              </span>
            </p>
            <motion.i
              whileTap={{ scale: 0.8 }}
              onClick={() => setIsPlayList(!isPlayList)}
            >
              <RiPlayListFill className="text-textColor hover:text-headingColor text-3xl cursor-pointer" />
            </motion.i>
          </div>
          <div className="flex-1 ">
            <AudioPlayer
              src={allSongs[songIndex]?.songUrl}
              onPlay={() => console.log("is playing")}
              autoPlay={true}
              showSkipControls={true}
              onClickNext={nextTrack}
              onClickPrevious={previousTrack}
            />
          </div>
          <div className="h-full flex items-center justify-center flex-col gap-3">
            <motion.i whileTap={{ scale: 0.8 }} onClick={closeMusicPlayer}>
              <IoMdClose className="text-textColor hover:text-headingColor text-2xl cursor-pointer" />
            </motion.i>
            <motion.i whileTap={{ scale: 0.8 }} onClick={togglePlayer}>
              <IoArrowRedo className="text-textColor hover:text-headingColor text-2xl cursor-pointer" />
            </motion.i>
          </div>
          {isPlayList && (
            <>
              <PlayListCard />
            </>
          )}
        </div>
        {miniPlayer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed right-2 bottom-2 "
          >
            <div className="w-40 h-40 rounded-full flex items-center justify-center  relative ">
              <div className="absolute inset-0 rounded-full bg-red-600 blur-xl animate-pulse"></div>
              <img
                onClick={togglePlayer}
                src={allSongs[songIndex]?.imageURL}
                className="z-50 w-32 h-32 rounded-full object-cover cursor-pointer"
                alt=""
              />
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default MusicPlayer;

export const PlayListCard = () => {
  const [{ allSongs, isSongPlaying, songIndex }, dispath] = useStateValue();
  const getAllSongs = async () => {
    try {
      const res = await axios.get(
        `https://online-music-app.onrender.com/songs/getall`
      );
      // console.log(res.data);
      dispath({
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

  const setCurrentPlaySong = (index) => {
    if (!isSongPlaying) {
      dispath({
        type: actionType.SET_ISSONG_PLAYING,
        isSongPlaying: true,
      });
    }
    if (songIndex !== index) {
      dispath({
        type: actionType.SET_SONG_INDEX,
        songIndex: index,
      });
    }
  };
  return (
    <>
      <div className="absolute left-4 bottom-24 gap-2 py-2 w-350 max-w-[350px] h-510 max-h-[510px] flex flex-col overflow-y-scroll scrollbar-thin rounded-md shadow-md bg-primary">
        {allSongs.length > 0 ? (
          allSongs.map((music, index) => (
            <motion.div
              initial={{ opacity: 0, translateX: -50 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`group w-full p-4 hover:bg-card flex gap-3 items-center cursor-pointer ${
                music?._id === songIndex._id ? "bg-card" : "bg-transparent"
              }`}
              onClick={() => setCurrentPlaySong(index)}
              key={index}
            >
              <IoMusicalNote className="text-textColor group-hover:text-headingColor text-2xl cursor-pointer" />
              <div className="flex items-start flex-col">
                <p className="text-lg text-headingColor font-semibold">
                  {`${
                    music?.name.length > 20
                      ? music?.name.slice(0, 20)
                      : music?.name
                  }`}
                  <span className="text-base">({music?.album})</span>
                </p>
                <p className="text-textColor">
                  {music?.artist}
                  <span className="text-sm text-textColor font-semibold">
                    ({music?.category})
                  </span>
                </p>
              </div>
            </motion.div>
          ))
        ) : (
          <></>
        )}
      </div>
    </>
  );
};
