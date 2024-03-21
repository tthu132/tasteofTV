import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Buttonn from "~/components/Button";
import styles from './QuanLySanPham.module.scss'
import classNames from "classnames/bind";
import Table from "~/components/TableComponent";
import { Checkbox, Form, Input, Modal, Upload, Button } from "antd";
import { useEffect, useState } from "react";
import { getBase64 } from "~/utils";
import Images from "~/components/Images";
import { useMutationHook } from '~/hooks/useMutationHook';
import * as ProductService from '~/services/ProductService'
import * as message from '~/components/Message'
import Loadingg from "~/components/Loading";
import { useQuery } from '@tanstack/react-query'
import DrawerComponent from "~/components/DrawerComponent";
import { useSelector } from "react-redux";


const cx = classNames.bind(styles)
function QuanLySanPham() {

    const [isTest, setTest] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [stateProduct, setStateProduct] = useState({
        name: '',
        image: '',
        type: '',
        price: '',
        countInStock: '',
        description: ''

    })
    const [stateProductDetail, setStateProductdetail] = useState({
        name: '',
        image: '',
        type: '',
        price: '',
        countInStock: '',
        description: ''

    })
    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [form] = Form.useForm();
    const [form1] = Form.useForm();
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)

    const user = useSelector((state) => state.user)

    const renderAction = () => {
        return (
            <div>
                <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
                <EditOutlined style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }} onClick={handleDetailsProduct} />
            </div>
        )
    }


    const mutation = useMutationHook(
        (data) => {
            ProductService.createProduct(data)
        }
    )
    const mutationUpdate = useMutationHook(
        (data) => {
            const { id,
                token,
                ...rests } = data
            console.log('mution updateeee ', data);
            const res = ProductService.updateProduct(
                id,
                token,
                { ...rests })

            console.log('mutionnn ressss', res);
            return res
        },
    )

    const fetchProductAll = async () => {

        const res = await ProductService.getAllProduct()

        return res
    }

    const fetchDetailProduct = async () => {
        const res = await ProductService.getDetailsProduct(rowSelected)
        console.log('res detail  ', res.data);
        if (res.data) {
            setStateProductdetail({
                name: res.data.name,
                image: res.data.image,
                type: res.data.type,
                price: res.data.price,
                countInStock: res.data.countInStock,
                description: res.data.description

            })

        }
        console.log('state product detail  ', stateProductDetail);
        setIsLoadingUpdate(false)
        return res
    }

    useEffect(() => {
        const setValues = () => {
            if (form1 && stateProductDetail) {
                Object.entries(stateProductDetail).forEach(([key, value]) => {
                    form1.setFieldValue(key, value);
                });
            }
        };

        setValues();
        setIsLoadingUpdate(false)

    }, [form1, stateProductDetail, isOpenDrawer])

    useEffect(() => {
        if (rowSelected) {
            fetchDetailProduct(rowSelected)
        }
    }, [rowSelected, isOpenDrawer])

    const { data, isSuccess, isError, isLoading } = mutation
    const { data: dataUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated, isLoading: isLoadingUpdated } = mutationUpdate
    console.log('data updated ', dataUpdated);

    const queryProduct = useQuery({ queryKey: ['products'], queryFn: fetchProductAll, retry: 3, retryDelay: 1000 })

    const { isLoading: isLoadingProduct, data: product } = queryProduct

    useEffect(() => {
        if (product?.data) {
            // const dataTable = product.data.map((item) => {
            //     console.log('id nefeeeeeeeeeeee ', item._id);
            //     return { ...item, key: item._id }
            // })
            // console.log('data bang ', dataTable);

            setTest(true);
        }
    }, [product?.data]);


    if (isLoadingProduct) {
        console.log('Đang tải dữ liệu...');

    } else {
        console.log('productttttt', product);
        console.log('productttttt dataa', product.data);

        // console.log('productttttt test', test);


    }

    const columns = [
        {
            title: 'Tên',
            dataIndex: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Giá',
            dataIndex: 'price',
        },
        {
            title: 'Loại',
            dataIndex: 'type',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction,
        },
    ];


    useEffect(() => {
        if (isSuccess) {
            message.success()
            handleCancel()
            setIsModalOpen(false);
        } else if (isError) {
            message.error()

        }

    }, [isSuccess])
    useEffect(() => {
        if (isSuccessUpdated) {
            message.success()
            handleCloseDrawer()

        } else if (isError) {
            message.error()

        }

    }, [isSuccessUpdated])
    const handleCloseDrawer = () => {

        setIsOpenDrawer(false)
        setStateProductdetail({
            name: '',
            image: '',
            type: '',
            price: '',
            countInStock: '',
            description: ''

        })
        form.resetFields()

    };


    const handleOk = () => {
        setIsModalOpen(false);
    };


    const handleCancel = () => {

        setIsModalOpen(false);
        setStateProduct({
            name: '',
            image: '',
            type: '',
            price: '',
            countInStock: '',
            description: ''

        })
        form.resetFields()

    };

    const onFinish = () => {
        mutation.mutate(stateProduct)

    }
    const onFinishUpdate = () => {
        console.log('state product detail  onfinish', stateProductDetail);

        mutationUpdate.mutate({ id: rowSelected, token: user.access_token, ...stateProductDetail })

    }
    const handleOnChange = (e) => {
        setStateProduct({
            ...stateProduct,
            [e.target.name]: e.target.value
        })

    }
    const handleOnChangeDetail = (e) => {
        console.log('checkkk ', e.target.name, e.target.value);
        setStateProductdetail({
            ...stateProductDetail,
            [e.target.name]: e.target.value
        })



    }
    const handleUploadAvatar = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProduct({
            ...stateProduct,
            image: file.preview
        })
    }
    const handleUploadAvatarDetail = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProductdetail({
            ...stateProductDetail,
            image: file.preview
        })
    }


    const setIsModalOpenDelete = () => {

    }
    const handleDetailsProduct = () => {
        setIsLoadingUpdate(true)
        if (rowSelected) {
            fetchDetailProduct()
        }
        setIsOpenDrawer(true)


        console.log('row selected ', rowSelected);

    }
    return (
        <div className={cx('wrapper')}>

            <h3>Quản lý sản phẩm</h3>
            <Buttonn onClick={() => setIsModalOpen(true)} Plus className={cx('wrapper-icon')}><PlusOutlined className={cx('icon-plus')} /></Buttonn>

            {isTest &&
                <Table
                    rowClassName={cx('row')}
                    isLoading={isLoadingProduct}
                    columns={columns}
                    dataa={product.data.map((item) => {
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

            < Modal title="Tạo tài khoản" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} >
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
                        label="Tên sản phẩm"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập tên sản phẩm!',
                            },
                        ]}
                    >
                        <Input value={stateProduct.name} onChange={handleOnChange} name="name" />
                    </Form.Item>

                    <Form.Item
                        label="Loại sản phẩm"
                        name="type"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn loại sản phẩm!',
                            },
                        ]}
                    >
                        <Input value={stateProduct.type} onChange={handleOnChange} name="type" />
                    </Form.Item>


                    <Form.Item
                        label="Giá sản phẩm"
                        name="price"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập giá sản phẩm!',
                            },
                        ]}
                    >
                        <Input value={stateProduct.price} onChange={handleOnChange} name="price" />

                    </Form.Item>
                    <Form.Item
                        label="Số lượng sản phẩm"
                        name="countInStock"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập số lượng sản phẩm!',
                            },
                        ]}
                    >
                        <Input value={stateProduct.countInStock} onChange={handleOnChange} name="countInStock" />

                    </Form.Item>
                    <Form.Item
                        label="Mô tả sản phẩm"
                        name="description"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập mô tả sản phẩm!',
                            },
                        ]}
                    >
                        <Input value={stateProduct.description} onChange={handleOnChange} name="description" />

                    </Form.Item>

                    <Form.Item
                        label="Hình ảnh sản phẩm"
                        name="image"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn ảnh cho sản phẩm!',
                            },
                        ]}
                    >
                        <Upload
                            onChange={handleUploadAvatar}
                            showUploadList={true}
                            maxCount={1}>
                            <Button >Chọn Ảnh</Button>
                            {
                                stateProduct.image && (
                                    <Images ProductAdmin src={stateProduct.image}></Images>
                                )
                            }
                        </Upload>


                    </Form.Item>


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

            </Modal>
            <DrawerComponent
                title="Chi tiết sản phẩm"
                isOpen={isOpenDrawer}
                onClose={() => setIsOpenDrawer(false)}
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
                            label="Tên sản phẩm"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên sản phẩm!',
                                },
                            ]}
                        >
                            <Input value={stateProductDetail.name} onChange={handleOnChangeDetail} name="name" />
                        </Form.Item>

                        <Form.Item
                            label="Loại sản phẩm"
                            name="type"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn loại sản phẩm!',
                                },
                            ]}
                        >
                            <Input value={stateProductDetail.type} onChange={handleOnChangeDetail} name="type" />
                        </Form.Item>


                        <Form.Item
                            label="Giá sản phẩm"
                            name="price"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập giá sản phẩm!',
                                },
                            ]}
                        >
                            <Input value={stateProductDetail.price} onChange={handleOnChangeDetail} name="price" />

                        </Form.Item>
                        <Form.Item
                            label="Số lượng sản phẩm"
                            name="countInStock"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số lượng sản phẩm!',
                                },
                            ]}
                        >
                            <Input value={stateProductDetail.countInStock} onChange={handleOnChangeDetail} name="countInStock" />

                        </Form.Item>
                        <Form.Item
                            label="Mô tả sản phẩm"
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mô tả sản phẩm!',
                                },
                            ]}
                        >
                            <Input value={stateProductDetail.description} onChange={handleOnChangeDetail} name="description" />

                        </Form.Item>

                        <Form.Item
                            label="Hình ảnh sản phẩm"
                            name="image"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ảnh cho sản phẩm!',
                                },
                            ]}
                        >
                            <Upload
                                onChange={handleUploadAvatarDetail}
                                showUploadList={true}
                                maxCount={1}>
                                <Button >Chọn Ảnh</Button>
                                {
                                    stateProductDetail.image && (
                                        <Images ProductAdmin src={stateProductDetail.image}></Images>
                                    )
                                }
                            </Upload>


                        </Form.Item>


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

        </div >
    );
}

export default QuanLySanPham;