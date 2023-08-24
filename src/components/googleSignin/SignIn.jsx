import React from "react";
import { auth, provider } from "./config";
import { signInWithPopup } from "firebase/auth";

function SignIn({ handleLogin }) {
    const signInWithGoogle = () => {
        signInWithPopup(auth, provider)
            .then((data) => {
                const user = data.user;
                handleLogin(user); // Passing the whole user object for now
                const firebaseUid = user.uid;
                console.log(firebaseUid)
                // Now you can call a function to interact with the RevenueCat API
                // Pass the firebaseUid as the "appUserId"
                interactWithRevenueCatAPI(firebaseUid);
            })
            .catch((error) => {
                console.error("Error during sign-in:", error);
            });
    };

    // Function to interact with the RevenueCat API
    const interactWithRevenueCatAPI = (appUserId) => {
        // Use the `appUserId` to call the RevenueCat API
        // ...
    };

    return (
        <div>
            <h1>Hello and welcome</h1>
            <button onClick={signInWithGoogle}>Sign in with Google</button>;
        </div>
    );
}

export default SignIn;
