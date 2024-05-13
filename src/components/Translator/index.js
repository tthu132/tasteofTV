import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import styles from './Translator.module.scss';
import classNames from 'classnames/bind';
import alanBtn from "@alan-ai/alan-sdk-web";
import { useCart } from '~/context/CartConText'
import { useNavigate } from 'react-router-dom';
import Button from '../Button';
import { useDispatch, useSelector } from 'react-redux'

import ModalComponent from "~/components/ModalComponent";
import { Checkbox, Form, Input, Radio, message } from 'antd';

import { useMutationHook } from '~/hooks/useMutationHook';
import * as OrderService from '~/services/OrderService'
import * as UserService from '~/services/UserService'
import { updateUser, } from '~/redux/slice/userSlide'
import { removeAllOrderProduct, removeOrderProduct, selectedOrder, update } from '~/redux/slice/orderSlice';

import axios, * as others from 'axios';


const cx = classNames.bind(styles);

function Translator() {
    const API_KEY = '5J44khjHMGO2D4ybVswYV5PxeBKN4z7L';
    // Thay thế bằng API Key của bạn
    const [audioData, setAudioData] = useState(null);
    // Hàm gửi yêu cầu đến API của FPT AI để chuyển đổi văn bản thành giọng nói
    // async function textToSpeech(text, voice = 'banmai', speed = '') {
    //     try {
    //         const response = await axios.post(
    //             'https://api.fpt.ai/hmi/tts/v5',
    //             { text: text },
    //             {
    //                 headers: {
    //                     'api-key': API_KEY,
    //                     'speed': speed,
    //                     'voice': voice
    //                 }
    //             }
    //         );
    //         console.log('responnn', response);
    //         console.log('responnn', response.data.async);
    //         const test = response.data.async
    //         playAudioFromUrl(test)
    //         setAudioData(response.data.async);
    //     } catch (error) {
    //         console.error('Error:', error);
    //         setAudioData(null);
    //     }
    // }
    async function textToSpeech(audioUrl, voice = 'banmai', speed = '') {
        try {
            const response = await axios.post(
                'https://api.fpt.ai/hmi/tts/v5',
                { text: audioUrl },
                {
                    headers: {
                        'api-key': API_KEY,
                        'speed': speed,
                        'voice': voice
                    }
                }
            );
            const audioData = response.data.async;

            // Tạo một đối tượng audio mới với đường dẫn URL đã cung cấp
            const audio = new Audio(audioData);
            audio.currentTime = 0.3

            // Trả về một Promise để xử lý kết quả phát audio
            return new Promise((resolve, reject) => {
                // Phát audio và xử lý kết quả
                const playPromise = audio.play();

                if (playPromise !== undefined) {
                    playPromise.catch((error) => {
                        // Log lỗi hoặc thực hiện xử lý bổ sung mà không hiển thị lỗi ra giao diện
                        console.error('Automatic playback failed:', error);
                        // Ví dụ: Ghi log hoặc thực hiện một hành động nào đó khi phát audio không thành công
                    });
                }
            });
        } catch (error) {
            console.error('Error:', error);
            // throw new Error('Failed to play audio');
        }
    }

    function playAudioFromUrl(audioUrl, startTime = 0.3) {
        // Tạo một đối tượng audio mới với đường dẫn URL đã cung cấp
        const audio = new Audio(audioUrl);
        audio.currentTime = startTime;
        // Phát audio
        audio.play();
    }

    const [form1] = Form.useForm();
    const navigate = useNavigate()
    const dispatch = useDispatch()


    const user = useSelector((state) => state.user)
    const [user1, setUser1] = useState(user)
    const order = useSelector((state) => state.order)

    const { test, handleOrderAdd1, handleSearch, handleOrderAdd2, handleOk1 } = useCart()

    const recognitionRef = useRef();
    const [recognition, setRecognition] = useState(null); // State để lưu trữ đối tượng SpeechRecognition
    const [isActive, setIsActive] = useState(false);
    const [text, setText] = useState('');

    /////////////
    const [showAdress, setShowAdress] = useState(false)

    const [stateUserDetail, setStateUserdetail] = useState({
        name: '',

        phone: '',
        address: '',
        detailAddress: '',
        tinh: '',
        huyen: '',
        xa: ''
    })
    ///////////


    function sendData(test) {
        alanBtnRef.btnInstance.sendText(test)

    };
    function removeAccentsAndLowercase(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SpeechRecognition();
    rec.lang = 'vi-VN';

    const handleOnRecord = () => {
        // textToSpeech(`Đang lắng nghe`)

        setText('Đang nghe...')
        if (isActive) {
            if (recognition) {
                recognition.stop();
                setText('')
            }
            setIsActive(false);

        } else {

            rec.onresult = async function (e) {
                const transcript = e.results[0][0].transcript;

                setText(transcript);

                const str = removeAccentsAndLowercase(transcript)
                if ((transcript === 'mua ngay' && transcript === 'them vao gio hang') && !user?.id) {
                    textToSpeech(`Quý khách vui lòng đăng nhập tài khoản`)

                } else {
                    // setText(transcript);
                    sendData(str)


                }
            };

            rec.start();


            rec.onend = () => {
                setIsActive(false);
            };

            setRecognition(rec);
            setIsActive(true);
        }
    }

    const alanBtnRef = useRef({}).current;
    const [noilai, setNoilai] = useState(false)
    useEffect(() => {
        alanBtnRef.btnInstance = alanBtn({
            key: "b96b222e61a0e86404eb252714da6c3e2e956eca572e1d8b807a3e2338fdd0dc/stage",

            onEvent: function (e) {
                let itemCheck = localStorage.getItem('itemAdd')

                // console.info('onEvent 1', e.ents[0].value);
                // search(e.ents.value)
                if (e.text === 'contrinue addcart') {

                    // if (user.id) {
                    if (itemCheck) {

                        textToSpeech(`Quý khách muốn lấy bao nhiêu sản phẩm`)
                    } else {
                        textToSpeech(`Vui lòng vào trang chi tiết sản phẩm để thực hiện chức năng này`)
                    }

                    // } else {
                    // textToSpeech(`Quý khách vui lòng đăng nhập để thực hiện chức năng này`)

                    // }
                }
                if (e.text === 'contrinue') {
                    handleOnRecord()
                    textToSpeech(`Quý khách vui lòng nói lại`)

                }
                if (e.text === 'contrinue buyNow') {

                    if (itemCheck) {
                        textToSpeech(`Quý khách muốn mua số lượng bao nhiêu`)

                    } else {
                        textToSpeech(`Vui lòng vào trang sản phẩm để thực hiện chức năng này`)

                    }
                }
                if (e.text === 'contrinuee') {
                    handleOnRecord()

                }

                if (e.text == `I'm sorry, I don't understand what you are asking. Can you please rephrase your question?` || e.text === `I'm sorry, I don't understand the question. Can you please rephrase it?`) {
                    setNoilai(true)
                    textToSpeech(`Quý khách vui lòng nói lại`)

                }

            },
            onCommand: ({ command, payload }) => { // Đăng ký callback tại đây
                handleCommand(command); // Gọi trình xử lý lệnh của bạn
                window.dispatchEvent(new CustomEvent(command, { detail: payload }))

            }
        })
    }, []);




    const handleCommand = (command) => {
        console.log('onEvent Sự kiện lệnh ', command);
    }
    const openCart = useCallback(() => {

        alanBtnRef.btnInstance.playText('Opening cart')

        // if (!user?._id) {
        //     // alanBtnRef.btnInstance.sendText('Trang chu')
        //     textToSpeech('Bạn chưa đăng nhập, vui lòng đăng nhập')
        //     navigate('/login')
        // }
        // window.location.href = '/order';
        textToSpeech(' đã mở giỏ hàng')
        navigate('/order')



    }, [alanBtnRef.btnInstance])

    const closeCart = useCallback(() => {

        localStorage.removeItem('itemAdd');
        localStorage.removeItem('itemBuyNow');


        // const item2 = JSON.parse(item);

        alanBtnRef.btnInstance.playText('Close cart')
        navigate('/')

        if (localStorage.getItem('itemAdd')) {
            // Nếu tồn tại, xóa mục đó khỏi localStorage
            localStorage.removeItem('itemAdd');
        }
        if (localStorage.getItem('itemBuyNow')) {
            // Nếu tồn tại, xóa mục đó khỏi localStorage
            localStorage.removeItem('itemBuyNow');
        }

        // textToSpeech('Trở về trang chủ')


    }, [alanBtnRef.btnInstance])

    const [test1, setTest1] = useState('')
    const searchAlan = useCallback(async ({ detail: { name } }) => {
        let result

        if (name) {
            result = await handleSearch(name);


        }
        if (result?._id) {
            // setTest1('Đang mở sản pham')
            textToSpeech(`Đang mở sản phẩm ${result?.name}`)
            setTest1(!test1)
            localStorage.setItem('itemAdd', JSON.stringify(result));
            window.location.href = `/product/${result?._id}`;


            // navigate(`/product/${result?._id}`)

        } else {
            textToSpeech(`Không tìm thấy sản phẩm có tên ${name}`)

            message.error('Không tìm thấy sản phẩm')

        }
    })
    useEffect(() => {
        // localStorage.removeItem('item');
        // localStorage.removeItem('itemAdd');
        // localStorage.removeItem('itemBuyNow');
        textToSpeech(`Chi tiết sản phẩm đang mở`)

    }, [test1])
    const item = localStorage.getItem('itemAdd');


    const addCart = useCallback(({ detail: { quantity } }) => {
        const item2 = JSON.parse(item);

        if (quantity && item2) {
            const check = handleOrderAdd1(quantity, item2)
            if (check) {
                textToSpeech(`Đã thêm vào giỏ hàng`)

            } else {
                textToSpeech(`Không đủ số lượng! Vui lòng giảm số lượng.`)
            }

        }
        // handleOrderAdd1()

    })

    //-------------------------
    const payment = useCallback(({ detail: { quantity } }) => {

        const item2 = JSON.parse(item);
        if (quantity && item2) {
            const check = handleOrderAdd2(quantity, item2)

            if (check) {
                navigate('/payment')
                setShowAdress(true)

                if (user?.address) {
                    textToSpeech('Quý khách Vui lòng xem lại thông tin giao hàng')
                } else {
                    textToSpeech('Quý khách Vui lòng cập nhật thông tin giao hàng')
                }
            } else {
                textToSpeech(`Không đủ số lượng! Vui lòng giảm số lượng.`)
            }

        }

    })
    const itemBuyNow = localStorage.getItem('itemBuyNow');

    const addName = () => {

        handleOnChangeDetail('name', getSubstringAfterFirstSpace(text, 1))

    }
    const addSdt = () => {

        handleOnChangeDetail('phone', getSubstringAfterFirstSpace(text, 3))

    }
    const addTinh = () => {

        handleOnChangeDetail('tinh', getSubstringAfterFirstSpace(text, 1))

    }
    const addHuyen = () => {

        handleOnChangeDetail('huyen', getSubstringAfterFirstSpace(text, 1))

    }
    const addXa = () => {

        handleOnChangeDetail('xa', getSubstringAfterFirstSpace(text, 1))

    }
    const addDetail = () => {

        handleOnChangeDetail('detailAddress', getSubstringAfterFirstSpace(text, 2))
    }

    const getSubstringAfterFirstSpace1 = (str) => {
        const firstSpaceIndex = str.indexOf(' ');
        if (firstSpaceIndex !== -1) {
            return str.substring(firstSpaceIndex + 1);
        } else {
            return '';
        }
    };
    const getSubstringAfterFirstSpace = (str, spaceIndex) => {
        // Tìm vị trí của dấu cách thứ spaceIndex
        let currentIndex = 0;
        let currentSpaceIndex = -1;
        while (currentIndex < str.length && spaceIndex > 0) {
            if (str[currentIndex] === ' ') {
                spaceIndex--;
                currentSpaceIndex = currentIndex;
            }
            currentIndex++;
        }

        if (spaceIndex === 0 && currentSpaceIndex !== -1 && currentSpaceIndex < str.length - 1) {
            return str.substring(currentSpaceIndex + 1);
        } else {
            return '';
        }
    };

    const addConfirm = () => {
        const { name, phone, tinh, huyen, xa, detailAddress } = stateUserDetail

        if (name && phone && tinh && huyen && xa && detailAddress) {
            textToSpeech('Cập nhật thành công')
            handleOk()
        } else {
            textToSpeech('Vui lòng cập nhật đầy đủ thông tin')

        }
    }
    //-----------------order-----------------------------------------

    const mutationAddOrder = useMutationHook(
        (data) => {
            const {
                token,
                ...rests } = data
            const res = OrderService.createOrder(
                { ...rests }, token)
            return res
        },
    )
    const { data: dataOrder, isPending: isPendingOrder, isSuccess, isError } = mutationAddOrder

    const orderNow = () => {
        console.log('bodyyy', {
            token: user?.access_token,
            orderItems: order?.orderItemsSlected,
            fullName: user?.name,
            address: user?.address,
            phone: user?.phone,
            detailAddress: user?.detailAddress,

            paymentMethod: 'later_money',
            itemsPrice: priceMemo,
            shippingPrice: diliveryPriceMemo,
            totalPrice: totalPriceMemo,
            user: user?.id
        });
        mutationAddOrder.mutate(
            {
                token: user?.access_token,
                orderItems: order?.orderItemsSlected,
                fullName: user?.name,
                address: user?.address,
                phone: user?.phone,

                paymentMethod: 'later_money',
                itemsPrice: priceMemo,
                shippingPrice: diliveryPriceMemo,
                totalPrice: totalPriceMemo,
                user: user?.id,
                note: '',
                email: user?.email
            }, {
            onSuccess: () => {

                if (isPendingOrder === false) {
                    textToSpeech('Đặt hàng thành công, xin cảm ơn')

                    const arrayOrdered = []
                    order?.orderItemsSlected?.forEach(element => {
                        arrayOrdered.push(element.product)
                    });

                    dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }))

                    message.success('Đặt hàng thành công')

                    navigate('/orderSuccess',)
                }
            }
        })

    }
    const updateAdd = () => {
        setShowAdress(true)
    }
    const COMMANDS = {
        OPEN_CART: 'open-cart',
        CLOSE_CART: 'close-cart',
        SEARCH: 'search',
        ADD_CART: 'add-item',
        PAYMENT: 'add-buy',
        ADD_NAME: 'add-name',
        ADD_SDT: 'add-sdt',
        ADD_TINH: 'add-tinh',
        ADD_HUYEN: 'add-huyen',
        ADD_DETAIL: 'add-detail',
        ADD_XA: 'add-xa',
        ADD_CONFIRM: 'confirm-address',
        ORDER: 'order',
        UPDATE_ADDRESS: 'update-address'

    }
    useEffect(() => {
        window.addEventListener(COMMANDS.OPEN_CART, openCart)
        window.addEventListener(COMMANDS.CLOSE_CART, closeCart)
        window.addEventListener(COMMANDS.SEARCH, searchAlan)
        window.addEventListener(COMMANDS.ADD_CART, addCart)

        window.addEventListener(COMMANDS.PAYMENT, payment)
        window.addEventListener(COMMANDS.ADD_NAME, addName)

        window.addEventListener(COMMANDS.ADD_SDT, addSdt)
        window.addEventListener(COMMANDS.ADD_TINH, addTinh)
        window.addEventListener(COMMANDS.ADD_HUYEN, addHuyen)
        window.addEventListener(COMMANDS.ADD_DETAIL, addDetail)
        window.addEventListener(COMMANDS.ADD_XA, addXa)

        window.addEventListener(COMMANDS.ADD_CONFIRM, addConfirm)

        window.addEventListener(COMMANDS.ORDER, orderNow)

        window.addEventListener(COMMANDS.UPDATE_ADDRESS, updateAdd)



        return () => {
            window.removeEventListener(COMMANDS.OPEN_CART, openCart)
            window.removeEventListener(COMMANDS.CLOSE_CART, closeCart)
            window.removeEventListener(COMMANDS.SEARCH, searchAlan)
            window.removeEventListener(COMMANDS.ADD_CART, addCart)

            window.removeEventListener(COMMANDS.PAYMENT, payment)
            window.removeEventListener(COMMANDS.ADD_NAME, addName)

            window.removeEventListener(COMMANDS.ADD_SDT, addSdt)
            window.removeEventListener(COMMANDS.ADD_TINH, addTinh)
            window.removeEventListener(COMMANDS.ADD_HUYEN, addHuyen)
            window.removeEventListener(COMMANDS.ADD_DETAIL, addDetail)
            window.removeEventListener(COMMANDS.ADD_XA, addXa)

            window.removeEventListener(COMMANDS.ADD_CONFIRM, addConfirm)

            window.removeEventListener(COMMANDS.ORDER, orderNow)

            window.removeEventListener(COMMANDS.UPDATE_ADDRESS, updateAdd)



        }
    }, [openCart, closeCart, searchAlan, addCart, item])

    //----------------------------------------------=============================================================
    useEffect(() => {
        if (showAdress) {
            setStateUserdetail({

                name: user?.name,
                address: user?.address,
                phone: user?.phone,
                detailAddress: user?.detailAddress,
                tinh: user?.tinh,
                huyen: user?.huyen,
                xa: user?.xa
            })
        }
        setText('')
    }, [showAdress])
    const onFinishUpdate = () => {
        setShowAdress(false)
    }
    const onFinishFailed = () => {

    }
    const mutationUpdate = useMutationHook(
        (data) => {
            const { id,
                token,
                ...rests } = data
            const res = UserService.updateUser(
                id,

                { ...rests }, token,)

            return res
        },
    )
    const handleOk = () => {
        const { name, phone, tinh, huyen, xa, detailAddress } = stateUserDetail
        if (name && phone) {
            mutationUpdate.mutate({ id: user.id, token: user.access_token, ...stateUserDetail }, {
                onSuccess: () => {
                    dispatch(updateUser({ id: user.id, token: user.access_token, ...stateUserDetail }))
                    setShowAdress(false)
                }
            });
        }
    }
    const handleCancleUpdate = () => {
        setShowAdress(false)

    }

    const handleOnChangeDetail = (key, value) => {
        setStateUserdetail({
            ...stateUserDetail,
            [key]: value
        })
        if ((key === 'tinh' || key === 'huyen' || key === 'xa' || key === 'ten' || key === 'phone' || key === 'detailAddress' || key === 'name') && value != null) {
            textToSpeech(`Ghi nhận`)

        }
    }
    useEffect(() => {
        form1.setFieldsValue(stateUserDetail)
    }, [form1, stateUserDetail])
    // const handleOnChangeDetail = (e) => {
    //     setStateUserdetail({
    //         ...stateUserDetail,
    //         [e.target.name]: e.target.value
    //     })
    // }
    // const addDetail = () => {
    //     console.log('addName ', getSubstringAfterFirstSpace(text));
    //     setStateUserdetail(prevState => ({
    //         ...prevState, // Sao chép các giá trị từ stateUserDetail
    //         detailAddress: getSubstringAfterFirstSpace(text, 2) // Chỉ cập nhật trường name
    //     }));
    // }
    const priceMemo = useMemo(() => {
        const result = order?.orderItemsSlected?.reduce((total, cur) => {
            return total + ((cur.price * cur.amount))
        }, 0)
        return result
    }, [order])

    const priceDiscountMemo = useMemo(() => {
        if (!order || !order.orderItemsSlected) {
            return 0;
        }

        return order.orderItemsSlected.reduce((totalDiscount, item) => {
            // Kiểm tra xem trường discount có tồn tại không
            if (item.discount === undefined || item.discount === null) {
                return totalDiscount; // Bỏ qua nếu không có giảm giá
            }

            const totalItemPrice = item.price * item.amount;
            const discountAmount = (totalItemPrice * item.discount) / 100;
            return totalDiscount + discountAmount;
        }, 0);
    }, [order])
    const diliveryPriceMemo = useMemo(() => {
        if (priceMemo >= 200000 && priceMemo < 500000) {
            return 10000
        } else if (priceMemo >= 500000 || order?.orderItemsSlected?.length === 0) {
            return 0
        } else {
            return 20000
        }
    }, [priceMemo])
    const totalPriceMemo = useMemo(() => {
        return Number(priceMemo) - Number(priceDiscountMemo) + Number(diliveryPriceMemo)
    }, [priceMemo, priceDiscountMemo, diliveryPriceMemo])
    return (
        <div>
            <button
                className={cx({ active1: isActive }, 'icon', 'isActive')}
                onClick={handleOnRecord}
                style={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)', cursor: 'pointer', border: 'none', backgroundColor: 'transparent', padding: '20px', zIndex: '99999', position: 'relative' }}
            >
                <FontAwesomeIcon style={{ fontSize: '40px', color: '#5925f0' }} icon={faMicrophone} />
            </button>
            <div style={{ marginTop: '15px' }}>
                <p style={{ fontSize: '18px' }}>{text}</p>
            </div>
            {/* <ModalComponent
                open={true}
                onOk={handleOk}
                onCancel={handleCancleUpdate}
            >
                <button
                    className={cx({ active: isActive }, 'icon')}
                    onClick={handleOnRecord}
                    style={{ cursor: 'pointer', border: 'none', backgroundColor: 'transparent', padding: '20px', zIndex: '99999', position: 'relative' }}
                >
                    <FontAwesomeIcon style={{ fontSize: '40px', color: 'blue' }} icon={faMicrophone} />
                </button>
                <div>
                    <p>{text}</p>
                </div>

            </ModalComponent> */}
            < ModalComponent title="Cập nhật thông tin giao hàng"

                open={showAdress}
                onOk={handleOk}
                onCancel={handleCancleUpdate}
                footer={null}
            >

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
                    onFinishFailed={onFinishFailed}
                    form={form1}

                >
                    <Form.Item
                        label="Tên người dùng"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập tên người dùng!',
                            },
                        ]}
                    >
                        <Input value={stateUserDetail.name} onChange={handleOnChangeDetail} name="name" />
                    </Form.Item>


                    {/* <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập email!',
                                    },
                                ]}
                            >
                                <Input value={stateUserDetail.email} onChange={handleOnChangeDetail} name="email" />

                            </Form.Item> */}
                    <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập số điện thoại!',
                            },
                        ]}
                    >
                        <Input value={stateUserDetail.phone} onChange={handleOnChangeDetail} name="phone" />

                    </Form.Item>
                    <Form.Item
                        label="Tỉnh/Thành Phố"
                        name="tinh"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập tỉnh',
                            },
                        ]}
                    >
                        <Input value={stateUserDetail.tinh} onChange={handleOnChangeDetail} name="tinh" />

                    </Form.Item>
                    <Form.Item
                        label="Quận/Huyện"
                        name="huyen"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập huyện/thành phố',
                            },
                        ]}
                    >
                        <Input value={stateUserDetail.huyen} onChange={handleOnChangeDetail} name="huyen" />

                    </Form.Item>
                    <Form.Item
                        label="Xã/Phường"
                        name="xa"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập xã/phường',
                            },
                        ]}
                    >
                        <Input value={stateUserDetail.xa} onChange={handleOnChangeDetail} name="xa" />

                    </Form.Item>
                    <Form.Item
                        label="Địa chỉ (Đường/Ấp/Sô Nhà..)"
                        name="detailAddress"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập địa chỉ cụ thể',
                            },
                        ]}
                    >
                        <Input value={stateUserDetail.detailAddress} onChange={handleOnChangeDetail} name="detailAddress" />

                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button btnBuy type="primary" htmlType="submit">
                            Cập nhật
                        </Button>
                    </Form.Item>
                </Form>


                <div style={{ width: '100%', alignItems: 'center', textAlign: 'center', }}>
                    <button
                        className={cx({ active1: isActive }, 'icon', 'isActive')}
                        onClick={handleOnRecord}
                        style={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)', cursor: 'pointer', border: 'none', backgroundColor: 'transparent', padding: '20px', zIndex: '99999', position: 'relative' }}
                    >
                        <FontAwesomeIcon style={{ fontSize: '40px', color: '#5925f0' }} icon={faMicrophone} />
                    </button>
                    <div style={{ marginTop: '15px' }}>
                        <p style={{ fontSize: '18px' }}>{text}</p>
                    </div>

                </div>



            </ModalComponent>
        </div>
    );
}

export default Translator;
