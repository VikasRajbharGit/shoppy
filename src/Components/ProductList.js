import React, { useState, useEffect, useContext } from "react";
import { FirestoreContext } from "../App";
import firebase from "firebase";
import Card from "./Card";
import { useHistory } from "react-router-dom";
import "./Styles/ProductList.css";
import LoggedOutCard from "./LoggedOutCard";

function ProductList() {
  const fsContext = useContext(FirestoreContext);
  const history = useHistory();
  const filter = fsContext.filter;
  const ref = fsContext.fs.collection("react/ecommerce/products");
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [favourites, setFavourites] = useState({});
  const [cartProducts, setCartProducts] = useState([]);
  useEffect(() => {
    ref.onSnapshot(async () => {
      let data = await ref.get();
      const tempData = [];

      data.docs.forEach((doc) => {
        tempData.push(doc.data());
      });
      setAllProducts([...tempData]);
      // if (products.length == 0) {
      //   setProducts(tempData);
      //   console.log(tempData);
      //   console.log("--------");
      //   console.log(products);
      // }

      // console.table(tempData);
      //   console.log(data.docs[0].data());
    });
  }, []);

  useEffect(() => {
    // console.log(allProducts);
    if (filter === "No Filter" && fsContext.search === "") {
      // data = await ref.get();
      setProducts(allProducts);
    } else {
      if (filter === "No Filter") {
        // data = await ref.where("title", ">=", fsContext.search).get();

        const tempProducts = allProducts.filter((pro) =>
          pro.title.toLowerCase().includes(fsContext.search.toLowerCase())
            ? true
            : false
        );
        setProducts(tempProducts);
      } else if (fsContext.search === "") {
        // data = await ref
        // .where("category", "==", filter == "No Filter" ? "" : filter)
        // .get();

        const tempProducts = allProducts.filter((pro) => {
          return pro.category == fsContext.filter &&
            pro.title.toLowerCase().includes(fsContext.search.toLowerCase())
            ? true
            : false;
        });

        setProducts(tempProducts);
      } else {
        // data = await ref
        // .where("category", "==", filter)
        // .where("title", ">=", fsContext.search)
        // .get();
        const tempProducts = allProducts.filter((pro) => {
          return pro.category == fsContext.filter &&
            pro.title.toLowerCase().includes(fsContext.search.toLowerCase())
            ? true
            : false;
        });

        setProducts(tempProducts);
      }
    }
  }, [allProducts, filter, fsContext.search]);

  useEffect(() => {
    if (fsContext.user != 0) {
      const cartRef = fsContext.fs.collection(
        `react/ecommerce/users/${fsContext.user.uid}/cart`
      );
      cartRef.onSnapshot(async () => {
        const cartProductsColl = await cartRef.get();
        const cartItems = {};

        // console.log(cartProducts.docs[0].data());
        cartProductsColl.docs.forEach((doc) => {
          // console.log(doc.data().id);
          cartItems[doc.data().id] = doc.data().quantity;
          // cartItems.push({ id: doc.data().id, quantity: doc.data().quantity });
        });

        setCartProducts(cartItems);
      });
    } else {
      setCartProducts({});
    }
  }, [products, allProducts, fsContext.user]);

  useEffect(() => {
    if (fsContext.user != 0) {
      const favsRef = fsContext.fs.collection(
        `react/ecommerce/users/${fsContext.user.uid}/favourites`
      );
      favsRef.onSnapshot(async (qs) => {
        const temp = {};
        qs.docs.forEach((doc) => {
          temp[doc.data().id] = true;
        });
        // console.table(temp);
        setFavourites(temp);
      });
    }
  }, [products, fsContext.user]);

  return (
    <div className="prod_list">
      {products.length == 0 ? (
        <h1>Loading...</h1>
      ) : (
        <div className="parent">
          {fsContext.user != 0
            ? products.map((product) => (
                <Card
                  product={product}
                  cartQuantity={
                    cartProducts[product.id] != null
                      ? cartProducts[product.id]
                      : 0
                  }
                  fav={favourites[product.id] != null ? true : false}
                  key={product.id}
                />
              ))
            : products.map((product) => (
                <LoggedOutCard
                  product={product}
                  cartQuantity={
                    cartProducts[product.id] != null
                      ? cartProducts[product.id]
                      : 0
                  }
                  fav={favourites[product.id] != null ? true : false}
                  key={product.id}
                />
              ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;
