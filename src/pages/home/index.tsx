import { DatePicker, Form, message } from 'antd';
import { memo, useState, useCallback, useEffect, useRef, createContext, MutableRefObject, RefObject } from 'react';
// @ts-ignore
import styles from './style.module.less';
import constate from 'constate';
import json from './single.json';
import JsonBlock from './components/JsonBlock';
import ObjectForm, { IObjectFormRef } from './components/ObjectForm';
import { useReactive } from 'ahooks';
import useRefresh from '@/hooks/useRefresh';
import ArrayForm, { IArrayFormRef } from './components/ArrayForm';
import StringForm, { IStringFormRef } from './components/StringForm';
import classNames from 'classnames';

const { Item } = Form;

interface IHomeProps {
    prop?: string;
}

export const [RefProvider, useModelRef] = constate(
    ({
        objectFormRef,
        arrayFormRef,
        stringFormRef
    }: {
        objectFormRef: RefObject<IObjectFormRef>;
        arrayFormRef: RefObject<IArrayFormRef>;
        stringFormRef: RefObject<IStringFormRef>;
    }) => {
        return { objectFormRef, arrayFormRef, stringFormRef };
    }
);

export const EditContext = createContext<{
    isEdit: boolean;
    setIsEdit: (isEdit: boolean, cb?: () => void) => void;
    // @ts-ignore
}>({});

const Home = ({}: IHomeProps) => {
    // const formattedSchema = useRef(json as IFormattedSchema);
    const formattedSchema = useReactive(json as IFormattedSchema);
    const objectFormRef = useRef<IObjectFormRef>(null);
    const arrayFormRef = useRef<IArrayFormRef>(null);
    const stringFormRef = useRef<IStringFormRef>(null);
    useEffect(() => {
        console.log('formattedSchema ===> ', formattedSchema);
    }, []);
    const [isEdit, setIsEdit] = useState(false);
    // useRefresh();

    return (
        <div className={styles.home}>
            <EditContext.Provider value={{ isEdit, setIsEdit }}>
                <RefProvider objectFormRef={objectFormRef} arrayFormRef={arrayFormRef} stringFormRef={stringFormRef}>
                    {/* <ModalContext.Provider value={{ objectFormRef }}> */}
                    <div className={classNames({ [styles.mask]: isEdit })}>
                        <JsonBlock
                            noHeightLimit
                            depth={0}
                            k={[formattedSchema.path]}
                            currentSchema={formattedSchema.schema}
                            // parentSchema={formattedSchema}
                            // paths={[formattedSchema.current.path]}
                            paths={[]}
                        />
                        {/* </ModalContext.Provider> */}
                        <ObjectForm ref={objectFormRef} />
                        <ArrayForm ref={arrayFormRef} />
                        <StringForm ref={stringFormRef} />
                    </div>
                </RefProvider>
            </EditContext.Provider>
        </div>
    );
};

export default memo(Home);
