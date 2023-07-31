import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/SideBar';

const Layout = ({ children }) => {
  return (
    <React.Fragment>
      <Navbar />
      <div className="columns mt-6 is-mobile is-multiline" style={{ minHeight: "100vh" }}>
        <div className="column is-2 is-narrow-touch"><Sidebar /></div>
        <div className="column has-background-light">
          <main>{children}</main>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Layout;
