import { useState, useContext } from "react";
import AuthContext from "../context/authContext";
import api from "../api";
import { Button, Input, Select } from "./ui";

const ExpenseForm = ({categories, onExpenseAdded}) => {
    
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState('');

    const [error, setError] = useState('');
    const {user} = useContext(AuthContext);   
    
    const handdleSubmit = async (e) => {
        e.preventDefault();

        setError('');
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
        }
        catch(err){
            console.error('Error adding expnenses', err);
        }
    }

    return(
        <>
            <div>
                {error && <span className="message_span error">{ error }</span>}
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