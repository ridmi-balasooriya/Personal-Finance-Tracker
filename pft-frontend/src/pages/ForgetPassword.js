import { useState } from 'react';
import api from '../api';

function ForgetPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        
        e.preventDefault();
        
        try{
            const res = await api.post('/auth/forget-password', {email});
            setMessage(res.data.message);
        }
        catch(err){
            setMessage( err.response?.data?.message || 'Something went wrong.')
        }
    }

    return(
        <>
            <div>
                <h2>Forgot Password</h2>
                {message && <span>{message}</span>}
                <div>
                    <form onSubmit={handleSubmit}>
                        <input type='email' placeholder='Enter Your Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <button type='submit'>Send Reset Link</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ForgetPassword;