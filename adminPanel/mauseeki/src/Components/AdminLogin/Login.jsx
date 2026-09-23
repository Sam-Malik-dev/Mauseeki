
import React, { useState } from "react";
import "./Login.css";

function Login() {
    const [logininfo, setLogininfo] = useState({
        email: "",
        password: "",
        VerifyCode: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setLogininfo({
            ...logininfo,
            [e.target.name]: e.target.value,
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const res = await fetch(
                "https://mauseeki.onrender.com/Mauseeki/admin-login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(logininfo),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                alert(data.message);
                return;
            }

            localStorage.setItem("adminToken", data.token);
            localStorage.setItem(
                "adminUser",
                JSON.stringify(data.user)
            );

            alert("Admin Login Successful");

            // Later:
            // window.location.href = "/dashboard";

        } catch (error) {
            console.log("LOGIN ERROR:", error);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">

            <div className="login-box">

                <h1 className="login-logo">
                    Mauseeki
                </h1>

                <p className="login-heading">
                    Admin Login
                </p>

                <form onSubmit={handleLogin}>

                    <label>Email</label>

                    <input
                        type="email"
                        name="email"
                        value={logininfo.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                        required
                    />

                    <label>Password</label>

                    <input
                        type="password"
                        name="password"
                        value={logininfo.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        required
                    />

                    <label>Verification Code</label>

                    <input
                        type="text"
                        name="VerifyCode"
                        value={logininfo.VerifyCode}
                        onChange={handleChange}
                        placeholder="Enter verification code"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Login;
