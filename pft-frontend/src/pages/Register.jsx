import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { Button, Input, Alert} from "../components/ui";

const Register = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);
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
            setLoading(true);
            
            await api.post('/auth/register', {name, email, password});
            setSuccess('You are registered successfully.! You are being redirected to login page...')
            setTimeout(() => {
                navigate('/login');
            }, 3000)
            
        }
        catch(err){
            setError(err.response?.data?.message || "Registration Failed");
            setLoading(false);
        }finally{
            setLoading(false);
        }
    }

    return(
        <>
            <div>
                <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
                {error && <Alert type="error" onClear={()=>setError('')}>{ error }</Alert>}
                {success && <Alert type="success" onClear={()=>setSuccess('')}>{success}</Alert>}
                <div>
                    <form className="flex flex-col gap-4" onSubmit={handleRegister}>
                        <Input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <Input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        <Button type="submit" disabled={loading} >{loading? "Registering..." : "Register"}</Button>
                        <div className="mt-3">
                            <p className="py-1">Already have an account? <a href="/login">Login</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )

}

export default Register