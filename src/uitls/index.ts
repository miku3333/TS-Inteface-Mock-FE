export const marcoTask = (func: () => void, delay = 0) => {
    const timeout = setTimeout(() => {
        clearTimeout(timeout);
        func();
    }, delay);
};

interface INiceTry {
    <T>(fn: () => T): T | void;
}

interface INiceTryAsync {
    <T>(fn: () => Promise<T>): Promise<T | void>;
}

export const niceTry: INiceTry = (func) => {
    try {
        return func();
    } catch (e) {
        console.log(e);
    }
};

export const niceTryAsync: INiceTryAsync = async (func) => {
    try {
        return await func();
    } catch (e) {
        console.log(e);
    }
};
