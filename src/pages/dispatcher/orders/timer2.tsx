import { useState, useEffect } from "react";

function useTimer(data: { created_at: string }): { hours: number; minutes: number } {
    const [timeRemaining, setTimeRemaining] = useState(0);

    useEffect(() => {
        const start: Date = new Date();
        const end: Date = new Date(data.created_at);
        const diffInMilliseconds = +end - +start;
        const diffInSeconds = 20 * 60 - diffInMilliseconds / 1000;

        setTimeRemaining(diffInSeconds);

        const intervalId = setInterval(() => {
            setTimeRemaining((prevTime) => {
                if (prevTime > 0) {
                    return prevTime - 1;
                } else {
                    return 0;
                }
            });
        }, 60000);

        return () => clearInterval(intervalId);
    }, []);

    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);

    return { hours, minutes };
}

export default useTimer;
