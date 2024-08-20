import React, { useEffect } from "react";
import axios from "axios";
import { actionType } from "../../context/reducer";
import { useStateValue } from "../../context/stateProvider";
import { IoTrash } from "react-icons/io5";
import { motion } from "framer-motion";
import { AlbumCard } from "./songs";

const Artist = () => {
  const [{ allArtists }, dispatch] = useStateValue();
  //
  const getAllArtists = async () => {
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
  useEffect(() => {
    getAllArtists();
  }, []);
  return (
    <>
      <div className="w-full p-4 flex items-center justify-center flex-col">
        <div className="relative w-full  my-4 p-4 py-12 border border-gray-300 rounded-md">
          <ArtistContainer data={allArtists} />
        </div>
      </div>
    </>
  );
};

export default Artist;
export const ArtistContainer = ({ data }) => {
  return (
    <div className=" w-full  flex flex-wrap gap-3  items-center justify-evenly">
      {data &&
        data.map((artist, id) => (
          <AlbumCard key={artist._id} data={artist} index={id} type="artist" />
        ))}
    </div>
  );
};
