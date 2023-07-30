import React from "react";

const Modal = ({ title, content, onClose }) => {
  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{title}</p>
          <button
            className="delete"
            aria-label="close"
            onClick={onClose}
          ></button>
        </header>
        <section className="modal-card-body">{content}</section>
        <footer className="modal-card-foot">
          <button className="button is-success" onClick={onClose}>
            Close
          </button>
        </footer>
      </div>
    </div>
  );
};

export default Modal;
