import React from "react";
import "./App.module.css";
import Header from "./components/header/Header";
import Main from "./components/Main";
import Footer from "./components/footer/Footer";

function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header>
        <Header />
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Main />
      </main>

      {/* Footer at bottom */}
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default Home;
