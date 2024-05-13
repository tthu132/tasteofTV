import styles from './ThongKe.module.scss'
import classNames from "classnames/bind";
import { useMutationHook } from '~/hooks/useMutationHook';
import * as ProductService from '~/services/ProductService'
import * as ProductCategoryService from '~/services/ProductCatogoryService '
import * as ImageService from '~/services/ImageService'
import * as UserService from '~/services/UserService'
import * as OrderService from '~/services/OrderService'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from "react-redux";
import { useEffect, useState } from 'react';
import { faL } from '@fortawesome/free-solid-svg-icons';
import Images from '~/components/Images';
import images from '~/images';
import Table from "~/components/TableComponent";
import { FireFilled, ThunderboltFilled, FireTwoTone, FireOutlined, CodeSandboxCircleFilled, PlusCircleFilled } from "@ant-design/icons";
import { Tag } from 'antd';


import Chart from '~/components/Chart';

const cx = classNames.bind(styles)
function ThongKe() {

    const [isTest, setTest] = useState(false)

    const user = useSelector((state) => state.user)
    //--------------------------------------
    const getAllOrder = async () => {
        const res = await OrderService.getAllOrder(user?.access_token)
        return res
    }
    const queryOrder = useQuery({ queryKey: ['orders'], queryFn: getAllOrder })
    const { isLoading: isLoadingOrders, data: orders } = queryOrder
    //--------------------------------------------
    const getAllUser = async () => {
        const res = await UserService.getAllUser()
        return res
    }
    const queryUser = useQuery({ queryKey: ['users'], queryFn: getAllUser })
    const { isLoading: isLoadingUser, data: users } = queryUser


    //--------------------------------
    const getAllProduct = async () => {
        const res = await ProductService.getAllProduct()
        return res
    }
    const queryProduct = useQuery({ queryKey: ['products'], queryFn: getAllProduct })
    const { isLoading: isLoadingProduct, data: products } = queryProduct

    //-----------------------------------------
    const [totalOrders, setTotalOrders] = useState()
    const [totalAmount, setTotalAmount] = useState()

    const [totalUser, setTotalUser] = useState()
    const [totalProduct, setTotalProduct] = useState()





    useEffect(() => {
        let totalOrders1 = orders?.data.length;
        setTotalOrders(totalOrders1)

        let totalAmount1 = orders?.data.reduce((total, order) => total + order.totalPrice, 0);
        setTotalAmount(totalAmount1)

        setTotalUser(users?.data.length)

        setTotalProduct(products?.data.length)

    }, [orders, products])

    useEffect(() => {
        if (totalOrders && totalAmount && products?.data) {

            setTest(true);

        } else {
            setTest(false);

        }
    }, [totalOrders, totalAmount, products?.data]);


    //--------------------------------------
    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            rowScope: 'row',
        },

        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',

        },

        {
            title: 'Giá ',
            dataIndex: 'price',

        },
        {
            title: 'Giảm giá',
            dataIndex: 'discount',
        },

        {
            title: 'Số lượng bán được',
            dataIndex: 'selled',
            // render: renderAction,
        },
    ];
    const columns3 = [
        {
            title: 'STT',
            dataIndex: 'index',
            rowScope: 'row',
        },

        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',

        },

        {
            title: 'Giá ',
            dataIndex: 'price',

        },
        {
            title: 'Đã bán',
            dataIndex: 'selled',
        },

        {
            title: 'Số lượng trong kho',
            dataIndex: 'countInStock',
            // render: renderAction,
        },
    ];
    const statusColorMap = {
        'Đặt hàng thành công': 'gray',
        'Đang xử lý': 'yellowgreen',
        'Đã gửi hàng': 'lightblue',
        'Đã giao hàng': 'green',
        'Đã hủy': 'red'
    };
    const columnsOrder = [
        {
            title: 'STT',
            dataIndex: 'index',
            rowScope: 'row',
        },

        {
            title: 'Tên khách hàng',
            dataIndex: 'name',

        },

        {
            title: 'Giá trị',
            dataIndex: 'totalPrice',

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

    ];
    const getTopSellingProducts = (products) => {
        // Sắp xếp danh sách sản phẩm giảm dần theo số lượng đã bán
        if (products) {
            const sortedProducts = products?.sort((a, b) => b.selled - a.selled);

            // Lấy 5 sản phẩm đầu tiên từ danh sách đã sắp xếp
            const top5Products = sortedProducts?.slice(0, 5);
            return top5Products;
        }
        return
    };
    function getTop5ProductsLeastInStock(products) {
        if (products) {
            // Sắp xếp mảng theo countInStock từ nhỏ đến lớn
            const lessThan5InStockProducts = products.filter(product => product.countInStock <= 5);

            // Sắp xếp mảng các sản phẩm theo countInStock tăng dần
            lessThan5InStockProducts.sort((a, b) => a.countInStock - b.countInStock);

            return lessThan5InStockProducts;

        }
        return

    }
    function getProductsAboveStock(products, threshold) {
        if (products) {
            // Lọc ra các sản phẩm có tồn kho lớn hơn ngưỡng
            const productsAboveStock = products.filter(product => product.countInStock >= threshold);

            // Sắp xếp mảng theo countInStock từ lớn đến nhỏ
            productsAboveStock.sort((a, b) => b.countInStock - a.countInStock);

            return productsAboveStock;
        }
        return [];
    }
    function formatCurrency(number) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
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

    return (

        <div className={cx('wrapper')}>
            <h2>Trang quản trị hệ thống website</h2>
            <div className={cx('inner')}>


                {
                    isTest &&
                    <div className={cx('statistical')}>
                        <div className={cx('item')}>
                            <Images Total src={images.totalCart}></Images>
                            <div>
                                <p>TỔNG SỐ ĐƠN HÀNG</p>
                                <span>{totalOrders}</span>
                            </div>
                        </div>
                        <div className={cx('item')}>
                            <Images Total src={images.totalPrice}></Images>
                            <div>
                                <p>TỔNG THU</p>
                                <span>{formatCurrency(totalAmount)}</span>
                            </div>
                        </div>
                        <div className={cx('item')}>
                            <Images Total src={images.totalUser}></Images>
                            <div>
                                <p>TỔNG NGƯỜI DÙNG</p>
                                <span>{totalUser}</span>
                            </div>
                        </div>
                        <div className={cx('item')}>
                            <Images Total src={images.totalProduct}></Images>
                            <div>
                                <p>TỔNG SẢN PHẨM</p>
                                <span>{totalProduct}</span>
                            </div>
                        </div>
                    </div>
                }
                <Chart />
                {
                    isTest &&

                    <div className={cx('top')}>
                        <div style={{ backgroundColor: 'rgba(140, 195, 66, 60%)', padding: '10px', boxShadow: ' 0px 0px 10px rgba(0, 0, 0, 0.5)' }}>
                            <p className={cx('title')}> <FireFilled style={{ color: 'red', fontSize: '26px', margin: '5px' }} />Top sản phẩm bán chạy</p>
                            <Table
                                Top
                                rowClassName={cx('row')}
                                isLoading={isLoadingProduct}
                                columns={columns}
                                dataa={getTopSellingProducts(products?.data)?.map((item, index) => {
                                    return { ...item, selled: item.selled, key: item._id, index: index + 1, name: item?.name, price: formatCurrency(item.price), discount: item.discount ? `${item.discount}%` : '0%' }
                                })}
                                onRow={(record, rowIndex) => {

                                }}
                            />
                        </div>
                        <div style={{ backgroundColor: 'rgba(140, 195, 66, 60%)', padding: '10px', boxShadow: ' 0px 0px 10px rgba(0, 0, 0, 0.5)' }}>
                            <p className={cx('title')}> <ThunderboltFilled style={{ color: 'gold', fontSize: '26px', margin: '5px' }} />Đơn hàng mới</p>
                            <Table
                                Top
                                rowClassName={cx('row')}
                                isLoading={isLoadingProduct}
                                columns={columnsOrder}
                                dataa={orders?.data?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5).map((item, index) => {
                                    return { ...item, totalPrice: formatCurrency(item.totalPrice), key: item._id, index: index + 1, name: item?.shippingAddress?.fullName, date: formatDate(item?.updatedAt) }
                                })}
                                onRow={(record, rowIndex) => {

                                }}
                            />
                        </div>
                    </div>
                }
                {
                    isTest &&

                    <div className={cx('top')}>
                        <div style={{ marginTop: '30px', padding: '10px', boxShadow: ' 0px 0px 10px rgba(0, 0, 0, 0.5)' }}>
                            <p className={cx('title')}><PlusCircleFilled style={{ color: 'red', fontSize: '26px', margin: '5px' }} />Sản phẩm cần nhập hàng</p>
                            <Table
                                Top
                                colSpan={5}
                                rowClassName={cx('row')}
                                isLoading={isLoadingProduct}
                                columns={columns3}
                                dataa={getTop5ProductsLeastInStock(products?.data)?.map((item, index) => {
                                    return { ...item, key: item._id, index: index + 1, name: item?.name, price: formatCurrency(item.price), discount: item.discount ? `${item.discount}%` : '0%' }
                                })}
                                onRow={(record, rowIndex) => {

                                }}
                            />
                        </div>
                        <div style={{ marginTop: '30px', padding: '10px', boxShadow: ' 0px 0px 10px rgba(0, 0, 0, 0.5)' }}>
                            <p className={cx('title')}> <CodeSandboxCircleFilled style={{ color: 'gold', fontSize: '26px', margin: '5px' }} />Hàng tồn kho</p>
                            <Table
                                Top

                                rowClassName={cx('row')}
                                isLoading={isLoadingProduct}
                                columns={columns3}
                                dataa={getProductsAboveStock(products?.data, 10).map((item, index) => {
                                    return { ...item, key: item._id, index: index + 1, name: item?.name, price: formatCurrency(item.price), discount: item.discount ? `${item.discount}%` : '0%' }
                                })}
                                onRow={(record, rowIndex) => {

                                }}
                            />
                        </div>
                    </div>
                }



            </div>


        </div>


    );
}

export default ThongKe;