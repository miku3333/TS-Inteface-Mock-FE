import ModalForm, { IModalFormRef } from '@/components/ModalForm';
import { Form, InputNumber, Select } from 'antd';
import { memo, useState, useCallback, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { marcoTask } from '@/uitls';
// @ts-ignore
import styles from './style.module.less';

const { Item } = Form;

interface INumberFormProps {}

export interface INumberFormRef {
    openNumberForm?: (currentSchema: INumberSchemaExtended) => void;
}

const options: { value: INumberSchemaExtendedType; label: string }[] = [
    { value: 'int', label: '整数' },
    { value: 'float', label: '浮点数' },
    { value: 'timestamp', label: '时间戳' }
];

const NumberForm = forwardRef<INumberFormRef, INumberFormProps>(({}, ref) => {
    const formRef = useRef<IModalFormRef>(null);
    const [currentSchema, setCurrentSchema] = useState<INumberSchemaExtended | null>(null);
    const [open, setOpen] = useState(false);
    const [initialValues, setInitialValues] = useState<IObject>({});
    const openNumberForm = useCallback((currentSchema: INumberSchemaExtended) => {
        const { min, max, type = 'int' } = currentSchema;
        setInitialValues({ min, max, type });
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
            const { min, max, type } = values;
            if (currentSchema) {
                if (min > 0) {
                    currentSchema.min = min;
                }
                if (max > 0) {
                    currentSchema.max = max;
                }
                currentSchema.type = type;
            }
            setOpen(false);
        },
        [currentSchema]
    );
    useImperativeHandle(ref, () => ({ openNumberForm }));

    return (
        <ModalForm ref={formRef} open={open} setOpen={setOpen} initialValues={initialValues} onFinish={onFinish} title='数字属性'>
            <Item label='最小值' name='min'>
                <InputNumber precision={0} placeholder='默认为随机值' style={{ width: '100%' }} />
            </Item>
            <Item label='最大值' name='max'>
                <InputNumber precision={0} placeholder='默认为随机值' style={{ width: '100%' }} />
            </Item>
            <Item label='类型' name='type'>
                <Select options={options} />
            </Item>
        </ModalForm>
    );
});

export default memo(NumberForm);
