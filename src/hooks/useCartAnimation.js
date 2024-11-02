import { useRef, useState } from 'react';

const useCartAnimation = () => {
    const [isFlying, setIsFlying] = useState(false);
    const flyingRef = useRef(null);

    const startFlyToCartAnimation = (productCardRef) => {
        const productCard = productCardRef.current;
        const cartIcon = document.getElementById('cart-icon');

        if (productCard && cartIcon) {
            const productCardRect = productCard.getBoundingClientRect();
            const cartIconRect = cartIcon.getBoundingClientRect();

            const translateX = cartIconRect.x - productCardRect.x + cartIconRect.width / 2 - productCardRect.width / 2;
            const translateY = cartIconRect.y - productCardRect.y + cartIconRect.height / 2 - productCardRect.height / 2;

            const flyAnimation = productCard.animate(
                [
                    {
                        transform: `translate(0, 0) scale(1)`,
                        opacity: 1,
                    },
                    {
                        transform: `translate(${translateX}px, ${translateY}px) scale(0)`,
                        opacity: 0,
                    },
                ],
                {
                    duration: 800,
                    easing: 'ease-out',
                }
            );

            flyAnimation.onfinish = () => {
                setIsFlying(false);
            };

            setIsFlying(true);
        }
    };

    return { isFlying, setIsFlying, flyingRef, startFlyToCartAnimation };
};

export default useCartAnimation;
