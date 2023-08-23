import React from "react";
import { auth, provider } from "./config";
import { signInWithPopup } from "firebase/auth";

function SignIn({ handleLogin }) {
    const signInWithGoogle = () => {
        signInWithPopup(auth, provider)
            .then((data) => {
                handleLogin(data.user);
            })
            .catch((error) => {
                console.error("Error during sign-in:", error);
            });
    };

    return (
        <div>
            <h1>Hello and welcome</h1>
            <button onClick={signInWithGoogle}>Signin with Google</button>;
        </div>
    );
}

export default SignIn;
