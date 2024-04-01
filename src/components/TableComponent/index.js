import styles from './Table.module.scss'
import classNames from 'classnames/bind';
import { useState } from 'react';
import { Radio, Divider, Table } from 'antd'
import Loading from '../Loading';

const cx = classNames.bind(styles)

function TableComponent(props) {

    const { selectionType = 'checkbox', dataa = [], isLoading = false, columns = [], Top, colSpan } = props
    // const { selectionType = 'checkbox', dataa: dataSource = [], isLoading = false, columns = [], handleDelteMany } = props

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name,
        }),
    };


    return (

        <Loading isLoading={isLoading}>
            <div className={cx('table-container')}>


                {
                    Top ? <Table
                        colSpan={colSpan}
                        columns={columns}
                        dataSource={dataa}
                        {...props}
                        pagination={{ pageSize: 5 }}

                        rowClassName={cx('row')}
                    /> : <Table
                        rowSelection={{
                            type: selectionType,
                            ...rowSelection,
                        }}
                        columns={columns}
                        dataSource={dataa}
                        {...props}

                        rowClassName={cx('row')}
                    />
                }
            </div>
        </Loading>
    );
}

export default TableComponent;