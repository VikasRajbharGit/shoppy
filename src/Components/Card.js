import React, { useContext, useState, useEffect } from "react";
import { FaRecordVinyl, FaShoppingCart } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import {
  MdRemoveShoppingCart,
  MdAddShoppingCart,
  MdFavoriteBorder,
  MdFavorite,
} from "react-icons/md";
import { CartContext, FirestoreContext } from "../App";
import firebase from "firebase/app";
import { Link } from "react-router-dom";
import {
  handleCartAdd,
  handleCartRemove,
  handleFavoruite,
} from "../repositories/cart_repository";

function Card(props) {
  const cartContextRef = useContext(CartContext);
  const fsContext = useContext(FirestoreContext);
  const currentRoute = useLocation().pathname;

  return (
    // <Link to={`/product/${props.product.id}`} className="simple_text">
    <div className="card" style={{ textDecoration: "none" }}>
      <div className="fav_buttons">
        {(currentRoute == "/" || currentRoute == "/favourites") &&
          (props.fav ? (
            <MdFavorite
              fontSize="32"
              color="red"
              onClick={() => {
                handleFavoruite(fsContext, props, "remove");
              }}
            />
          ) : (
            <MdFavoriteBorder
              fontSize="32"
              onClick={() => {
                handleFavoruite(fsContext, props, "add");
              }}
            />
          ))}
      </div>

      <Link
        to={`/product/${props.product.id}`}
        style={{ textDecoration: "none" }}
      >
        <img src={props.product.image} className="image" />
        <h5>{props.product.title}</h5>
      </Link>
      <h5>$ {props.product.price}</h5>
      {currentRoute != "/favourites" && (
        <div className="card_buttons">
          <MdRemoveShoppingCart
            fontSize="32"
            onClick={() => {
              handleCartRemove(fsContext, cartContextRef, props);
            }}
          />
          <h3>{props.cartQuantity}</h3>
          <MdAddShoppingCart
            fontSize="32"
            onClick={() => {
              handleCartAdd(fsContext, cartContextRef, props);
            }}
          />
        </div>
      )}
    </div>
    // </Link>
  );
}

export default Card;
