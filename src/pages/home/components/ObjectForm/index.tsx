import ModalForm, { IModalFormRef } from '@/components/ModalForm';
import { useResetState } from 'ahooks';
import { Checkbox, Form } from 'antd';
import { memo, useState, useCallback, useEffect, forwardRef, useImperativeHandle, useRef, useMemo } from 'react';
import { useModelRef } from '../..';
import { marcoTask } from '@/uitls';
// @ts-ignore
import styles from './style.module.less';

// const styles = require('./style.module.less');
const { Item } = Form;
const { Group } = Checkbox;

interface IObjectFormProps {}

export interface IObjectFormRef {
    openObjectForm?: (currentSchema: IObjectSchema) => void;
}

const ObjectForm = forwardRef<IObjectFormRef, IObjectFormProps>(({}, ref) => {
    const formRef = useRef<IModalFormRef>(null);

    const [currentSchema, setCurrentSchema] = useState<IObjectSchema | null>(null);
    const [open, setOpen] = useState(false);
    const [options, setOptions, resetOptions] = useResetState<{ label: string; value: string }[]>([]);
    const [initialValues, setInitialValues] = useState<IObject>({});
    const openObjectForm = useCallback((currentSchema: IObjectSchema) => {
        const { required, properties } = currentSchema;
        setOpen(true);
        setOptions(
            Object.keys(properties).map((key) => ({
                label: key,
                value: key
            }))
        );
        setInitialValues({ required: required || [] });
        console.log('currentSchema ===> ', currentSchema);
        setCurrentSchema(currentSchema);
    }, []);
    useEffect(() => {
        marcoTask(() => {
            formRef.current?.form.resetFields();
        });
    }, [initialValues]);
    const onFinish = useCallback(
        (values: IObject) => {
            const { required } = values;
            console.log('currentSchema ===> ', currentSchema);
            console.log('currentSchema.required ===> ', currentSchema?.required);
            if (currentSchema) {
                currentSchema.required = required;
                console.log('currentSchema.required ===> ', currentSchema.required);
            }
            setOpen(false);
        },
        [currentSchema]
    );
    useImperativeHandle(ref, () => ({ openObjectForm }));

    return (
        <ModalForm ref={formRef} open={open} setOpen={setOpen} initialValues={initialValues} onFinish={onFinish} title='对象属性'>
            <Item label='必选' name='required'>
                <Group options={options} className={styles.group} />
            </Item>
        </ModalForm>
    );
});

export default memo(ObjectForm);
