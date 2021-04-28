import React, { useEffect, useRef } from 'react';

// A custom hook that works the same way as useEffect, but doesn't fire on the initial render
export const useEffectAfterInitialisation = (effect: Function, dependencies: any[]) => {
    const isInitialRenderRef = useRef(true);

    useEffect(() => {
        if (isInitialRenderRef.current) {
            isInitialRenderRef.current = false;
        } else {
            effect();
        }
    }, dependencies);
}
