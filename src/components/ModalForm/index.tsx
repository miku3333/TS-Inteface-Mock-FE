import { memo, useState, useCallback, useEffect, ReactNode, forwardRef, useImperativeHandle, useRef, useContext } from 'react';
// @ts-ignore
import styles from './style.module.less';
import { Form, FormInstance, Modal } from 'antd';
import { CUSTOM_COL } from '@/constants';
import { EditContext, useModelRef } from '@/pages/home';

const { Item, useForm } = Form;

interface IModalFormProps {
    prop?: string;
    open: boolean;
    setOpen: (open: boolean) => void;
    children: ReactNode;
    onFinish: (values: IObject) => void;
    initialValues?: IObject;
    customCol?: boolean;
    title?: string;
}

export interface IModalFormRef {
    form: FormInstance<any>;
}

const ModalForm = forwardRef<IModalFormRef, IModalFormProps>(({ prop, open, setOpen, children, onFinish, initialValues, customCol = true, title }, ref) => {
    const [form] = useForm();
    const { setIsEdit } = useContext(EditContext);

    const onOk = useCallback(() => {
        form.submit();
    }, []);
    const onCancel = useCallback(() => {
        setOpen(false);
    }, []);
    useEffect(() => {
        if (open) {
            form.resetFields();
        } else {
            setIsEdit(false);
        }
    }, [open]);
    useImperativeHandle(ref, () => ({
        form
    }));

    return (
        <>
            <Modal open={open} onOk={onOk} onCancel={onCancel} title={title} mask={false}>
                <Form form={form} onFinish={onFinish} initialValues={initialValues} {...(customCol ? CUSTOM_COL : {})}>
                    {children}
                </Form>
            </Modal>
        </>
    );
});

export default memo(ModalForm);
