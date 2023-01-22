import { ReactNode, memo, useEffect, useRef, useState } from 'react';
import styles from './style.module.less';
import { marcoTask } from '@/uitls';
import { useUpdateEffect } from 'ahooks';

const UnknownHeightCloseWrapper = ({ close, children }: { close: boolean; children: ReactNode }) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [initHeight, setInitHeight] = useState(0);
    useEffect(() => {
        if (wrapperRef.current) {
            setInitHeight(wrapperRef.current.clientHeight);
            console.log('wrapperRef.current.clientHeight ===> ', wrapperRef.current.clientHeight);
        }
    }, []);
    // const [isClosing, setIsClosing] = useState(false);
    // const timer = useRef(0);
    // useUpdateEffect(() => {
    //     if (!close) {
    //         setIsClosing(true);
    //         if (timer.current) {
    //             clearTimeout(timer.current);
    //         }
    //         timer.current = setTimeout(() => {
    //             clearTimeout(timer.current);
    //             setIsClosing(false);
    //         }, 1000) as unknown as number;
    //     }
    // }, [close]);
    const height = close ? 0 : initHeight || 'auto';
    // prettier-ignore
    return (
        <div ref={wrapperRef} style={{height}} className={styles.closeWrapper}>{children}</div>
    );
};

export default memo(UnknownHeightCloseWrapper);
