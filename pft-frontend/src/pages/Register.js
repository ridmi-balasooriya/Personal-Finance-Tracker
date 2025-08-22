import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { Button, Input} from "../components/ui";

const Register = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {

        e.preventDefault();
        setError('');

        if(confirmPassword !== password){
            setError('Passwords do not match.');
            return;
        }

        if(name==='' || email==='' || password===''|| confirmPassword===''){
            setError('Fields cannot be empty.');
            return;
        }

        try{
            await api.post('/auth/register', {name, email, password});
            setSuccess('You are registered successfully.! You are being redirected to login page...')
            setTimeout(() => {
                navigate('/login');
            }, 3000)
            
        }
        catch(err){
            setError(err.response?.data?.message || "Registration Failed")
        }
    }

    return(
        <>
            <div>
                {error && <span className="message_span error">{error}</span>}
                {success && <span className="message_span success">{success}</span>}
                <div>
                    <form onSubmit={handleRegister}>
                        <Input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <Input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        <Button type="submit">Register</Button>
                        <p>Already have an account? <a href="/login">Login</a></p>
                    </form>
                </div>
            </div>
        </>
    )

}

export default Register