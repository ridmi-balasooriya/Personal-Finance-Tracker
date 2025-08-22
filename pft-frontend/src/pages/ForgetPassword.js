import { useState } from 'react';
import api from '../api';
import { Button, Input} from "../components/ui";

const ForgetPassword = () => {

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
                        <Input type='email' placeholder='Enter Your Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <Button type="submit">Send Reset Link</Button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ForgetPassword;