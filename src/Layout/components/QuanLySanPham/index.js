import { PlusOutlined } from "@ant-design/icons";
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


const cx = classNames.bind(styles)
function QuanLySanPham() {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [stateProduct, setStateProduct] = useState({
        name: '',
        image: '',
        type: '',
        price: '',
        countInStock: '',
        description: ''

    })
    console.log('name tu admin ', stateProduct.name);
    const [form] = Form.useForm();

    const mutation = useMutationHook(
        (data) => {
            // const { name, image, type, price, countInStock, description } = data
            // console.log('data từ mutauon ', data);
            ProductService.createProduct(data)
        }
    )
    const fetchProductAll = async () => {
        const res = await ProductService.getAllProduct()
        console.log('res-----product ', res);
        return res
    }

    const { isLoading: isLoadingProduct, data: product } = useQuery({ queryKey: ['product'], queryFn: fetchProductAll, retry: 3, retryDelay: 1000 })
    console.log('data tu query ', product);
    const { data, isSuccess, isError, isLoading } = mutation


    useEffect(() => {
        if (isSuccess) {
            console.log('successssss');
            message.success()
            handleCancel()
            setIsModalOpen(false);
        } else if (isError) {
            console.log('errorrrrrr');
            message.error()

        }

    }, [isSuccess])

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
        console.log('finissh ', stateProduct);
    }
    const handleOnChange = (e) => {
        setStateProduct({
            ...stateProduct,
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

    return (
        <div className={cx('wrapper')}>

            <h3>Quản lý sản phẩm</h3>
            <Buttonn onClick={() => setIsModalOpen(true)} Plus className={cx('wrapper-icon')}><PlusOutlined className={cx('icon-plus')} /></Buttonn>

            <Table rowClassName={cx('row')} />

            <Modal title="Tạo tài khoản" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} >
                {/* <Loadingg isLoadingg={isLoading}> */}
                <Form
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
                {/* </Loadingg> */}
            </Modal>
        </div>
    );
}

export default QuanLySanPham;