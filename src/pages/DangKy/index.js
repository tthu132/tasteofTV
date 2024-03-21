import styles from './DangKy.module.scss'
import classNames from 'classnames/bind';
import Button from '~/components/Button';

import { EyeFilled, EyeInvisibleFilled, CloseOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutationHook } from '~/hooks/useMutationHook';
import * as UserSevice from '~/services/UserService'
import * as message from '~/components/Message'



const cx = classNames.bind(styles)

function FormRegister() {

    const navigate = useNavigate()

    const [showPass, setShowPass] = useState(false)
    const [showPassConf, setShowPassConf] = useState(false)

    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [pass, setPass] = useState('')
    const [passConf, setPassConf] = useState('')

    const mutation = useMutationHook(data => UserSevice.signupUser(data))
    console.log('muatation ', mutation);


    const { data, isPending, isSuccess, isError } = mutation

    useEffect(() => {
        if (isSuccess) {
            message.success()
            navigate('/login')
        } else if (isError) {
            message.error()
        }

    }, [isSuccess, isError])

    const handleSubmit = () => {

        mutation.mutate({
            name,
            phone,
            email,
            password: pass,
            confirmPassword: passConf

        })

    }


    return (
        <div className={cx('wrapper')}>

            <div >


                <div className={cx('test')}>
                    <div className={cx('test-con')}>
                        <h1 >Welcom to website!</h1>
                    </div>
                    <div className={cx('inner')}>
                        <CloseOutlined className={cx('close')} onClick={() => navigate('/')} />
                        <h1>Xin chào</h1>
                        <p>Đăng Ký tài khoản của bạn</p>

                        <div className={cx('input')}>
                            <div>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder='Tên người dùng'></input>
                                <span></span>
                            </div>
                            <div>
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder='Email của bạn'></input>
                                <span></span>
                            </div>
                            <div>
                                <input
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder='Số điện thoại'></input>
                                <span></span>
                            </div>
                            <div >
                                <div className={cx('input-password')}>
                                    <input
                                        value={pass}
                                        onChange={(e) => setPass(e.target.value)}
                                        placeholder='password'
                                        type={showPass ? 'text' : 'password'}>

                                    </input>
                                    <Button
                                        onClick={(e) => { e.preventDefault(); setShowPass(!showPass) }} btnEye>
                                        {showPass ? <EyeFilled></EyeFilled> : <EyeInvisibleFilled></EyeInvisibleFilled>}
                                    </Button>
                                </div>
                                <span></span>
                            </div>
                            <div>
                                <div className={cx('input-password')}>
                                    <input
                                        value={passConf}
                                        onChange={(e) => setPassConf(e.target.value)}
                                        placeholder='Nhập lại password'
                                        type={showPassConf ? 'text' : 'password'}></input>
                                    <Button
                                        onClick={(e) => { e.preventDefault(); setShowPassConf(!showPassConf) }} btnEye>
                                        {showPassConf ? <EyeFilled></EyeFilled> : <EyeInvisibleFilled></EyeInvisibleFilled>}
                                    </Button>
                                </div>
                                <span></span>
                            </div>

                        </div>

                        <Button
                            buttonLoginFrom onClick={handleSubmit}
                            disabled={name.length == 0 || pass.length == 0 || phone.length == 0 || passConf.length == 0 || email.length == 0}>Đăng Ký
                        </Button>

                        <div className={cx('span')}>
                            <p>Quên mật khẩu</p>
                            <p>Bạn đã có tài khoản?<span onClick={() => navigate('/login')}>Đăng nhập</span></p>

                        </div>
                    </div>
                </div>

            </div >
        </div>
    );
}

export default FormRegister;