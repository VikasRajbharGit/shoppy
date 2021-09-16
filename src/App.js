import React, { useState } from "react";
import "./App.css";
import firebaseConfig from "./Firebase";
import firebase from "firebase";
import Todo from "./Todo";
import ProductList from "./Components/ProductList";
import BgContainer from "./Components/BgContainer";
import Nav from "./Components/Nav";
import Cart from "./Components/Cart";
import ProductPage from "./Components/ProductPage";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Favourites from "./Components/Favourites";

const fs = firebase.firestore();

const FirestoreContext = React.createContext();
const CartContext = React.createContext();
function App() {
  const [cartData, setCartData] = useState({
    totalAmount: "...",
    products: [],
    productsCount: "...",
  });
  const [cart, setCart] = useState({
    products: [],
    total: 0,
    productCount: 0,
    productsQuantities: {},
  });
  const [filter, setFilter] = useState("No Filter");
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(0);

  return (
    <FirestoreContext.Provider
      value={{
        fs,
        filter,
        setFilter,
        search,
        setSearch,
        user,
        setUser,
        cartData,
        setCartData,
      }}
    >
      <CartContext.Provider value={{ cart, setCart }}>
        <div className="App">
          <Router>
            <Nav />
            <Switch>
              <Route exact path="/">
                <BgContainer />
                <ProductList />
              </Route>
              <Route path="/cart">
                <Cart />
              </Route>
              <Route path="/favourites">
                <Favourites />
              </Route>
              <Route path="/product/:id" children={<ProductPage />}></Route>
              <Route path="*">Error</Route>
            </Switch>
          </Router>
        </div>
      </CartContext.Provider>
    </FirestoreContext.Provider>
  );
}

export default App;
export { FirestoreContext, CartContext };
