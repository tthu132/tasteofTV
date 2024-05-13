import { useState, useEffect } from "react";

import DayChart from "~/components/RevenueChart";
import axios from "axios";
import styles from './Chart.module.scss'
import classNames from 'classnames/bind';
const cx = classNames.bind(styles)
const Chart = () => {

    const [revenueData, setRevenueData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchRevenueByDay();
    }, []);

    const fetchRevenueByDay = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3000/api/order/get-chart`)

            const data = await response.data;
            setRevenueData(data);
        } catch (error) {
            console.error("Failed to fetch revenue by day:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-4 my-5 rounded-lg bg-white p-5 shadow-xl">
            <h4 className="mb-6 font-semibold text-gray-800">Doanh Thu Theo Ngày</h4>

            {loading ? (
                <p className="text-center text-gray-500">Đang tải...</p>
            ) : (
                <div className={cx('inner')}>
                    <div className={cx('table')}>
                        <table >
                            <thead >
                                <tr>
                                    <th >
                                        Ngày
                                    </th>
                                    <th >
                                        Doanh Thu
                                    </th>
                                </tr>
                            </thead>
                            <tbody >
                                {revenueData.map(({ _id, totalRevenue }, index) => (
                                    <tr key={index}>
                                        <td >
                                            {_id.day}/{_id.month}/{_id.year}
                                        </td>
                                        <td >
                                            {totalRevenue.toLocaleString()} đ
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 md:ml-12 md:mt-0 md:w-2/3">
                        <DayChart revenueData={revenueData} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chart;