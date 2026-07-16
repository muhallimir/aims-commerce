import { useCallback, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateUserInfo, useGoogleSignInMutation } from "@store/user.slice";
import Cookies from "js-cookie";

const inlineClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export const useGoogleAuth = () => {
	const dispatch = useDispatch();
	const [googleSignIn] = useGoogleSignInMutation();
	const initializedRef = useRef(false);

	const renderInto = useCallback((clientId) => {
		if (!clientId) return;
		if (initializedRef.current) return;
		initializedRef.current = true;

		window.google.accounts.id.initialize({
			client_id: clientId,
			callback: async (response) => {
				const { credential } = response;
				try {
					const result = await googleSignIn({ credential }).unwrap();
					dispatch(updateUserInfo(result));
					Cookies.set("token", result.token, { path: "/" });
				} catch (err) {
					console.error("Google Sign-In failed", err);
				}
			},
		});

		const buttonElement = document.getElementById("google-signin-btn");
		if (buttonElement) {
			window.google.accounts.id.renderButton(buttonElement, {
				theme: "outline",
				size: "large",
				width: "100%",
			});
		}
	}, [googleSignIn, dispatch]);

	const initializeGoogle = useCallback(async () => {
		const clientId = inlineClientId || (await fetch("/api/config/google")
			.then((r) => r.json())
			.then((d) => d?.googleClientId)
			.catch(() => ""));

		renderInto(clientId);
	}, [renderInto]);

	useEffect(() => {
		if (typeof window === "undefined") return;
		if (window.google) {
			initializeGoogle();
			return;
		}
		const interval = setInterval(() => {
			if (window.google) {
				clearInterval(interval);
				initializeGoogle();
			}
		}, 100);
		const timeout = setTimeout(() => clearInterval(interval), 10000);
		return () => {
			clearInterval(interval);
			clearTimeout(timeout);
		};
	}, [initializeGoogle]);

	return { initializeGoogle };
};
