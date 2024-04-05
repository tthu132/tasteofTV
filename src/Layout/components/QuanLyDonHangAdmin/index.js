import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import Buttonn from "~/components/Button";
import styles from './QuanLySanPham.module.scss'
import classNames from "classnames/bind";
import Table from "~/components/TableComponent";
import { Checkbox, Form, Input, Modal, Upload, Button, Select, Space, Tag } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { getBase64 } from "~/utils";
import Images from "~/components/Images";
import { useMutationHook } from '~/hooks/useMutationHook';
import * as ProductService from '~/services/ProductService'
import * as ProductCategoryService from '~/services/ProductCatogoryService '
import * as ImageService from '~/services/ImageService'
import * as OrderService from '~/services/OrderService'

import * as message from '~/components/Message'
import Loadingg from "~/components/Loading";
import { useQuery } from '@tanstack/react-query'
import DrawerComponent from "~/components/DrawerComponent";
import { useSelector } from "react-redux";
import ModalComponent from "~/components/ModalComponent";
import { Spin } from 'antd'
import { useReactToPrint } from "react-to-print";
import images from "~/images";


const cx = classNames.bind(styles)
function QuanLyDonHangAdmin() {

    const [isTest, setTest] = useState(false)


    const [isModalOpen, setIsModalOpen] = useState(false)
    const [stateProduct, setStateProduct] = useState({
        name: '',
        price: '',
        countInStock: '',
        description: '',
        idProductCategory: '',
        idsImage: [],
        discount: '',


    })
    const [stateProductDetail, setStateProductdetail] = useState({
        name: '',
        price: '',
        countInStock: '',
        description: '',
        idProductCategory: '',
        idsImage: [],
        discount: '',

    })

    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [form] = Form.useForm();
    const [form1] = Form.useForm();
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
    const [isModalDelete, setIsModalDelete] = useState(false)


    const { Option } = Select;

    const user = useSelector((state) => state.user)
    console.log('user ', user);

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
            const res = ProductService.updateProduct(
                id,
                token,
                { ...rests })

            return res
        },
    )
    const mutationDelete = useMutationHook(
        (data) => {
            const { id,
                token,
            } = data

            const res = ProductService.deleteProduct(
                id,
                token,
            )

            return res
        },
    )



    const fetchProductAll = async () => {

        const res = await ProductService.getAllProduct()

        return res
    }
    const fetchOrderAll = async () => {

        const res = await OrderService.getAllOrder()

        return res
    }

    const [imageQQ, setImageQQ] = useState()


    const [stateOrderDetail, setStateOrderDetail] = useState({
        id: '',
        name: '',
        price: '',
        address: '',
        phone: '',
        paymentMethod: '',
        updatedAt: '',
        status: '',
        note: '',
        orderItems: {},
        itemsPrice: '',
        shippingPrice: '',

    })
    const fetchDetailOrder = async () => {
        const res = await OrderService.getDetailsOrder(rowSelected);
        console.log('kiemtra 0', res.data);
        if (res.data) {
            setStateOrderDetail({
                id: res.data._id,
                name: res.data.shippingAddress.fullName,
                price: res.data.totalPrice,
                address: res.data.shippingAddress.address,
                phone: res.data.shippingAddress.phone,
                paymentMethod: res.data.paymentMethod,
                updatedAt: res.data.updatedAt,
                status: res.data.status,
                note: res.data.note,
                orderItems: res.data.orderItems,
                itemsPrice: res.data.itemsPrice,
                shippingPrice: res.data.shippingPrice

            })
        }
        setIsLoadingUpdate(false);
        return res;
    }

    useEffect(() => {
        console.log('state after update: ', stateProductDetail);
        const setValues = () => {
            if (form1 && stateProductDetail) {
                Object.entries(stateProductDetail).forEach(([key, value]) => {
                    form1.setFieldValue(key, value);
                    console.log('key-value', key, value);
                });
            }
        };

        setValues();
        setIsLoadingUpdate(false)

    }, [form1, stateProductDetail, isOpenDrawer])

    const { data, isSuccess, isError, isPending } = mutation
    const { data: dataUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated, isPending: isLoadingUpdated } = mutationUpdate
    const { data: dataDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted, isPending: isLoadingDeleted } = mutationDelete



    const queryProduct = useQuery({ queryKey: ['products'], queryFn: fetchProductAll, retry: 3, retryDelay: 1000 })

    const { isPending: isLoadingProduct, data: product } = queryProduct

    const getAllOrder = async () => {
        const res = await OrderService.getAllOrder(user?.access_token)
        return res
    }


    const queryOrder = useQuery({ queryKey: ['orders'], queryFn: getAllOrder })
    const { isLoading: isLoadingOrders, data: orders } = queryOrder
    console.log('orderrrrr', orders);

    useEffect(() => {
        if (orders?.data) {

            setTest(true);
            console.log('orderrrrr', orders);
        }
    }, [orders?.data]);


    const statusColorMap = {
        'Đặt hàng thành công': 'gray',
        'Đang xử lý': 'yellowgreen',
        'Đã gửi hàng': 'lightblue',
        'Đã giao hàng': 'green',
        'Đã hủy': 'red'
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            rowScope: 'row',
        },
        {
            title: 'Mã đơn hàng',
            dataIndex: '_id',

        },
        {
            title: 'Tên khách hàng',
            dataIndex: 'name',
            render: (text) => <a>{text}</a>,
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('name')
        },

        {
            title: 'Giá trị',
            dataIndex: 'totalPrice',
            sorter: (a, b) => a.price - b.price
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'date',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (_, { status }) => {
                const color = statusColorMap[status] || 'default'; // Mặc định là màu mặc định nếu không tìm thấy màu tương ứng

                return (
                    <Tag color={color} key={status}>
                        {status.toUpperCase()}
                    </Tag>
                );
            },
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
        setStateOrderDetail({
            id: '',
            name: '',
            price: '',
            address: '',
            phone: '',
            paymentMethod: '',
            updatedAt: '',
            status: '',
            note: '',
            orderItems: {},
            itemsPrice: '',
            shippingPrice: ''


        })

        form.resetFields()
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {

        setIsModalOpen(false);
        setStateOrderDetail({
            id: '',
            name: '',
            price: '',
            address: '',
            phone: '',
            paymentMethod: '',
            updatedAt: '',
            status: '',
            note: '',
            orderItems: {},
            itemsPrice: '',
            shippingPrice: ''
        })

        form.resetFields()

    };


    useEffect(() => {
        if (isSuccess) {

            message.success()
            handleCancel()
            setIsModalOpen(false);

        } else if (isError) {
            message.error()
        }
    }, [isSuccess])

    const mutationUpdateOrder = useMutationHook(
        (data) => {
            const { id,

                ...rests } = data
            const res = OrderService.updateOrder(
                id,

                { ...rests })

            return res
        },
    )

    const onFinishUpdate = () => {


        mutationUpdateOrder.mutate({ id: rowSelected, ...stateOrderDetail }, {
            onSettled: () => {
                queryOrder.refetch()
            }
        });
    }



    const handleOnChange = (e) => {
        setStateProduct({
            ...stateProduct,
            [e.target.name]: e.target.value
        }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }
    const handleOnChangeDetail = (e) => {
        setStateProductdetail({
            ...stateProductDetail,
            [e.target.name]: e.target.value
        })
    }
    const handleOnChangeCatoDetail = (value) => {
        setStateProductdetail({
            ...stateProductDetail,
            idProductCategory: value // Sửa đổi dòng này
        }, {
            onSettled: () => {
                queryProduct.refetch()
            }
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

    const handleCancelDelete = () => {
        setIsModalDelete(false)

    }
    const handleDeleteProduct = () => {
        mutationDelete.mutate({ id: rowSelected, token: user.access_token }, {
            onSuccess: () => {
                queryProduct.refetch()
            }
        })
    }
    const handleDetailsProduct = () => {
        // setIsLoadingUpdate(true)
        if (rowSelected) {
            // fetchDetailProduct()
            fetchDetailOrder()
            setIsLoadingUpdate(true)
        }
        setIsOpenDrawer(true)
    }
    //---------------------

    //----------

    const handleOnChangeCato = (value) => {
        setStateOrderDetail({
            ...stateOrderDetail,
            status: value // Sửa đổi dòng này
        }, {
            onSettled: () => {
                queryOrder.refetch()
            }
        })

    }
    useEffect(() => {
        if (rowSelected) {
            fetchDetailOrder(rowSelected)

        }
    }, [rowSelected, isOpenDrawer])



    const onCloseDetail = () => {
        setIsOpenDrawer(false)
        setStateOrderDetail({
            id: '',
            name: '',
            price: '',
            address: '',
            phone: '',
            paymentMethod: '',
            updatedAt: '',
            status: '',
            note: '',
            orderItems: {},
            itemsPrice: '',
            shippingPrice: ''

        })
        form1.resetFields()

    }

    function formatDate(dateString) {
        const dateObject = new Date(dateString);

        // Lấy ngày, tháng và năm
        const day = dateObject.getDate();
        const month = dateObject.getMonth() + 1; // Tháng bắt đầu từ 0 nên cần +1
        const year = dateObject.getFullYear();

        // Tạo chuỗi ngày tháng năm
        const formattedDate = `${day}/${month}/${year}`;

        return formattedDate;
    }

    console.log('sieutest ', stateOrderDetail.orderItems);

    const refPDF = useRef()

    const generatePDF = useReactToPrint({
        content: () => refPDF.current,
        documentTitle: "HoaDon"
    })
    const defaultNumbers = ' hai ba bốn năm sáu bảy tám chín';

    const chuHangDonVi = ('1 một' + defaultNumbers).split(' ');
    const chuHangChuc = ('lẻ mười' + defaultNumbers).split(' ');
    const chuHangTram = ('không một' + defaultNumbers).split(' ');

    const convert_block_three = (number) => {
        console.log('convert ', number);
        if (number == '000') return '';
        var _a = number + ''; //Convert biến 'number' thành kiểu string

        //Kiểm tra độ dài của khối
        switch (_a.length) {
            case 0: return '';
            case 1: return chuHangDonVi[_a];
            case 2: return convert_block_two(_a);
            case 3:
                var chuc_dv = '';
                if (_a.slice(1, 3) != '00') {
                    chuc_dv = convert_block_two(_a.slice(1, 3));
                }
                var tram = chuHangTram[_a[0]] + ' trăm';
                return tram + ' ' + chuc_dv;
        }
    }

    const convert_block_two = (number) => {
        var dv = chuHangDonVi[number[1]];
        var chuc = chuHangChuc[number[0]];
        var append = '';

        // Nếu chữ số hàng đơn vị là 5
        if (number[0] > 0 && number[1] == 5) {
            dv = 'lăm'
        }

        // Nếu số hàng chục lớn hơn 1
        if (number[0] > 1) {
            append = ' mươi';

            if (number[1] == 1) {
                dv = ' mốt';
            }
        }

        return chuc + '' + append + ' ' + dv;
    }
    const dvBlock = '1 nghìn triệu tỷ'.split(' ');

    function to_vietnamese(number) {
        var str = parseInt(number) + '';
        var i = 0;
        var arr = [];
        var index = str.length;
        var result = [];
        var rsString = '';

        if (index == 0 || str == 'NaN') {
            return '';
        }

        // Chia chuỗi số thành một mảng từng khối có 3 chữ số
        while (index >= 0) {
            arr.push(str.substring(index, Math.max(index - 3, 0)));
            index -= 3;
        }

        // Lặp từng khối trong mảng trên và convert từng khối đấy ra chữ Việt Nam
        for (i = arr.length - 1; i >= 0; i--) {
            if (arr[i] != '' && arr[i] != '000') {
                result.push(convert_block_three(arr[i]));

                // Thêm đuôi của mỗi khối
                if (dvBlock[i]) {
                    result.push(dvBlock[i]);
                }
            }
        }

        // Join mảng kết quả lại thành chuỗi string
        rsString = result.join(' ');

        // Trả về kết quả kèm xóa những ký tự thừa
        return rsString.replace(/[0-9]/g, '').replace(/ /g, ' ').replace(/ $/, '');
    }
    function getCurrentDate() {
        // Tạo một đối tượng Date để lấy ngày hiện tại
        const currentDate = new Date();

        // Lấy thông tin ngày, tháng, năm
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; // Tháng bắt đầu từ 0 nên cần cộng thêm 1
        const year = currentDate.getFullYear();

        // Trả về chuỗi định dạng ngày/tháng/năm
        return `${day}/${month}/${year}`;
    }
    const priceMemo = useMemo(() => {
        if (Array.isArray(stateOrderDetail?.orderItems)) {
            console.log('teeee', stateOrderDetail?.orderItems);
            const result = stateOrderDetail.orderItems.reduce((total, cur) => {
                return total + (cur.price * cur.amount);
            }, 0);
            return result;
        } else {
            return 0;
        }// hoặc giá trị mặc định khác nếu không có orderItems
    }, [stateOrderDetail?.orderItems])

    console.log('pricemomo', priceMemo);
    const priceDiscountMemo = useMemo(() => {
        if (Array.isArray(stateOrderDetail?.orderItems)) {
            return stateOrderDetail?.orderItems.reduce((totalDiscount, item) => {
                // Kiểm tra xem trường discount có tồn tại không
                if (item.discount === undefined || item.discount === null) {
                    return totalDiscount; // Bỏ qua nếu không có giảm giá
                }

                const totalItemPrice = item.price * item.amount;
                const discountAmount = (totalItemPrice * item.discount) / 100;
                return totalDiscount + discountAmount;
            }, 0);
        } else {
            return 0;
        }// hoặc giá trị mặc định khác nếu không có orderItems

    }, [stateOrderDetail?.orderItems])

    return (
        <div className={cx('wrapper')}>

            <h4 className={cx('title')}>Quản lý Đơn hàng</h4>

            {isTest &&
                <Table
                    rowClassName={cx('row')}
                    isLoading={isLoadingProduct}
                    columns={columns}
                    dataa={orders?.data.map((item, index) => {
                        return { ...item, key: item._id, index: index + 1, name: item?.shippingAddress?.fullName, date: formatDate(item?.updatedAt) }
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


            <DrawerComponent
                title="Xem và cập nhật trạng thái đơn hàng"
                isOpen={isOpenDrawer}
                onClose={onCloseDetail}
                width="80%"
            >
                <Loadingg isLoading={isLoadingUpdate}>
                    <div className={cx('detail')}>
                        <div className={cx('form')}>
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
                                    label="ID đơn hàng"
                                    name="id"

                                >
                                    <span name="id" >{stateOrderDetail.id}</span>
                                </Form.Item>

                                <Form.Item
                                    label="Tên khách hàng"
                                    name="name"

                                >
                                    <span name="id" >{stateOrderDetail.name}</span>
                                </Form.Item>
                                <Form.Item
                                    label="Giá trị đơn hàng"
                                    name="name"

                                >
                                    <span name="id" >{stateOrderDetail.price}</span>
                                </Form.Item>
                                <Form.Item
                                    label="Địa chỉ giao hàng"
                                    name="name"

                                >
                                    <span name="id" >{stateOrderDetail.address}</span>
                                </Form.Item>
                                <Form.Item
                                    label="Số điện thoại"
                                    name="name"

                                >
                                    <span name="id" >{stateOrderDetail.phone}</span>
                                </Form.Item>
                                <Form.Item
                                    label="Phương thức thanh toán"
                                    name="name"

                                >
                                    <span name="id" >{stateOrderDetail.paymentMethod}</span>
                                </Form.Item>
                                <Form.Item
                                    label="Ngày đặt hàng"
                                    name="name"

                                >
                                    <span name="id" >{formatDate(stateOrderDetail.updatedAt)}</span>
                                </Form.Item>
                                <Form.Item
                                    label="Ghi chú"
                                    name="name"

                                >
                                    <span name="note" >{stateOrderDetail.note}</span>
                                </Form.Item>
                                <Form.Item
                                    label="Trạng thái đơn hàng"
                                    name="name"

                                >
                                    <span name="id" >{stateOrderDetail.status}</span>
                                </Form.Item>

                                <Form.Item
                                    label="Cập nhật trạng thái đơn hàng"
                                    name="name"

                                >
                                    <Select defaultValue={stateOrderDetail.status} value={stateOrderDetail.status} onChange={(value) => handleOnChangeCato(value)}>


                                        <Option value='Đặt hàng thành công'>Đặt hàng thành công</Option>
                                        <Option value='Đang xử lý'>Đang xử lý</Option>
                                        <Option value='Đã gửi hàng'>Đã gửi hàng</Option>

                                        <Option value='Đã giao hàng'>Đã giao hàng</Option>
                                        <Option value='Đã hủy'>Đã hủy</Option>


                                    </Select>
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

                        </div>
                        <div className={cx('tablee')}>
                            <div className={cx('bill')} ref={refPDF}>

                                <div className={cx('header-bill')}>
                                    <Images logo src={images.logo}></Images>
                                    <h1>Hóa Đơn</h1>
                                    <div>
                                        <p>
                                            Mã HĐ: {stateOrderDetail.id}
                                        </p>
                                        <p>Ngày xuất hóa đơn: {getCurrentDate()}</p>
                                    </div>
                                </div>
                                <div className={cx('info')}>
                                    <p><p>Khách hàng: </p> {stateOrderDetail.name}</p>
                                    <p><p>Địa chỉ giao hàng: </p>{stateOrderDetail.address}</p>
                                    <p><p>Số điện thoại: </p>{stateOrderDetail.phone}</p>
                                    <p><p>Hình thước thanh toán: </p>{stateOrderDetail.paymentMethod}</p>
                                </div>


                                <table className={cx('table')}>
                                    <thead>
                                        <tr>
                                            <th>Sản phẩm</th>
                                            <th>Giá</th>
                                            <th>Số lượng</th>
                                            <th>Giảm giá</th>
                                            <th>Tạm tính</th>
                                        </tr>
                                    </thead>
                                    {/* console.log('get order detail ', stateOrderDetail.orderItems[0]); */}

                                    <tbody>
                                        {stateOrderDetail?.orderItems[0]?.name && stateOrderDetail?.orderItems?.map((product) => (

                                            <tr key={product.id}>

                                                <td style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Images imageOrderList src={product?.image}></Images>
                                                    {product?.name}
                                                </td>
                                                <td>{product?.price} ₫</td>
                                                <td>{product?.amount}</td>
                                                <td>{product?.discount ? product?.discount : 0} %</td>
                                                <td>{product?.discount ? (product.price - (product.discount * product.price) / 100) * product.amount : product.price * product.amount} ₫</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan="4">Tạm tính</td>
                                            <td>{stateOrderDetail.itemsPrice} ₫</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="4">Phí vận chuyển</td>
                                            <td>{stateOrderDetail.shippingPrice} ₫</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="4">Giảm giá</td>
                                            <td>{priceDiscountMemo} ₫</td>
                                        </tr>
                                        <tr>

                                            <td colSpan="4">Tổng cộng</td>
                                            <td>{stateOrderDetail.price} ₫</td>
                                        </tr>
                                    </tfoot>

                                </table>
                                <span style={{ margin: '5px 0', fontSize: '15px' }}>Thành tiền: <b><i>{to_vietnamese(stateOrderDetail.price)}</i></b></span>

                            </div>
                            <p>{stateOrderDetail.updatedAt}</p>
                            <Button onClick={() => generatePDF()}>Xuất hóa đơn</Button>
                        </div>

                    </div>
                </Loadingg>
            </DrawerComponent >

            < ModalComponent title="Xóa tài khoản"
                open={isModalDelete}
                onOk={handleDeleteProduct}
                onCancel={handleCancelDelete}
            >
                <p>Bạn muốn xóa sản phẩm này?</p>

            </ModalComponent>

        </div >
    );
}

export default QuanLyDonHangAdmin;