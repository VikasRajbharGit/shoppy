import React, { useState, useEffect } from "react";
import firebase from "firebase";
import "./Components/Styles/Card.css";
import newData from "./data";

function Todo() {
  const fs = firebase.firestore();
  const [todos, setTodos] = useState([]);
  const ref = fs.collection("react/ecommerce/products");

  useEffect(() => {
    // ref.onSnapshot(async(qs)=>{

    // });
    ref.onSnapshot(async () => {
      const data = await ref.get();
      const tempData = [];
      data.docs.forEach((doc) => {
        //   console.log(doc.data());
        tempData.push(doc.data());
      });
      setTodos([...tempData]);
      //   console.table(tempData);
      //   console.log(data.docs[0].data());
    });
  }, [todos]);
  const addData = () => {
    newData.forEach((doc) => {
      ref.doc(doc.id.toString()).set(doc);
    });
  };
  return (
    <>
      <button
        onClick={() => {
          addData();
        }}
      >
        add data
      </button>
      {todos.map((todo) => {
        return (
          <div>
            <h1>{todo.title}</h1>
            <p>{todo.description}</p>
            <img className="image" src={todo.image} />
            <hr />
          </div>
        );
      })}
    </>
  );
}

export default Todo;
