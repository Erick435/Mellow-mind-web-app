import React from "react";
import { auth, provider } from "./config";
import { signInWithPopup } from "firebase/auth";
import './signin.css';

// ------------------------ SIGNING IN FUNCTION/ GOOGLE FIREBASE ---------------
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
    // ============================================================================


    // ------------------------ ADDING IMAGES TO THE CAROUSEL LANDING PAGE -----------

    const images = [
        "/ss1.png",
        "/ss2.png",
        "/ss3.png",
    ]

    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

    // useEffect to handle transition 
    React.useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000); // change images every 5 seconds

        // Cleanup: clear the timer when the component is unmounted or before re-running the effect
        return () => clearInterval(timer);
    }, [currentImageIndex]);


    // ===============================================================================


    return (
        <div className="landingPageContainer">

            {/*                          NAVBAR                         */}
            <div className="navbar">
                <div className="title-container">
                    <img src="/logo-trsprnt.png" alt="Mellow Mind Logo" />
                    <h1>MellowMind</h1>
                </div>
                <div className="signin-link" onClick={signInWithGoogle}>
                    Sign In
                </div>
            </div>
            {/* ========================================================= */}

            {/*                         CAROUSEL                        */}

            <div className="carousel-container">
                <img src={images[currentImageIndex]} alt="Carousel content" />

                <div className="carousel-dots">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            className={`dot ${currentImageIndex === index ? 'active' : ''}`}
                            onClick={() => setCurrentImageIndex(index)}
                        ></button>
                    ))}
                </div>

            </div>
            {/* ================================================================== */}

        </div>
    );
}

export default SignIn;
