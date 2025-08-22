import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import AuthContext from "../context/authContext";

const Login = ({setUser}) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [userData, setUserData] = useState({});
    const { login } = useContext(AuthContext); //get login function from the authcontext
    const [error, setError] = useState('')
    const navigate = useNavigate();

    const handleLogin = async (e) =>{

        e.preventDefault();
        setError('');

        if(email==='' || password===''){
            setError('Fields cannot be empty.');
            return;
        }

        try{
            const {data} = await api.post('/auth/login', {email, password});
            if(data.token){
                const userDetails = { id: data.user.id, name: data.user.name, email: data.user.email, token: data.token };
                setUserData(userDetails)
                login(userDetails); // Call login function from Authcontext
            }
            navigate('/expenses');
        }
        catch(err){
            setError('Login Failed', err);
        }

    }

    return(
        <>
            <div>
                <h2>Login</h2>
                {error && <span className="message_span error">{ error }</span>}
                <div>
                    <form onSubmit={handleLogin}>
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <button type="submit">Login</button>                        
                    </form>
                    <p>
                        Don't have an account? <a href="/register">Register</a> |
                        Forget your password? <a href="/forget-password">Reset Password</a>
                    </p>
                </div>
            </div>
        </>
    )
}

export default Login