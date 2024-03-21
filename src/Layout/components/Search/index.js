import Tippy from '@tippyjs/react/headless';
import styles from './Search.module.scss'
import classNames from 'classnames/bind';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCartShopping, faCircleUser, faHeart, faMagnifyingGlass, faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState, useRef } from 'react';
import Products from '~/components/Products';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux'
import { searchProduct } from '~/redux/slice/productSlide';
import { Link, NavLink } from 'react-router-dom';

import * as ProductService from '~/services/ProductService'
import { useNavigate } from 'react-router-dom';
import Loading from '~/components/Loading';
import { useDebounce } from '~/hooks/useDebounce';
const cx = classNames.bind(styles)


function Search() {

    const [searchValue, setSearchValue] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [showResult, setShowResult] = useState(true)
    const [showLoading, setShowLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(true);


    const inputRef = useRef()
    // const history = useHistory();
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const searchRedux = useSelector((state) => state?.product?.search)
    const searchDebounce = useDebounce(searchRedux, 1000)


    useEffect(() => {
        const fetchProductSearch = async (searchRedux) => {
            setIsLoading(true)
            console.log('serach value ', searchRedux);
            const res = await ProductService.getAllProduct(searchRedux)
            setIsLoading(false)

            setSearchResult(res.data)
            setShowLoading(false)

        }
        fetchProductSearch(searchDebounce)
    }, [searchDebounce])

    const handleHindenResult = () => {
        setShowResult()
        setShowResult(false)
    }
    console.log(searchResult);
    console.log(searchValue.length);
    const handleKeyPress = (event) => {

        if (event.key === 'Enter') {
            setShowResult(false)


            // Xử lý tìm kiếm ở đây, ví dụ:
            navigate(`/ketquatimkiem/${searchValue}`);
            console.log('Đang tìm kiếm:', searchValue);
        }
    };
    return (
        <Tippy
            interactive
            visible={searchResult.length > 0 && showResult && searchValue.length > 0}
            onClickOutside={handleHindenResult}
            render={(attrs) => (

                <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                    <Loading isLoading={isLoading}>
                        <PopperWrapper>
                            <div className={cx('search-title')}>{
                                searchResult && searchResult.map((item, index) => (
                                    <div key={index}>

                                        <Products data={item}></Products>
                                    </div>
                                ))
                            }</div>
                        </PopperWrapper>
                    </Loading>
                </div>
            )}>


            <div className={cx('search')}>
                <input className={cx('input-search')} placeholder='Search...'
                    ref={inputRef}
                    value={searchValue}
                    onChange={(e) => {

                        e.target.value = e.target.value.trimStart()
                        setSearchValue(e.target.value)

                        dispatch(searchProduct(e.target.value))

                    }}
                    onFocus={() => setShowResult(true)}
                    onKeyPress={handleKeyPress}
                    onKeyDown={(e) => {
                        if ((e.key === 'Backspace' || e.key === 'Delete')) {
                            setSearchResult('')
                            // Xử lý sự kiện xóa ở đây
                            // Ví dụ: gọi hàm để xóa dữ liệu liên quan
                        }
                    }}

                ></input>

                <div className={cx('button-icon')}>
                    <div>
                        {
                            searchValue && !showLoading &&
                            < button onClick={() => {
                                setSearchValue('');
                                inputRef.current.focus();
                                setSearchResult([])

                            }}><FontAwesomeIcon className={cx('icon', 'clear')} icon={faXmark} /></button>
                        }
                        {showLoading &&
                            <button><FontAwesomeIcon className={cx('icon', 'loading')} icon={faSpinner} /></button>}
                    </div>

                    <NavLink to={`/ketquatimkiem/${searchValue}`}><FontAwesomeIcon className={cx('icon-search', 'icon')} icon={faMagnifyingGlass} /></NavLink>

                </div>

            </div>
        </Tippy >

    );
}

export default Search;