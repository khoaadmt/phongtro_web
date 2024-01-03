import React, { useState, useEffect, useRef } from "react";
import { apiGetDashboard, apiGetPostsLimit } from "../../services/post";
import icons from "../../ultils/icons";
import { ChartLine } from "../../components";
import moment from "moment";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import styled from "styled-components";

const PrintOnlyContent = styled.div`
    @media print {
        display: block !important;
    }

    @media screen {
        display: none !important;
    }
    h1 {
        font-size: 28px;
        text-align: center;
        padding: 10px 0 30px 5px;
    }
    h3 {
        font-size: 24px;
        padding: 10px 0 10px 5px;
    }
`;
const { HiUserGroup, MdPersonAddAlt1, MdOutlinePostAdd } = icons;

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [isMonth, setIsMonth] = useState(false);
    const [newPosts, setNewPosts] = useState(null);
    const [customTime, setCustomTime] = useState({
        from: "",
        to: "",
    });
    const fetchDashboard = async (params) => {
        const response = await Promise.all([
            apiGetDashboard(params),
            apiGetPostsLimit({ limitPost: 5, order: ["createdAt", "DESC"] }),
        ]);
        console.log(response);
        if (response[0].data.success) setData(response[0].data.chartData);
        if (response[1].data.err === 0) setNewPosts(response[1].data.response.rows);
    };
    useEffect(() => {
        const type = isMonth ? "month" : "day";
        const params = { type };
        if (customTime.from) params.from = customTime.from;
        if (customTime.to) params.to = customTime.to;
        fetchDashboard(params);
    }, [isMonth, customTime]);
    const handleCustomTime = () => {
        setCustomTime({ from: "", to: "" });
    };
    const [selectedChart, setSelectedChart] = useState("ctpt");

    const componentsPDF = useRef();
    const generatePDF = useReactToPrint({
        content: () => componentsPDF.current,
        documentTitle: "Data Report",
    });
    const getCurrentDate = () => {
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; // Tháng bắt đầu từ 0
        const year = currentDate.getFullYear();

        return `${day}/${month}/${year}`;
    };
    return (
        <div className="relative bg-white p-4 h-full">
            <div className="flex items-center justify-between border-b border-gray-800">
                <h3 className="font-bold text-[30px] pb-4 ">Tổng quan</h3>
            </div>
            <div className="py-8">
                <div ref={componentsPDF} style={{ width: "100%" }}>
                    <PrintOnlyContent>
                        <h1>Phòng Trọ 123.com</h1>
                        <h3>Ngày {getCurrentDate()}</h3>
                        <h3>Phone: 0366516834 </h3>
                    </PrintOnlyContent>
                    <div className="flex gap-4 items-center">
                        <div className="flex-1 border bg-white rounded-md shadow-md flex p-4 items-center justify-between">
                            <span className="flex flex-col">
                                <span className="text-[24px] text-main">{data?.views || 0}</span>
                                <span className="text-sm text-gray-500">SỐ LƯỢT TRUY CẬP</span>
                            </span>
                            <HiUserGroup size={30} />
                        </div>
                        <div className="flex-1 border bg-white rounded-md shadow-md flex p-4 items-center justify-between">
                            <span className="flex flex-col">
                                <span className="text-[24px] text-main">{data?.postCount || 0}</span>
                                <span className="text-sm text-gray-500">SÔ BÀI ĐĂNG</span>
                            </span>
                            <MdOutlinePostAdd size={30} />
                        </div>
                        <div className="flex-1 border bg-white rounded-md shadow-md flex p-4 items-center justify-between">
                            <span className="flex flex-col">
                                <span className="text-[24px] text-main">{data?.userCount || 0}</span>
                                <span className="text-sm text-gray-500">THÀNH VIÊN</span>
                            </span>
                            <MdPersonAddAlt1 size={30} />
                        </div>
                    </div>
                    <div className="mt-5 ">
                        <div className="mt-8 rounded-md shadow-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold">Chọn biểu đồ:</h4>
                                <select
                                    value={selectedChart}
                                    onChange={(e) => setSelectedChart(e.target.value)}
                                    className="border rounded-md p-2">
                                    <option value="ctpt">Phòng trọ</option>
                                    <option value="ctmb">Mặt bằng</option>
                                    <option value="ctch">Căn hộ</option>
                                    <option value="nct">Nhà cho thuê</option>
                                </select>
                            </div>
                            {selectedChart === "ctpt" && (
                                <div className="flex-1 h-full shadow-lg rounded-md flex flex-col p-4">
                                    <h4 className="font-bold">Số bài đăng cho thuê phòng trọ</h4>
                                    <ChartLine data={data?.ctpt} isMonth={isMonth} customTime={customTime} />
                                </div>
                            )}
                            {selectedChart === "ctmb" && (
                                <div className="flex-1 h-full shadow-lg rounded-md flex flex-col p-4">
                                    <h4 className="font-bold">Số bài đăng cho thuê mặt bằng</h4>
                                    <ChartLine data={data?.ctmb} isMonth={isMonth} customTime={customTime} />
                                </div>
                            )}
                            {selectedChart === "ctch" && (
                                <div className="flex-1 h-full shadow-lg rounded-md flex flex-col p-4">
                                    <h4 className="font-bold">Số bài đăng cho thuê căn hộ</h4>
                                    <ChartLine data={data?.ctch} isMonth={isMonth} customTime={customTime} />
                                </div>
                            )}
                            {selectedChart === "nct" && (
                                <div className="flex-1 h-full shadow-lg rounded-md flex flex-col p-4">
                                    <h4 className="font-bold">Số bài đăng nhà cho thuê</h4>
                                    <ChartLine data={data?.nct} isMonth={isMonth} customTime={customTime} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <button onClick={generatePDF} className="mt-4 p-2 bg-blue-500 text-white rounded-md cursor-pointer">
                    In báo cáo
                </button>
                <div className="mt-8 rounded-md shadow-lg p-4">
                    <h4 className="font-bold">Các bài đăng mới nhất</h4>
                    <table className="table-auto w-full mt-4">
                        <thead>
                            <tr className="border-b border-t">
                                <td className="p-2 font-bold">STT</td>
                                <td className="p-2 font-bold">Tựa đề</td>
                                <td className="p-2 font-bold">Thể loại</td>
                                <td className="p-2 font-bold">Người đăng</td>
                                <td className="p-2 font-bold">Liên hệ</td>
                                <td className="p-2 font-bold">Ngày đăng</td>
                            </tr>
                        </thead>
                        <tbody>
                            {newPosts?.map((item, index) => (
                                <tr key={item.id}>
                                    <td className={`p-2 ${index % 2 === 0 ? "" : "bg-gray-100"} m-auto`}>
                                        {index + 1}
                                    </td>
                                    <td className={`p-2 ${index % 2 === 0 ? "" : "bg-gray-100"} m-auto`}>
                                        {item?.title}
                                    </td>
                                    <td className={`p-2 ${index % 2 === 0 ? "" : "bg-gray-100"} m-auto`}>
                                        {item?.category?.value}
                                    </td>
                                    <td className={`p-2 ${index % 2 === 0 ? "" : "bg-gray-100"} m-auto`}>
                                        {item?.receiverName || item?.user?.name}
                                    </td>
                                    <td className={`p-2 ${index % 2 === 0 ? "" : "bg-gray-100"} m-auto`}>
                                        {item?.receiverPhone || item?.user?.zalo}
                                    </td>
                                    <td className={`p-2 ${index % 2 === 0 ? "" : "bg-gray-100"} m-auto`}>
                                        {moment(item?.createdAt).format("DD/MM/YYYY")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
