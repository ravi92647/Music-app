import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useStateValue } from "../../context/stateProvider";
import moment from "moment";
import axios from "axios";
import { actionType } from "../../context/reducer";
import { MdDelete } from "react-icons/md";

const UserData = () => {
  const [{ allUsers }, dispatch] = useStateValue();

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

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <>
      <div className="w-full p-4 flex items-center justify-center flex-col">
        <div className="relative w-full py-12 min-h-[400px] overflow-x-scroll scrollbar-thin scrollbar-track-slate-300 scrollbar-thumb-slate-400 my-4 flex flex-col items-center justify-start p-4 border border-gray-300 rounded-md gap-3">
          {/* <div className="absolute top-4 left-4">
            <p className="text-xl font-bold">
              <span className="text-sm font-semibold text-textColor">
                Count :
              </span>
              {allUsers?.length}
            </p>
          </div> */}
          <div className="w-full min-w-[750px] flex items-center justify-between uppercase ">
            {/* prettier-ignore */}
            <p className="text-sm text-textColor font-semibold w-275 min-w-[160px] text-center">Name</p>
            {/* prettier-ignore */}
            <p className="text-sm text-textColor font-semibold w-275 min-w-[160px] text-center">Email</p>
            {/* prettier-ignore */}
            <p className="text-sm text-textColor font-semibold w-275 min-w-[160px] text-center">Created</p>
            {/* prettier-ignore */}
            <p className="text-sm text-textColor font-semibold w-275 min-w-[160px] text-center">Role</p>{" "}
          </div>
          {allUsers &&
            allUsers?.map((data, index) => (
              <UserCard data={data} index={index} key={data._id} />
            ))}
        </div>
      </div>
    </>
  );
};

export default UserData;

export const UserCard = ({ data, index }) => {
  const [{ user, allUsers }, dispatch] = useStateValue();
  const [roleUpdated, setRoleUpdated] = useState(false);
  const createdAt = moment(new Date(data.createdAt)).format("MMMM Do YYYY");

  const update = async (userId, role) => {
    try {
      const res = await axios.put(
        `https://online-music-app.onrender.com/register/update/${userId}`,
        {
          role,
        }
      );
      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const getAllUsers = async () => {
    try {
      const res = await axios.get(
        `https://online-music-app.onrender.com/register/getall`
      );
      return res.data;
    } catch (error) {
      return null;
    }
  };
  useEffect(() => {
    if (!allUsers) {
      getAllUsers().then((data) => {
        dispatch({
          type: actionType.SET_ALL_USERS,
          allUsers: data.data,
        });
      });
    }
  }, []);
  const UpdateUserRole = (userId, role) => {
    setRoleUpdated(false);
    update(userId, role).then((res) => {
      if (res) {
        getAllUsers().then((data) => {
          // console.log(data);
          dispatch({
            type: actionType.SET_ALL_USERS,
            allUsers: data.data,
          });
        });
      }
    });
  };
  const removeUser = async (userId) => {
    try {
      const res = await axios.delete(
        `https://online-music-app.onrender.com/register/delete/${userId}`
      );
      return res;
    } catch (error) {
      return null;
    }
  };
  const deleteuser = (userId) => {
    // console.log(userId);
    removeUser(userId).then((res) => {
      if (res) {
        getAllUsers().then((data) => {
          dispatch({
            type: actionType.SET_ALL_USERS,
            allUsers: data.data,
          });
        });
      }
    });
  };

  return (
    <>
      <motion.div
        // key={index}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className="relative w-full rounded-md flex items-center justify-between py-4 bg-lightOverlay cursor-pointer hover:bg-card hover:shadow-md"
      >
        {data._id !== user?.existuser._id && (
          <motion.div
            whileTap={{ scale: 0.75 }}
            className="absolute left-4 w-8 h-8 rounded-md flex items-center justify-center bg-gray-200"
            onClick={() => deleteuser(data._id)}
          >
            <MdDelete className="text-xl text-red-400 hover:text-red-500" />
          </motion.div>
        )}
        <p className="text-base text-textColor w-275 min-w-[160px] text-center">
          {data.name}
        </p>
        {/* prettier-ignore */}
        <p className="text-base text-textColor w-275 min-w-[160px] text-center">{data.email}</p>
        {/* prettier-ignore */}
        <p className="text-base text-textColor w-275 min-w-[160px] text-center">{createdAt}</p>
        {/* prettier-ignore */}
        <div className=" w-275 min-w-[160px] text-center flex items-center justify-center gap-6 relative">
        <p className="text-base text-textColor"> {data.role}</p>
        {data._id !== user?.existuser._id && (
          <motion.p   whileTap={{ scale: 0.75 }} className="text-[10px]  font-semibold text-textColor px-1 bg-purple-200 rounded-sm hover:shadow-md"  onClick={() => setRoleUpdated(true)}>
        {data.role === "admin" ? "member" : "admin"}
        </motion.p>
        )}
       {roleUpdated&&(
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute z-10 top-6 right-4 rounded-md p-4 flex items-start flex-col gap-4 bg-white shadow-xl"
          >
              <p className="text-textColor text-sm font-semibold">
              Are you sure do u want to mark the user as{" "}
              <span>{data.role === "admin" ? "member" : "admin"}</span> ?
            </p>
            <div className="flex items-center gap-4">
              <motion.button
                whileTap={{ scale: 0.75 }}
                className="outline-none border-none text-sm px-4 py-1 rounded-md bg-blue-200 text-black hover:shadow-md"
                onClick={() =>
                  UpdateUserRole(
                    data._id,
                    data.role === "admin" ? "member" : "admin"
                  )
                }
              >
                Yes
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.75 }}
                className="outline-none border-none text-sm px-4 py-1 rounded-md bg-gray-200 text-black hover:shadow-md"
                onClick={() => setRoleUpdated(false)}
              >
                No
              </motion.button>
            </div>
          </motion.div>
       )}
        </div>
      </motion.div>
    </>
  );
};
