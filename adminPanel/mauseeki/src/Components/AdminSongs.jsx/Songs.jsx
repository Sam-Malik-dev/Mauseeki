import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import "./Songs.css";

function Songs() {
    const [songs, setSongs] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    const API = "https://mauseeki.onrender.com/Mauseeki";

    useEffect(() => {
        const allsongs = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await fetch(`${API}/all-songs`);

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(
                        data.message || "Failed to fetch songs"
                    );
                }

                setSongs(data);
            } catch (error) {
                console.log("Fetch Songs Error:", error);
                setError(error.message || "Unable to connect to server");
            } finally {
                setLoading(false);
            }
        };

        allsongs();
    }, []);

    const handleDelete = async (songId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this song?"
        );

        if (!confirmDelete) return;

        try {
            setDeletingId(songId);

            const res = await fetch(
                `${API}/delete-song/${songId}`,
                {
                    method: "DELETE",
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || "Failed to delete song"
                );
            }

            setSongs((prevSongs) =>
                prevSongs.filter((song) => song._id !== songId)
            );

            alert(data.message || "Song deleted successfully");

        } catch (error) {
            console.log("Delete Error:", error);
            alert(error.message || "Unable to delete song");
        } finally {
            setDeletingId(null);
        }
    };

    const filteredSongs = songs.filter((song) => {
        const searchText = search.toLowerCase();

        return (
            song.title?.toLowerCase().includes(searchText) ||
            song.language?.toLowerCase().includes(searchText) ||
            song.genre?.toLowerCase().includes(searchText) ||
            song.category?.toLowerCase().includes(searchText) ||
            song.artist?.artistname?.toLowerCase().includes(searchText) ||
            song.album?.albumtitle?.toLowerCase().includes(searchText)
        );
    });

    return (
        <div className="songs-page">

            {/* Header */}
            <div className="songs-header">

                <div>
                    <p className="songs-label">
                        MUSIC LIBRARY
                    </p>

                    <h1>All Songs</h1>

                    <p className="songs-subtitle">
                        Manage and explore all songs in Mauseeki
                    </p>
                </div>

                <div className="song-count">
                    <span>{songs.length}</span>
                    <p>Total Songs</p>
                </div>

            </div>


            {/* Search */}
            <div className="songs-toolbar">

                <div className="search-box">

                    <span>⌕</span>

                    <input
                        type="text"
                        placeholder="Search songs, artists, albums..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>

                <div className="result-count">
                    {filteredSongs.length} songs
                </div>

            </div>


            {/* Loading */}
            {loading && (
                <div className="songs-message">

                    <div className="loader"></div>

                    <p>Loading songs...</p>

                </div>
            )}


            {/* Error */}
            {!loading && error && (
                <div className="songs-message error-message">

                    <div className="message-icon">
                        !
                    </div>

                    <h3>
                        Something went wrong
                    </h3>

                    <p>
                        {error}
                    </p>

                </div>
            )}


            {/* Empty */}
            {!loading &&
                !error &&
                filteredSongs.length === 0 && (
                    <div className="songs-message">

                        <div className="message-icon">
                            ♪
                        </div>

                        <h3>
                            No songs found
                        </h3>

                        <p>
                            {search
                                ? "Try searching with another keyword."
                                : "There are no songs available yet."}
                        </p>

                    </div>
                )}


            {/* Songs */}
            {!loading &&
                !error &&
                filteredSongs.length > 0 && (

                    <div className="songs-table-wrapper">

                        <div className="songs-table">

                            {/* Header */}
                            <div className="song-row song-table-header">

                                <div>#</div>
                                <div>Song</div>
                                <div>Artist</div>
                                <div>Album</div>
                                <div>Language</div>
                                <div>Genre</div>
                                <div>Year</div>
                                <div>Action</div>

                            </div>


                            {/* Songs */}
                            {filteredSongs.map((song, index) => (

                                <div
                                    className="song-row"
                                    key={song._id || index}
                                >

                                    {/* Number */}
                                    <div className="song-number">
                                        {String(index + 1).padStart(2, "0")}
                                    </div>


                                    {/* Song */}
                                    <div className="song-main">

                                        <img
                                            src={song.coverImage}
                                            alt={song.title}
                                            className="song-cover"
                                        />

                                        <div className="song-info">

                                            <h3>
                                                {song.title ||
                                                    "Unknown Song"}
                                            </h3>

                                            <p>
                                                {song.category ||
                                                    "Music"}
                                            </p>

                                        </div>

                                    </div>


                                    {/* Artist */}
                                    <div className="song-artist">
                                        {song.artist?.artistname ||
                                            song.artistname ||
                                            "Unknown Artist"}
                                    </div>


                                    {/* Album */}
                                    <div className="song-album">
                                        {song.album?.albumtitle ||
                                            song.albumtitle ||
                                            "Single"}
                                    </div>


                                    {/* Language */}
                                    <div>
                                        <span className="language-badge">
                                            {song.language || "N/A"}
                                        </span>
                                    </div>


                                    {/* Genre */}
                                    <div className="song-genre">
                                        {song.genre || "N/A"}
                                    </div>


                                    {/* Year */}
                                    <div className="song-year">
                                        {song.releaseYear || "—"}
                                    </div>


                                    {/* Delete */}
                                    <div className="song-action">

                                        <button
                                            className="delete-song-button"
                                            onClick={() =>
                                                handleDelete(song._id)
                                            }
                                            disabled={
                                                deletingId === song._id
                                            }
                                            title="Delete song"
                                        >

                                            {deletingId === song._id ? (
                                                <span className="delete-loader"></span>
                                            ) : (
                                                <FaTrash />
                                            )}

                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>
                )}

        </div>
    );
}

export default Songs;
