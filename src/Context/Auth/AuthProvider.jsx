/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react'
import AuthContext from './AuthContext'

export default function AuthProvider(props) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("authorization");

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
    }, []);

    const login = (userData, token) => {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("authorization", token);

        setUser(userData);
        setToken(token);
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("authorization");

        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {props.children}
        </AuthContext.Provider>
    )
}
