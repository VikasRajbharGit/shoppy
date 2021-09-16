import React, { useContext, useState, useEffect } from "react";
import { CartContext, FirestoreContext } from "../App";
import firebase from "firebase";
import Card from "./Card";
import "./Styles/Card.css";
import "./Styles/Cart.css";
import "./Styles/ProductList.css";
import { FaAmazonPay } from "react-icons/fa";

function Cart() {
  const cartContextRef = useContext(CartContext);
  const fsContext = useContext(FirestoreContext);
  const productsRef = fsContext.fs.collection("react/ecommerce/products");

  const [cartProducts, setCartProducts] = useState([]);
  const [cartQuantities, setCartQuantities] = useState([]);
  useEffect(() => {
    if (fsContext.user != 0) {
      const cartRef = fsContext.fs.collection(
        `react/ecommerce/users/${fsContext.user.uid}/cart`
      );
      cartRef.onSnapshot(async () => {
        const products = await productsRef.get();
        const cartProductsColl = await cartRef.get();
        const cartProductIds = [];
        const tempProducts = [];
        const cartItems = {};

        cartProductsColl.docs.forEach((doc) => {
          cartItems[doc.data().id] = doc.data().quantity;
          cartProductIds.push(doc.data().id);
        });

        products.docs.forEach((doc) => {
          if (cartProductIds.includes(doc.data().id)) {
            tempProducts.push(doc.data());
          }
        });
        setCartProducts(tempProducts);
        setCartQuantities(cartItems);
        console.table(tempProducts);
      });
    } else {
      setCartQuantities({});
      setCartProducts([]);
    }
  }, [fsContext.user]);
  return (
    <>
      {/* {cartContextRef.cart.products.map((product) => {
        return <h1>{product}</h1>;
      })} */}
      <div className="prod_list" style={{ marginTop: "150px" }}>
        {cartProducts ? (
          cartProducts.length > 0 ? (
            <div className="parent" style={{ marginTop: "0px" }}>
              {cartProducts.map((product) => {
                return (
                  <Card
                    product={product}
                    cartQuantity={
                      cartQuantities[product.id] != null
                        ? cartQuantities[product.id]
                        : 0
                    }
                    key={product.id}
                  />
                  // <div>
                  //   <h3>{product.quantity}</h3>
                  //   <h1>{product.title}</h1>
                  //   <hr />
                  // </div>
                );
              })}
              <div className="pay">
                <p className="pay_text">${fsContext.cartData.totalAmount}</p>
              </div>
            </div>
          ) : fsContext.user != 0 ? (
            <h1 style={{ marginTop: "10vw" }}>No items</h1>
          ) : (
            <h1 style={{ marginTop: "10vw" }}>Please Login!</h1>
          )
        ) : (
          <h5 style={{ marginTop: "10vw" }}>Loading...</h5>
        )}
      </div>
    </>
  );
}

export default Cart;
