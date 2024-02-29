import { Spin } from 'antd'

const Loading = ({ children, isLoading, deday = 200 }) => {
    return (
        <Spin spinning={isLoading} delay={deday}>
            {children}
        </Spin>
    )
}

export default Loading