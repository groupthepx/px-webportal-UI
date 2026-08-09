
"use client";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

const getToken = (): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      unsubscribe();

      if (user) {
        // You should use user.getIdToken() instead of user.accessToken
        user.getIdToken().then((token : any) => {
          // console.log("User's authentication token:", token);
          resolve(token);
        }).catch((error  : any) => {
          console.error("Error getting user's authentication token:", error);
          reject(error);
        });
      } else {
        // If user is not logged in, you should reject the promise
        reject(new Error("User is not signed in."));
      }
    }, (error) => {
      console.error("Error in onAuthStateChanged:", error);
      reject(error);
    });
  });
};

export default getToken;