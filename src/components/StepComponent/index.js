import { Steps } from 'antd'

// import { CustomStep } from './styled';
const StepComponent = ({ current = 0, items = [] }) => {
    return (
        <Steps current={current}>
            {items.map((item) => {
                return (
                    <div key={item.title} title={item.title} description={item.description} />
                )
            })}
        </Steps>
    )
}

export default StepComponent