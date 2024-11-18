import React from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";

export default function Home() {

  return (
    <div className="bg-white dark:bg-black font-sans">
      <Header />
      <Main />
      <Footer />
    </div>
  );
}


export const generateStaticParams = async () => {
  return []
};