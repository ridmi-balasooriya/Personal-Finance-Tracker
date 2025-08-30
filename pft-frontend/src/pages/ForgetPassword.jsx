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
                <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>
                {success && <Alert type="success" onClear={() => setSuccess('')} delay = '1000000'>{ success }</Alert>}
                {error && <Alert type="error" onClear={() => setError('')}>{ error }</Alert>}
                {!success &&
                    <div>
                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <Input type='email' placeholder='Enter Your Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <Button type="submit" disabled={loading}>{loading? "Sending..." : "Send Reset Link"}</Button>
                        </form>
                        <div className="mt-3">
                            <p className="py-1">Go back to <a href="/login">Login</a> page.</p>
                        </div>
                    </div>
                }
                
            </div>
        </>
    );
}

export default ForgetPassword;