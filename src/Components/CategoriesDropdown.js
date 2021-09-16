import React, { useState, useContext, useEffect } from "react";
import "./Styles/CategoriesDropdown.css";
import { FirestoreContext } from "../App";
import firebase from "firebase";

function CategoriesDropdown() {
  const fsContext = useContext(FirestoreContext);
  const ref = fsContext.fs.doc("react/ecommerce/meta/categories");
  const [categories, setCategories] = useState([]);
  useEffect(async () => {
    // console.table("xxxx" + fsContext.filter);
    const data = await ref.get();
    const temp = data.data();

    setCategories(temp.categories);
  }, []);
  return (
    <>
      <div className="select">
        <select
          name="category"
          onChange={(e) => {
            fsContext.setFilter(e.target.value);
          }}
        >
          <option>No Filter</option>
          {categories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
        <div className="select_arrow"></div>
      </div>
    </>
  );
}
{
  /* <div class="select">
  <select>
    <option>--Select--</option>
    <option>Hello 1</option>
    <option>Hello 2</option>
    <option>Hello 3</option>
    <option>Hello 4</option>
  </select>
  <div class="select_arrow"></div>
</div>; */
}
export default CategoriesDropdown;
