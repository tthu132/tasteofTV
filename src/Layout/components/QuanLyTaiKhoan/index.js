import { PlusOutlined } from "@ant-design/icons";
import { Modal } from "antd"
import Button from "~/components/Button";
import styles from './QuanLyTaiKhoan.module.scss'
import classNames from "classnames/bind";
import Table from "~/components/TableComponent";
import { useState } from "react";

const cx = classNames.bind(styles)
function QuanLyTaiKhoan() {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div className={cx('wrapper')}>

            <h3>Quản lý người dùng</h3>
            <Button onClick={() => setIsModalOpen(true)} Plus className={cx('wrapper-icon')}><PlusOutlined className={cx('icon-plus')} /></Button>

            <Table rowClassName={cx('row')} />

            <Modal title="Tạo tài khoản" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>
        </div>
    );
}

export default QuanLyTaiKhoan;