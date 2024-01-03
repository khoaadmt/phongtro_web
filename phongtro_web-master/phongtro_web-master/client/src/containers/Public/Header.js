import React, { useCallback, useEffect, useRef, useState } from "react";
import logo from "../../assets/logo2.jpg";
import { Button, User } from "../../components";
import icons from "../../ultils/icons";
import { useNavigate, Link, useSearchParams, useLocation } from "react-router-dom";
import { path } from "../../ultils/constant";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../store/actions";
import menuManage from "../../ultils/menuManage";
import menuAdmin from "../../ultils/menuAdmin";

const { AiOutlinePlusCircle, AiOutlineLogout, BsChevronDown } = icons;

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const headerRef = useRef();
    const { isLoggedIn } = useSelector((state) => state.auth);
    const { currentData } = useSelector((state) => state.user);
    const [isShowMenu, setIsShowMenu] = useState(false);
    const goLogin = useCallback((flag) => {
        navigate(path.LOGIN, { state: { flag } });
    }, []);
    useEffect(() => {
        headerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }, [searchParams.get("page"), location.pathname]);

    return (
        <div ref={headerRef} className="w-full h-[60px] pt-3 bg-gray-500">
            <div className="w-full  flex items-center justify-between">
                <div className="pl-5 flex items-center">
                    <img src={logo} className="h-[40px] text-white " />
                    <h1 className="text-white text-lg ml-2">
                        Phòng trọ 123.com - kênh thông tin về phòng trọ số một Việt Nam
                    </h1>
                </div>

                <div className="flex items-center gap-1 mr-5">
                    {!isLoggedIn && (
                        <div className="flex items-center gap-1">
                            <Button
                                text={"Đăng nhập"}
                                textColor="text-white"
                                bgColor="bg-[#3961fb] hover:bg-gray-500"
                                onClick={() => goLogin(false)}
                            />
                            <Button
                                text={"Đăng ký"}
                                textColor="text-white"
                                bgColor="bg-[#3961fb] hover:bg-gray-500"
                                onClick={() => goLogin(true)}
                            />
                        </div>
                    )}
                    {isLoggedIn && (
                        <div className="flex items-center gap-3 relative pr-10">
                            <User />
                            <Button
                                text={"Quản lý tài khoản"}
                                textColor="text-white"
                                bgColor="bg-gray-500 hover:bg-blue-500"
                                px="px-4"
                                IcAfter={BsChevronDown}
                                onClick={() =>
                                    currentData?.role === "R3"
                                        ? navigate("/he-thong/sua-thong-tin-ca-nhan")
                                        : setIsShowMenu((prev) => !prev)
                                }
                            />
                            {isShowMenu && currentData?.role === "R2" && (
                                <div className="absolute min-w-200 z-50 top-full bg-white shadow-md rounded-md p-4 right-0 flex flex-col">
                                    {menuManage.map((item) => {
                                        return (
                                            <Link
                                                className="hover:text-orange-500 flex items-center gap-2 text-blue-600 border-b border-gray-200 py-2"
                                                key={item.id}
                                                to={item?.path}>
                                                {item?.icon}
                                                {item.text}
                                            </Link>
                                        );
                                    })}
                                    <span
                                        className="cursor-pointer hover:text-orange-500 text-blue-500 py-2 flex items-center gap-2"
                                        onClick={() => {
                                            setIsShowMenu(false);
                                            dispatch(actions.logout());
                                        }}>
                                        <AiOutlineLogout />
                                        Đăng xuất
                                    </span>
                                </div>
                            )}
                            {isShowMenu && currentData?.role === "R1" && (
                                <div className="absolute min-w-200 top-full bg-white shadow-md rounded-md p-4 right-0 flex flex-col">
                                    {menuAdmin.map((item) => {
                                        return (
                                            <Link
                                                className="hover:text-orange-500 flex items-center gap-2 text-blue-600 border-b border-gray-200 py-2"
                                                key={item.id}
                                                to={item?.path}>
                                                {item?.icon}
                                                {item.text}
                                            </Link>
                                        );
                                    })}
                                    <span
                                        className="cursor-pointer hover:text-orange-500 text-blue-500 py-2 flex items-center gap-2"
                                        onClick={() => {
                                            setIsShowMenu(false);
                                            dispatch(actions.logout());
                                        }}>
                                        <AiOutlineLogout />
                                        Đăng xuất
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                    {(currentData?.role === "R1" || currentData?.role === "R2") && (
                        <div className="pr-10">
                            <Button
                                text={"Đăng tin mới"}
                                textColor="text-white"
                                bgColor="bg-gray-500 hover:bg-blue-500"
                                IcAfter={AiOutlinePlusCircle}
                                onClick={() => navigate("/he-thong/tao-moi-bai-dang")}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
