import { useState, useContext } from "react";
import AuthContext from "../context/authContext";
import api from "../api";

function ExpenseForm({onExpenseAdded}){   
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [error, setError] = useState('');
    const {user} = useContext(AuthContext);

    const handdleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        if(!description || !amount || !date){
            setError('Please fill required fields');
            return;
        }

        if (!user || !user.token) {  // ✅ Ensure token is available
            setError("User not authenticated. Please login.");
            return;
        }

        try{
            const token = user.token;
            console.log("Sending token:", token);
            
            const {data} = await api.post('/expenses', 
                {description, amount, date},
                { headers: {Authorization: `Bearer ${token}`}}
            );
            onExpenseAdded(data);
            setDescription('');
            setAmount('');
            setDate('');
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
                        <input type="text" placeholder="Expense Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                        <input type="number" placeholder="Expense Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
                        <input type="date" placeholder="Expense Date" value={date} onChange={(e) => setDate(e.target.value)} />
                        <button type="submit">Add Expense</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ExpenseForm;