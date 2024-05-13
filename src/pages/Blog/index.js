
import { useQuery } from '@tanstack/react-query'
import styles from './Blog.module.scss'
import classNames from "classnames/bind";
import { useState, useEffect } from 'react';
import { useMutationHook } from '~/hooks/useMutationHook';
import * as BlogService from '~/services/BlogService'
import * as CommentService from '~/services/CommentService'

import { HeartOutlined, CommentOutlined, HeartFilled, SendOutlined, EllipsisOutlined } from "@ant-design/icons";
import Images from '~/components/Images';
import { formatCurrency } from '~/utils'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ModalComponent from '~/components/ModalComponent';
import Comment from '~/components/Comment';
import { getTimeElapsedString } from '~/utils'
import Button from '~/components/Button';
import { Popover } from 'antd';
import * as message from '~/components/Message'
import Loading from '~/components/Loading';
import { useLocation, useParams } from 'react-router-dom';


const cx = classNames.bind(styles)
function Blog() {
    const navigate = useNavigate()
    const user = useSelector((state) => state.user)
    const location = useLocation()


    const [blogData, setBlogData] = useState([]);
    const [likedBlogs, setLikedBlogs] = useState([]);


    const fetchProductBlog = async () => {

        const res = await BlogService.getAllProductCatogory()


        return res
    }
    const queryBlogAll = useQuery({ queryKey: ['blogs'], queryFn: fetchProductBlog, retry: 3, retryDelay: 1000 })

    const { isPending: isLoadingBlogALl, data: blogs, isSuccess } = queryBlogAll


    useEffect(() => {
        setBlogData(blogs)
    }, [isSuccess])

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




    const mutationUpdate = useMutationHook(
        (data) => {
            const { id,

                ...rests } = data
            const res = BlogService.updateProductCatogory(
                id,

                { ...rests })

            return res
        },
    )
    const { data: dataUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated, isPending: isLoadingUpdated } = mutationUpdate



    // Hàm xử lý khi click vào icon tym
    const handleClickTym = async (index, id) => {

        // Kiểm tra xem blog có được đã like hay chưa
        const blog = blogs.data[index];
        // Kiểm tra xem người dùng đã like bài viết này chưa
        const isLiked = blog?.idsLike.includes(user.id);

        let updatedBlogData

        if (!isLiked) {
            setLikedBlogs([...likedBlogs, index]);
            const updatedIdsLikes = [...blog.idsLike, user.id];
            updatedBlogData = {
                ...blog,
                idsLike: updatedIdsLikes,
            };

            const updatedData = [...blogs.data];
            updatedData[index] = updatedBlogData;
            setBlogData({ ...blogData, data: updatedData });



        } else {
            const updatedLikedBlogs = likedBlogs.filter((likedIndex) => likedIndex !== index);
            setLikedBlogs(updatedLikedBlogs);
            // Nếu đã like, loại bỏ id của người dùng khỏi mảng idsLikes
            const updatedIdsLikes = blog?.idsLike.filter((id) => id !== user.id);
            // Cập nhật danh sách idsLikes của bài đăng
            updatedBlogData = {
                ...blog,
                idsLike: updatedIdsLikes,
            };
            // Cập nhật dữ liệu của bài đăng trong state
            const updatedData = [...blogs.data];
            updatedData[index] = updatedBlogData;


        }
        mutationUpdate.mutate({ id: id, ...updatedBlogData }, {
            onSettled: () => {
                queryBlogAll.refetch()
            }
        });
    };

    //--------commnent----------------------------
    const [showComment, setShowCommen] = useState(false)
    const handleOk = () => {
        setShowCommen(false);
    };
    const handleCancel = () => {

        setShowCommen(false);

    };
    const [stateComment, setStateComment] = useState()
    const [blogSelected, setBlogSelected] = useState()
    const [load, setLoad] = useState(false)



    const handleClickCommet = async (item) => {
        setLoad(true)
        setShowCommen(!showComment)

        setBlogSelected(item)
        const res = await CommentService.getAllComment(item?._id);

        setStateComment(res.data)
        setLoad(false)

    }
    //--------------create comment
    const [comments, setComments] = useState([]);
    const [valueComment, setValueComment] = useState()

    const mutationCreateComment = useMutationHook(
        (data) => {
            return CommentService.createComment(data)
        }
    )
    const { mutate: addTodo, data: dataImage, isSuccess: isSuccessImage, isError: isErrorImage, isPending: isPendingImage } = mutationCreateComment
    useEffect(() => {
        // Nếu có kết quả trả về từ mutation, thêm bình luận mới vào danh sách và cập nhật state
        if (mutationCreateComment.data) {

            // const newComment = mutationCreateComment.data;
            // setStateComment(prevComments => [newComment, ...prevComments]);
        }
    }, [mutationCreateComment.data]);
    const handleCreateComment = async (id) => {
        if (!user?.id) {
            navigate('/login', { state: location?.pathname })
        } else {
            mutationCreateComment.mutate({
                content: valueComment,
                idUser: user.id,
                idBlog: blogSelected._id,
                idRep: id
            }, {
                onSuccess: (newComment) => {
                    if (newComment) {

                        setStateComment(prevComments => [newComment.data, ...prevComments,]);
                    }
                    message.success('Đã bình luận!')

                }
            });


            setValueComment('');
        }
    }
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleCreateComment();
        }
    };
    //------------------------delete comment-----------------------------------------
    const [popoverVisible, setPopoverVisible] = useState(false);

    const mutationDeleteComment = useMutationHook(
        (data) => {
            return CommentService.deleteComment(data)
        }
    )
    const { data: dataDelete, isSuccess: isSuccessDelete, isError: isErrorDelete, isPending: isPendingDelete } = mutationDeleteComment

    const handleDeleteComment = (id) => {
        mutationDeleteComment.mutate(id, {
            onSuccess: () => {
                updateCommentStateAfterDelete(id);
                message.success('Đã xóa bình luận!')

            }
        })
    }
    const updateCommentStateAfterDelete = (deletedCommentId) => {
        // Lọc bỏ bình luận đã bị xóa khỏi mảng bình luận hiện tại
        const updatedComments = stateComment.filter(comment => comment._id !== deletedCommentId);
        // Cập nhật lại trạng thái của stateComment
        setStateComment(updatedComments);
    };
    const CommentActions = ({ onDelete }) => (
        <div>
            <p style={{ color: 'gray', marginTop: '10px', fontWeight: '500', cursor: 'pointer' }} onClick={onDelete}>Xóa bình luận</p>
        </div>
    );

    //--------------------rep===================================
    const [showRep, setShowRep] = useState(false)
    const handleRep = (item) => {
        setShowRep(item._id)

    }
    return (
        <div className={cx('wrapper')}>Blog
            <div className={cx('inner')}>
                {
                    blogs && <div>
                        {
                            blogs?.data.map((item, index) => (
                                <div key={index} className={cx('item-blog')}>
                                    <h3>{item?.title}</h3>
                                    <p>Ngày đăng: {formatDate(item?.createdAt)}</p>
                                    <div className={cx('video')}>
                                        <video controls width="300">
                                            <source src={item.video} type="video/mp4" />
                                        </video>
                                    </div>
                                    <div style={{ margin: '20px 0' }}>
                                        <h4>Cách chọn mua dừa sáp</h4>
                                        <h5 style={{ margin: '10px 0' }}> Lắc để nghe tiếng nước</h5>

                                        <ul>
                                            <li>Dừa sáp thường là đặc ruột nên rất ít nước, có nhiều quả nước còn sánh như chất lỏng không giống với nước dừa thường. Vì vậy khi lắc sẽ không có tiếng ục ục như dừa thường.
                                            </li>
                                            <li> Bạn nên chọn những trái dừa có tiếng lắc nước nhưng tiếng kêu không trong trẻo thì có khả năng đó là trái sáp có chất lượng cao nhất.
                                            </li>

                                        </ul>
                                        <h5 style={{ margin: '10px 0' }}> Cảm giác khi cầm tay</h5>
                                        <ul>
                                            <li>
                                                Bạn nên chọn mua những quả có trọng lượng nhẹ hơn những quả dừa thường.

                                            </li>
                                            <li> Bởi dừa sáp là loại có khá ít nước và nước đã sánh như keo vì vậy trọng lượng sẽ nhẹ hơn.</li>
                                        </ul>
                                        <h5 style={{ margin: '10px 0' }}>  Dựa vào kích cỡ trái</h5>
                                        <ul>
                                            <li>
                                                Kích cỡ của dừa sáp thường chia làm 4 loại: Ngoại cỡ trên 1,5kg, lớn trên 1,2kg, trung từ 0.7kg đến 1.2kg, nhỏ dưới 0.7kg.

                                            </li>

                                        </ul>
                                        <h5 style={{ margin: '10px 0' }}>  Thông tin về dừa sáp Trà Vinh</h5>
                                        <ul>
                                            <li>
                                                Dừa sáp là đặc sản của quê hương Trà Vinh, nổi tiếng nhất là tại huyện Cầu Kè.

                                            </li>
                                            <li> Dừa sáp quý hiếm là vì rất kén đất và khó trồng. Cùng là loại dừa sáp hoặc cùng một buồng dừa nhưng nhưng tỷ lệ cho sáp chỉ chiếm khoảng 20-40%.</li>
                                            <li>Bạn có thể ăn dừa sáp bằng cách dùng muỗng nạo phần cơm dừa để ăn tươi tại chỗ. Hoặc biến tấu thành món dừa dầm sữa hoặc sinh tố cũng vô cùng thơm ngon.</li>
                                        </ul>

                                    </div>


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
                                        <div onClick={() => handleClickTym(index, item?._id)}>
                                            {likedBlogs.includes(index) || item.idsLike.includes(user?.id) ? <HeartFilled style={{ fontSize: '26px', color: 'red', }} /> : <HeartOutlined style={{ fontSize: '26px', }} />}
                                            <p>{item?.idsLike.length}</p>
                                        </div>
                                        <div>
                                            <CommentOutlined onClick={() => handleClickCommet(item)} style={{ fontSize: '26px' }} />
                                            <p>{item?.idsComment.length}</p>

                                        </div>


                                    </div>
                                    {
                                        blogSelected?._id === item?._id && showComment &&
                                        <Loading isLoading={isPendingImage || isPendingDelete || load}>

                                            <div className={cx('create-comment')}>
                                                {
                                                    user.id && <Images AvatarComment src={user.avatar} />
                                                }
                                                <input onKeyDown={handleKeyDown} value={valueComment} onChange={(e) => setValueComment(e.target.value)} autoFocus placeholder='Viết bình luận...' className={cx('input-comment')} />
                                                <SendOutlined onClick={() => handleCreateComment()} style={{ fontSize: '20px', position: 'absolute', right: '10px', cursor: 'pointer' }} />

                                            </div>

                                            <hr style={{ margin: '10px 0' }}></hr>
                                            <h3 style={{ color: 'gray', marginTop: '10px' }}>Tất cả bình luận</h3>
                                            <div style={{ height: '300px', overflowY: 'scroll' }}>
                                                {

                                                    stateComment?.map((item, index) => (


                                                        <>
                                                            <div key={index}>
                                                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                                    <Comment data={item} />
                                                                    {
                                                                        (item?.user?.id === user?.id) &&
                                                                        <Popover content={<CommentActions onDelete={() => handleDeleteComment(item._id)} />}>
                                                                            <EllipsisOutlined onClick={() => setPopoverVisible(true)} style={{ transform: ' rotate(90deg)' }} />
                                                                        </Popover>
                                                                    }
                                                                </div>

                                                                <div className={cx('action-comment')}>
                                                                    <h4>{getTimeElapsedString(item.timestamp)}</h4>

                                                                    <h4 onClick={() => handleRep(item)} style={{ marginRight: '10px' }}>Trả lời</h4>

                                                                    {/* (item?.user?.id === user?.id) ? <></> :   <h4>Báo cáo</h4> */}
                                                                    {(item?.user?.id === user?.id) ? <></> : <h4>Báo cáo</h4>}
                                                                </div>

                                                                {
                                                                    showRep === item._id &&
                                                                    <>
                                                                        <div className={cx('create-comment-rep')}>
                                                                            {
                                                                                user.id && <Images AvatarComment src={user.avatar} />
                                                                            }
                                                                            <input onKeyDown={handleKeyDown} value={valueComment} onChange={(e) => setValueComment(e.target.value)} autoFocus placeholder='Viết bình luận...' className={cx('input-comment')} />
                                                                            <SendOutlined onClick={() => handleCreateComment(item)} style={{ fontSize: '20px', position: 'absolute', right: '10px', cursor: 'pointer' }} />

                                                                        </div>

                                                                    </>
                                                                }
                                                            </div>
                                                            {
                                                                item?.replies &&
                                                                item.replies.map((item2, index) => (
                                                                    <div key={index} style={{ marginLeft: '50px', marginBottom: '10px' }}>
                                                                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                                            <Comment data={item2} />
                                                                            {
                                                                                (item2?.user?.id === user?.id) &&
                                                                                <Popover content={<CommentActions onDelete={() => handleDeleteComment(item2._id)} />}>
                                                                                    <EllipsisOutlined onClick={() => setPopoverVisible(true)} style={{ transform: ' rotate(90deg)' }} />
                                                                                </Popover>
                                                                            }
                                                                        </div>

                                                                        <div className={cx('action-comment')}>
                                                                            <h4>{getTimeElapsedString(item.timestamp)}</h4>

                                                                            <h4 onClick={() => handleRep()} style={{ marginRight: '10px' }}>Trả lời</h4>
                                                                            <h4>Báo cáo</h4>
                                                                        </div>

                                                                        {
                                                                            showRep &&
                                                                            <div className={cx('create-comment')}>
                                                                                <Images AvatarComment src={user.avatar} />
                                                                                <input onKeyDown={handleKeyDown} value={valueComment} onChange={(e) => setValueComment(e.target.value)} autoFocus placeholder='Viết bình luận...' className={cx('input-comment')} />
                                                                                <SendOutlined onClick={() => handleCreateComment()} style={{ fontSize: '20px', position: 'absolute', right: '10px', cursor: 'pointer' }} />

                                                                            </div>
                                                                        }
                                                                    </div>
                                                                ))
                                                            }
                                                        </>
                                                    ))
                                                }
                                            </div>


                                        </Loading>}

                                </div>
                            ))
                        }
                    </div>
                }

            </div>
            {/* <ModalComponent
                title={blogSelected?.title}
                open={showComment}
                onOk={handleOk}
                footer={null}
                onCancel={handleCancel}


            > */}
            {/* </ModalComponent> */}

        </div >
    );
}

export default Blog;