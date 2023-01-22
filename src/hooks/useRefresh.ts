import { useCallback, useEffect, useState } from 'react';

const useRefresh = () => {
    const [key, setKey] = useState(0);
    const refresh = useCallback(() => {
        setKey((key) => key + 1);
    }, []);
    useEffect(() => {
        refresh;
    }, []);
    return refresh;
};

export default useRefresh;
