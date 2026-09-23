import React, { useEffect, useState } from "react";
import {
    FaUsers,
    FaMusic,
    FaCompactDisc,
    FaMicrophone
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {

    const [users, setUsers] = useState(0);
    const [songs, setSongs] = useState(0);
    const [albums, setAlbums] = useState(0);
    const [artists, setArtists] = useState(0);

    const [allusers, setAllusers] = useState([]);
    const [allsongs, setAllsongs] = useState([]);
    const [allalbums, setAllalbums] = useState([]);
    const [allartists, setAllartists] = useState([]);

    useEffect(() => {

        const fetchData = async () => {
            try {

                const [
                    usersRes,
                    songsRes,
                    albumsRes,
                    artistsRes
                ] = await Promise.all([
                    fetch("https://mauseeki.onrender.com/Mauseeki/total-Users"),
                    fetch("https://mauseeki.onrender.com/Mauseeki/total-songs"),
                    fetch("https://mauseeki.onrender.com/Mauseeki/total-albums"),
                    fetch("https://mauseeki.onrender.com/Mauseeki/total-artists")
                ]);

                setUsers(await usersRes.json());
                setSongs(await songsRes.json());
                setAlbums(await albumsRes.json());
                setArtists(await artistsRes.json());

            } catch (error) {
                console.log("Dashboard Error:", error);
            }
        };


        const fetchRecent = async () => {
            try {

                const [
                    usersRes,
                    songsRes,
                    albumsRes,
                    artistsRes
                ] = await Promise.all([
                    fetch("https://mauseeki.onrender.com/Mauseeki/recent-users"),
                    fetch("https://mauseeki.onrender.com/Mauseeki/recent-songs"),
                    fetch("https://mauseeki.onrender.com/Mauseeki/recent-albums"),
                    fetch("https://mauseeki.onrender.com/Mauseeki/recent-artists")
                ]);

                if (usersRes.ok) {
                    setAllusers(await usersRes.json());
                }

                if (songsRes.ok) {
                    setAllsongs(await songsRes.json());
                }

                if (albumsRes.ok) {
                    setAllalbums(await albumsRes.json());
                }

                if (artistsRes.ok) {
                    setAllartists(await artistsRes.json());
                }

            } catch (error) {
                console.log("Recent Data Error:", error);
            }
        };


        fetchData();
        fetchRecent();

    }, []);


    return (
        <div className="dashboard">

            {/* Header */}

            <div className="dashboard-header">

                <p className="dashboard-label">
                    MAUSEEKI ADMIN
                </p>

                <h1>Dashboard</h1>

                <p className="dashboard-subtitle">
                    Welcome to your Mauseeki dashboard
                </p>

            </div>


            {/* Statistics Cards */}

            <div className="dashboard-cards">

                <div className="dashboard-card">

                    <div className="icon-box">
                        <FaUsers />
                    </div>

                    <div className="card-content">
                        <p>Total Users</p>
                        <h2>{users}</h2>
                        <Link to="/users">See All →</Link>
                    </div>

                </div>


                <div className="dashboard-card">

                    <div className="icon-box">
                        <FaMusic />
                    </div>

                    <div className="card-content">
                        <p>Total Songs</p>
                        <h2>{songs}</h2>
                        <Link to="/songs">See All →</Link>
                    </div>

                </div>


                <div className="dashboard-card">

                    <div className="icon-box">
                        <FaCompactDisc />
                    </div>

                    <div className="card-content">
                        <p>Total Albums</p>
                        <h2>{albums}</h2>
                        <Link to="/albums">See All →</Link>
                    </div>

                </div>


                <div className="dashboard-card">

                    <div className="icon-box">
                        <FaMicrophone />
                    </div>

                    <div className="card-content">
                        <p>Total Artists</p>
                        <h2>{artists}</h2>
                        <Link to="/artists">See All →</Link>
                    </div>

                </div>

            </div>


            {/* Recent Data */}

            <div className="recent-section">


                {/* Users */}

                <div className="recent-box">

                    <div className="recent-header">
                        <h2>Recent Users</h2>
                        <Link to="/users">See All</Link>
                    </div>

                    {allusers.length > 0 ? (

                        allusers.map((user) => (

                            <div className="recent-item" key={user._id}>

                                <div className="recent-avatar">
                                    <FaUsers />
                                </div>

                                <div className="recent-info">

                                    <h3>
                                        {user.firstname} {user.lastname}
                                    </h3>

                                    <p>
                                        {user.email}
                                    </p>

                                </div>

                            </div>

                        ))

                    ) : (
                        <p className="no-data">
                            No users found
                        </p>
                    )}

                </div>


                {/* Songs */}

                <div className="recent-box">

                    <div className="recent-header">
                        <h2>Recent Songs</h2>
                        <Link to="/songs">See All</Link>
                    </div>

                    {allsongs.length > 0 ? (

                        allsongs.map((song) => (

                            <div className="recent-item" key={song._id}>

                                <img
                                    src={song.coverImage}
                                    alt={song.title}
                                    className="recent-image"
                                />

                                <div className="recent-info">

                                    <h3>
                                        {song.title}
                                    </h3>

                                    <p>
                                        {song.language}
                                    </p>

                                </div>

                            </div>

                        ))

                    ) : (
                        <p className="no-data">
                            No songs found
                        </p>
                    )}

                </div>


                {/* Albums */}

                <div className="recent-box">

                    <div className="recent-header">
                        <h2>Recent Albums</h2>
                        <Link to="/albums">See All</Link>
                    </div>

                    {allalbums.length > 0 ? (

                        allalbums.map((album) => (

                            <div className="recent-item" key={album._id}>

                                <img
                                    src={album.thumbnail}
                                    alt={album.albumtitle}
                                    className="recent-image"
                                />

                                <div className="recent-info">

                                    <h3>
                                        {album.albumtitle}
                                    </h3>

                                    <p>
                                        {album.description}
                                    </p>

                                </div>

                            </div>

                        ))

                    ) : (
                        <p className="no-data">
                            No albums found
                        </p>
                    )}

                </div>


                {/* Artists */}

                <div className="recent-box">

                    <div className="recent-header">
                        <h2>Recent Artists</h2>
                        <Link to="/artists">See All</Link>
                    </div>

                    {allartists.length > 0 ? (

                        allartists.map((artist) => (

                            <div className="recent-item" key={artist._id}>

                                <img
                                    src={artist.image}
                                    alt={artist.artistname}
                                    className="recent-image artist-image"
                                />

                                <div className="recent-info">

                                    <h3>
                                        {artist.artistname}
                                    </h3>

                                    <p>
                                        {artist.bio}
                                    </p>

                                </div>

                            </div>

                        ))

                    ) : (
                        <p className="no-data">
                            No artists found
                        </p>
                    )}

                </div>

            </div>

        </div>
    );
}

export default Dashboard;