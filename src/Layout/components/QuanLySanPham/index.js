import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import Buttonn from "~/components/Button";
import styles from './QuanLySanPham.module.scss'
import classNames from "classnames/bind";
import Table from "~/components/TableComponent";
import { Checkbox, Form, Input, Modal, Upload, Button, Select, Space } from "antd";
import { useEffect, useRef, useState } from "react";
import { getBase64 } from "~/utils";
import Images from "~/components/Images";
import { useMutationHook } from '~/hooks/useMutationHook';
import * as ProductService from '~/services/ProductService'
import * as ProductCategoryService from '~/services/ProductCatogoryService '
import * as ImageService from '~/services/ImageService'

import * as message from '~/components/Message'
import Loadingg from "~/components/Loading";
import { useQuery } from '@tanstack/react-query'
import DrawerComponent from "~/components/DrawerComponent";
import { useSelector } from "react-redux";
import ModalComponent from "~/components/ModalComponent";
import { Spin } from 'antd'


const cx = classNames.bind(styles)
function QuanLySanPham() {

    const [isTest, setTest] = useState(false)
    const [isTestCato, setTestCato] = useState(false)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [stateProduct, setStateProduct] = useState({
        name: '',
        price: '',
        countInStock: '',
        description: '',
        idProductCategory: '',
        idsImage: [],
        discount: '',
        donvi: ''

    })
    const [stateProductDetail, setStateProductdetail] = useState({
        name: '',
        price: '',
        countInStock: '',
        description: '',
        idProductCategory: '',
        idsImage: [],
        discount: '',
        donvi: ''
    })
    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [form] = Form.useForm();
    const [form1] = Form.useForm();
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
    const [isModalDelete, setIsModalDelete] = useState(false)

    const [editCatogory, setEditCatogory] = useState({
        name: ''
    })
    const [editIndex, setEditIndex] = useState(null);
    const [editedName, setEditedName] = useState('');
    const [category, setCategory] = useState([])
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
                    {/* <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button> */}
                    {/* <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button> */}
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
        // render: (text) =>
        //     searchedColumn === dataIndex ? (
        //         <Highlighter
        //             highlightStyle={{
        //                 backgroundColor: '#ffc069',
        //                 padding: 0,
        //             }}
        //             searchWords={[searchText]}
        //             autoEscape
        //             textToHighlight={text ? text.toString() : ''}
        //         />
        //     ) : (
        //         text
        //     ),
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

    const mutationUpdateCato = useMutationHook(
        (data) => {
            const { id,
                token,
                ...rests } = data
            const res = ProductCategoryService.updateProductCatogory(
                id,
                token,
                { ...rests })

            return res
        },
    )
    const mutationDeleteImage = useMutationHook(
        (data) => {
            const { id,
                token,
            } = data

            const res = ImageService.deleteImage(
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
    const fetchProductCatogoryAll = async () => {

        const res = await ProductCategoryService.getAllProductCatogory()

        return res
    }

    const [imageQQ, setImageQQ] = useState()

    const fetchDetailProduct = async () => {
        const res = await ProductService.getDetailsProduct(rowSelected);
        if (res.data) {
            setStateProductdetail({
                name: res.data.name,
                price: res.data.price,
                countInStock: res.data.countInStock,
                description: res.data.description,
                idProductCategory: res.data.idProductCategory,
                idsImage: res.data.idsImage || [],
                discount: res.data.discount,
                donvi: res.data.donvi
                // Thiết lập mặc định là một mảng trống nếu idsImage không tồn tại
            });

            if (res.data.idsImage) { // Kiểm tra xem idsImage có tồn tại không trước khi thực hiện map
                const imageRequests = res.data.idsImage.map(id => ImageService.getDetailsImage(id));
                const imageResponses = await Promise.all(imageRequests);

                // Lấy danh sách các ảnh từ các response
                const images = imageResponses.map(response => response.data);

                if (images) {
                    setImageQQ(images.map(image => ({
                        uid: image._id,
                        url: image.image,
                        name: ''
                    })));
                }
            }
        }

        setIsLoadingUpdate(false);
        return res;
    };


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

    const { data: dataDeletedImage, isSuccess: isSuccessDeletedImage, isError: isErrorDeletedImage, isPending: isLoadingDeletedImage } = mutationDeleteImage


    const queryProduct = useQuery({ queryKey: ['products'], queryFn: fetchProductAll, retry: 3, retryDelay: 1000 })

    const { isPending: isLoadingProduct, data: product } = queryProduct


    const queryProductCatogory = useQuery({ queryKey: ['productsCatogory'], queryFn: fetchProductCatogoryAll, retry: 3, retryDelay: 1000 })

    const { isPending: isLoadingProductCatogory, data: productsCatogory } = queryProductCatogory
    const { data: dataUpdatedCato, isSuccess: isSuccessUpdatedCato, isError: isErrorUpdatedCato, isPending: isLoadingUpdatedCato } = mutationUpdateCato


    const mutationCatogory = useMutationHook(
        (data) => {
            ProductCategoryService.createProductCatogory(data)
        }
    )
    const { dataCatogory, isSuccess: isSuccessCatogory, isError: isErrorCatogory, isPending: isLoadingCreateCato } = mutationCatogory


    useEffect(() => {
        if (product?.data) {

            setTest(true);
        }
    }, [product?.data]);

    useEffect(() => {
        if (productsCatogory) {

            setTestCato(true);
            setCategory(productsCatogory.data)
        }

    }, [productsCatogory]);

    const columns = [
        {
            title: 'Tên',
            dataIndex: 'name',
            render: (text) => <a>{text}</a>,
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('name')
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            sorter: (a, b) => a.price - b.price
        },
        {
            title: 'Loại',
            dataIndex: 'type',
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
        setStateProductdetail({
            name: '',
            price: '',
            countInStock: '',
            description: '',
            idProductCategory: '',
            idsImage: '',
            discount: '',
            donvi: ''
        })

        form.resetFields()
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {

        setIsModalOpen(false);
        setStateProduct({
            name: '',
            price: '',
            countInStock: '',
            description: '',
            idProductCategory: '',
            idsImage: [],
            discount: '',
            donvi: ''

        })

        form.resetFields()

    };


    const mutationImage = useMutationHook(
        (data) => {
            return ImageService.createImage(data); // Chú ý việc trả về promise từ hàm createImage
        },

    );

    const { mutate: addTodo, data: dataImage, isSuccess: isSuccessImage, isError: isErrorImage, isPending: isPendingImage } = mutationImage
    const onFinish = async () => {

        mutationImage.mutate(image, {
            onSuccess: (dataImage) => {

                if (dataImage) {
                    const mangId = dataImage.map(item => item.data._id);
                    setStateProduct({
                        ...stateProduct,
                        idsImage: mangId
                    });

                    if (mangId) {
                        mutation.mutate({ ...stateProduct, idsImage: mangId }, {
                            onSettled: () => {
                                queryProduct.refetch();
                            },
                        }, {
                            onSuccess: () => {
                                message.success()
                                setIsModalOpen(false)
                            }
                        });
                    }
                }
            },
            onError: (error) => {
                console.error('Error during mutation:', error);
            }
        });
    }

    useEffect(() => {
        if (isSuccess) {

            message.success()
            handleCancel()
            setIsModalOpen(false);

        } else if (isError) {
            message.error()
        }
    }, [isSuccess])


    const onFinishUpdate = () => {
        console.log('image update ', imageUpdate);

        console.log('idddd 0', stateProductDetail);

        if (imageUpdate) {
            mutationImage.mutate(imageUpdate, {
                onSuccess: (dataImage) => {
                    if (dataImage && dataImage.length > 0) {
                        console.log('image update steate dataImag ', dataImage);

                        const mangId = dataImage.map(item => item.data._id);
                        setStateProductdetail(prevState => ({
                            ...prevState,
                            idsImage: [...prevState.idsImage, ...mangId] // Kết hợp idsImage cũ và mangId
                        }));

                        console.log('image update state update ', stateProductDetail);

                        if (mangId) {
                            console.log('idddd ', stateProductDetail);
                            mutationUpdate.mutate({ id: rowSelected, token: user.access_token, ...stateProductDetail, idsImage: [...stateProductDetail.idsImage, ...mangId] }, {
                                onSettled: () => {
                                    queryProduct.refetch()
                                }
                            });
                        }
                    }
                },
                onError: (error) => {
                    console.error('Error during mutation:', error);
                }
            });
        } else {
            mutationUpdate.mutate({ id: rowSelected, token: user.access_token, ...stateProductDetail }, {
                onSettled: () => {
                    queryProduct.refetch()
                }
            }, {
                onSuccess: () => {

                }
            });
        }
    };

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
    const [imageUpdate, setImageUpdate] = useState()
    const handleUploadListImageUpdate = async ({ fileList }) => {
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
        setImageUpdate(previews)
        console.log("image update 1", previews);
        console.log("image update 2", imageUpdate);



    }
    const handleCancelDelete = () => {
        setIsModalDelete(false)

    }
    const handleDeleteProduct = () => {
        mutationDelete.mutate({ id: rowSelected, token: user.access_token }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })

    }
    const handleDetailsProduct = () => {
        // setIsLoadingUpdate(true)
        if (rowSelected) {
            fetchDetailProduct()
            setIsLoadingUpdate(true)
        }
        setIsOpenDrawer(true)
    }
    //---------------------
    const inputRef = useRef();

    const handleChangeEditedName = (e) => {
        setEditedName(e.target.value);
        setEditCatogory({
            name: e.target.value
        })
    };

    const handleSaveEditedName = () => {

        let updatedProducts = category.map(item => {
            if (item._id === editIndex) {
                return { ...item, name: editedName }
            }

            return item
        })

        setCategory([...updatedProducts])

        const newData = updatedProducts[editIndex]

        mutationUpdateCato.mutate({ token: user.access_token, id: editIndex, ...editCatogory }, {
            onSettled: () => {
                queryProductCatogory.refetch()
            }
        })

        setEditIndex(null);
        setEditedName({
            name: ''
        })
    };

    const handleOpenEditModal = (id, index) => {

        setEditIndex(id);
        setEditedName(productsCatogory.data[index].name);
    }

    const [namecatogory, setNameCatogory] = useState({
        name: ''
    })

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);
    useEffect(() => {
        if (isSuccessUpdatedCato) {

            message.success()


        } else if (isErrorUpdatedCato) {
            message.error()
        }

    }, [isSuccessUpdatedCato])

    const inputRef2 = useRef(null);
    const [openCreateCato, setOpenCreateCato] = useState(false)
    const handleOnChangNameCato = (e) => {
        setNameCatogory({
            [e.target.name]: e.target.value
        })

    }
    const handleCreateCatogory = () => {

        mutationCatogory.mutate(namecatogory, {
            onSettled: () => {
                queryProductCatogory.refetch()
            }
        })

        setOpenCreateCato(false)
        setNameCatogory({ name: '' })

    }
    useEffect(() => {
        if (inputRef2.current) {
            inputRef2.current.focus();
        }
    }, [openCreateCato]);

    useEffect(() => {
        if (isSuccessCatogory) {

            message.success()


        } else if (isErrorCatogory) {
            message.error()
        }

    }, [isSuccessCatogory])
    const handleCancelCreateCato = () => {
        setOpenCreateCato(false)
        setNameCatogory({ name: '' })

    }

    //----------
    const [openDeletecato, setOpenDeleteCato] = useState(false)
    const [idDeletecato, setidDeleteCato] = useState(null)

    const mutationDeleteCato = useMutationHook(
        (data) => {
            const { id,
                token,
            } = data

            const res = ProductCategoryService.deleteProductCatogory(
                id,
                token,
            )

            return res
        },
    )
    const { data: dataDeletedCato, isSuccess: isSuccessDeletedCato, isError: isErrorDeletedCato, isPending: isLoadingDeletedCato } = mutationDeleteCato


    const handleDeleteCato = () => {

        mutationDeleteCato.mutate({ id: idDeletecato, token: user.access_token }, {
            onSettled: () => {
                queryProductCatogory.refetch()
                queryProduct.refetch()
            }
        })
        setOpenDeleteCato(false)
        setidDeleteCato(null)

    }

    const handleClickIconDeleteCato = (id) => {
        setOpenDeleteCato(true)
        setidDeleteCato(id);
    }

    useEffect(() => {
        if (isSuccessDeletedCato) {

            message.success()

        } else if (isErrorDeletedCato) {
            message.error()
        }

    }, [isSuccessDeletedCato])

    const handleOnChangeCato = (value) => {
        setStateProduct({
            ...stateProduct,
            idProductCategory: value // Sửa đổi dòng này
        }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })

    }
    useEffect(() => {
        if (rowSelected) {
            fetchDetailProduct(rowSelected)

        }
    }, [rowSelected, isOpenDrawer, isSuccessDeletedCato])


    const onRemoveFile = (e) => {

        mutationDeleteImage.mutate({ id: e.uid, token: user.access_token }, {
            onSettled: () => {
                // Xóa ảnh thành công, cập nhật lại imageQQ
                const updatedImageQQ = imageQQ.filter(image => image.uid !== e.uid);
                setImageQQ(updatedImageQQ);

                // Refetch dữ liệu nếu cần
                queryProductCatogory.refetch();
                queryProduct.refetch();
            }
        });

    }


    const onCloseDetail = () => {
        console.log('cloooo');
        setIsOpenDrawer(false)
        setStateProductdetail({
            name: '',
            price: '',
            countInStock: '',
            description: '',
            idProductCategory: '',
            idsImage: '',
            discount: '',
            donvi: ''

        })
        form1.resetFields()

    }
    return (
        <div className={cx('wrapper')}>

            <h4 className={cx('title')}>Quản lý loại sản phẩm</h4>

            <div className={cx('catogory')}>

                <Buttonn onClick={() => setOpenCreateCato(true)} Plus className={cx('wrapper-icon')}><PlusOutlined className={cx('icon-plus')} /></Buttonn>
                <ModalComponent
                    open={openCreateCato}
                    onCancel={handleCancelCreateCato}
                    onOk={handleCreateCatogory}
                    title="Tạo loại sản phẩm"
                >
                    <input
                        ref={inputRef2}

                        style={{ padding: '10px', borderRadius: '5px' }}
                        autoFocus
                        value={namecatogory.name}
                        onChange={handleOnChangNameCato}
                        name="name"
                    />
                </ModalComponent>

                {
                    productsCatogory &&
                    <ul className={cx('catogory')}>

                        <Loadingg isLoading={isLoadingUpdatedCato || isLoadingCreateCato || isLoadingDeletedCato}>
                            {
                                productsCatogory.data.map((item, index) => (
                                    <li key={index} className={cx('catogory-item')}>

                                        <ModalComponent
                                            onOk={handleSaveEditedName}
                                            title="Chỉnh sửa loại sản phẩm"
                                            open={editIndex === item._id}
                                            onCancel={() => setEditIndex(null)}>

                                            <input
                                                ref={inputRef}
                                                style={{ padding: '10px', borderRadius: '5px' }}
                                                autoFocus
                                                value={editedName}
                                                onChange={handleChangeEditedName}
                                            />
                                        </ModalComponent>


                                        <p>{item.name}</p>
                                        <div>
                                            <EditOutlined style={{ fontSize: '20px', cursor: 'pointer', marginRight: 20 }} onClick={() => (handleOpenEditModal(item._id, index), setEditedName(item.name), setEditCatogory(item.name))} />
                                            <DeleteOutlined style={{ fontSize: '20px', cursor: 'pointer' }} onClick={() => handleClickIconDeleteCato(item._id)} />

                                        </div>



                                    </li>
                                ))
                            }
                        </Loadingg>
                        <ModalComponent
                            onOk={handleDeleteCato}

                            title="Xóa loại sản phẩm"
                            open={openDeletecato}
                            onCancel={() => setOpenDeleteCato(false)}
                        >
                            <p>Bạn có chắc muốn xóa loại sản phẩm này?</p>

                        </ModalComponent>
                    </ul>
                }

            </div>
            <h4 className={cx('title')}>Quản lý sản phẩm</h4>

            <h4>Tạo sản phẩm mới</h4>
            <Buttonn onClick={() => setIsModalOpen(true)} Plus className={cx('wrapper-icon')}><PlusOutlined className={cx('icon-plus')} /></Buttonn>
            <h4>Toàn bộ sản phẩm</h4>

            {isTest &&
                <Table
                    rowClassName={cx('row')}
                    isLoading={isLoadingProduct}
                    columns={columns}
                    dataa={product.data.map((item) => {
                        return { ...item, key: item._id }
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


            < ModalComponent title="Thêm sản phẩm mới"
                open={isModalOpen}
                onOk={handleOk}
                footer={null}
                onCancel={handleCancel} >
                {/* <Loadingg isLoadingg={isLoading}> */}

                {/* </Loadingg> */}

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
                        label="Tên sản phẩm"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập tên sản phẩm!',
                            },
                        ]}
                    >
                        <Input value={stateProduct.name} onChange={handleOnChange} name="name" />
                    </Form.Item>
                    <Form.Item
                        label="Đơn vị tính"
                        name="donvi"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập nhập đơn vị sản phẩm!',
                            },
                        ]}
                    >
                        <Input value={stateProduct.donvi} onChange={handleOnChange} name="donvi" />

                    </Form.Item>


                    <Form.Item
                        label="Giá sản phẩm"
                        name="price"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập giá sản phẩm!',
                            },
                        ]}
                    >
                        <Input value={stateProduct.price} onChange={handleOnChange} name="price" />

                    </Form.Item>
                    <Form.Item
                        label="Giảm giá"
                        name="discount"

                    >
                        <Input value={stateProduct.discount} onChange={handleOnChange} name="discount" />

                    </Form.Item>
                    <Form.Item
                        label="Số lượng sản phẩm"
                        name="countInStock"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập số lượng sản phẩm!',
                            },
                        ]}
                    >
                        <Input value={stateProduct.countInStock} onChange={handleOnChange} name="countInStock" />

                    </Form.Item>
                    <Form.Item
                        label="Mô tả sản phẩm"
                        name="description"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập mô tả sản phẩm!',
                            },
                        ]}
                    >
                        <Input value={stateProduct.description} onChange={handleOnChange} name="description" />

                    </Form.Item>
                    <Form.Item
                        label="Loại sản phẩm"
                        name="idProductCategory"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn loại sản phẩm!',
                            },
                        ]}
                    >
                        <Select placeholder="Select province" name="idProductCategory" value={stateProduct.idProductCategory} onChange={(value) => handleOnChangeCato(value)}>
                            {
                                productsCatogory && productsCatogory.data && productsCatogory.data.map((item) => (
                                    <Option
                                        key={item._id}
                                        value={item._id}


                                    >{item.name}</Option>

                                ))
                            }

                        </Select>

                    </Form.Item>


                    <Form.Item
                        label="Hình các ảnh sản phẩm"
                        name="image"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn ảnh cho sản phẩm!',
                            },
                        ]}
                    >
                        <Upload
                            listType="picture"
                            onChange={handleUploadListImage}
                            showUploadList={true}
                            maxCount={5}>
                            <Button >Chọn Ảnh</Button>
                            <p>{stateProduct.idsImage}</p>

                        </Upload>


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

            </ModalComponent>
            <DrawerComponent
                title="Chi tiết sản phẩm"
                isOpen={isOpenDrawer}
                onClose={onCloseDetail}
                width="80%"
            >
                <Loadingg isLoading={isLoadingUpdate}>
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
                            label="Tên sản phẩm"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên sản phẩm!',
                                },
                            ]}
                        >
                            <Input value={stateProductDetail.name} onChange={handleOnChangeDetail} name="name" />
                        </Form.Item>
                        <Form.Item
                            label="Đơn vị tính"
                            name="donvi"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập đơn vị sản phẩm!',
                                },
                            ]}
                        >
                            <Input value={stateProductDetail.donvi} onChange={handleOnChangeDetail} name="donvi" />

                        </Form.Item>

                        <Form.Item
                            label="Giá sản phẩm"
                            name="price"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập giá sản phẩm!',
                                },
                            ]}
                        >
                            <Input value={stateProductDetail.price} onChange={handleOnChangeDetail} name="price" />

                        </Form.Item>

                        <Form.Item
                            label="Giảm giá"
                            name="discount"

                        >
                            <Input value={stateProductDetail.discount} onChange={handleOnChangeDetail} name="discount" />

                        </Form.Item>
                        <Form.Item
                            label="Số lượng sản phẩm"
                            name="countInStock"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số lượng sản phẩm!',
                                },
                            ]}
                        >
                            <Input value={stateProductDetail.countInStock} onChange={handleOnChangeDetail} name="countInStock" />

                        </Form.Item>
                        <Form.Item
                            label="Mô tả sản phẩm"
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mô tả sản phẩm!',
                                },
                            ]}
                        >
                            <Input value={stateProductDetail.description} onChange={handleOnChangeDetail} name="description" />

                        </Form.Item>
                        <Form.Item
                            label="Loại sản phẩm"
                            name="idProductCategory"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mô tả sản phẩm!',
                                },
                            ]}
                        >
                            <Select placeholder="Select province" name="idProductCategory" value={stateProductDetail.idProductCategory} onChange={(value) => handleOnChangeCatoDetail(value)}>
                                {
                                    productsCatogory && productsCatogory.data && productsCatogory.data.map((item) => (
                                        <Option
                                            key={item._id}
                                            value={item._id}


                                        >{item.name}</Option>

                                    ))
                                }

                            </Select>

                        </Form.Item>

                        <Form.Item
                            label="Các hình ảnh sản phẩm"
                            name="image2"

                        >
                            <Upload
                                listType="picture"
                                onChange={handleUploadListImage}
                                showUploadList={true}
                                maxCount={5}
                                fileList={imageQQ}
                                onRemove={e => onRemoveFile(e)}
                            >

                            </Upload>
                        </Form.Item>

                        <Form.Item

                            name="idsImage"
                            label="Thêm ảnh"


                        >
                            <Upload
                                listType="picture"
                                onChange={handleUploadListImageUpdate}
                                showUploadList={true}
                                maxCount={5}>
                                <Button >Chọn Ảnh</Button>

                            </Upload>

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

export default QuanLySanPham;