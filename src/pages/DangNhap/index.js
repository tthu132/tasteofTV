import styles from './DangNhap.module.scss'
import classNames from 'classnames/bind';
import Button from '~/components/Button';

import { EyeFilled, EyeInvisibleFilled, CloseOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useMutationHook } from '~/hooks/useMutationHook';

import * as UserSevice from '~/services/UserService'

import { jwtDecode } from "jwt-decode";
import { UseDispatch, useDispatch } from 'react-redux';
import { updateUser } from '~/redux/slice/userSlide';


const cx = classNames.bind(styles)

function FormLogin() {

    const [showPass, setShowPass] = useState(false)
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')

    const navigate = useNavigate()

    const dispatch = useDispatch()
    const location = useLocation()


    const mutation = useMutationHook(data => UserSevice.loginUser(data))

    const { data, isPending, isSuccess, isError } = mutation


    useEffect(() => {
        if (isSuccess) {


            // handleCloseForm()
            console.log('data login ', data);
            localStorage.setItem('access_token', JSON.stringify(data?.access_token))

            if (data?.access_token) {
                const decode = jwtDecode(data?.access_token)
                console.log('decode ', decode);
                if (decode?.id)
                    handleGetDetailUser(decode?.id, data?.access_token)
            }
            if (location?.state) {
                navigate(location?.state)
            } else navigate('/')


        }

    }, [isSuccess])

    const handleGetDetailUser = async (id, token) => {

        const res = await UserSevice.getDetailsUser(id, token)
        dispatch(updateUser({ ...res?.data, access_token: token }))
        console.log('check: ', { ...res?.data, access_token: token });
    }

    const handleSubmit = () => {
        mutation.mutate({
            email,
            password: pass
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
                        <p>Đăng nhập vào tài khoản của bạn</p>

                        <div className={cx('input')}>
                            <div>
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder='Email của bạn'></input>
                                <span></span>
                            </div>
                            <div >
                                <div className={cx('input-password')}>
                                    <input
                                        value={pass}
                                        onChange={(e) => setPass(e.target.value)}
                                        placeholder='password'
                                        type={showPass ? 'text' : 'password'}></input>
                                    <Button
                                        onClick={(e) => { e.preventDefault(); setShowPass(!showPass) }}
                                        btnEye>
                                        {showPass ? <EyeFilled></EyeFilled> : <EyeInvisibleFilled></EyeInvisibleFilled>}
                                    </Button>
                                </div>
                                <span></span>
                            </div>

                        </div>
                        <Button
                            disabled={email.length == 0 || pass.length == 0}
                            buttonLoginFrom onClick={handleSubmit}>Đăng nhập
                        </Button>

                        <div className={cx('span')}>
                            <p>Quên mật khẩu</p>
                            <p>Chưa có tài khoản?<span onClick={() => navigate('/register')}>Tạo tài khoản</span></p>

                        </div>

                    </div>

                </div>
            </div>
        </div >
    );
}

export default FormLogin;