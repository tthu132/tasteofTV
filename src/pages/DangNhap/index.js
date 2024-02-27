import styles from './DangNhap.module.scss'
import classNames from 'classnames/bind';
import Button from '~/components/Button';
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles)

function DangNhap() {

    const [showPass, setShowPass] = useState(false)
    const [email, setEmail] = useState('4et5')
    const [pass, setPass] = useState('')


    const navigate = useNavigate()


    const handleNavigate = () => {
        navigate('/register')


    }

    console.log('email :', email);
    console.log('pass :', pass);

    const handleSubmit = () => {

        console.log('email :', email);
        console.log('pass :', pass);

    }


    return (
        <div className={cx('wrapper')}>
            <form className={cx('inner')}>

                <h1>Xin chào</h1>
                <p>Đăng nhập vào tài khoản của bạn</p>

                <div className={cx('input')}>
                    <div>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Email của bạnnnn'></input>
                        <span></span>
                    </div>
                    <div >
                        <div className={cx('input-password')}>
                            <input
                                placeholder='password'
                                type={showPass ? 'text' : 'password'}
                                value={pass}
                                onChange={(e) => setPass(e.target.value)}
                            ></input>
                            <Button
                                onClick={(e) => { e.preventDefault(); setShowPass(!showPass) }} btnEye>
                                {showPass ? <EyeFilled></EyeFilled> : <EyeInvisibleFilled></EyeInvisibleFilled>}
                            </Button>
                        </div>
                        <span></span>
                    </div>

                </div>

                <Button buttonLoginFrom onClick={handleSubmit}>Đăng nhập</Button>

                <div className={cx('span')}>
                    <p>Quên mật khẩu</p>
                    <p>Chưa có tài khoản?<span onClick={handleNavigate}>Tạo tài khoản</span></p>

                </div>

            </form>
        </div>
    );
}

export default DangNhap;