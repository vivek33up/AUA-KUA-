import React from "react";
import { useNavigate } from "react-router-dom";
import HomeLayout from "../layouts/HomeLayout";

import logo from "../assets/logo.png";
import cover from "../assets/cover_img.png";

export default function Home() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <HomeLayout
      logoSrc={logo}
      coverSrc={cover}
      onGetStarted={handleGetStarted}
    />
  );
}