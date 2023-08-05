import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/SideBar";

const Layout = ({ children }) => {
  return (
    <React.Fragment>
      <Navbar />
      <section className="container">
        <div className="container mt-4">
          <div className="columns is-desktop">
            <div className="column is-3-desktop">
              <div className="box mt-6">
                <Sidebar />
              </div>
            </div>
            <div className="column is-9-desktop">
              <div className="content mt-6">
                <main>{children}</main>
              </div>
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};

export default Layout;
