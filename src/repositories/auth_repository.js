import "firebase/auth";
import firebase from "firebase/app";

var provider = new firebase.auth.GoogleAuthProvider();

const login = async (fsContext) => {
  console.log("logging in");
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      console.log(result);
      /** @type {firebase.auth.OAuthCredential} */
      var credential = result.credential;

      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      console.log(user);

      localStorage.setItem("user", JSON.stringify(user));
      fsContext.setUser(user);
      // ...
    })
    .catch((error) => {
      console.log(error);
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
};

const logout = (fsContext) => {
  localStorage.clear();
  fsContext.setUser(0);
};

export { login, logout };
