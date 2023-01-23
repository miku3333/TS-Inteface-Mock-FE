import ModalForm, { IModalFormRef } from '@/components/ModalForm';
import { Button, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { memo, useState, useCallback, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { marcoTask } from '@/uitls';
// @ts-ignore
import styles from './style.module.less';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Item, List, ErrorList } = Form;

interface IAnyOfFormProps {}

export interface IAnyOfFormRef {
    openAnyOfForm?: (currentSchema: IAnyOfSchemaExtended) => void;
}

const AnyOfForm = forwardRef<IAnyOfFormRef, IAnyOfFormProps>(({}, ref) => {
    const formRef = useRef<IModalFormRef>(null);
    const [currentSchema, setCurrentSchema] = useState<IAnyOfSchemaExtended | null>(null);
    const [open, setOpen] = useState(false);
    const [initialValues, setInitialValues] = useState<IObject>({});
    const openAnyOfForm = useCallback((currentSchema: IAnyOfSchemaExtended) => {
        const { anyOfRate } = currentSchema;
        const len = currentSchema.anyOf.length;
        const perRate = (1 / len).toFixed(2);
        const anyOfList = currentSchema.anyOf.map((value, index) => ({
            value,
            rate: anyOfRate ? anyOfRate[index] : perRate
        }));
        setInitialValues({ anyOfList });
        setOpen(true);
        setCurrentSchema(currentSchema);
    }, []);
    useEffect(() => {
        marcoTask(() => {
            formRef.current?.form.resetFields();
        });
    }, [initialValues]);
    const onFinish = useCallback(
        (values: IObject) => {
            const { anyofList } = values;
            // console.log('anyofList ===> ', anyofList);
            if (currentSchema && anyofList.length) {
                const anyofRate = anyofList.map((item: any) => item.rate);
                currentSchema.anyOfRate = anyofRate;
            }
            setOpen(false);
        },
        [currentSchema]
    );
    useImperativeHandle(ref, () => ({ openAnyOfForm }));

    return (
        <ModalForm ref={formRef} open={open} setOpen={setOpen} initialValues={initialValues} onFinish={onFinish} title='anyOf属性'>
            <div className={styles.list}>
                <List
                    name='anyOfList'
                    rules={[
                        {
                            validator: async (_, anyOfList) => {
                                // const valueList = anyofList.map((item: any) => item?.value);
                                // for (const i in valueList) {
                                //     console.log('i ===> ', i);
                                //     console.log('valueList[i] ===> ', valueList[i]);
                                //     if (valueList.indexOf(valueList[i], i + 1) > 0) {
                                //         return Promise.reject(new Error('枚举值中有相同元素'));
                                //     }
                                // }
                                let isSubmit = true;
                                const allRate = anyOfList
                                    .map((item: any) => item?.rate)
                                    .reduce((pre: number, cur: string) => {
                                        if (cur === undefined) {
                                            isSubmit = false;
                                        }
                                        return pre + Number(cur);
                                    }, 0);
                                if (isSubmit && (allRate > 1 || allRate < 0.99)) {
                                    return Promise.reject(new Error('比率总和必须为1'));
                                }
                            }
                        }
                    ]}>
                    {(fields, { add, remove }, { errors }) => (
                        <>
                            {fields.map(({ key, name, ...restFields }, index) => (
                                <Row key={key}>
                                    <Col span={24}>
                                        <Item {...restFields} label={`比率${index}`} name={[name, 'rate']} rules={[{ required: true }]}>
                                            <InputNumber precision={2} min={0} max={1} placeholder='默认为随机值' style={{ width: '100%' }} />
                                        </Item>
                                    </Col>
                                </Row>
                            ))}
                            <Item>
                                <ErrorList errors={errors} />
                            </Item>
                        </>
                    )}
                </List>
            </div>
        </ModalForm>
    );
});

export default memo(AnyOfForm);
