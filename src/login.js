import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import './LoginForm.css';
import { Link } from 'react-router-dom';


function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [authenticated, setAuthenticated] = useState(false);
    const [userRoles, setUserRoles] = useState([]);


    const submit = async () => {
        try {
            const response = await axios.post('http://localhost:8180/realms/SpringBootDemoKeyCloak/protocol/openid-connect/token', 
                new URLSearchParams({
                    'grant_type': 'password',
                    'client_id': 'Pranshu',
                    'client_secret': 'pEMKbVNkwdIhN5JnKdR5cCWrguaRoB1U',
                    'username': username,
                    'password': password
                }), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });

            console.log('Access Token:', response.data.access_token);

            sessionStorage.setItem("token",response.data.access_token)
            const { access_token } = response.data;
            const decodedToken = jwtDecode(access_token);
            const userRoles = decodedToken.realm_access.roles;
            console.log('User Roles:', userRoles);
            setUserRoles(userRoles);
            setAuthenticated(true);
            sessionStorage.setItem("Role", userRoles);


        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        submit();
    };

    return (
        <div className="login-form-container">
            <h2>Login Form</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label><br />
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                /><br />
                <label htmlFor="password">Password:</label><br />
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                /><br /><br />
                <button type="submit">Submit</button>
            </form>
            {authenticated && userRoles.includes('admin') && (
                <div>
                    <h3>Welcome, Admin!</h3>
                    <Link to="/logindept">Go to User Page</Link>
                </div>
            )}
            {authenticated && userRoles.includes('employee') && (
                <div>
                    <h3>Welcome, User!</h3>
                    <Link to="/logindept">Go to User Page</Link>
                </div>
            )}
            {!authenticated && (
                <div>
                    <p>Please login to access the site.</p>
                </div>
            )}
        </div>
    );
}

export default LoginForm;
