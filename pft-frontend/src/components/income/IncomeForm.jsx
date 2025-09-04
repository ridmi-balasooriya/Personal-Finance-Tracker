import { useState, useEffect, useContext } from "react";
import AuthContext from "../../context/authContext";
import api from "../../api";
import { Button, Input, Select, Alert } from "../ui";

const IncomeForm = () => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const {user} = useContext(AuthContext);   

    useEffect(() => {
            if(!user || !user.token) return;
    
            const fetchCategories = async () => {
                try{
                    const token = user.token;
    
                    const {data} = await api.get('/categories?type=income', 
                        {headers: {Authorization: `Bearer ${token}`}},
                    )
    
                    setCategories(data);
    
                }catch(err){
                    console.error('Failed to load categories', err);
                }
            }
            fetchCategories();
        }, [user]);

    const handdleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setSuccess('');

        if(!description || !amount || !date){
            setError('Please fill required fields');
            return;
        }

        if (!user || !user.token) {  // Ensure token is available
            setError("User not authenticated. Please login.");
            return;
        }

        try{
            const token = user.token;
            setLoading(true);
            
            const {data} = await api.post('/incomes', 
                {description, amount, date, category}, { 
                    headers: {Authorization: `Bearer ${token}`}
            });
            
            //onIncomeAdded(data);
            setDescription('');
            setAmount('');
            setDate('');
            setCategory('');
            setSuccess('Income added successfully');
        }
        catch(err){
            console.error('Error adding incomes', err);
            setError('Failed to add income');            
        } finally{
            setLoading(false);
        }
    }

        return(
        <>
            <div>
                {success && <Alert type="success" onClear={() => setSuccess('')}>{ success }</Alert>}
                {error && <Alert type="error" onClear={() => setError('')}>{ error }</Alert>}
                <div>
                    <form onSubmit={handdleSubmit}>
                        <Select value={category} onChange={(e) => setCategory(e.target.value)} options={categories} required></Select>
                        <Input type="text" placeholder="Income Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                        <Input type="number" placeholder="Income Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
                        <Input type="date" placeholder="Income Date" value={date} onChange={(e) => setDate(e.target.value)} />
                        <Button type="submit" disabled={loading} variant="primary">{loading? "Adding..." : "Add Income"}</Button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default IncomeForm