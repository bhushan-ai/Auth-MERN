import React from "react";
import assets from "../assets/assets";
import { useAppContext } from "./Context/useAppContext";

function Header() {
  const { userData } = useAppContext();

  return (
    <div className="flex  flex-col items-center mt-20 text-center text-gray-800 justify-center px-4  ">
      <img src={assets.header_img} className="h-40 w-40 rounded-full mb-6" />
      <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2">
        Hey {userData ? userData.username : "Guys"} !
        <img src={assets.hand_wave} />
      </h1>
      <h2 className="text-3xl sm:text-5xl font-semibold mb-4  ">
        Welcome to my site{" "}
      </h2>
      <p className="mb-8 max-w-md">
        Let's test this site by login using your Email
      </p>
      <button
        className="border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all cursor-pointer
"
      >
        Get Started
      </button>
    </div>
  );
}

export default Header;
