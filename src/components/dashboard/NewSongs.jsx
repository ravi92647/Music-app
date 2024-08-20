import React, { useEffect, useRef, useState } from "react";
import FilterButton from "./FilterButton";
import axios from "axios";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { motion } from "framer-motion";

import { BiCloudUpload } from "react-icons/bi";
import { MdDelete } from "react-icons/md";

import { storage } from "../../config/firebase";
import { useStateValue } from "../../context/stateProvider";

import { actionType } from "../../context/reducer";
import { filterByLanguage, filters } from "../../utils/supportfunctions";
import Swal from "sweetalert2";
// import { IoMusicalNote } from "react-icons/io5";
// import AlertSuccess from "./AlertSuccess";
// import AlertError from "./AlertError";

const NewSongs = () => {
  const [songName, setSongName] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [songImageCover, setSongImageCover] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);

  //audio usestate

  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [audioUploadingProgress, setAudioUploadingProgress] = useState(0);
  const [audioImageCover, setAudioImageCover] = useState(null);

  ///artist usestate
  const [isArtistLoading, setIsArtistLoading] = useState(false);
  const [artistUploadingProgress, setArtistUploadingProgress] = useState(0);
  const [artistImageCover, setArtistImageCover] = useState(null);
  const [artistName, setArtistName] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  ///album artist
  const [isAlbumLoading, setIsAlbumLoading] = useState(false);
  const [albumUploadingProgress, setAlbumUploadingProgress] = useState(0);
  const [albumImageCover, setAlbumImageCover] = useState(null);
  const [albumName, setAlbumName] = useState("");

  const [
    {
      allArtists,
      allAlbums,
      albumFilter,
      artistFilter,
      filterTerm,
      languageFilter,
      allSongs,
    },
    dispatch,
  ] = useStateValue();
  const getAllAlbum = async () => {
    try {
      const res = await axios.get(
        `https://online-music-app.onrender.com/album/getall`
      );
      // console.log(res.data);
      dispatch({
        type: actionType.SET_ALL_ALBUMS,
        allAlbums: res.data.data,
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
      //  console.log(res.data);
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
    getAllAlbum();
    getAllArtist();
  }, []);

  const deleteImageObject = (url, isImage) => {
    if (isImage) {
      setIsImageLoading(true);
      setIsAudioLoading(true);

      Swal.fire({
        title: "Deleted Successfully",
        icon: "success",
        confirmButtonText: "okay",
      });
    }

    const deleteRef = ref(storage, url);
    deleteObject(deleteRef).then(() => {
      setSongImageCover(null);
      setIsImageLoading(false);
      setAudioImageCover(null);
      setIsAudioLoading(false);
    });
  };

  const deleteArtistObject = (url, isImage) => {
    if (isImage) {
      setIsArtistLoading(true);
      Swal.fire({
        title: "Deleted Successfully",
        icon: "success",
        confirmButtonText: "okay",
      });
    }

    const deleteRef = ref(storage, url);
    deleteObject(deleteRef).then(() => {
      setArtistImageCover(null);
      setIsArtistLoading(false);
    });
  };
  const deleteAlbumObject = (url, isImage) => {
    if (isImage) {
      setIsAlbumLoading(true);
      Swal.fire({
        title: "Deleted Successfully",
        icon: "success",
        confirmButtonText: "okay",
      });
    }

    const deleteRef = ref(storage, url);
    deleteObject(deleteRef).then(() => {
      setAlbumImageCover(null);
      setIsAlbumLoading(false);
    });
  };
  const saveNewSong = async (data) => {
    try {
      const res = await axios.post(
        `https://online-music-app.onrender.com/songs/save`,
        {
          ...data,
        }
      );
      // console.log(res);
      dispatch({
        type: actionType.SET_ALL_SONGS,
        allSongs: res.data.data,
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  const saveSong = () => {
    if (
      !songImageCover ||
      !audioImageCover ||
      !songName ||
      !artistFilter ||
      !albumFilter ||
      !languageFilter ||
      !filterTerm
    ) {
      // console.log("file missing");
      Swal.fire({
        title: "Fill All Feild",
        icon: "error",
        confirmButtonText: "okay",
      });
    } else {
      setIsAudioLoading(true);
      setIsImageLoading(true);
      const data = {
        name: songName,
        imageURL: songImageCover,
        songUrl: audioImageCover,
        album: albumFilter,
        artist: artistFilter,
        language: languageFilter,
        category: filterTerm,
      };

      saveNewSong(data).then((res) => {
        getAllSongs().then((Song) => {
          dispatch({
            type: actionType.SET_ALL_SONGS,
            allSongs: Song,
          });
        });
        Swal.fire({
          title: "Song Created Successfully",
          icon: "success",
          confirmButtonText: "okay",
        });
      });
      setIsImageLoading(false);
      setIsAudioLoading(false);
      setSongName("");
      setSongImageCover(null);
      setAudioImageCover(null);
      dispatch({ type: actionType.SET_ARTIST_FILTER, artistFilter: null });
      dispatch({
        type: actionType.SET_LANGUAGE_FILTER,
        languageFilter: null,
      });
      dispatch({ type: actionType.SET_ALBUM_FILTER, albumFilter: null });
      dispatch({ type: actionType.SET_FILTER_TERM, filterTerm: null });
    }
  };
  //////////////////////////////
  const saveNewArtist = async (data) => {
    try {
      const res = await axios.post(
        `https://online-music-app.onrender.com/artist/save`,
        {
          ...data,
        }
      );
      //console.log(res);
      dispatch({
        type: actionType.SET_ALL_ARTISTS,
        allArtists: res.data.data,
      });
    } catch (error) {
      return null;
    }
  };

  const saveArtist = () => {
    if (!artistImageCover || !twitter || !instagram || !artistName) {
      // console.log("fill all");
      Swal.fire({
        title: "Fill All Feilds",
        icon: "error",
        confirmButtonText: "okay",
      });
    } else {
      setIsArtistLoading(true);
      const data = {
        name: artistName,
        imageURL: artistImageCover,
        twitter: twitter,
        instagram: instagram,
      };
      saveNewArtist(data).then((res) => {
        getAllArtist().then((data) => {
          dispatch({
            type: actionType.SET_ALL_ARTISTS,
            allArtists: data,
          });
        });
        Swal.fire({
          title: "Artist Created Successfully",
          icon: "success",
          confirmButtonText: "okay",
        });
      });
      setArtistName("");
      setArtistImageCover(null);
      setIsArtistLoading(null);
      setTwitter("");
      setInstagram("");
    }
  };

  const saveNewAlbum = async (data) => {
    try {
      const res = await axios.post(
        `https://online-music-app.onrender.com/album/save`,
        {
          ...data,
        }
      );
      // console.log(res);
      dispatch({
        type: actionType.SET_ALL_ALBUMS,
        allAlbums: res.data.data,
      });
    } catch (error) {
      return null;
    }
  };

  const saveAlbum = () => {
    if (!albumImageCover || !albumName) {
      //console.log("fill all");
      Swal.fire({
        title: "Fill All Feild",
        icon: "error",
        confirmButtonText: "okay",
      });
    } else {
      setIsAlbumLoading(true);
      const data = {
        name: albumName,
        imageURL: albumImageCover,
      };
      saveNewAlbum(data).then((res) => {
        getAllAlbum().then((data) => {
          dispatch({
            type: actionType.SET_ALL_ALBUMS,
            allAlbums: data,
          });
        });
        Swal.fire({
          title: "Album Created Successfully",
          icon: "success",
          confirmButtonText: "okay",
        });
      });
      setAlbumName("");
      setAlbumImageCover(null);
      setIsAlbumLoading(null);
    }
  };

  return (
    <>
      <div className="flex items-center flex-col justify-center p-4 border border-gray-300 rounded-md">
        <p className="text-xl font-semibold text-headingColor">Upload Song</p>
        <input
          type="text"
          placeholder="Type your song name"
          className="w-full p-3 rounded-md text-base font-semibold text-textColor outline-none shadow-sm border border-gray-300 bg-transparent"
          value={songName}
          onChange={(e) => setSongName(e.target.value)}
        />
        <div className="flex w-full justify-between flex-wrap m-3 items-center gap-4">
          <FilterButton filterData={allArtists} flag={"Artist"} />
          <FilterButton filterData={allAlbums} flag={"Albums"} />
          <FilterButton filterData={filterByLanguage} flag={"Language"} />
          <FilterButton filterData={filters} flag={"Category"} />
        </div>
        {/* image uploading*/}
        <div className="bg-card  backdrop-blur-md w-full  h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
          {isImageLoading && <FileLoader progress={imageUploadProgress} />}
          {!isImageLoading && (
            <>
              {!songImageCover ? (
                <FileUploader
                  updateState={setSongImageCover}
                  setProgress={setImageUploadProgress}
                  isLoading={setIsImageLoading}
                  isImage={true}
                />
              ) : (
                <div className="relative w-full h-full overflow-hidden rounded-md">
                  <img
                    src={songImageCover}
                    alt="uploaded image"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md  duration-500 transition-all ease-in-out"
                    onClick={() => {
                      deleteImageObject(songImageCover, true);
                    }}
                  >
                    <MdDelete className="text-white" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        {/* audio uploading */}
        <div className="bg-card  backdrop-blur-md w-full  h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
          {isAudioLoading && <FileLoader progress={audioUploadingProgress} />}
          {!isAudioLoading && (
            <>
              {!audioImageCover ? (
                <FileUploader
                  updateState={setAudioImageCover}
                  setProgress={setAudioUploadingProgress}
                  isLoading={setIsAudioLoading}
                  isImage={false}
                />
              ) : (
                <div className="relative w-full h-full overflow-hidden flex justify-center items-center rounded-md">
                  <audio src={audioImageCover} controls />
                  <button
                    type="button"
                    className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md  duration-500 transition-all ease-in-out"
                    onClick={() => {
                      deleteImageObject(audioImageCover, false);
                    }}
                  >
                    <MdDelete className="text-white" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        <div className="flex items-center justify-center w-full p-4">
          {isImageLoading || isAudioLoading ? (
            <DisabledButton />
          ) : (
            <motion.button
              whileTap={{ scale: 0.75 }}
              className="px-8 py-2 rounded-md text-white bg-red-600 w-60 hover:shadow-lg"
              onClick={saveSong}
            >
              Save Song
            </motion.button>
          )}
        </div>
        {/* artist uploading */}
        <p className="text-xl font-semibold text-headingColor">
          Artist Details
        </p>

        <div className="bg-card  backdrop-blur-md w-full  h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
          {isArtistLoading && <FileLoader progress={artistUploadingProgress} />}
          {!isArtistLoading && (
            <>
              {!artistImageCover ? (
                <FileUploader
                  updateState={setArtistImageCover}
                  setProgress={setArtistUploadingProgress}
                  isLoading={setIsArtistLoading}
                  isImage={true}
                />
              ) : (
                <div className="relative w-full h-full overflow-hidden rounded-md">
                  <img
                    src={artistImageCover}
                    alt="uploaded image"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md  duration-500 transition-all ease-in-out"
                    onClick={() => {
                      deleteArtistObject(artistImageCover, true);
                    }}
                  >
                    <MdDelete className="text-white" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        {/* artist name */}
        <input
          type="text"
          placeholder="Type artist name"
          className="w-full p-3 mt-3 rounded-md text-base font-semibold text-textColor outline-none shadow-sm border border-gray-300 bg-transparent"
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
        />
        {/* twitter id */}
        <div className="w-full m-3 p-3 flex items-center rounded-md  shadow-sm border border-gray-300">
          {/* <p className="text-base font-semibold text-gray-400">
            www.twitter.com/
          </p> */}
          <input
            type="text"
            placeholder="your twitter id"
            className="w-full text-base font-semibold text-textColor outline-none bg-transparent"
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
          />
        </div>
        {/* intagram id */}
        <div className="w-full p-3 flex items-center rounded-md  shadow-sm border border-gray-300">
          {/* <p className="text-base font-semibold text-gray-400">
            www.instagram.com/
          </p> */}
          <input
            type="text"
            placeholder="your instagram id"
            className="w-full text-base font-semibold text-textColor outline-none bg-transparent"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
          />
        </div>
        {/* Save button */}
        <div className="flex items-center justify-center w-full p-4">
          {isArtistLoading ? (
            <DisabledButton />
          ) : (
            <motion.button
              whileTap={{ scale: 0.75 }}
              className="px-8 py-2 rounded-md text-white bg-red-600 w-60 hover:shadow-lg"
              onClick={saveArtist}
            >
              Save Artist
            </motion.button>
          )}
        </div>
        {/* album section */}
        <p className="text-xl font-semibold text-headingColor">
          Albums Details
        </p>

        <div className="bg-card  backdrop-blur-md w-full  h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
          {isAlbumLoading && <FileLoader progress={albumUploadingProgress} />}
          {!isAlbumLoading && (
            <>
              {!albumImageCover ? (
                <FileUploader
                  updateState={setAlbumImageCover}
                  setProgress={setAlbumUploadingProgress}
                  isLoading={setIsAlbumLoading}
                  isImage={true}
                />
              ) : (
                <div className="relative w-full h-full overflow-hidden rounded-md">
                  <img
                    src={albumImageCover}
                    alt="uploaded image"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md  duration-500 transition-all ease-in-out"
                    onClick={() => {
                      deleteAlbumObject(albumImageCover, true);
                    }}
                  >
                    <MdDelete className="text-white" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        {/* album name */}
        <input
          type="text"
          placeholder="Type artist name"
          className="w-full p-3 mt-3 rounded-md text-base font-semibold text-textColor outline-none shadow-sm border border-gray-300 bg-transparent"
          value={albumName}
          onChange={(e) => setAlbumName(e.target.value)}
        />
        {/* Save button */}
        <div className="flex items-center justify-center w-full p-4">
          {isAlbumLoading ? (
            <DisabledButton />
          ) : (
            <motion.button
              whileTap={{ scale: 0.75 }}
              className="px-8 py-2 rounded-md text-white bg-red-600 w-60 hover:shadow-lg"
              onClick={saveAlbum}
            >
              Save Song
            </motion.button>
          )}
        </div>
      </div>
    </>
  );
};

export default NewSongs;

///////////////////////////
////////////////////////
export const DisabledButton = () => {
  return (
    <button
      disabled
      type="button"
      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
    >
      <svg
        role="status"
        className="inline w-4 h-4 mr-3 text-white animate-spin"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="#E5E7EB"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentColor"
        />
      </svg>
      Loading...
    </button>
  );
};

///////////////////////////
/////////////////////

export const FileUploader = ({
  isLoading,
  updateState,
  isImage,
  setProgress,
}) => {
  const uploadFile = (e) => {
    isLoading(true);
    const uploadedFile = e.target.files[0];
    // console.log(uploadedFile);
    // console.log(storage);
    const storageRef = ref(
      storage,
      `${isImage ? "Image" : "Audio"}/${Date.now()}-${uploadedFile.name}`
    );
    // console.log(storageRef);

    const uploadTask = uploadBytesResumable(storageRef, uploadedFile);
    // console.log(uploadTask);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          updateState(downloadUrl);
          isLoading(false);
        });
      }
    );
  };
  return (
    <>
      <>
        <label>
          <div className="flex flex-col items-center justify-center h-full">
            <div className="flex flex-col justify-center items-center cursor-pointer">
              <p className="font-bold text-2xl">
                <BiCloudUpload />
              </p>
              <p className="text-lg">
                click to upload {isImage ? "image" : "audio"}
              </p>
            </div>
          </div>
          <input
            type="file"
            name="upload-image"
            className="w-0 h-0"
            accept={`${isImage ? "image/*" : "audio/*"}`}
            onChange={uploadFile}
          />
        </label>
      </>
    </>
  );
};

export const FileLoader = ({ progress }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <p className="text-xl font-semibold text-textColor">
        {Math.round(progress) > 0 && <>{`${Math.round(progress)}%`}</>}
      </p>
      <div className="w-20 h-20 min-w-[40px] bg-red-600  animate-ping  rounded-full flex items-center justify-center relative">
        <div className="absolute inset-0 rounded-full bg-red-600 blur-xl "></div>
      </div>
    </div>
  );
};
