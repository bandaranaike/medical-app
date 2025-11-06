import React, {useState, useEffect} from 'react';
import {AxiosError} from 'axios';
import {format, subDays} from 'date-fns';
import axios from "@/lib/axios";
import printService from "@/lib/printService";
import ExportSummaryReport from "@/components/reports/ExportSummaryReport";

interface ServiceCostItem {
    service_id: number;
    service_name: string;
    service_key: string;
    total_bill_amount: number;
    total_system_amount: number;
    item_count: number;
}

interface ReportMeta {
    start_date: string;
    end_date: string;
    total_services: number;
    total_bill_amount: number;
    total_system_amount: number;
}

interface ApiResponse {
    success: boolean;
    data: ServiceCostItem[];
    meta: ReportMeta;
}

const ServiceCostReport = () => {
    const [report, setReport] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState({
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd'),
    });

    const fetchReport = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get<ApiResponse>('/reports/service-costs', {
                params: {
                    start_date: dateRange.startDate,
                    end_date: dateRange.endDate,
                },
            });
            setReport(response.data);
        } catch (err) {
            const error = err as AxiosError;
            setError(
                // @ts-ignore
                error.response?.data?.message ||
                error.message ||
                'Failed to fetch report'
            );
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchReport();
    }, [dateRange]);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setDateRange((prev) => ({...prev, [name]: value}));
    };

    const setQuickRange = (days: number) => {
        const end = new Date();
        const start = subDays(end, days - 1);
        setDateRange({
            startDate: format(start, 'yyyy-MM-dd'),
            endDate: format(end, 'yyyy-MM-dd'),
        });
    };

    if (loading && !report) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="my-6">


            <div className="flex">
                <div className="flex-grow">
                    <h1 className="text-2xl font-bold mb-6">Service Cost Report</h1>
                </div>
                <div className="">
                    <ExportSummaryReport/>
                </div>
            </div>

            {/* Date Range Selector */}
            <div
                className="mb-6 rounded-lg p-4 border">
                <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium mb-1">
                            Start Date
                        </label>
                        <input
                            type="date"
                            name="startDate"
                            value={dateRange.startDate}
                            onChange={handleDateChange}
                            className="w-full p-2 border  rounded-md focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium mb-1">
                            End Date
                        </label>
                        <input
                            type="date"
                            name="endDate"
                            value={dateRange.endDate}
                            onChange={handleDateChange}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setQuickRange(1)}
                        className={`px-3 py-1 rounded-md text-sm ${
                            dateRange.startDate === format(new Date(), 'yyyy-MM-dd')
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800'
                        }`}
                    >
                        Today
                    </button>
                    <button
                        onClick={() => setQuickRange(7)}
                        className={`px-3 py-1 rounded-md text-sm ${
                            dateRange.startDate === format(subDays(new Date(), 6), 'yyyy-MM-dd')
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800'
                        }`}
                    >
                        Last 7 Days
                    </button>
                    <button
                        onClick={() => setQuickRange(30)}
                        className={`px-3 py-1 rounded-md text-sm ${
                            dateRange.startDate === format(subDays(new Date(), 29), 'yyyy-MM-dd')
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800'
                        }`}
                    >
                        Last 30 Days
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div
                    className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md border border-red-200 dark:border-red-800">
                    {error}
                </div>
            )}

            {/* Report Summary */}
            {report && (
                <>
                    <div
                        className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border dark:border-gray-700">
                        <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Summary</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div
                                className="p-3 rounded border">
                                <p className="text-sm">Date Range</p>
                                <p className="font-medium dark:text-white">
                                    {new Date(report.meta.start_date).toLocaleDateString()} -{' '}
                                    {new Date(report.meta.end_date).toLocaleDateString()}
                                </p>
                            </div>
                            <div
                                className="p-3 rounded border">
                                <p className="text-sm">Services</p>
                                <p className="font-medium dark:text-white">{report.meta.total_services}</p>
                            </div>
                            <div
                                className="p-3 rounded border">
                                <p className="text-sm">Total Bill Amount</p>
                                <p className="font-medium text-green-600 dark:text-green-400">
                                    {report.meta.total_bill_amount.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </p>
                            </div>
                            <div
                                className="p-3 rounded border">
                                <p className="text-sm">Total System Amount</p>
                                <p className="font-medium text-blue-600 dark:text-blue-400">
                                    {report.meta.total_system_amount.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Report Table */}
                    <div
                        className="rounded-lg overflow-hidden border">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Service
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Key
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                                        Items
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                                        Bill Amount
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                                        System Amount
                                    </th>
                                </tr>
                                </thead>
                                <tbody
                                    className="divide-y">
                                {report.data.map((item) => (
                                    <tr key={item.service_id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            {item.service_name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {item.service_key}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                            {item.item_count}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                                            {item.total_bill_amount.toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-blue-600 dark:text-blue-400">
                                            {item.total_system_amount.toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ServiceCostReport;