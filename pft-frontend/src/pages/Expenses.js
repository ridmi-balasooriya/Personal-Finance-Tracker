import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import AuthContext from "../context/authContext";
import ExpenseForm from "../components/ExpenseForm";

function Expenses(){
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user, logout} = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(!user || !user.token) return;

        const fetchExpenses = async () => {  
            try{
                setLoading(true);
                setError('');                
                
                const token = user.token;

                const {data} = await api.get('/expenses', {
                    headers: {Authorization: `Bearer ${token}`}
                });

                setExpenses(data)
            }
            catch(err){
                console.error(err)
                setError("Failed to load expenses. Please try again.");
            }
            finally{
                setLoading(false);
            }
        };
        fetchExpenses();
    }, [user]);
    
    const handleAddExpenses = (newExpenseData) => {
        const newExpense = newExpenseData.newExpense;
        setExpenses(prev => [...prev, newExpense]); //Add new expense to the table
    }

    return(
        <>
            <div>
                <h2>My Expenses</h2>
                <button onClick={() => logout(navigate)}>Log Out</button> {/* Use logout from context */}

                <div>
                    <ExpenseForm onExpenseAdded={handleAddExpenses} />
                </div>
                
                <div>
                    {loading ?(
                            <p>Loading expenses...</p>
                        ) : error ? (
                            <span className="message_span error">{ error }</span>
                        ) : expenses.length === 0 ? (
                            <span className="message_span error">No expenses found</span>
                        ) : (
                            <table className='expense_table' border='1'>
                                <thead>
                                    <tr>
                                    <th>Description</th>
                                    <th>Amount <small>(AED)</small></th>
                                    <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expenses.map((expense) => (
                                    <tr key={expense._id}>
                                        <td>{expense.description}</td>
                                        <td>{expense.amount}</td>
                                        <td>{expense.date}</td>
                                    </tr>
                                    ))

                                    }
                                </tbody>
                            </table>
                        )

                    }
                </div>                                    
            </div>
        </>
    );
}

export default Expenses;