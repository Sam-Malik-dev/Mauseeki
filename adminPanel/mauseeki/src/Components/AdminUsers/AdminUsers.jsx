import React, { useEffect, useState } from "react";
import "./AdminUsers.css";

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const getUsers = async () => {
            try {
                setLoading(true);
                setError("");

                const url =
                    "https://mauseeki.onrender.com/Mauseeki/allusers";

                const res = await fetch(url);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(
                        data.message || "Failed to fetch users"
                    );
                }

                setUsers(data);
            } catch (error) {
                console.log(error);
                setError("Unable to load users");
            } finally {
                setLoading(false);
            }
        };

        getUsers();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmDelete) return;

        try {
            const res = await fetch(
                `https://mauseeki.onrender.com/Mauseeki/delete-user/${id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || "Failed to delete user"
                );
            }

            setUsers((prev) =>
                prev.filter((user) => user._id !== id)
            );
        } catch (error) {
            console.log(error);
            alert("Unable to delete user");
        }
    };

    const filteredUsers = users.filter((user) => {
        const name =
            `${user.firstname || ""} ${user.lastname || ""}`
                .toLowerCase();

        const email = (user.email || "").toLowerCase();

        return (
            name.includes(search.toLowerCase()) ||
            email.includes(search.toLowerCase())
        );
    });

    return (
        <div className="users-page">

            <div className="users-header">
                <div>
                    <p className="users-label">ADMIN PANEL</p>

                    <h1>Users</h1>

                    <p className="users-subtitle">
                        Manage all users registered in Mauseeki.
                    </p>
                </div>

                <div className="user-count">
                    <span>{users.length}</span>
                    <p>Total Users</p>
                </div>
            </div>

            <div className="users-toolbar">

                <div className="user-search">
                    <span>⌕</span>

                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />
                </div>

                <p className="user-result-count">
                    {filteredUsers.length} users found
                </p>

            </div>

            {loading && (
                <div className="users-message">
                    <div className="user-loader"></div>
                    <h3>Loading users...</h3>
                </div>
            )}

            {!loading && error && (
                <div className="users-message user-error">
                    <div className="user-message-icon">!</div>

                    <h3>{error}</h3>

                    <p>
                        Please check your backend server.
                    </p>
                </div>
            )}

            {!loading &&
                !error &&
                filteredUsers.length === 0 && (
                    <div className="users-message">

                        <div className="user-message-icon">
                            ♙
                        </div>

                        <h3>No users found</h3>

                        <p>
                            {search
                                ? "Try another search."
                                : "No users have been registered yet."}
                        </p>

                    </div>
                )}

            {!loading &&
                !error &&
                filteredUsers.length > 0 && (
                    <div className="users-table-wrapper">

                        <table className="users-table">

                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredUsers.map(
                                    (user, index) => (
                                        <tr key={user._id}>

                                            <td className="user-number">
                                                {index + 1}
                                            </td>

                                            <td>
                                                <div className="user-main">

                                                    <img
                                                        src={
                                                            user.profilepic ||
                                                            "https://via.placeholder.com/50"
                                                        }
                                                        alt={`${user.firstname || ""} ${user.lastname || ""}`}
                                                        className="user-image"
                                                    />

                                                    <div className="user-info">
                                                        <h3>
                                                            {user.firstname}{" "}
                                                            {user.lastname}
                                                        </h3>

                                                        <span>
                                                            Mauseeki User
                                                        </span>
                                                    </div>

                                                </div>
                                            </td>

                                            <td className="user-email">
                                                {user.email}
                                            </td>

                                            <td>
                                                <span className="role-badge">
                                                    {user.VerifyCode ===
                                                    "admin"
                                                        ? "Admin"
                                                        : "User"}
                                                </span>
                                            </td>

                                            <td>
                                                <button
                                                    className="delete-user-button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            user._id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </td>

                                        </tr>
                                    )
                                )}
                            </tbody>

                        </table>

                    </div>
                )}
        </div>
    );
}

export default AdminUsers;
