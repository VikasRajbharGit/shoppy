import React from "react";
import Popup from "reactjs-popup";
import "./Styles/Search.css";

function SearchModal() {
  return (
    <>
      <Popup trigger={<h5> Search</h5>} position="right center" modal="true">
        <div className="main">
          <input type="text" placeholder="search" className="seacrh_box" />
        </div>
      </Popup>
    </>
  );
}

export default SearchModal;
