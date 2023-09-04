import React, { useState, useEffect } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./config";
import { FaGoogle, FaStopwatch, FaSpinner, FaMusic, FaBullseye } from 'react-icons/fa6';
import './signin.css';

const Carousel = ({ images, currentImageIndex, setCurrentImageIndex }) => (
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
);

const Navbar = ({ signInWithGoogle }) => (
    <div className="navbar">
        <div className="title-container">
            <img src="/logo-trsprnt.png" alt="Mellow Mind Logo" />
            <h1>MellowMind</h1>
        </div>
        <div className="signin-link" onClick={signInWithGoogle}>
            <b>Sign In with
                <div className="signIn-button-google">
                    <FaGoogle className="google-G" />
                    oogle
                </div>
            </b>
        </div>
    </div>
);

const Footer = ({ link }) => (
    <div className="footer">
        © 2023 i4software beta 2.0 application. All rights reserved. <br />
        Interested in giving feedback? <a href={link} target="_blank" rel="noopener noreferrer">Click here</a>
    </div>
);


const SignIn = ({ handleLogin }) => {
    const images = ["/ss1.png", "/ss2.png", "/ss3.png"];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [images.length]);

    const signInWithGoogle = () => {
        signInWithPopup(auth, provider)
            .then(data => handleLogin(data.user))
            .catch(error => console.error("Error during sign-in:", error));
    };

    return (
        <div className="landingPageContainer">
            <Navbar signInWithGoogle={signInWithGoogle} />
            <Carousel images={images} currentImageIndex={currentImageIndex} setCurrentImageIndex={setCurrentImageIndex} />
            <div className="infos">
                <h1 className="instructions">
                    <FaMusic />  Listen <br />
                    <FaStopwatch />  Focus <br />
                    <FaSpinner className="spinner" /> Rest <br />
                    <FaBullseye /> Experience
                </h1>
            </div>
            <Footer link="https://forms.gle/YP93waRthLBaf6Jg8" />
        </div>
    );
}

export default SignIn;
