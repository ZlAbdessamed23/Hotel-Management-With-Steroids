import { useState, useEffect } from 'react';

function useScreenSize() : "mobile" | "sm" | "md" | "lg" | "xl" {
  const [screenSize, setScreenSize] = useState<"mobile" | "sm" | "md" | "lg" | "xl">('mobile');

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width >= 1280) {
        setScreenSize('xl');
      } else if (width >= 1024) {
        setScreenSize('lg');
      } else if (width >= 768) {
        setScreenSize('md');
      } else if (width >= 640) {
        setScreenSize('sm');
      } else {
        setScreenSize('mobile');
      }
    };

    // Check if window is defined (client-side)
    if (typeof window !== 'undefined') {
      // Set the initial value
      updateScreenSize();

      // Add event listener for window resize
      window.addEventListener('resize', updateScreenSize);

      // Cleanup function to remove event listener
      return () => window.removeEventListener('resize', updateScreenSize);
    }
  }, []); // Empty dependency array means this effect runs once on mount

  useEffect(() => {
    console.log(screenSize);
  },[screenSize]);

  return screenSize;
}

export default useScreenSize;