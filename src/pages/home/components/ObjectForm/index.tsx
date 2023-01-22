import ModalForm, { IModalFormRef } from '@/components/ModalForm';
import { useResetState } from 'ahooks';
import { Checkbox, Form } from 'antd';
import { memo, useState, useCallback, useEffect, forwardRef, useImperativeHandle, useRef, useMemo } from 'react';
import { useModelRef } from '../..';
import { marcoTask } from '@/uitls';
// import styles from './style.module.less';

const styles = require('./style.module.less');
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
    const openObjectForm = useCallback((currentSchemas: IObjectSchema) => {
        const { required, properties } = currentSchemas;
        setOpen(true);
        setOptions(
            Object.keys(properties).map((key) => ({
                label: key,
                value: key
            }))
        );
        setInitialValues({ required: required || [] });
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
            if (currentSchema) {
                currentSchema.required = required;
            }
            setOpen(false);
            // resetOptions();
            // resetRequired();
            // marcoTask(() => {
            // });
            // resetPaths();
        },
        [currentSchema]
    );
    useImperativeHandle(ref, () => ({ openObjectForm }));

    return (
        <ModalForm ref={formRef} open={open} setOpen={setOpen} initialValues={initialValues} onFinish={onFinish} title='对象属性'>
            <Item label='必选' name='required'>
                <Group options={options} />
            </Item>
        </ModalForm>
    );
});

export default memo(ObjectForm);
