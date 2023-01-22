import ModalForm, { IModalFormRef } from '@/components/ModalForm';
import { Form, InputNumber } from 'antd';
import { memo, useState, useCallback, useEffect, forwardRef, useImperativeHandle, useRef, useMemo } from 'react';
import { marcoTask } from '@/uitls';
// @ts-ignore
import styles from './style.module.less';

const { Item } = Form;

interface IArrayFormProps {}

export interface IArrayFormRef {
    openArrayForm?: (currentSchema: IArraySchema) => void;
}

const ArrayForm = forwardRef<IArrayFormRef, IArrayFormProps>(({}, ref) => {
    const formRef = useRef<IModalFormRef>(null);
    const [currentSchema, setCurrentSchema] = useState<IArraySchema | null>(null);
    const [open, setOpen] = useState(false);
    const [initialValues, setInitialValues] = useState<IObject>({});
    const openArrayForm = useCallback((currentSchema: IArraySchema) => {
        const { min, max } = currentSchema;
        console.log('currentSchema ===> ', currentSchema);
        setInitialValues({ min, max });
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
            const { min, max } = values;
            if (currentSchema) {
                if (min > 0) {
                    currentSchema.min = min;
                }
                if (max > 0) {
                    currentSchema.max = max;
                }
            }
            setOpen(false);
        },
        [currentSchema]
    );
    useImperativeHandle(ref, () => ({ openArrayForm }));

    return (
        <ModalForm ref={formRef} open={open} setOpen={setOpen} initialValues={initialValues} onFinish={onFinish} title='数组属性'>
            <Item label='最小数量' name='min'>
                <InputNumber precision={0} style={{ width: '100%' }} />
            </Item>
            <Item label='最大数量' name='max'>
                <InputNumber precision={0} style={{ width: '100%' }} />
            </Item>
        </ModalForm>
    );
});

export default memo(ArrayForm);
