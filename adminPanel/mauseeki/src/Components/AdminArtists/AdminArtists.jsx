import React, { useEffect, useState } from "react";
import "./AdminArtists.css";

function AdminArtists() {
    const [artist, setArtist] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const artists = async () => {
            try {
                setLoading(true);
                setError("");

                const url =
                    "https://mauseeki.onrender.com/Mauseeki/all-artist";

                const res = await fetch(url);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(
                        data.message || "Failed to fetch artists"
                    );
                }

                setArtist(data);
            } catch (error) {
                console.log(error);
                setError("Unable to load artists");
            } finally {
                setLoading(false);
            }
        };

        artists();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this artist?"
        );

        if (!confirmDelete) return;

        try {
            const res = await fetch(
                `https://mauseeki.onrender.com/Mauseeki/delete-artist/${id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || "Failed to delete artist"
                );
            }

            setArtist((prev) =>
                prev.filter((item) => item._id !== id)
            );

        } catch (error) {
            console.log(error);
            alert("Unable to delete artist");
        }
    };

    const filteredArtists = artist.filter((item) =>
        item.artistname
            ?.toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <div className="artists-page">

            {/* Header */}
            <div className="artists-header">

                <div>
                    <p className="artists-label">
                        ADMIN PANEL
                    </p>

                    <h1>Artists</h1>

                    <p className="artists-subtitle">
                        Manage all artists registered in Mauseeki.
                    </p>
                </div>

                <div className="artist-count">
                    <span>{artist.length}</span>
                    <p>Total Artists</p>
                </div>

            </div>

            {/* Toolbar */}
            <div className="artists-toolbar">

                <div className="artist-search">

                    <span>⌕</span>

                    <input
                        type="text"
                        placeholder="Search artists..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>

                <p className="result-count">
                    {filteredArtists.length} artists found
                </p>

            </div>

            {/* Loading */}
            {loading && (
                <div className="artists-message">

                    <div className="loader"></div>

                    <h3>Loading artists...</h3>

                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <div className="artists-message error-message">

                    <div className="message-icon">
                        !
                    </div>

                    <h3>{error}</h3>

                    <p>
                        Please check your backend server.
                    </p>

                </div>
            )}

            {/* Empty */}
            {!loading &&
                !error &&
                filteredArtists.length === 0 && (
                    <div className="artists-message">

                        <div className="message-icon">
                            ♪
                        </div>

                        <h3>No artists found</h3>

                        <p>
                            {search
                                ? "Try another search."
                                : "No artists have been added yet."}
                        </p>

                    </div>
                )}

            {/* Artists */}
            {!loading &&
                !error &&
                filteredArtists.length > 0 && (
                    <div className="artists-grid">

                        {filteredArtists.map((item) => (

                            <div
                                className="artist-card"
                                key={item._id}
                            >

                                <img
                                    src={item.image}
                                    alt={item.artistname}
                                    className="artist-image"
                                />

                                <div className="artist-info">

                                    <h2>
                                        {item.artistname}
                                    </h2>

                                    <p>
                                        {item.language ||
                                            "Unknown Language"}
                                    </p>

                                    <span>
                                        {item.region ||
                                            "Unknown Region"}
                                    </span>

                                </div>

                                <button
                                    className="delete-artist-button"
                                    onClick={() =>
                                        handleDelete(item._id)
                                    }
                                >
                                    Delete Artist
                                </button>

                            </div>

                        ))}

                    </div>
                )}

        </div>
    );
}

export default AdminArtists;