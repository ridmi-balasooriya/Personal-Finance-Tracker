import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import api from "../api";

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('');
    const [validToken, setValidToken] = useState(false);

    useEffect(() => {
        const checkToken = async () => {            
            try{
                await api.get(`/auth/reset-password/${token}`);
                setValidToken(true);
            }
            catch(err){
                setMessage('Invalid or Expired Token')
            }
        }
        checkToken();
    }, [token]);

    const handleSubmit = async (e) => {

        e.preventDefault();

        if(password !== confirmPassword){
            setMessage('Password do not match.');
            return;
        }

        try{
            const res = await api.post(`/auth/reset-password/${token}`, {password});
            setMessage(res.data.message);
            setTimeout( () => navigate('/login'), 2000);
        }
        catch(err){
            setMessage(err.response?.data?.message || 'Something went wrong');
        }
    }

    return(
        <>
            <div>
                <h2>Reset Password</h2>
                { message && <span>{message}</span>}
                {validToken ? (
                    <div>
                        <form onSubmit={handleSubmit}>
                            <input type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                            <button type="submit">Reset Password</button>
                        </form>
                    </div>
                ) : (
                    <p>Invalid Token</p>
                )}
            </div>
        </>
    );
}

export default ResetPassword;