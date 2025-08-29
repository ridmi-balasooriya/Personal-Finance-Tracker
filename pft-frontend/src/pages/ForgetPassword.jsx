import { useState } from 'react';
import api from '../api';
import { Button, Input, Alert} from "../components/ui";

const ForgetPassword = () => {

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        
        e.preventDefault();

        try{
            setLoading(true);
            const res = await api.post('/auth/forget-password', {email});
            setSuccess(res.data.message);
        }
        catch(err){
            setError( err.response?.data?.message || 'Something went wrong.')
        }finally{
            setLoading(false);
        }
    }

    return(
        <>
            <div>
                <h2>Forgot Password</h2>
                {success && <Alert type="success" onClear={() => setSuccess('')}>{ success }</Alert>}
                {error && <Alert type="error" onClear={() => setError('')}>{ error }</Alert>}
                <div>
                    <form onSubmit={handleSubmit}>
                        <Input type='email' placeholder='Enter Your Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <Button type="submit" disabled={loading}>{loading? "Sending..." : "Send Reset Link"}</Button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ForgetPassword;