import React, { useEffect, useState } from "react";
import "./AdminAlbum.css";

function AdminAlbum() {
    const [album, setAlbum] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const albums = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await fetch(
                    "https://mauseeki.onrender.com/Mauseeki/all-album"
                );

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(
                        data.message || "Failed to fetch albums"
                    );
                }

                setAlbum(data);
            } catch (error) {
                console.log(error);
                setError("Unable to load albums");
            } finally {
                setLoading(false);
            }
        };

        albums();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this album?"
        );

        if (!confirmDelete) return;

        try {
            const res = await fetch(
                `https://mauseeki.onrender.com/Mauseeki/delete-album/${id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || "Failed to delete album"
                );
            }

            setAlbum((prev) =>
                prev.filter((item) => item._id !== id)
            );
        } catch (error) {
            console.log(error);
            alert("Unable to delete album");
        }
    };

    const filteredAlbums = album.filter((item) =>
        item.albumtitle
            ?.toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <div className="albums-page">

            {/* Header */}
            <div className="albums-header">

                <div>
                    <p className="albums-label">
                        ADMIN PANEL
                    </p>

                    <h1>Albums</h1>

                    <p className="albums-subtitle">
                        Manage all albums available in Mauseeki.
                    </p>
                </div>

                <div className="album-count">
                    <span>{album.length}</span>
                    <p>Total Albums</p>
                </div>

            </div>

            {/* Search */}
            <div className="albums-toolbar">

                <div className="album-search">

                    <span>⌕</span>

                    <input
                        type="text"
                        placeholder="Search albums..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>

                <p className="album-result-count">
                    {filteredAlbums.length} albums found
                </p>

            </div>

            {/* Loading */}
            {loading && (
                <div className="albums-message">

                    <div className="album-loader"></div>

                    <h3>
                        Loading albums...
                    </h3>

                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <div className="albums-message album-error">

                    <div className="album-message-icon">
                        !
                    </div>

                    <h3>
                        {error}
                    </h3>

                    <p>
                        Please check your backend server.
                    </p>

                </div>
            )}

            {/* No Albums */}
            {!loading &&
                !error &&
                filteredAlbums.length === 0 && (
                    <div className="albums-message">

                        <div className="album-message-icon">
                            ♪
                        </div>

                        <h3>
                            No albums found
                        </h3>

                        <p>
                            {search
                                ? "Try another search."
                                : "No albums have been added yet."}
                        </p>

                    </div>
                )}

            {/* Albums */}
            {!loading &&
                !error &&
                filteredAlbums.length > 0 && (

                    <div className="albums-grid">

                        {filteredAlbums.map((item) => (

                            <div
                                className="album-card"
                                key={item._id}
                            >

                                {/* Album Image */}
                                <img
                                    src={item.thumbnail}
                                    alt={item.albumtitle}
                                    className="album-image"
                                />

                                {/* Album Information */}
                                <div className="album-info">

                                    <h2>
                                        {item.albumtitle}
                                    </h2>

                                    <p>
                                        <strong>
                                            Artist:
                                        </strong>{" "}
                                        {item.artist?.artistname ||
                                            "Unknown Artist"}
                                    </p>

                                    <p>
                                        <strong>
                                            Created by:
                                        </strong>{" "}
                                        {item.createdBy
                                            ? `${item.createdBy.firstname || ""} ${item.createdBy.lastname || ""}`
                                            : "Unknown User"}
                                    </p>

                                    <span>
                                        {item.description ||
                                            "No description available"}
                                    </span>

                                </div>

                                {/* Delete */}
                                <button
                                    className="delete-album-button"
                                    onClick={() =>
                                        handleDelete(item._id)
                                    }
                                >
                                    Delete Album
                                </button>

                            </div>

                        ))}

                    </div>
                )}

        </div>
    );
}

export default AdminAlbum;
