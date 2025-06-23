import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(
  "pk_test_51RFXxURU6dTxWNa8Rebfob9Zt3rMq6TiiycTe1Juwlw4tftkUEkGs0unHz5c0anbhVhuA26gYm8cgmA8DwG8HY2N00sVz2t486"
);

const StripeCheckout = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default StripeCheckout;
