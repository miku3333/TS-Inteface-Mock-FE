export const marcoTask = (func: () => void, delay = 0) => {
    const timeout = setTimeout(() => {
        clearTimeout(timeout);
        func();
    }, delay);
};
