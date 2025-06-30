import React from "react";
import Navbar from "../Components/Navbar";
import Header from "../Components/Header";

function Home() {
  return (
    <div className='flex flex-col items-center min-h-screen  justify-center bg-[url("/bg_img.png")] bg-center bg-cover'>
      <Navbar />
      <Header />
    </div>
  );
}

export default Home;
