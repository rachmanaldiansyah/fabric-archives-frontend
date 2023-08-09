import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/SideBar";
import Footer from "../components/Footer";

const Layout = ({ children }) => {
  return (
    <React.Fragment>
      <Navbar />
      <section className="hero has-background-grey-lighter is-fullheight is-fullwidth mt-4 pl-4 pr-4">
        <div className="hero body">
          <div className="columns is-desktop">
            <div className="column is-3-desktop">
              <div className="box mt-6">
                <Sidebar />
              </div>
            </div>
            <div className="column is-9-desktop">
              <div className="content mt-6 mb-4">
                <main>{children}</main>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </React.Fragment>
  );
};

export default Layout;
