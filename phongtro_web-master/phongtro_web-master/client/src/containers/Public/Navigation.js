import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { formatVietnameseToString } from "../../ultils/Common/formatVietnameseToString";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../store/actions";
import { path } from "../../ultils/constant";

const notActive = "hover:bg-gray-500 px-4 h-full flex items-center bg-gray-800";
const active = " px-4 h-full flex items-center  bg-gray-500";

const Navigation = ({ isAdmin }) => {
    const dispatch = useDispatch();
    const { categories } = useSelector((state) => state.app);
    const { currentData } = useSelector((state) => state.user);
    useEffect(() => {
        dispatch(actions.getCategories());
    }, []);
    return (
        <div
            className={`w-full bg-gray-800  flex ${
                isAdmin ? "justify-start" : "justify-center"
            } items-center h-[50px] bg-gray-200 text-white`}>
            <div className="w-full flex h-full items-center text-md font-medium justify-center">
                <NavLink to={`/`} className={({ isActive }) => (isActive ? active : notActive)}>
                    Trang chủ
                </NavLink>
                {categories?.length > 0 &&
                    categories.map((item) => {
                        return (
                            <div key={item.code} className="h-full flex justify-center items-center">
                                <NavLink
                                    to={`/${formatVietnameseToString(item.value)}`}
                                    className={({ isActive }) => (isActive ? active : notActive)}>
                                    {item.value}
                                </NavLink>
                            </div>
                        );
                    })}
                <NavLink to={path.CONTACT} className={({ isActive }) => (isActive ? active : notActive)}>
                    Liên hệ
                </NavLink>
                {currentData.id && (
                    <NavLink to={`/${path.WISHLIST}`} className={({ isActive }) => (isActive ? active : notActive)}>
                        Bài đăng yêu thích
                    </NavLink>
                )}
            </div>
        </div>
    );
};

export default Navigation;
