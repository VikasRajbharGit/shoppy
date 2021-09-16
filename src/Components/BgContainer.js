import React from "react";
import "./Styles/BgContainer.css";
import CategoriesDropdown from "./CategoriesDropdown";

function BgContainer() {
  return (
    <div className="bg_container">
      <span className="container_buttons">
        {/* <h4 className="container_items"></h4>
        <h1 className="container_items"></h1> */}
        {/* <h4>showing 30</h4> */}
        <div className="container_items">
          <CategoriesDropdown />
        </div>
      </span>
    </div>
  );
}

export default BgContainer;
