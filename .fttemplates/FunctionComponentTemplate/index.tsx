
import {memo, useState, useCallback, useEffect} from 'react';
// import styles from './style.module.less';

const styles = require('./style.module.less');

interface I<FTName | pascalcase>Props {
    prop?: string;
}

const <FTName | pascalcase> = ({ prop }: I<FTName | pascalcase>Props) => {
    const [tempState, setTempState] = useState(1);
    const onClick = useCallback(() => {
        setTempState(tempState => tempState + 1);
    }, []);
    useEffect(() => {
        console.log('tempState ===> ', tempState);
    }, [tempState]);

    return (
        <div className={styles.<FTName | camelcase>}>
            <div className={styles.txt} onClick={onClick}><FTName | pascalcase></div>
            <div className={styles.txt}>{tempState}</div>
            <div className={styles.txt}>{prop}</div>
        </div>
    );
};

export default memo(<FTName | pascalcase>);
