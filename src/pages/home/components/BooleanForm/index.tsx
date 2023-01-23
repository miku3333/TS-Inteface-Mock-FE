import ModalForm, { IModalFormRef } from '@/components/ModalForm';
import { Form, InputNumber, Select } from 'antd';
import { memo, useState, useCallback, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { marcoTask } from '@/uitls';
// @ts-ignore
import styles from './style.module.less';

const { Item } = Form;

interface IBooleanFormProps {}

export interface IBooleanFormRef {
    openBooleanForm?: (currentSchema: IBooleanSchemaExtended) => void;
}

const BooleanForm = forwardRef<IBooleanFormRef, IBooleanFormProps>(({}, ref) => {
    const formRef = useRef<IModalFormRef>(null);
    const [currentSchema, setCurrentSchema] = useState<IBooleanSchemaExtended | null>(null);
    const [open, setOpen] = useState(false);
    const [initialValues, setInitialValues] = useState<IObject>({});
    const openBooleanForm = useCallback((currentSchema: IBooleanSchemaExtended) => {
        const { trueRate = 0.5 } = currentSchema;
        setInitialValues({ trueRate });
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
            const { trueRate } = values;
            if (currentSchema) {
                currentSchema.trueRate = trueRate;
            }
            setOpen(false);
        },
        [currentSchema]
    );
    useImperativeHandle(ref, () => ({ openBooleanForm }));

    return (
        <ModalForm ref={formRef} open={open} setOpen={setOpen} initialValues={initialValues} onFinish={onFinish} title='布尔属性'>
            <Item label='true比例' name='trueRate'>
                <InputNumber precision={2} max={1} min={0} placeholder='默认为0.5' style={{ width: '100%' }} />
            </Item>
        </ModalForm>
    );
});

export default memo(BooleanForm);
