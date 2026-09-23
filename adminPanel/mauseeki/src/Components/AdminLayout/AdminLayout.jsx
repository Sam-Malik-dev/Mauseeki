import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import "./AdminLayout.css";

function AdminLayout() {
    return (
        <div className="admin-layout">

            <Sidebar />

            <main className="admin-content">
                <Outlet />
            </main>

        </div>
    );
}

export default AdminLayout;