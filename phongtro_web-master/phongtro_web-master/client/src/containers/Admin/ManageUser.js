import React, { useEffect, useState } from "react";
import Pagination from "../Public/Pagination";
import { apiGetUsers, apiGetRoles, apiUpdateUserByAdmin, apiDeleteUser, apiGetUsersHistory } from "../../services/user";
import moment from "moment";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
    TERipple,
    TEModal,
    TEModalDialog,
    TEModalContent,
    TEModalHeader,
    TEModalBody,
    TEModalFooter,
} from "tw-elements-react";

const ManageUser = () => {
    const [users, setUsers] = useState(null);
    const [edit, setEdit] = useState(null);
    const [update, setUpdate] = useState(false);
    const [searchParams] = useSearchParams();
    const [roles, setRoles] = useState(null);
    const [userHistory, setUserHistory] = useState(null);
    const [payload, setPayload] = useState({
        phone: "",
        role: "",
        name: "",
    });

    const fetchUsers = async (params) => {
        const response = await Promise.all([
            apiGetUsers({ ...params, limit: process.env.REACT_APP_LIMIT_ADMIN }),
            apiGetRoles(),
        ]);
        if (response[0].data?.success) setUsers(response[0].data?.users);
        if (response[1].data?.success) setRoles(response[1].data?.roles);
    };
    const fetchUserHistory = async (uid) => {
        try {
            const response = await apiGetUsersHistory(uid);

            if (response.data?.success) {
                setUserHistory(response.data?.userHistory);
            }
        } catch (error) {
            console.error("Error fetching user history:", error.message);
            toast.error("Cannot get user history");
        }
    };

    const handleUpdate = (user) => {
        setEdit(user);
        setPayload({
            phone: user?.phone,
            role: user?.role,
            name: user?.name,
        });
    };
    useEffect(() => {
        let params = [];
        for (let entry of searchParams.entries()) params.push(entry);
        let searchParamsObject = {};
        params?.forEach((i) => {
            if (Object.keys(searchParamsObject)?.some((item) => item === i[0])) {
                searchParamsObject[i[0]] = [...searchParamsObject[i[0]], i[1]];
            } else {
                searchParamsObject = { ...searchParamsObject, [i[0]]: [i[1]] };
            }
        });
        if (!edit) fetchUsers(searchParamsObject);
    }, [edit, update, searchParams]);

    const deleteUser = async (uid) => {
        const response = await apiDeleteUser(uid);
        if (response.data.success) {
            toast.success(response.mes);
            setUpdate(!update);
        } else toast.error(response.mes);
    };
    const handleSubmit = async () => {
        const response = await apiUpdateUserByAdmin(edit.id, payload);
        if (response.data.success) setEdit(null);
    };

    // view actions user
    const [showActionsDetails, setShowActionsDetails] = useState(false);
    const handleShowActionsDetails = (userId) => {
        setShowDetails(false);
        setShowActionsDetails(true);
        fetchUserHistory(userId);
    };
    const UserActionsDetailsModal = () => (
        <div className="py-4">
            <table className="table-auto w-full mt-4">
                <thead>
                    <tr className="border-b border-t">
                        <td className="p-2 font-bold">STT</td>
                        <td className="p-2 font-bold">Tên thành viên</td>

                        <td className="p-2 font-bold">Hoạt động</td>
                        <td className="p-2 font-bold">Chi tiết hoạt động</td>
                        <td className="p-2 font-bold">Thời gian</td>
                    </tr>
                </thead>
                <tbody>
                    {userHistory ? (
                        userHistory.map((item, index) => (
                            <tr key={index}>
                                <td className="p-2">{index + 1}</td>
                                <td>{item.name}</td>
                                <td className="p-2">{item.action}</td>
                                <td className="p-2">{item.detail}</td>
                                <td className="p-2">{item.timestamp}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="p-2 text-center">
                                <span style={{ fontStyle: "italic", fontSize: "20px" }}>No data</span>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <button
                type="button"
                onClick={() => {
                    setShowActionsDetails(false);
                    setShowDetails(true);
                    setUserHistory(null);
                }}
                style={{ marginTop: "25px" }}
                className="py-2 px-4 bg-red-600 rounded-md text-white font-semibold flex items-center justify-center gap-2">
                <span>Close</span>
            </button>
        </div>
    );

    // manager user
    const [showModal, setShowModal] = useState(false);
    const [userId, setuserId] = useState(null);
    const handleShowModal = (userId) => {
        setShowModal(true);
        setuserId(userId);
    };
    const handleDeleteUser = () => {
        deleteUser(userId);
        setShowModal(false);
    };
    const [showDetails, setShowDetails] = useState(true);
    const UserDetailsModal = () => (
        <div className="py-4">
            <div>
                {/* <!-- Modal --> */}
                <TEModal show={showModal} setShow={setShowModal}>
                    <TEModalDialog>
                        <TEModalContent>
                            <TEModalHeader>
                                {/* <!--Modal title--> */}
                                <h5 className="text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200">
                                    Xóa Thành Viên
                                </h5>
                                {/* <!--Close button--> */}
                                <button
                                    type="button"
                                    className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                                    onClick={() => setShowModal(false)}
                                    aria-label="Close">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="h-6 w-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </TEModalHeader>
                            {/* <!--Modal body--> */}
                            <TEModalBody>Bạn có chắc muốn xóa thành viên này ?</TEModalBody>
                            <TEModalFooter>
                                <TERipple rippleColor="light">
                                    <button
                                        type="button"
                                        className="inline-block rounded bg-primary-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                                        onClick={() => setShowModal(false)}>
                                        Close
                                    </button>
                                </TERipple>
                                <TERipple rippleColor="light">
                                    <button
                                        type="button"
                                        className="ml-1 inline-block rounded bg-danger px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                                        onClick={handleDeleteUser}>
                                        Xóa
                                    </button>
                                </TERipple>
                            </TEModalFooter>
                        </TEModalContent>
                    </TEModalDialog>
                </TEModal>
            </div>
            <table className="table-auto w-full mt-4">
                <thead>
                    <tr className="border-b border-t">
                        <td className="p-2 font-bold">STT</td>
                        <td className="p-2 font-bold">Tên thành viên</td>
                        <td className="p-2 font-bold">Phone</td>
                        <td className="p-2 font-bold text-center">Vai trò</td>
                        <td className="p-2 font-bold text-center">Số bài đăng</td>
                        <td className="p-2 font-bold text-center">Ngày tạo</td>
                        <td className="p-2 font-bold text-center">Quản Lý</td>
                    </tr>
                </thead>
                <tbody>
                    {users?.rows?.map((item, index) => (
                        <tr key={item.id}>
                            <td className={`p-2 ${index % 2 === 0 ? "" : "bg-gray-100"} m-auto`}>{index + 1}</td>
                            <td className={`p-2 ${index % 2 === 0 ? "" : "bg-gray-100"} m-auto`}>
                                {edit?.id === item.id ? (
                                    <input
                                        type="text"
                                        value={payload.name}
                                        onChange={(e) => setPayload((prev) => ({ ...prev, name: e.target.value }))}
                                        className="py-2 px-4 border rounded-md"
                                    />
                                ) : (
                                    <span>{item?.name}</span>
                                )}
                            </td>
                            <td className={`p-2 ${index % 2 === 0 ? "" : "bg-gray-100"} m-auto text-center`}>
                                {edit?.id === item.id ? (
                                    <input
                                        type="number"
                                        value={payload.phone}
                                        onChange={(e) => setPayload((prev) => ({ ...prev, phone: e.target.value }))}
                                        className="py-2 px-4 border rounded-md"
                                    />
                                ) : (
                                    <span>{item?.phone}</span>
                                )}
                            </td>
                            <td className={`p-2 ${index % 2 === 0 ? "" : "bg-gray-100"} m-auto text-center`}>
                                {edit?.id === item.id ? (
                                    <select
                                        className="border px-4 py-2 rounded-md"
                                        value={payload.role}
                                        onChange={(e) => setPayload((prev) => ({ ...prev, role: e.target.value }))}>
                                        {roles?.map((el) => (
                                            <option key={el.code} value={el.code}>
                                                {el.value}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <span>{item?.roleData?.value}</span>
                                )}
                            </td>
                            <td className={`p-2 ${index % 2 === 0 ? "" : "bg-gray-100"} m-auto text-center`}>
                                {item?.posts?.length}
                            </td>
                            <td className={`p-2 ${index % 2 === 0 ? "" : "bg-gray-100"} m-auto text-center`}>
                                {moment(item?.createdAt).format("DD/MM/yyyy")}
                            </td>
                            <td className={`p-2 ${index % 2 === 0 ? "" : "bg-gray-100"} m-auto text-center`}>
                                <span
                                    className="p-2 cursor-pointer text-blue-500 hover:underline"
                                    onClick={() => handleUpdate(item)}>
                                    Sửa
                                </span>
                                <span
                                    className="p-2 cursor-pointer text-blue-500 hover:underline"
                                    onClick={() => handleShowModal(item.id)}>
                                    Xóa
                                </span>

                                <span
                                    onClick={() => handleShowActionsDetails(item.id)}
                                    className="p-2 cursor-pointer text-blue-500 hover:underline">
                                    Lịch sử hoạt động
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="relative h-full bg-white p-4">
            <button
                data-modal-target="popup-modal"
                data-modal-toggle="popup-modal"
                class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="button">
                Toggle modal
            </button>

            <div
                id="popup-modal"
                tabindex="-1"
                class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div class="relative p-4 w-full max-w-md max-h-full">
                    <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <button
                            type="button"
                            class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            data-modal-hide="popup-modal">
                            <svg
                                class="w-3 h-3"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 14">
                                <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                />
                            </svg>
                            <span class="sr-only">Close modal</span>
                        </button>
                        <div class="p-4 md:p-5 text-center">
                            <svg
                                class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20">
                                <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                            </svg>
                            <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                Are you sure you want to delete this product?
                            </h3>
                            <button
                                data-modal-hide="popup-modal"
                                type="button"
                                class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2">
                                Yes, I'm sure
                            </button>
                            <button
                                data-modal-hide="popup-modal"
                                type="button"
                                class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                                No, cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between gap-8 border-b">
                <h3 className="font-bold text-[30px] pb-4 ">Quản lý thành viên</h3>
                {edit?.id && (
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="py-2 px-4 bg-blue-500 rounded-md text-white font-semibold flex items-center justify-center gap-2">
                            <span>Update</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setEdit(null)}
                            className="py-2 px-4 bg-red-500 rounded-md text-white font-semibold flex items-center justify-center gap-2">
                            <span>Cancel</span>
                        </button>
                    </div>
                )}
            </div>

            {showActionsDetails && <UserActionsDetailsModal />}
            {showDetails && <UserDetailsModal />}

            {users && (
                <div className="">
                    <Pagination admin count={users?.count} posts={users?.rows} />
                </div>
            )}
        </div>
    );
};

export default ManageUser;
