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
            setSuccess('Password Reset Successfully.');
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
                <h2 className="text-2xl font-bold text-center mb-4">Reset Password</h2>
                {success && <Alert type="success" onClear={() => setSuccess('')} delay = '1000000'>{ success }</Alert>}
                {error && <Alert type="error" onClear={() => setError('')}>{ error }</Alert>}
                {!success &&
                    <div>
                        {validToken ? (
                            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                                <Input type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                <Input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                                <Button type="submit" disabled={loading} >{loading? "Resetting Password..." : "Reset Password"}</Button>
                            </form>                        
                        ) : (
                            <Alert type="error" onClear={() => setError('')} delay = '1000000'>Invalid Token</Alert>
                        )}
                    </div>
                }
                
                <div className="mt-3">
                    <p className="py-1">Go back to <a href="/login">Login</a> page.</p>
                </div>
            </div>
        </>
    );
}

export default ResetPassword;