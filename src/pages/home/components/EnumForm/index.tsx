import ModalForm, { IModalFormRef } from '@/components/ModalForm';
import { Button, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { memo, useState, useCallback, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { marcoTask } from '@/uitls';
// @ts-ignore
import styles from './style.module.less';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Item, List, ErrorList } = Form;

interface IEnumFormProps {}

export interface IEnumFormRef {
    openEnumForm?: (currentSchema: IEnumSchemaExtended) => void;
}

const EnumForm = forwardRef<IEnumFormRef, IEnumFormProps>(({}, ref) => {
    const formRef = useRef<IModalFormRef>(null);
    const [currentSchema, setCurrentSchema] = useState<IEnumSchemaExtended | null>(null);
    const [open, setOpen] = useState(false);
    const [initialValues, setInitialValues] = useState<IObject>({});
    const openEnumForm = useCallback((currentSchema: IEnumSchemaExtended) => {
        const { enumRate } = currentSchema;
        const len = currentSchema.enum.length;
        const perRate = (1 / len).toFixed(2);
        const enumList = currentSchema.enum.map((value, index) => ({
            value,
            rate: enumRate ? enumRate[index] : perRate
        }));
        console.log('enumList ===> ', enumList);
        // currentSchema.enumRate || new Array(len).fill(perRate);
        setInitialValues({ enumList });
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
            const { enumList } = values;
            // console.log('enumList ===> ', enumList);
            if (currentSchema && enumList.length) {
                const enumValue = enumList.map((item: any) => item.value);
                const enumRate = enumList.map((item: any) => item.rate);
                currentSchema.enum = enumValue;
                currentSchema.enumRate = enumRate;
            }
            setOpen(false);
        },
        [currentSchema]
    );
    useImperativeHandle(ref, () => ({ openEnumForm }));

    return (
        <ModalForm ref={formRef} open={open} setOpen={setOpen} initialValues={initialValues} onFinish={onFinish} title='枚举属性'>
            <div className={styles.list}>
                <List
                    name='enumList'
                    rules={[
                        {
                            validator: async (_, enumList) => {
                                // const valueList = enumList.map((item: any) => item?.value);
                                // for (const i in valueList) {
                                //     console.log('i ===> ', i);
                                //     console.log('valueList[i] ===> ', valueList[i]);
                                //     if (valueList.indexOf(valueList[i], i + 1) > 0) {
                                //         return Promise.reject(new Error('枚举值中有相同元素'));
                                //     }
                                // }
                                let isSubmit = true;
                                const allRate = enumList
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
                            {fields.map(({ key, name, ...restFields }) => (
                                <Row key={key}>
                                    <Col span={11}>
                                        <Item {...restFields} label='值' name={[name, 'value']} rules={[{ required: true }]}>
                                            <Input style={{ width: '90%' }} placeholder='请输入枚举值' />
                                        </Item>
                                    </Col>
                                    <Col span={11}>
                                        <Item {...restFields} label='比率' name={[name, 'rate']} rules={[{ required: true }]}>
                                            <InputNumber precision={2} min={0} max={1} placeholder='默认为随机值' style={{ width: '100%' }} />
                                        </Item>
                                    </Col>
                                    <Col span={2}>{fields.length > 1 ? <MinusCircleOutlined className={styles.delete} onClick={() => remove(name)} /> : null}</Col>
                                </Row>
                            ))}
                            <Item>
                                <Button type='dashed' onClick={() => add()} style={{ width: '100%' }} icon={<PlusOutlined />}>
                                    新增枚举值
                                </Button>
                                <ErrorList errors={errors} />
                            </Item>
                        </>
                    )}
                </List>
            </div>
        </ModalForm>
    );
});

export default memo(EnumForm);
