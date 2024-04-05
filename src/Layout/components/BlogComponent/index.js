import styles from './QuanLyBlog.module.scss'
import classNames from "classnames/bind";
// import WriteBlog from '~/components/WriteBlog';
import { Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Images from '~/components/Images';
import { getBase64 } from '../../../utils'
import Button from '~/components/Button';
import { useState, useEffect } from 'react';
import { useMutationHook } from '~/hooks/useMutationHook';
import * as BlogService from '~/services/BlogService'
const cx = classNames.bind(styles)

function BlogComponent({}) {


    const [videoUrl, setVideoUrl] = useState('');

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const videoUrl = URL.createObjectURL(file);
            setVideoUrl(videoUrl);
        }

    };
    console.log('url', videoUrl);
    return (
        <div className={cx('wrapper')}>
            <input type="file" accept="video/*" onChange={handleFileUpload} />
            {videoUrl && (
                <div>
                    <p>Video đã tải lên:</p>
                    <video controls src={videoUrl} width="400" />
                    <p>Đường dẫn: {videoUrl}</p>
                </div>
            )}
        </div>
    );
}

export default BlogComponent;