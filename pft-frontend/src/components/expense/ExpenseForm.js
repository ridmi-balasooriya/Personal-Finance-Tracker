import { useState, useContext } from "react";
import AuthContext from "../../context/authContext";
import api from "../../api";
import { Button, Input, Select, Alert } from "../ui";

const ExpenseForm = ({categories, onExpenseAdded}) => {
    
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const {user} = useContext(AuthContext);   

    const clearAfterDelay = (settler, delay = '3000') => {
        setTimeout(() => {
            settler('');
        }, delay)
    };
    
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
            
            const {data} = await api.post('/expenses', 
                {description, amount, date, category}, { 
                    headers: {Authorization: `Bearer ${token}`}
            });
            onExpenseAdded(data);
            setDescription('');
            setAmount('');
            setDate('');
            setCategory('');
            setSuccess('Expense added successfully');
            clearAfterDelay(setSuccess);
        }
        catch(err){
            console.error('Error adding expnenses', err);
            setError('Failed to add expense');            
            clearAfterDelay(setError);
        }
    }

    return(
        <>
            <div>
                {success && <Alert type="success">{ success }</Alert>}
                {error && <Alert type="error">{ error }</Alert>}
                <div>
                    <form onSubmit={handdleSubmit}>
                        <Select value={category} onChange={(e) => setCategory(e.target.value)} options={categories} required></Select>
                        <Input type="text" placeholder="Expense Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                        <Input type="number" placeholder="Expense Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
                        <Input type="date" placeholder="Expense Date" value={date} onChange={(e) => setDate(e.target.value)} />
                        <Button type="submit" variant="primary">Add Expense</Button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ExpenseForm;