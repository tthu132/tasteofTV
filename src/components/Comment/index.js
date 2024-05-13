import classNames from "classnames/bind";
import styles from './Comment.module.scss'
import Images from "../Images";

const cx = classNames.bind(styles)

function Comment({ data }) {
   
    return (
        <div className={cx('wrapper')}>

            <div className={cx('inner')}>
                <Images AvatarComment src={data?.user?.avatar} />
                <div className={cx('content')}>

                    <h4>{data?.user?.name}</h4>
                    <p>{data?.content}</p>
                </div>

            </div>





        </div>
    );
}

export default Comment;