import { useEffect, useRef } from 'react';

/**
 * Custom hook for infinite scrolling
 * Uses the IntersectionObserver API to detect when the target element becomes visible
 * 
 * @param {Function} callback - Function to execute when target is intersected
 * @param {boolean} hasMore - Flag indicating if there is more data to load
 * @param {boolean} isLoading - Flag to prevent fetching when already loading
 * @returns {React.MutableRefObject} - Ref object to be attached to the target HTML element
 */
const useInfiniteScroll = (callback, hasMore, isLoading) => {
    const observerTarget = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                // When target comes into view, and conditions are met, trigger a load
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    callback();
                }
            },
            { threshold: 1.0 } // 100% of the target should be visible
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        // Cleanup function
        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [callback, hasMore, isLoading]);

    return observerTarget;
};

export default useInfiniteScroll;
