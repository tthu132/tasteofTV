
import { useQuery } from '@tanstack/react-query'
import styles from './Blog.module.scss'
import classNames from "classnames/bind";
import { useState, useEffect } from 'react';
import { useMutationHook } from '~/hooks/useMutationHook';
import * as BlogService from '~/services/BlogService'
import { HeartOutlined, CommentOutlined } from "@ant-design/icons";
import Images from '~/components/Images';
import { formatCurrency } from '~/utils'
import { useNavigate } from 'react-router-dom';


const cx = classNames.bind(styles)
function Blog() {
    const navigate = useNavigate()

    const fetchProductBlog = async () => {

        const res = await BlogService.getAllProductCatogory()

        console.log('blob', res.data[0].title);
        return res
    }
    const queryBlogAll = useQuery({ queryKey: ['blogs'], queryFn: fetchProductBlog, retry: 3, retryDelay: 1000 })

    const { isPending: isLoadingBlogALl, data: blogs } = queryBlogAll
    console.log('blog all 1', blogs);



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
        <div className={cx('wrapper')}>Blog
            <div className={cx('inner')}>
                {
                    blogs && <div>
                        {
                            blogs?.data.map((item, index) => (
                                <div key={index} className={cx('item-blog')}>

                                    <div className={cx('video')}>
                                        <video controls width="400">
                                            <source src={item.video} type="video/mp4" />
                                        </video>
                                    </div>
                                    <h3>{item?.title}</h3>
                                    <p>Ngày đăng: {formatDate(item?.createdAt)}</p>

                                    <h4>Xem sản phẩm tại:</h4>

                                    <div className={cx('item-product')} onClick={() => navigate(`/product/${item?.product._id}`)}>
                                        <Images imageOrderList src={item?.product.firstImage} />
                                        <div>
                                            <span>{item?.product.name}</span>
                                            {
                                                item?.product.discount ?
                                                    <div >
                                                        <p className={cx('old-price')}>{formatCurrency(item?.product.price)}</p>
                                                        <h4>{formatCurrency(item?.product.price - (item?.product.price * item?.product.discount) / 100)}</h4>
                                                    </div> : <h4>{formatCurrency(item?.product.price)}</h4>
                                            }

                                        </div>

                                    </div>

                                    <div className={cx('action')}>
                                        <div>
                                            <HeartOutlined style={{ fontSize: '26px' }} />
                                            <p>10</p>
                                        </div>
                                        <div>
                                            <CommentOutlined style={{ fontSize: '26px' }} />
                                            <p>20</p>
                                        </div>
                                    </div>

                                </div>
                            ))
                        }
                    </div>
                }

            </div>

        </div >
    );
}

export default Blog;