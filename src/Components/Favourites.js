import React, { useContext, useState, useEffect } from "react";
import { FirestoreContext } from "../App";
import Card from "./Card";
import "./Styles/Card.css";
import "./Styles/Cart.css";
import "./Styles/ProductList.css";

function Favourites() {
  const fsContext = useContext(FirestoreContext);
  const productsRef = fsContext.fs.collection("react/ecommerce/products");

  const [favProducts, setFavProducts] = useState([]);

  useEffect(() => {
    if (fsContext.user != 0) {
      const favsRef = fsContext.fs.collection(
        `react/ecommerce/users/${fsContext.user.uid}/favourites`
      );
      favsRef.onSnapshot(async () => {
        const products = await productsRef.get();
        const favProductsColl = await favsRef.get();
        const favProductIds = [];
        const tempProducts = [];
        const favItems = {};

        favProductsColl.docs.forEach((doc) => {
          favItems[doc.data().id] = doc.data().quantity;
          favProductIds.push(doc.data().id);
        });

        products.docs.forEach((doc) => {
          if (favProductIds.includes(doc.data().id)) {
            tempProducts.push(doc.data());
          }
        });
        setFavProducts(tempProducts);

        console.table(tempProducts);
      });
    } else {
      setFavProducts([]);
    }
  }, [fsContext.user]);

  return (
    <>
      <div className="prod_list" style={{ marginTop: "150px" }}>
        {favProducts ? (
          favProducts.length > 0 ? (
            <div className="parent" style={{ marginTop: "0px" }}>
              {favProducts.map((product) => {
                return <Card product={product} fav={true} key={product.id} />;
              })}
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

export default Favourites;
