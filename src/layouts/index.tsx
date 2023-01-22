import { ConfigProvider } from 'antd';
import { useEffect } from 'react';
import { Outlet } from 'umi';
import zhCN from 'antd/locale/zh_CN';

const Layout = () => {
    useEffect(() => {
        console.log(' ===> layouts');
    }, []);
    return (
        <div>
            <ConfigProvider locale={zhCN}>
                <Outlet />
            </ConfigProvider>
        </div>
    );
};

export default Layout;
