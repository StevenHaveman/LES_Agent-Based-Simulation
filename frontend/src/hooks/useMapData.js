import { useEffect, useState } from "react";

export const useMapData = () => {
    const [houses, setHouses] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:5000/houses")
            .then(res => res.json())
            .then(data => setHouses(data))
            .catch(err => console.error(err));
    }, []);

    return houses;
};