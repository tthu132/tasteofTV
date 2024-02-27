import styles from './DangKy.module.scss'
import classNames from 'classnames/bind';
import Button from '~/components/Button';
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import DangNhap from '../DangNhap';

const cx = classNames.bind(styles)

function DangKy() {

    const [showPass, setShowPass] = useState(false)
    const navigate = useNavigate()


    const handleNavigate = () => {
        navigate('/login')


    }

    return (
        <div className={cx('wrapper')}>
            <form className={cx('inner')}>

                <h1>Xin chào</h1>
                <p>Đăng ký tài khoản của bạn</p>

                <div className={cx('input')}>
                    <div>
                        <input placeholder='Tên '></input>
                        <span></span>
                    </div>
                    <div>
                        <input placeholder='Email của bạn'></input>
                        <span></span>
                    </div>
                    <div >
                        <div className={cx('input-password')}>
                            <input placeholder='password' type={showPass ? 'text' : 'password'}></input>
                            <Button onClick={(e) => { e.preventDefault(); setShowPass(!showPass) }} btnEye>{showPass ? <EyeFilled></EyeFilled> : <EyeInvisibleFilled></EyeInvisibleFilled>}</Button>
                        </div>
                        <span></span>
                    </div>

                </div>

                <Button buttonLoginFrom>Đăng Ký</Button>

                <div className={cx('span')}>
                    <p>Quên mật khẩu</p>
                    <p>Đã có tài khoản?<span onClick={handleNavigate}>Đăng Nhập</span></p>

                </div>

            </form>
        </div>
    );
}

export default DangKy;