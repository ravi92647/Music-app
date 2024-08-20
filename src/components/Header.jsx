import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import { FaCrown } from "react-icons/fa";
import axios from "axios";
import { useStateValue } from "../context/stateProvider";
import { actionType } from "../context/reducer";
import { motion } from "framer-motion";

const Header = () => {
  const isActiveStyle =
    "text-lg text-headingColor font-semibold hover:text-headingColor duration-100 transition-all ease-in-out";
  const isnotActiveStyle =
    "text-lg text-textColor hover:text-headingColor duration-100 transition-all ease-in-out";

  const Token = localStorage.getItem("token");
  // console.log(Token);

  const [{ user }, dispatch] = useStateValue();
  const [view, setView] = useState(false);
  const validateUser = async (data) => {
    try {
      const res = await axios.get(
        `https://online-music-app.onrender.com/register/login`,
        {
          headers: {
            token: Token,
          },
        }
      );
      //console.log(res.data.existuser);
      // return res.data.existuser;
      dispatch({
        type: actionType.SET_USER,
        user: res.data,
      });
    } catch (error) {
      return null;
    }
  };
  const navigate = useNavigate();
  const logout = () => {
    localStorage.clear("token");
    navigate("/");
  };


  useEffect(() => {
    validateUser();
  }, []);

  return (
    <div className="w-full  flex-col bg-orange-100">
      <header className="flex items-center w-full p-4 md:py-2 md:px-6">
        <NavLink to={"/home"}>
          <img src={logo} alt="img" className="w-16" />
        </NavLink>
        <ul className="flex items-center justify-center ml-7">
          <li className="mx-5 text-lg">
            <NavLink
              to={"/home"}
              className={({ isActive }) =>
                isActive ? isActiveStyle : isnotActiveStyle
              }
            >
              Home
            </NavLink>
          </li>
          {/* <li className="mx-5 text-lg">
            <NavLink
              className={({ isActive }) =>
                isActive ? isActiveStyle : isnotActiveStyle
              }
            >
              Music
            </NavLink>
          </li>
          <li className="mx-5 text-lg">
            <NavLink
              className={({ isActive }) =>
                isActive ? isActiveStyle : isnotActiveStyle
              }
            >
              Playlist
            </NavLink>
          </li> */}
        </ul>
        <div
          onMouseEnter={() => setView(true)}
          onMouseLeave={() => setView(false)}
          className="flex items-center ml-auto cursor-pointer gap-2 relative"
        >
          <div className="flex flex-col">
            <p className="text-textColor text-lg hover:text-headingColor font-semibold">
              {user?.existuser.name}
            </p>
            <p className="flex items-center gap-2 text-xs text-gray-500 font-normal">
              Premium Member.
              <FaCrown className="text-xm -ml-1 text-yellow-500" />
            </p>
          </div>
          {view && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="absolute z-10  right-0 w-275 p-4 gap-4 top-11 bg-card shadow-lg rounded-lg backdrop-blur-sm flex flex-col"
            >
              {user?.existuser.role === "admin" && (
                <>
                  <NavLink to={"/dashboard/homes"}>
                    <p className="text-base text-textColor hover:font-semibold duration-150 transition-all ease-in-out">
                      Dashboard
                    </p>
                  </NavLink>
                  <hr />
                </>
              )}
              <NavLink>
                <p className="text-base text-textColor hover:font-semibold duration-150 transition-all ease-in-out">
                  Profile
                </p>
              </NavLink>
              
              <p
                className="text-base text-textColor hover:font-semibold duration-150 transition-all ease-in-out"
                onClick={logout}
              >
                Sign out
              </p>
            </motion.div>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
