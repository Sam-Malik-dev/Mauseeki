import React, { useEffect, useState } from "react";
import "./Messages.css";

function Messages() {
    const [messages, setMessages] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const getMessages = async () => {
            try {
                setLoading(true);
                setError("");

                const url =
                    "https://mauseeki.onrender.com/Mauseeki/messages";

                const res = await fetch(url);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(
                        data.message || "Failed to fetch messages"
                    );
                }

                setMessages(data);
            } catch (error) {
                console.log(error);
                setError("Unable to load messages");
            } finally {
                setLoading(false);
            }
        };

        getMessages();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this message?"
        );

        if (!confirmDelete) return;

        try {
            const res = await fetch(
                `https://mauseeki.onrender.com/Mauseeki/delete-message/${id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || "Failed to delete message"
                );
            }

            setMessages((prev) =>
                prev.filter((item) => item._id !== id)
            );
        } catch (error) {
            console.log(error);
            alert("Unable to delete message");
        }
    };

    const filteredMessages = messages.filter((item) => {
        const name = (item.name || "").toLowerCase();
        const email = (item.email || "").toLowerCase();
        const message = (item.message || "").toLowerCase();

        const value = search.toLowerCase();

        return (
            name.includes(value) ||
            email.includes(value) ||
            message.includes(value)
        );
    });

    return (
        <div className="messages-page">

            <div className="messages-header">
                <div>
                    <p className="messages-label">
                        ADMIN PANEL
                    </p>

                    <h1>Messages</h1>

                    <p className="messages-subtitle">
                        View messages sent by Mauseeki users.
                    </p>
                </div>

                <div className="message-count">
                    <span>{messages.length}</span>
                    <p>Total Messages</p>
                </div>
            </div>

            <div className="messages-toolbar">

                <div className="message-search">
                    <span>⌕</span>

                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />
                </div>

                <p className="message-result-count">
                    {filteredMessages.length} messages found
                </p>

            </div>

            {loading && (
                <div className="messages-state">
                    <div className="message-loader"></div>
                    <h3>Loading messages...</h3>
                </div>
            )}

            {!loading && error && (
                <div className="messages-state message-error">
                    <div className="message-state-icon">!</div>

                    <h3>{error}</h3>

                    <p>
                        Please check your backend server.
                    </p>
                </div>
            )}

            {!loading &&
                !error &&
                filteredMessages.length === 0 && (
                    <div className="messages-state">

                        <div className="message-state-icon">
                            ✉
                        </div>

                        <h3>No messages found</h3>

                        <p>
                            {search
                                ? "Try another search."
                                : "No messages have been received yet."}
                        </p>

                    </div>
                )}

            {!loading &&
                !error &&
                filteredMessages.length > 0 && (
                    <div className="messages-table-wrapper">

                        <table className="messages-table">

                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Email</th>
                                    <th>Message</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredMessages.map(
                                    (item, index) => (
                                        <tr key={item._id}>

                                            <td className="message-number">
                                                {index + 1}
                                            </td>


                                            <td className="message-email">
                                                {item.email ||
                                                    "No email"}
                                            </td>

                                            <td>
                                                <p className="message-content">
                                                    {item.message ||
                                                        "No message"}
                                                </p>
                                            </td>

                                            <td>
                                                <button
                                                    className="delete-message-button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            item._id
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

export default Messages;
