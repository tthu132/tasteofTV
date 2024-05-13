import { Modal } from 'antd'

const ModalComponent = ({ title, isOpen = false, children, ...rests }) => {
    return (
        <Modal title={title} open={isOpen} {...rests} >
            {children}
        </Modal>
    )
}
//style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}
export default ModalComponent