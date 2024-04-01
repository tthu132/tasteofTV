import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import Buttonn from "~/components/Button";
import styles from './QuanLyTaiKhoan.module.scss'
import classNames from "classnames/bind";
import Table from "~/components/TableComponent";
import { Checkbox, Form, Input, Modal, Upload, Button, Select, Space } from "antd";
import { useEffect, useRef, useState } from "react";
import { getBase64 } from "~/utils";
import Images from "~/components/Images";
import { useMutationHook } from '~/hooks/useMutationHook';
import * as UserService from '~/services/UserService'

import * as ImageService from '~/services/ImageService'

import * as message from '~/components/Message'
import Loadingg from "~/components/Loading";
import { useQuery } from '@tanstack/react-query'
import DrawerComponent from "~/components/DrawerComponent";
import { useSelector } from "react-redux";
import ModalComponent from "~/components/ModalComponent";
import { Spin } from 'antd'

const cx = classNames.bind(styles)
function QuanLyTaiKhoan() {



    const [isTest, setTest] = useState(false)


    const [isModalOpen, setIsModalOpen] = useState(false)
    const [stateUser, setStateUser] = useState({
        name: '',
        email: '',
        phone: '',
        isAdmin: false,


    })
    const [stateUserDetail, setStateUserdetail] = useState({
        name: '',
        email: '',
        phone: '',
        isAdmin: false,
    })
    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [form] = Form.useForm();
    const [form1] = Form.useForm();
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
    const [isModalDelete, setIsModalDelete] = useState(false)

    const [editIndex, setEditIndex] = useState(null);
    const [editedName, setEditedName] = useState('');
    const { Option } = Select;

    const user = useSelector((state) => state.user)

    const renderAction = () => {
        return (
            <div>
                <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} onClick={() => setIsModalDelete(true)} />
                <EditOutlined style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }} onClick={handleDetailsProduct} />
            </div>
        )
    }


    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    {/* <Button
                            type="link"
                            size="small"
                            onClick={() => {
                                confirm({
                                    closeDropdown: false,
                                });
                                setSearchText(selectedKeys[0]);
                                setSearchedColumn(dataIndex);
                            }}
                        >
                            Filter
                        </Button> */}
                    {/* <Button
                            type="link"
                            size="small"
                            onClick={() => {
                                close();
                            }}
                        >
                            close
                        </Button> */}
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        // render: (text) =>
        //     searchedColumn === dataIndex ? (
        //         <Highlighter
        //             highlightStyle={{
        //                 backgroundColor: '#ffc069',
        //                 padding: 0,
        //             }}
        //             searchWords={[searchText]}
        //             autoEscape
        //             textToHighlight={text ? text.toString() : ''}
        //         />
        //     ) : (
        //         text
        //     ),
    });
    const mutation = useMutationHook(
        (data) => {
            UserService.signupUser(data)
        }
    )

    const mutationUpdate = useMutationHook(
        (data) => {
            const { id,
                token,
                ...rests } = data
            const res = UserService.updateUser(
                id,

                { ...rests }, token,)

            return res
        },
    )
    const mutationDelete = useMutationHook(
        (data) => {
            const { id,
                token,
            } = data

            const res = UserService.deleteUser(
                id,
                token,
            )

            return res
        },
    )


    const mutationDeleteImage = useMutationHook(
        (data) => {
            const { id,
                token,
            } = data

            const res = ImageService.deleteImage(
                id,
                token,
            )
            return res
        },
    )

    const fetchAllUser = async () => {

        const res = await UserService.getAllUser()
        console.log('userrr ', res);

        return res
    }

    const [imageQQ, setImageQQ] = useState()

    const fetchDetailUser = async () => {
        const res = await UserService.getDetailsUser(rowSelected);
        if (res.data) {
            setStateUserdetail({
                name: res.data.name,
                email: res.data.email,
                phone: res.data.phone,
                isAdmin: res.data.isAdmin,

            });

            if (res.data.idsImage) { // Kiểm tra xem idsImage có tồn tại không trước khi thực hiện map
                const imageRequests = res.data.idsImage.map(id => ImageService.getDetailsImage(id));
                const imageResponses = await Promise.all(imageRequests);

                // Lấy danh sách các ảnh từ các response
                const images = imageResponses.map(response => response.data);

                if (images) {
                    setImageQQ(images.map(image => ({
                        uid: image._id,
                        url: image.image,
                        name: ''
                    })));
                }
            }
        }

        setIsLoadingUpdate(false);
        return res;
    };


    useEffect(() => {
        console.log('state after update: ', stateUserDetail);
        const setValues = () => {
            if (form1 && stateUserDetail) {
                Object.entries(stateUserDetail).forEach(([key, value]) => {
                    form1.setFieldValue(key, value);
                    console.log('key-value', key, value);
                });
            }
        };

        setValues();
        setIsLoadingUpdate(false)

    }, [form1, stateUserDetail, isOpenDrawer])

    const { data, isSuccess, isError, isPending } = mutation
    const { data: dataUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated, isPending: isLoadingUpdated } = mutationUpdate
    const { data: dataDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted, isPending: isLoadingDeleted } = mutationDelete

    const { data: dataDeletedImage, isSuccess: isSuccessDeletedImage, isError: isErrorDeletedImage, isPending: isLoadingDeletedImage } = mutationDeleteImage


    const queryUser = useQuery({ queryKey: ['user'], queryFn: fetchAllUser, retry: 3, retryDelay: 1000 })

    const { isPending: isLoadingUser, data: users } = queryUser



    useEffect(() => {
        if (users?.data) {

            setTest(true);
        }
    }, [users?.data]);



    const columns = [
        {
            title: 'Tên',
            dataIndex: 'name',
            render: (text) => <a>{text}</a>,
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('name')
        },
        {
            title: 'Email',
            dataIndex: 'email',
            // sorter: (a, b) => a.price - b.price
        },
        {
            title: 'Admin',
            dataIndex: 'admin',
            filters: [
                {
                    text: 'True',
                    value: true,
                },
                {
                    text: 'False',
                    value: false,
                }
            ],
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            ...getColumnSearchProps('phone')

        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction,
        },
    ];

    useEffect(() => {
        if (isSuccessUpdated) {
            message.success()
            handleCloseDrawer()

        } else if (isError) {
            message.error()
        }

    }, [isSuccessUpdated])

    useEffect(() => {
        if (isSuccessDeleted) {
            message.success()
            handleCancelDelete()

        } else if (isErrorDeleted) {
            message.error()
        }

    }, [isSuccessDeleted])

    const handleCloseDrawer = () => {

        setIsOpenDrawer(false)
        setStateUserdetail({
            name: '',
            email: '',
            phone: '',
            isAdmin: false,

        })

        form.resetFields()
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {

        setIsModalOpen(false);
        setStateUser({
            name: '',
            email: '',
            phone: '',
            isAdmin: false,
        })

        form.resetFields()

    };


    const mutationImage = useMutationHook(
        (data) => {
            return ImageService.createImage(data); // Chú ý việc trả về promise từ hàm createImage
        },

    );

    const { mutate: addTodo, data: dataImage, isSuccess: isSuccessImage, isError: isErrorImage, isPending: isPendingImage } = mutationImage
    const onFinish = async () => {


        mutation.mutate({ ...stateUser }, {
            onSettled: () => {
                queryUser.refetch();
            },
        });

    }

    useEffect(() => {
        if (isSuccess) {

            message.success()
            handleCancel()
            setIsModalOpen(false);

        } else if (isError) {
            message.error()
        }
    }, [isSuccess])


    const onFinishUpdate = () => {

        console.log('user update ', stateUserDetail);

        mutationUpdate.mutate({ id: rowSelected, token: user.access_token, ...stateUserDetail }, {
            onSettled: () => {
                queryUser.refetch()
            }
        });

    };

    const handleOnChange = (e) => {
        setStateUser({
            ...stateUser,
            [e.target.name]: e.target.value
        }, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }
    const handleOnChangeDetail = (e) => {
        setStateUserdetail({
            ...stateUserDetail,
            [e.target.name]: e.target.value
        })
    }

    const handleUploadAvatar = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateUser({
            ...stateUser,
            image: file.preview
        })
    }
    const handleUploadAvatarDetail = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateUserdetail({
            ...stateUserDetail,
            image: file.preview
        })
    }

    const [image, setImage] = useState()
    const handleUploadListImage = async ({ fileList }) => {
        const file = fileList.slice(0, 5);
        const base64Promises = file.map(async (file) => {
            if (!file.url && !file.preview) {
                const blob = file.originFileObj;
                return getBase64(blob);
            }
            return file.preview;
        });

        // Chờ tất cả các promise được giải quyết
        const previews = await Promise.all(base64Promises);
        setImage(previews)


    }
    const [imageUpdate, setImageUpdate] = useState()
    const handleUploadListImageUpdate = async ({ fileList }) => {
        const file = fileList.slice(0, 5);
        const base64Promises = file.map(async (file) => {
            if (!file.url && !file.preview) {
                const blob = file.originFileObj;
                return getBase64(blob);
            }
            return file.preview;
        });

        // Chờ tất cả các promise được giải quyết
        const previews = await Promise.all(base64Promises);
        setImageUpdate(previews)
        console.log("image update 1", previews);
        console.log("image update 2", imageUpdate);



    }
    const handleCancelDelete = () => {
        setIsModalDelete(false)

    }
    const handleDeleteProduct = () => {
        console.log('bodyyy ', { id: rowSelected, token: user.access_token });
        mutationDelete.mutate({ id: rowSelected, token: user.access_token }, {
            onSettled: () => {
                queryUser.refetch()
            }
        })

    }
    const handleDetailsProduct = () => {
        // setIsLoadingUpdate(true)
        if (rowSelected) {
            fetchDetailUser()
            setIsLoadingUpdate(true)
        }
        setIsOpenDrawer(true)
    }
    //---------------------




    //----------

    useEffect(() => {
        if (rowSelected) {
            fetchDetailUser(rowSelected)

        }
    }, [rowSelected, isOpenDrawer])


    const onRemoveFile = (e) => {

        mutationDeleteImage.mutate({ id: e.uid, token: user.access_token }, {
            onSettled: () => {
                // Xóa ảnh thành công, cập nhật lại imageQQ
                const updatedImageQQ = imageQQ.filter(image => image.uid !== e.uid);
                setImageQQ(updatedImageQQ);


                queryUser.refetch();
            }
        });

    }


    const onCloseDetail = () => {
        console.log('cloooo');
        setIsOpenDrawer(false)
        setStateUserdetail({
            name: '',
            phone: '',
            email: '',
            isAdmin: false,


        })
        form1.resetFields()

    }

    return (
        <div className={cx('wrapper')}>


            <h4 className={cx('title')}>Quản lý sản phẩm</h4>

            <h4>Tạo sản phẩm mới</h4>
            <Buttonn onClick={() => setIsModalOpen(true)} Plus className={cx('wrapper-icon')}><PlusOutlined className={cx('icon-plus')} /></Buttonn>
            <h4>Toàn bộ sản phẩm</h4>

            {isTest &&
                <Table
                    rowClassName={cx('row')}
                    isLoading={isLoadingUser}
                    columns={columns}
                    dataa={users.data.map((item) => {
                        return { ...item, key: item._id }
                    })
                    }
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: (event) => {
                                setRowSelected(record._id)
                            }, // click row

                        };
                    }}
                />
            }


            < ModalComponent forceRender title="Thêm tài khoản phẩm mới"
                open={isModalOpen}
                onOk={handleOk}
                footer={null}
                onCancel={handleCancel} >
                {/* <Loadingg isLoadingg={isLoading}> */}

                {/* </Loadingg> */}

                < Form
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    style={{
                        maxWidth: 600,
                    }}

                    autoComplete="on"
                    onFinish={onFinish}
                    form={form}


                >
                    <Form.Item
                        label="Tên người dùng"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập tên người dùng!',
                            },
                        ]}
                    >
                        <Input value={stateUser.name} onChange={handleOnChange} name="name" />
                    </Form.Item>



                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập email!',
                            },
                        ]}
                    >
                        <Input value={stateUser.email} onChange={handleOnChange} name="email" />

                    </Form.Item>
                    <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập số điện thoại!',
                            },
                        ]}
                    >
                        <Input value={stateUser.phone} onChange={handleOnChange} name="phone" />

                    </Form.Item>


                    {/* <Form.Item
                        label="Hình các ảnh sản phẩm"
                        name="image"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn ảnh cho sản phẩm!',
                            },
                        ]}
                    >
                        <Upload
                            listType="picture"
                            onChange={handleUploadListImage}
                            showUploadList={true}
                            maxCount={5}>
                            <Button >Chọn Ảnh</Button>
                            <p>{stateUser.idsImage}</p>

                        </Upload>


                    </Form.Item> */}



                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>

            </ModalComponent >
            <DrawerComponent
                forceRender
                title="Chi tiết người dùng"
                isOpen={isOpenDrawer}
                onClose={onCloseDetail}
                width="80%"
            >
                <Loadingg isLoading={isLoadingUpdate}>
                    < Form
                        name="basic"
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                        style={{
                            maxWidth: 600,
                        }}

                        autoComplete="on"
                        onFinish={onFinishUpdate}
                        form={form1}

                    >
                        <Form.Item
                            label="Tên người dùng"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên người dùng!',
                                },
                            ]}
                        >
                            <Input value={stateUserDetail.name} onChange={handleOnChangeDetail} name="name" />
                        </Form.Item>


                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập email!',
                                },
                            ]}
                        >
                            <Input value={stateUserDetail.email} onChange={handleOnChangeDetail} name="email" />

                        </Form.Item>
                        <Form.Item
                            label="Số điện thoại"
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số điện thoại!',
                                },
                            ]}
                        >
                            <Input value={stateUserDetail.phone} onChange={handleOnChangeDetail} name="phone" />

                        </Form.Item>


                        {/* <Form.Item
                            label="Các hình ảnh sản phẩm"
                            name="image2"

                        >
                            <Upload
                                listType="picture"
                                onChange={handleUploadListImage}
                                showUploadList={true}
                                maxCount={5}
                                fileList={imageQQ}
                                onRemove={e => onRemoveFile(e)}
                            >

                            </Upload>
                        </Form.Item>

                        <Form.Item

                            name="idsImage"
                            label="Thêm ảnh"


                        >
                            <Upload
                                listType="picture"
                                onChange={handleUploadListImageUpdate}
                                showUploadList={true}
                                maxCount={5}>
                                <Button >Chọn Ảnh</Button>

                            </Upload>

                        </Form.Item> */}

                        <Form.Item
                            wrapperCol={{
                                offset: 8,
                                span: 16,
                            }}
                        >
                            <Button type="primary" htmlType="submit">
                                Cập nhật
                            </Button>
                        </Form.Item>
                    </Form>
                </Loadingg>
            </DrawerComponent >

            < ModalComponent title="Xóa tài khoản"
                open={isModalDelete}
                onOk={handleDeleteProduct}
                onCancel={handleCancelDelete}
            >
                <p>Bạn muốn xóa tài khoản này?</p>

            </ModalComponent>
        </div>
    );
}

export default QuanLyTaiKhoan;