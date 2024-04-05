import styles from './QuanLyBlog.module.scss'
import classNames from "classnames/bind";
// import WriteBlog from '~/components/WriteBlog';
import { UploadOutlined } from '@ant-design/icons';
import { getBase64 } from '../../../utils'
// import Button from '~/components/Button';
import { useState, useEffect, useRef } from 'react';
import { useMutationHook } from '~/hooks/useMutationHook';
import * as BlogService from '~/services/BlogService'
import * as ProductService from '~/services/ProductService'
import Table from "~/components/TableComponent";
import DrawerComponent from "~/components/DrawerComponent";


import ModalComponent from "~/components/ModalComponent";
import { Checkbox, Form, Input, Modal, Upload, Button, Select, Space } from "antd";
import { useQuery } from '@tanstack/react-query'
import Images from '~/components/Images';
import { Option } from 'antd/es/mentions';
import TextArea from 'antd/es/input/TextArea';
import Loading from '~/components/Loading';
import axios from 'axios';
import * as message from '~/components/Message'
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import { formatDate } from '~/utils'


const cx = classNames.bind(styles)

function QuanLyBlog() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [rowSelected, setRowSelected] = useState('')


    // const [videoUrl, setVideoUrl] = useState('');
    const [form] = Form.useForm();
    const [form1] = Form.useForm();


    const [stateBlog, setStateBlog] = useState({
        title: '',
        video: '',
        idProduct: ''
    })


    const mutation = useMutationHook(
        (data) => {
            BlogService.createProductCatogory(data)
        }
    )
    const handleCancel = () => {
        form.resetFields();

        setIsModalOpen(false)
    }

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const [text, setText] = useState('')
    const handleOnChange = (e) => {
        setText(e.target.value)
    }
    const handleOnSelectProduct = id => {
        setStateBlog({
            ...setStateBlog,
            idProduct: id
        })
    }
    const fetchProductAll = async () => {

        const res = await ProductService.getAllProduct()

        return res
    }
    const queryProduct = useQuery({ queryKey: ['products'], queryFn: fetchProductAll, retry: 3, retryDelay: 1000 })

    const { isPending: isLoadingProduct, data: product } = queryProduct

    // console.log('dataBlog', product?.data[0].firstImage);
    const fetchProductBlog = async () => {

        const res = await BlogService.getAllProductCatogory()

        return res
    }
    const queryBlogAll = useQuery({ queryKey: ['blogs'], queryFn: fetchProductBlog, retry: 3, retryDelay: 1000 })


    const [videoUrl, setVideoUrl] = useState('');
    const { isPending: isLoadingBlogALl, data: blogs } = queryBlogAll

    const [video, setVideo] = useState(null);
    const handleVideoUpload = async (event) => {
        const file = event.target.files[0];
        setVideo(file)
    }
    const [loading, setLoading] = useState(false);

    const uploadFile = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('file', video);
        formData.append('upload_preset', 'ml_default');
        try {
            let api = 'https://api.cloudinary.com/v1_1/dgrzr3uqm/video/upload';
            const res = await axios.post(api, formData)
            const { secure_url } = res.data
            console.log('secure-url', secure_url);
            return secure_url
        } catch (error) {
            console.error('Error uploading video:', error);
        } finally {
            setLoading(false); // Kết thúc quá trình loading
        }
    }
    const onFinish = async () => {
        const urlVideo = await uploadFile()
        console.log('urlVideo', urlVideo);

        mutation.mutate({ ...stateBlog, title: text, video: urlVideo }, {
            onSuccess: () => {
                message.success('Tạo blog thành công')
                handleCancel()
            }
        }
        )

    }
    //-------------------------------------
    const [isModalDelete, setIsModalDelete] = useState(false)

    const renderAction = () => {
        return (
            <div>
                <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} onClick={() => setIsModalDelete(true)} />
                <EditOutlined style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }} onClick={handleDetailsBlog} />
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

    });
    const columns = [
        {
            title: 'Tiêu đề Blog',
            dataIndex: 'title',
            render: (text) => <a>{text}</a>,
            sorter: (a, b) => a.title.length - b.title.length,
            ...getColumnSearchProps('title')
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'date',
            // sorter: (a, b) => a.price - b.price
        },

        {
            title: 'Sản phẩm gắn vào Blog',
            dataIndex: 'product',


        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction,
        },
    ];
    //------------------------------
    const [stateDetailBlog, setStateDetailBlog] = useState({
        title: '',
        idProduct: '',
        video: '',
        productName: ''


    })
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)

    const fetchDetailBlog = async () => {
        const res = await BlogService.getDetailsOrder(rowSelected);
        console.log('kiemtra 01', res.data);

        if (res.data) {
            setStateDetailBlog({
                title: res?.data.title,
                idProduct: res?.data.idProduct,
                video: res?.data.video,
                productName: res?.productName

            })
            console.log('kiemtra 0111111111', stateDetailBlog);

        }

        // setIsLoadingUpdate(false);
        return res;
    }
    const handleDetailsBlog = () => {
        // setIsLoadingUpdate(true)
        if (rowSelected) {
            // fetchDetailProduct()
            fetchDetailBlog()
            // setIsLoadingUpdate(true)
        }
        setIsOpenDrawer(true)
    }
    useEffect(() => {
        if (rowSelected) {
            fetchDetailBlog(rowSelected)

        }
    }, [rowSelected, isOpenDrawer])

    const mutationUpdateBlog = useMutationHook(
        (data) => {
            const { id,

                ...rests } = data
            const res = BlogService.updateProductCatogory(
                id,

                { ...rests })

            return res
        },
    )
    const { data: dataUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated, isPending: isLoadingUpdated } = mutationUpdateBlog
    const onFinishUpdate = () => {


        mutationUpdateBlog.mutate({ id: rowSelected, ...stateDetailBlog }, {
            onSettled: () => {
                queryBlogAll.refetch()
            },
        }, {
            onSuccess: () => {
                message.success('Cập nhật thành công!')
                setIsOpenDrawer(false)
            }
        });
    }
    const handleOnChangeDetail = (e) => {
        setStateDetailBlog({
            ...stateDetailBlog,
            [e.target.name]: e.target.value
        })
    }
    const onCloseDetail = () => {
        console.log('cloooo');
        setIsOpenDrawer(false)
        setStateBlog({
            title: '',
            idProduct: '',
            video: '',
            productName: ''


        })
        form1.resetFields()

    }
    console.log('kiemtra 01', stateDetailBlog);
    useEffect(() => {
        if (isSuccessUpdated) {
            message.success()
            onCloseDetail()

        } else if (isErrorUpdated) {
            message.error()
        }

    }, [isSuccessUpdated])
    return (
        <Loading isLoading={false}>
            <div className={cx('wrapper')}>
                <h4>Tạo Blog mới</h4>
                {/* <video controls width="400">
                    <source src={blogs?.data[0].video} type="video/mp4" />
                    Your browser does not support the video tag.
                </video> */}

                <Button onClick={() => (setIsModalOpen(true), setText(''))}>Add</Button>
                <Loading isLoading={false}>
                    < ModalComponent forceRender title="Tạo Blog mới"
                        open={isModalOpen}
                        onOk={handleOk}
                        footer={null}
                        onCancel={handleCancel} >
                        {/* <Loadingg isLoadingg={isLoading}> */}

                        {/* </Loadingg> */}

                        <Loading isLoading={loading}>
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
                                    label="Tiêu đề Blog"
                                    name="title"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập tiêu đề bài Blog!',
                                        },
                                    ]}
                                >
                                    <Input value={stateBlog.title} onChange={handleOnChange} name="title" />
                                    {/* <TextArea value={stateBlog.title} onChange={handleOnChange} name="title"></TextArea> */}
                                </Form.Item>



                                <Form.Item
                                    label="Video"
                                    name="video"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng chọn video!',
                                        },
                                    ]}
                                >
                                    <input name="video" type="file" accept="video/*" onChange={handleVideoUpload} />
                                    {/* {videoUrl && (
                            <div>
                                <p>Video đã tải lên:</p>
                                <video controls src={videoUrl} width="400" />
                                <p>Đường dẫn: {videoUrl}</p>
                            </div>
                        )} */}

                                </Form.Item>
                                <Form.Item
                                    label="Gắn sản phẩm"
                                    name="idProduct"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng chọn sản phẩm!',
                                        },
                                    ]}
                                >
                                    <Select placeholder="Select product" name="idProduct" value={stateBlog.idProduct} onChange={(value) => handleOnSelectProduct(value)}>
                                        {
                                            product && product.data && product.data.map((item) => (
                                                <Option
                                                    key={item._id}
                                                    value={item._id}


                                                >
                                                    {/* <div>
                                            <Images Small src={item?.firstImage}></Images>
                                            <p>{item?.name}</p>
                                        </div> */}
                                                    {item?.name}
                                                </Option>

                                            ))
                                        }

                                    </Select>

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
                        </Loading>

                    </ModalComponent >
                </Loading>
                {blogs &&
                    <Table
                        rowClassName={cx('row')}
                        // isLoading={isLoadingUser}
                        columns={columns}
                        dataa={blogs.data.map((item) => {
                            return { ...item, product: item.product.name, date: formatDate(item.createdAt) }
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

                //-----------------------------------------------------------
                <DrawerComponent
                    forceRender
                    title="Chi tiết Blog"
                    isOpen={isOpenDrawer}
                    onClose={onCloseDetail}
                    width="80%"
                >
                    <Loading isLoading={false}>
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
                                label="Tiêu đề Blog"
                                name="title"
                            // rules={[
                            //     {
                            //         required: true,
                            //         message: 'Vui lòng nhập tiêu đề Blog!',
                            //     },
                            // ]}
                            >
                                <Input value={stateDetailBlog.title} onChange={handleOnChangeDetail} name="title" />
                                <p>akjah{stateDetailBlog.title}</p>
                                {/* <TextArea value={stateDetailBlog.title} onChange={handleOnChangeDetail} name="title" ></TextArea> */}

                            </Form.Item>


                            <Form.Item
                                label="Gắn sản phẩm"
                                name="idProduct"
                            // rules={[
                            //     {
                            //         required: true,
                            //         message: 'Vui lòng chọn sản phẩm!',
                            //     },
                            // ]}
                            >
                                <Select placeholder={stateDetailBlog.productName} name="idProduct" value={stateDetailBlog.idProduct} onChange={(value) => handleOnSelectProduct(value)}>
                                    {
                                        product && product.data && product.data.map((item) => (
                                            <Option
                                                key={item._id}
                                                value={item._id}


                                            >
                                                {item?.name}
                                            </Option>

                                        ))
                                    }

                                </Select>


                            </Form.Item>

                            <Form.Item
                                label="Video"
                                name="video"
                            // rules={[
                            //     {
                            //         required: true,
                            //         message: 'Vui lòng nhập video cho Blog!',
                            //     },
                            // ]}
                            >
                                {/* <video controls width="400">
                                        <source src={stateDetailBlog.video} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video> */}
                                <input name="video" type="file" accept="video/*" onChange={handleVideoUpload} />

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
                    </Loading>
                </DrawerComponent >

            </div>
        </Loading>
    );
}

export default QuanLyBlog;