import React from "react";

const Footer = () => {
  return (
    <footer className="footer has-background-grey has-text-light">
      <div className="content has-text-centered">
        <p>
          &copy; {new Date().getFullYear()} Sistem Pengarsipan Ijazah & Sertifikat.
          All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
