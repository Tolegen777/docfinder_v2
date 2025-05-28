import { useEffect, useState } from 'react';

import { BREAKPOINTS } from '@/shared/constants/breakpoints';

export const useWindowSize = () => {
    const [windowWidth, setWindowWidth] = useState<number | undefined>(
        undefined,
    );

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return {
        windowWidth: windowWidth || 0,
        isMobile:
            typeof windowWidth !== 'undefined'
                ? windowWidth < BREAKPOINTS.xs
                : false,
        isLarge:
            typeof windowWidth !== 'undefined'
                ? windowWidth >= BREAKPOINTS.lg
                : false,
        is3xl:
            typeof windowWidth !== 'undefined'
                ? windowWidth >= BREAKPOINTS['3xl']
                : false,
    };
};
