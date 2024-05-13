import styles from './ThongTinTaiKhoan.module.scss'
import classNames from 'classnames/bind';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '~/components/Button';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import * as UserSevice from '~/services/UserService'
import { useMutationHook } from '~/hooks/useMutationHook';
import * as message from '~/components/Message'
import { updateUser } from '~/redux/slice/userSlide';
import { UseDispatch, useDispatch } from 'react-redux';
import { Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Images from '~/components/Images';
import { getBase64 } from '../../../utils'

const cx = classNames.bind(styles)

function ThongTinTaiKhoan() {
    const currentUser = useSelector((state) => state.user)
    const dispatch = useDispatch()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [avatar, setAvatar] = useState('')


    const mutation = useMutationHook(
        (data) => {
            const { id, access_token, ...rests } = data
            UserSevice.updateUser(id, data, access_token)
        }
    )
    const { data, isPending, isSuccess, isError } = mutation


    useEffect(() => {
        if (isSuccess) {
            message.success()
            handleGetDetailsUser(currentUser?.id, currentUser?.access_token)
            // handleGetDetailsUser(user?.id, user?.access_token)
        } else if (isError) {
            message.error()
        }
    }, [isSuccess, isError])

    useEffect(() => {
        setEmail(currentUser.email)
        setName(currentUser.name)
        setPhone(currentUser.phone)
        setAvatar(currentUser.avatar)

    }, [currentUser])

    const handleUpdate = () => {
        mutation.mutate({ id: currentUser.id, email, name, phone, avatar, access_token: currentUser.access_token })
    }
    const handleGetDetailsUser = async (id, token) => {
        const res = await UserSevice.getDetailsUser(id, token)
        dispatch(updateUser({ ...res?.data, access_token: token }))
    }
    const handleUploadAvatar = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setAvatar(file.preview)
    }

    return (
        <div className={cx('wraper')}>
            <h2>Thông tin tài khoản</h2>

            <div className={cx('inner')}>
                <div className={cx('item-input')}>
                    <label htmlFor='name'>Tên người dùng</label>
                    <div>
                        <div className={cx('input-group')}>
                            <input
                                id='name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}>
                            </input>
                            {name &&
                                <FontAwesomeIcon
                                    className={cx('icon')}
                                    icon={faXmark}
                                    onClick={() => setName('')}
                                />}
                        </div>
                        <Button upDate onClick={handleUpdate}>Cập nhật</Button>

                    </div>
                </div>
                <div className={cx('item-input')}>
                    <label htmlFor='email'>Email</label>
                    <div>
                        <div className={cx('input-group')}>
                            <input
                                id='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}>
                            </input>
                            {
                                email &&
                                <FontAwesomeIcon
                                    className={cx('icon')}
                                    icon={faXmark}
                                    onClick={() => setEmail('')}
                                />
                            }
                        </div>
                        <Button onClick={handleUpdate} upDate>Cập nhật</Button>

                    </div>
                </div>
                <div className={cx('item-input')}>
                    <label htmlFor='phone'>Số điện thoại</label>
                    <div>
                        <div className={cx('input-group')}>
                            <input
                                id='phone'
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}

                            ></input>
                            {
                                phone &&
                                <FontAwesomeIcon
                                    className={cx('icon')}
                                    icon={faXmark}
                                    onClick={() => setPhone('')}
                                />
                            }
                        </div>
                        <Button onClick={handleUpdate} upDate>Cập nhật</Button>

                    </div>
                </div>
                <div className={cx('item-avatar')}>
                    <label htmlFor='avatar'>Avatar</label>
                    <div>
                        <div className={cx('input-group')}>
                            <Upload
                                onChange={handleUploadAvatar}
                                showUploadList={false}
                                maxCount={1}>
                                <Button icon={<UploadOutlined />}>Chọn Ảnh</Button>
                            </Upload>
                            {
                                avatar && (
                                    <Images Avatar src={currentUser.avatar || avatar}></Images>
                                )
                            }

                        </div>
                        <Button onClick={handleUpdate} upDate>Cập nhật</Button>

                    </div>
                </div>
            </div>

        </div>
    );
}

export default ThongTinTaiKhoan;