import React, { useState } from "react";
import {
    CardElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { Box, Button, Alert } from "@mui/material";
import Cookies from "js-cookie";

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            fontSize: "16px",
            color: "#32325d",
        },
        invalid: {
            color: "#fa755a",
        },
    },
    hidePostalCode: true,
};

const StripePaymentForm = ({
    amount,
    onSuccess,
}: {
    amount: number;
    onSuccess: (paymentResult: any) => void;
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!stripe || !elements) return;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_MONGODB_URI}/api/orders/create-payment-intent`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Cookies.get("token")}`,
                },

                body: JSON.stringify({ amount }),
            });

            const { clientSecret } = await res.json();

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement)!,
                },
            });

            if (result.error) {
                setError(result.error.message || "Payment failed.");
            } else if (result.paymentIntent?.status === "succeeded") {
                onSuccess(result.paymentIntent);
            }
        } catch (err: any) {
            setError("Unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box mt={2}>
            <CardElement options={CARD_ELEMENT_OPTIONS} />
            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}
            <Button
                variant="contained"
                sx={{ mt: 2 }}
                disabled={!stripe || loading}
                onClick={handleSubmit}
                fullWidth
            >
                {loading ? "Processing..." : `Pay $${amount.toFixed(2)}`}
            </Button>
        </Box>
    );
};

export default StripePaymentForm;