import React, { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { CartContext, FirestoreContext } from "../App";

import { Link } from "react-router-dom";

function LoggedOutCard(props) {
  const cartContextRef = useContext(CartContext);
  const fsContext = useContext(FirestoreContext);
  const currentRoute = useLocation().pathname;

  return (
    // <Link to={`/product/${props.product.id}`} className="simple_text">
    <div className="card" style={{ textDecoration: "none" }}>
      <Link
        to={`/product/${props.product.id}`}
        style={{ textDecoration: "none" }}
      >
        <img src={props.product.image} className="image" />
        <h5>{props.product.title}</h5>
      </Link>
      <h5>$ {props.product.price}</h5>
    </div>
    // </Link>
  );
}

export default LoggedOutCard;
