import React, { useState, useEffect, useContext } from "react";
import { CartContext, FirestoreContext } from "../App";
import { useParams } from "react-router";
// import firebase from "firebase";
import "./Styles/ProductPage.css";
import { useHistory } from "react-router-dom";
import { FaAmazonPay, FaMinus, FaPlus } from "react-icons/fa";
import { login } from "../repositories/auth_repository";
import {
  handleCartAdd,
  handleCartRemove,
} from "../repositories/cart_repository";

function ProductPage() {
  const fsContext = useContext(FirestoreContext);
  const cartContextRef = useContext(CartContext);
  const { id } = useParams();
  const [quantity, setQuantity] = useState(0);
  const ref = fsContext.fs.doc(`react/ecommerce/products/${id}`);
  const [product, setProduct] = useState({});
  useEffect(async () => {
    if (fsContext.user != 0) {
      const cartRef = fsContext.fs.collection(
        `react/ecommerce/users/${fsContext.user.uid}/cart`
      );

      cartRef.where("id", "==", parseInt(id)).onSnapshot(async (qs) => {
        // console.log(qs.docs[0].data());
        if (qs.docs.length > 0) {
          setQuantity(qs.docs[0].data().quantity);
        }
      });
    } else {
      setQuantity(0);
    }
    const doc = await ref.get();
    setProduct(doc.data());
    // console.log(doc.data());
  }, [fsContext.user]);
  return (
    <>
      {product != null ? (
        <div className="product_page">
          <div className="product_image_container">
            <img className="product_image" src={product.image} />
          </div>
          <div className="product_info">
            <h1>{product.title}</h1>
            <h2>Price: $ {product.price}</h2>
            <h5>Category: {product.category}</h5>
            <p>{product.description}</p>
          </div>
          {fsContext.user == 0 ? (
            <div className="manage_cart">
              <span
                className="manage_cart_text"
                style={{ fontSize: "1rem" }}
                onClick={() => {
                  login(fsContext);
                }}
              >
                Login For Cart
              </span>
            </div>
          ) : (
            <div className="manage_cart">
              <span
                className="manage_cart_text"
                onClick={() => {
                  handleCartRemove(fsContext, cartContextRef, { product });
                }}
              >
                <FaMinus />
              </span>
              <span className="manage_cart_text">{quantity}</span>
              <span
                className="manage_cart_text"
                onClick={() => {
                  handleCartAdd(fsContext, cartContextRef, { product });
                }}
              >
                <FaPlus />
              </span>
            </div>
          )}
        </div>
      ) : (
        <h1>Loading...</h1>
      )}
    </>
  );
}

export default ProductPage;
