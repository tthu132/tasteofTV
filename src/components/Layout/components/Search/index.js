import Tippy from '@tippyjs/react/headless';
import styles from './Search.module.scss'
import classNames from 'classnames/bind';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCartShopping, faCircleUser, faHeart, faMagnifyingGlass, faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState, useRef } from 'react';
import Products from '~/components/Products';
import axios from 'axios';

const cx = classNames.bind(styles)


function Search() {

    const [searchValue, setSearchValue] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [showResult, setShowResult] = useState(true)
    const [showLoading, setShowLoading] = useState(false)

    const inputRef = useRef()

    useEffect(() => {
        if (!searchValue.trim()) {
            return;
        }

        setShowLoading(true)

        const fetchApi = async () => {
            try {
                const res = await axios.get(`https://tiktok.fullstack.edu.vn/api/users/search?q=${encodeURIComponent(searchValue)}&type=less`)

                setSearchResult(res.data.data)
                setShowLoading(false)

            } catch (erro) {
                setShowLoading(false)
            }
        }

        fetchApi()


    }, [searchValue])

    const handleHindenResult = () => {
        setShowResult(false)
    }
    console.log(searchResult);
    console.log(searchValue.length);
    return (
        <Tippy
            interactive
            visible={searchResult.length > 0 && showResult && searchValue.length > 0}
            onClickOutside={handleHindenResult}
            render={(attrs) => (

                <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                    <PopperWrapper>
                        <div className={cx('search-title')}>{
                            searchResult.map((item, index) => (
                                <div key={index}>

                                    <Products data={item}></Products>
                                </div>
                            ))
                        }</div>
                    </PopperWrapper>
                </div>
            )}>


            <div className={cx('search')}>
                <input placeholder='Search...'
                    ref={inputRef}
                    value={searchValue}
                    onChange={(e) => {
                        e.target.value = e.target.value.trimStart()
                        setSearchValue(e.target.value)
                    }}
                    onFocus={() => setShowResult(true)}

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
                    {/* <Tippy content='Tìm kiếm'> */}
                    <button className={cx('icon-search', 'icon')}><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
                    {/* </Tippy> */}
                </div>

            </div>
        </Tippy >

    );
}

export default Search;