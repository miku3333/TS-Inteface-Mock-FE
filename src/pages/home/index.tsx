import { Button, Form } from 'antd';
import { memo, useState, useCallback, useEffect, useRef, createContext, MutableRefObject, RefObject } from 'react';
// @ts-ignore
import styles from './style.module.less';
import constate from 'constate';
import json from './single.json';
import JsonBlock from './components/JsonBlock';
import { useReactive } from 'ahooks';
import classNames from 'classnames';
import ObjectForm, { IObjectFormRef } from './components/ObjectForm';
import ArrayForm, { IArrayFormRef } from './components/ArrayForm';
import StringForm, { IStringFormRef } from './components/StringForm';
import NumberForm, { INumberFormRef } from './components/NumberForm';
import BooleanForm, { IBooleanFormRef } from './components/BooleanForm';
import EnumForm, { IEnumFormRef } from './components/EnumForm';
import AnyOfForm, { IAnyOfFormRef } from './components/AnyOfForm';

const { Item } = Form;

interface IHomeProps {
    prop?: string;
}

export const [RefProvider, useModelRef] = constate(
    ({
        objectFormRef,
        arrayFormRef,
        stringFormRef,
        numberFormRef,
        booleanFormRef,
        enumFormRef,
        anyOfFormRef
    }: {
        objectFormRef: RefObject<IObjectFormRef>;
        arrayFormRef: RefObject<IArrayFormRef>;
        stringFormRef: RefObject<IStringFormRef>;
        numberFormRef: RefObject<INumberFormRef>;
        booleanFormRef: RefObject<IBooleanFormRef>;
        enumFormRef: RefObject<IEnumFormRef>;
        anyOfFormRef: RefObject<IAnyOfFormRef>;
    }) => {
        return { objectFormRef, arrayFormRef, stringFormRef, numberFormRef, booleanFormRef, enumFormRef, anyOfFormRef };
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
    const numberFormRef = useRef<INumberFormRef>(null);
    const booleanFormRef = useRef<IBooleanFormRef>(null);
    const enumFormRef = useRef<IEnumFormRef>(null);
    const anyOfFormRef = useRef<IAnyOfFormRef>(null);
    useEffect(() => {
        console.log('formattedSchema ===> ', formattedSchema);
    }, []);
    const [isEdit, setIsEdit] = useState(false);
    // useRefresh();

    return (
        <div className={styles.home}>
            <Button type='primary'>保存</Button>
            <EditContext.Provider value={{ isEdit, setIsEdit }}>
                {/* prettier-ignore */}
                <RefProvider 
                    objectFormRef={objectFormRef} 
                    arrayFormRef={arrayFormRef} 
                    stringFormRef={stringFormRef}
                    numberFormRef={numberFormRef}
                    booleanFormRef={booleanFormRef}
                    enumFormRef={enumFormRef}
                    anyOfFormRef={anyOfFormRef}
                >
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
                        <NumberForm ref={numberFormRef} />
                        <BooleanForm ref={booleanFormRef} />
                        <EnumForm ref={enumFormRef} />
                        <AnyOfForm ref={anyOfFormRef} />
                    </div>
                </RefProvider>
            </EditContext.Provider>
        </div>
    );
};

export default memo(Home);
