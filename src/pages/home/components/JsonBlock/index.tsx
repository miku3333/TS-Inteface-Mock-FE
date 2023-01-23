import { memo, useState, useCallback, useEffect, useMemo, ReactNode, useRef, useImperativeHandle, useContext } from 'react';
// @ts-ignore
import styles from './style.module.less';
import { SCHEMA_TYPE } from '@/constants';
import { CaretDownOutlined, EditOutlined, QuestionCircleOutlined, QuestionOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { marcoTask } from '@/uitls';
import { forwardRef } from 'react';
import { useResetState, useSize, useUpdateEffect } from 'ahooks';
import { Popover, Tag } from 'antd';
import { CSSTransition } from 'react-transition-group';
import { EditContext, useModelRef } from '../..';

// interface PriceValue {
//     number?: number;
//     currency?: string;
// }

// interface PriceInputProps {
//     value?: PriceValue;
//     onChange?: (value: PriceValue) => void;
// }

interface IJsonBlockProps {
    paths: string[];
    k: string[];
    parentSchema?: ISchemaWithChildren;
    currentSchema: IAllSchema;
    depth: number;
    noHeightLimit?: boolean;
    resetParent?: () => void;
    isOptional?: boolean;
}

const tagMap = {
    1: {
        name: '字符',
        tag: <Tag color='magenta'>字符</Tag>
    },
    2: {
        name: '数字',
        tag: <Tag color='geekblue'>数字</Tag>
    },
    3: {
        name: 'null',
        tag: <Tag color='volcano'>null</Tag>
    },
    4: {
        name: '布尔',
        tag: <Tag color='orange'>布尔</Tag>
    },
    5: {
        name: 'ERROR',
        tag: <Tag color='red'>ERROR</Tag>
    },
    6: {
        name: '枚举',
        tag: <Tag color='gold'>枚举</Tag>
    },
    7: {
        name: '数组',
        tag: <Tag color='lime'>数组</Tag>
    },
    8: {
        name: '任意之一',
        tag: <Tag color='green'>任意之一</Tag>
    },
    9: {
        name: '任意',
        tag: <Tag color='cyan'>任意</Tag>
    },
    10: {
        name: '对象',
        tag: <Tag color='blue'>对象</Tag>
    }
};

const JsonBlock = memo(({ paths, k, parentSchema, currentSchema, depth, noHeightLimit, resetParent, isOptional }: IJsonBlockProps) => {
    const schemaType = useMemo(() => {
        const temp = 1;
        return temp;
    }, []);
    const { objectFormRef, arrayFormRef, stringFormRef, numberFormRef, booleanFormRef, enumFormRef, anyOfFormRef } = useModelRef();
    const listRef = useRef<HTMLDivElement | null>(null);
    const [maxHeight, setMaxHeight, resetMaxHeight] = useResetState(0);
    const [listClose, setListClose] = useState(true);
    const { isEdit, setIsEdit } = useContext(EditContext);
    const [curEdit, setCurEdit] = useState(false);

    useUpdateEffect(() => {
        const ref = listRef.current;
        if (ref) {
            if (listClose) {
                resetMaxHeight();
            } else {
                // console.log('ref ===> ', ref.scrollHeight);
                // console.log('ref ===> ', ref.children[0].scrollHeight);
                setMaxHeight(ref.scrollHeight + 4);
                resetParent?.();
            }
        }
    }, [listClose]);

    const setCurrent = useCallback(() => {
        const ref = listRef.current;
        if (ref) {
            // TODO: 待优化
            // console.log('ref ===> ', ref);
            // console.log('ref.children[0].scrollHeight ===> ', ref.children[0].scrollHeight);
            // debugger;
            marcoTask(() => {
                setMaxHeight(ref.children[0].scrollHeight + 4);
            }, 300);
        }
    }, []);

    useEffect(() => {
        setListClose(false);
    }, []);

    const titleClick: React.MouseEventHandler<HTMLSpanElement> = useCallback((e) => {
        e.stopPropagation();
        setListClose((listClose) => !listClose);
    }, []);

    const edit = () => {
        setIsEdit(true);
        setCurEdit(true);
        if (currentSchema.key === SCHEMA_TYPE.object) {
            objectFormRef.current?.openObjectForm?.(currentSchema);
        } else if (currentSchema.key === SCHEMA_TYPE.array) {
            arrayFormRef.current?.openArrayForm?.(currentSchema);
        } else if (currentSchema.key === SCHEMA_TYPE.string) {
            stringFormRef.current?.openStringForm?.(currentSchema);
        } else if (currentSchema.key === SCHEMA_TYPE.number) {
            numberFormRef.current?.openNumberForm?.(currentSchema);
        } else if (currentSchema.key === SCHEMA_TYPE.boolean) {
            booleanFormRef.current?.openBooleanForm?.(currentSchema);
        } else if (currentSchema.key === SCHEMA_TYPE.enum) {
            enumFormRef.current?.openEnumForm?.(currentSchema);
        } else if (currentSchema.key === SCHEMA_TYPE.anyOf) {
            anyOfFormRef.current?.openAnyOfForm?.(currentSchema);
        } else {
            setIsEdit(false);
            setCurEdit(false);
        }
    };

    useEffect(() => {
        if (!isEdit) {
            setCurEdit(false);
        }
    }, [isEdit]);

    const getCurrentBlock = useCallback(() => {
        let extraEle: ReactNode | null = null;
        switch (currentSchema.key) {
            case SCHEMA_TYPE.string:
            case SCHEMA_TYPE.number:
            case SCHEMA_TYPE.null:
            case SCHEMA_TYPE.boolean:
                break;
            case SCHEMA_TYPE.enum:
                break;
            case SCHEMA_TYPE.any:
                break;
            case SCHEMA_TYPE.anyOf:
                extraEle = (
                    <div className={styles.children}>
                        {currentSchema.anyOf.map((schema, index) => (
                            <JsonBlock
                                key={index}
                                depth={depth + 1}
                                currentSchema={schema}
                                parentSchema={currentSchema}
                                k={['anyOf', index + '']}
                                paths={paths.concat(['anyOf', index + ''])}
                                resetParent={setCurrent}
                            />
                        ))}
                    </div>
                );
                break;
            case SCHEMA_TYPE.array:
                extraEle = (
                    <div className={styles.children}>
                        {
                            // prettier-ignore
                            Array.isArray(currentSchema.items)
                                ? currentSchema.items.map((item, index) => (
                                    <JsonBlock
                                        key={index}
                                        depth={depth + 1}
                                        currentSchema={item}
                                        parentSchema={currentSchema}
                                        k={['items', index + '']}
                                        paths={paths.concat(['items', index + ''])}
                                        resetParent={setCurrent}
                                    />
                                ))
                                : (
                                    <JsonBlock
                                        depth={depth + 1}
                                        currentSchema={currentSchema.items}
                                        parentSchema={currentSchema}
                                        k={['items']}
                                        paths={paths.concat(['items'])}
                                        resetParent={setCurrent}
                                    />
                                )
                        }
                    </div>
                );
                break;
            case SCHEMA_TYPE.object:
                extraEle = (
                    <div className={styles.children}>
                        {currentSchema.properties.extraType !== 'any' &&
                            Object.entries(currentSchema.properties).map(([key, value]) =>
                                // prettier-ignore
                                <JsonBlock
                                    key={key}
                                    depth={depth + 1}
                                    currentSchema={value}
                                    parentSchema={currentSchema}
                                    k={['properties', key]}
                                    paths={paths.concat(['properties', key])}
                                    resetParent={setCurrent}
                                    isOptional={!!(currentSchema.required) && !(currentSchema.required.includes(key))}
                                />
                            )}
                    </div>
                );
                break;
        }
        return extraEle;
    }, []);

    const ChildBlock = getCurrentBlock();

    // @ts-ignore
    const { key, min, max } = currentSchema || {};

    return (
        <div
            className={classNames({
                [styles.schema]: true,
                [styles.noMask]: curEdit
            })}>
            <div className={styles.title} onClick={edit}>
                <div className={styles.key}>{k[k.length - 1]}</div>
                {tagMap[currentSchema.key].tag}
                {min && <div className={styles.tag}>min: {min}</div>}
                {max && <div className={styles.tag}>max: {max}</div>}
                {isOptional && (
                    <Popover content='该字段是可选的, 可能不存在'>
                        <QuestionCircleOutlined />
                    </Popover>
                )}
                {ChildBlock && <CaretDownOutlined onClick={titleClick} rotate={listClose ? 180 : 0} className={styles.arrow} />}
                {/* <div className={styles.extraType}> {currentSchema.extraType}</div> */}
            </div>
            {ChildBlock && (
                <div ref={listRef} className={styles.list} style={{ maxHeight: noHeightLimit ? 'none' : maxHeight }}>
                    {ChildBlock}
                </div>
            )}
        </div>
    );
});

export default JsonBlock;
