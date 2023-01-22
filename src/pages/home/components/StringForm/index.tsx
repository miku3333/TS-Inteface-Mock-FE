import ModalForm, { IModalFormRef } from '@/components/ModalForm';
import { Form, InputNumber, Select } from 'antd';
import { memo, useState, useCallback, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { marcoTask } from '@/uitls';
// @ts-ignore
import styles from './style.module.less';

const { Item } = Form;

interface IStringFormProps {}

export interface IStringFormRef {
    openStringForm?: (currentSchema: IStringSchemaExtended) => void;
}

const options: { value: IStringSchemaExtendedType; label: string }[] = [
    { value: 'timestamp', label: '时间戳' },
    { value: 'url', label: '网址' },
    { value: 'name', label: '姓名' },
    { value: 'county', label: '地址' },
    { value: 'en', label: '英文' },
    { value: 'normal', label: '随机' }
];

const StringForm = forwardRef<IStringFormRef, IStringFormProps>(({}, ref) => {
    const formRef = useRef<IModalFormRef>(null);
    const [currentSchema, setCurrentSchema] = useState<IStringSchemaExtended | null>(null);
    const [open, setOpen] = useState(false);
    const [initialValues, setInitialValues] = useState<IObject>({});
    const openStringForm = useCallback((currentSchema: IStringSchemaExtended) => {
        const { min, max, type = 'normal' } = currentSchema;
        console.log('currentSchema ===> ', currentSchema);
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
    useImperativeHandle(ref, () => ({ openStringForm }));

    return (
        <ModalForm ref={formRef} open={open} setOpen={setOpen} initialValues={initialValues} onFinish={onFinish} title='字符串属性'>
            <Item label='最小长度' name='min'>
                <InputNumber precision={0} placeholder='默认为随机值' style={{ width: '100%' }} />
            </Item>
            <Item label='最大长度' name='max'>
                <InputNumber precision={0} placeholder='默认为随机值' style={{ width: '100%' }} />
            </Item>
            <Item label='类型' name='type'>
                <Select options={options} />
            </Item>
        </ModalForm>
    );
});

export default memo(StringForm);
