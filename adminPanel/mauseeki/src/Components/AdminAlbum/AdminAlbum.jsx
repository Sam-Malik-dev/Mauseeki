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

                const url =
                    "http://localhost:8080/Mauseeki/all-album";

                const res = await fetch(url);
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
                `http://localhost:8080/Mauseeki/delete-album/${id}`,
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

            <div className="albums-header">
                <div>
                    <p className="albums-label">ADMIN PANEL</p>

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

            {loading && (
                <div className="albums-message">
                    <div className="album-loader"></div>
                    <h3>Loading albums...</h3>
                </div>
            )}

            {!loading && error && (
                <div className="albums-message album-error">
                    <div className="album-message-icon">!</div>

                    <h3>{error}</h3>

                    <p>
                        Please check your backend server.
                    </p>
                </div>
            )}

            {!loading &&
                !error &&
                filteredAlbums.length === 0 && (
                    <div className="albums-message">
                        <div className="album-message-icon">
                            ♪
                        </div>

                        <h3>No albums found</h3>

                        <p>
                            {search
                                ? "Try another search."
                                : "No albums have been added yet."}
                        </p>
                    </div>
                )}

            {!loading &&
                !error &&
                filteredAlbums.length > 0 && (
                    <div className="albums-grid">
                        {filteredAlbums.map((item) => (
                            <div
                                className="album-card"
                                key={item._id}
                            >
                                <img
                                    src={item.thumbnail}
                                    alt={item.albumtitle}
                                    className="album-image"
                                />

                                <div className="album-info">
                                    <h2>
                                        {item.albumtitle}
                                    </h2>

                                    <p>
                                        {item.artist?.artistname ||
                                            item.artist?.name ||
                                            "Unknown Artist"}
                                    </p>

                                    <span>
                                        {item.description ||
                                            "No description available"}
                                    </span>
                                </div>

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
