import React, { useState, useEffect, useContext, useRef } from "react";
import "./Styles/Nav.css";
import { FaRecordVinyl, FaShoppingCart, FaTimesCircle } from "react-icons/fa";
import { FcShop } from "react-icons/fc";
import { GoSignOut } from "react-icons/go";
import { useHistory, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import "reactjs-popup/dist/index.css";
import { CartContext, FirestoreContext } from "../App";
import SearchModal from "./Search";
import firebase from "firebase/app";
import "firebase/auth";
import { login, logout } from "../repositories/auth_repository";
import "firebase/firestore";
import shoopy from "../assets/shoopy.png";

function Nav() {
  // const [showSearch, setShowSearch] = useState(false);

  const [show, handleShow] = useState(false);
  // const [cartData, setCartData] = useState({
  //   totalAmount: "...",
  //   products: [],
  //   productsCount: "...",
  // });
  const fsContext = useContext(FirestoreContext);
  // var provider = new firebase.auth.GoogleAuthProvider();
  const searchRef = useRef(null);
  const history = useHistory();
  const currentRoute = useLocation().pathname;

  useEffect(() => {
    const ref = fsContext.fs.collection(
      `react/ecommerce/users/${fsContext.user.uid}/cart`
    );
    if (fsContext.user != 0) {
      ref.onSnapshot(async (querySnapshot) => {
        var temp = { totalAmount: 0, products: [], productsCount: 0 };
        if (querySnapshot.docs.length > 0) {
          querySnapshot.docs.forEach((doc) => {
            const data = doc.data();
            temp.totalAmount += data.price * data.quantity;
            temp.productsCount += data.quantity;
            temp.products.push({ id: data.id, quantity: data.quantity });
          });
          fsContext.setCartData(temp);
        } else {
          fsContext.setCartData({
            totalAmount: 0,
            products: [],
            productsCount: 0,
          });
        }
      });
    } else {
      fsContext.setCartData({ totalAmount: 0, products: [], productsCount: 0 });
    }
  }, [fsContext.user]);
  useEffect(() => {
    var localUser = JSON.parse(localStorage.getItem("user"));
    if (localUser) {
      fsContext.setUser(localUser);
    }
  }, []);

  const handleSearch = (event) => {
    if (event.key === "Enter") {
      // console.log(event.target.value);
      fsContext.setSearch(event.target.value);
      history.push("/");
      // event.target.value = "";
    }
  };
  const clearSearch = () => {
    fsContext.setSearch("");
    searchRef.current.value = "";
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div className="nav_parent">
        <div className={`nav ${show && "nav_black"}`}>
          <div
            className="vertical_center"
            style={{
              alignContent: "left",
            }}
          >
            {/* <img
          className="nav_logo"
          src={
            fsContext.user != 0
              ? fsContext.user.photoURL
              : "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/170px-Netflix_2015_logo.svg.png"
          }
          // src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/170px-Netflix_2015_logo.svg.png"
          alt="Netflix Logo"
        /> */}
            <Link to="/" className="nav_text">
              <div className="logo">
                <img
                  className="kazuma"
                  src="https://www.pngkit.com/png/full/31-311991_anime-clipart-thumbs-up-konosuba-kazuma-thumbs-up.png"
                />
                <h3
                  className="brand"
                  onClick={() => {
                    fsContext.setSearch("");
                    fsContext.setFilter("No Filter");
                    searchRef.current.value = "";
                  }}
                >
                  Shoppy
                </h3>
              </div>
            </Link>
          </div>
          <div className="mid_nav">
            {/* <Link to="/">
          <h5>Home</h5>
        </Link> */}

            {/* <Link to="/">
          <h5>Shop</h5>
        </Link> */}

            {/* <h5>Search</h5> */}
            <div className="vertical_center">
              <div className="main ">
                <input
                  type="search"
                  placeholder="search"
                  className="seacrh_box"
                  onKeyDown={handleSearch}
                  ref={searchRef}
                />
                <button
                  type="reset"
                  className="clear_search"
                  onClick={clearSearch}
                >
                  <FaTimesCircle />
                </button>
              </div>
            </div>

            {/* <SearchModal /> */}

            {/* <h5
          onClick={() => {
            login();
          }}
        >
          Contact
        </h5> */}
          </div>

          {fsContext.user == 0 ? (
            <h5
              style={{ paddingRight: "10px" }}
              onClick={async () => {
                await login(fsContext);
              }}
            >
              Login
            </h5>
          ) : (
            <div className="nav_end" style={{ display: "flex" }}>
              <Link
                to="/favourites"
                style={{ marginRight: "10px" }}
                className="nav_text"
              >
                <h5>Favourites</h5>
              </Link>
              <Link to="/cart" className="nav_text">
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  <div className="total_amount">
                    <h5
                      style={{
                        fontWeight: "bolder",
                        textAlign: "right",
                      }}
                    >
                      $ {fsContext.cartData.totalAmount} &ensp;
                    </h5>
                  </div>
                  <div
                  // style={{
                  //   backgroundColor: "grey",
                  //   borderRadius: "3px",
                  //   height:'10px'
                  // }}
                  >
                    <h5 className="cart">
                      <FaShoppingCart /> &ensp;
                      {fsContext.cartData.productsCount} &ensp;
                    </h5>
                  </div>
                </div>
              </Link>
              <div className="vertical_center">
                <img className="profile_pic" src={fsContext.user.photoURL} />
              </div>
              <div className="logout vertical_center">
                <h4
                  style={{ paddingRight: "10px" }}
                  onClick={() => {
                    logout(fsContext);
                  }}
                >
                  <GoSignOut />
                </h4>
              </div>
            </div>
          )}
        </div>
        <div className="search_mobile">
          <input
            type="search"
            placeholder="search"
            className="seacrh_box"
            onKeyDown={handleSearch}
            ref={searchRef}
          />
          <button type="reset" className="clear_search" onClick={clearSearch}>
            <FaTimesCircle />
          </button>
        </div>
      </div>
      {currentRoute != "/cart" && (
        <Link to="/cart">
          <div className="cartFAB">
            <h1 className="cartFAB_text">{fsContext.cartData.productsCount}</h1>
            <div className="cartFAB_text">
              <FaShoppingCart />
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}

export default Nav;
