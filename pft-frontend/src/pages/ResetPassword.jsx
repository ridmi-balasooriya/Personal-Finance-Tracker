import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import api from "../api";
import { Button, Input, Alert} from "../components/ui";

const ResetPassword = () => {

    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [loading, setLoading] = useState(false);
     const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [validToken, setValidToken] = useState(false);

    useEffect(() => {
        const checkToken = async () => {            
            try{
                await api.get(`/auth/reset-password/${token}`);
                setValidToken(true);
            }
            catch(err){
                setError('Invalid or Expired Token')
            }
        }
        checkToken();
    }, [token]);

    const handleSubmit = async (e) => {

        e.preventDefault();
        
        if(password !== confirmPassword){
            setError('Password do not match.');
            return;
        }

        try{
            setLoading(true);

            const res = await api.post(`/auth/reset-password/${token}`, {password});
            setSuccess(res.data.message);
            setTimeout( () => navigate('/login'), 2000);
        }
        catch(err){
            setError(err.response?.data?.message || 'Something went wrong');
        }finally{
            setLoading(false);
        }
    }

    return(
        <>
            <div>
                <h2>Reset Password</h2>
                {success && <Alert type="success" onClear={() => setSuccess('')}>{ success }</Alert>}
                {error && <Alert type="error" onClear={() => setError('')}>{ error }</Alert>}
                {validToken ? (
                    <div>
                        <form onSubmit={handleSubmit}>
                            <Input type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <Input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                            <Button type="submit" disabled={loading} >{loading? "Resetting Password..." : "Reset Password"}</Button>
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