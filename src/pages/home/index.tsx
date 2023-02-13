import { Button, Form, Input, message } from 'antd';
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
import axios from 'axios';
import { marcoTask, niceTryAsync } from '@/uitls';
import useRefresh from '@/hooks/useRefresh';

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
    const formattedSchema = useReactive<Partial<IFormattedSchema>>({});
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
    const refresh = useRefresh();
    const [path, setPath] = useState('/api/test');
    const onChange = async () => {
        const res = await niceTryAsync(() => axios.post<IResponse<IFormattedSchema>>('http://localhost:23333/find', { path }));
        if (res?.data?.success) {
            const data = res.data.data;
            console.log('data ===> ', data);
            formattedSchema.path = path;
            formattedSchema.schema = data.schema;
            console.log('formattedSchema.schema ===> ', formattedSchema.schema);
            console.log('formattedSchema ===> ', formattedSchema);
        } else {
            message.error('该接口不存在');
        }
    };

    const onSave = async () => {
        const res = await niceTryAsync(() => axios.post<IResponse<null>>('http://localhost:23333/save', formattedSchema));
        if (res?.data?.success) {
            message.success('修改成功');
        }
    };

    return (
        <div className={styles.home}>
            <Input placeholder='请输入接口path' value={path} onChange={(e) => setPath(e.target.value)} />
            <Button type='primary' onClick={onChange}>
                更改接口
            </Button>
            <Button type='primary' onClick={onSave}>
                保存
            </Button>
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
                    {!!Object.keys(formattedSchema).length && (
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
                    )}
                </RefProvider>
            </EditContext.Provider>
        </div>
    );
};

export default memo(Home);
