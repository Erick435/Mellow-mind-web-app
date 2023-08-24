// PaymentPage.jsx
import React, { useEffect, useState } from "react";
import { getOrCreateSubscriber } from "../revenueCatApi"

function PaymentPage({userId}) {
  const [subscriberInfo, setSubscriberInfo] = useState({});
  const API_KEY = process.env.REACT_APP_CAT_API_KEY
  const appUserId = userId; // Replace with the actual app user ID

  useEffect(() => {
    getOrCreateSubscriber(API_KEY, appUserId)
      .then(response => {
        setSubscriberInfo(response.subscriber);
      })
      .catch(error => {
        console.error("API request failed:", error);
      });
  }, []);

  return (
    <div>
      <h1>Subscriber Information</h1>
      <pre>{JSON.stringify(subscriberInfo, null, 2)}</pre>
    </div>
  );
}

export default PaymentPage;
