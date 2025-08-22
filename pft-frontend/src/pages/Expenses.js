import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import AuthContext from "../context/authContext";
import ExpenseForm from "../components/ExpenseForm";
import ExpencseCategoryForm from "../components/ExpencseCategoryForm";
import iconEdit from "../assets/icons/edit.svg"
import iconDelete from "../assets/icons/delete.svg";

function Expenses(){
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user, logout} = useContext(AuthContext);
    const navigate = useNavigate();

    // Edit Status
    const [editId, setEditId] = useState('');
    const [categories, setCategories] = useState([]);
    const [editCategory, setEditCategory] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editAmount, setEditAmount] = useState('');
    const [editDate, setEditDate] = useState('');

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

        const fetchCategories = async () => {
            try{
                const token = user.token;

                const {data} = await api.get('/categories?type=expense', 
                    {headers: {Authorization: `Bearer ${token}`}},
                )

                setCategories(data);

            }catch(err){
                console.error('Failed to load categories', err);
            }
        }
        fetchExpenses();
        fetchCategories();
    }, [user]);
    
    const handleAddExpenses = (newExpenseData) => {
        const newExpense = newExpenseData.newExpense;
        setExpenses(prev => [...prev, newExpense]); //Add new expense to the table
    }

    const handleEdit = (expense) => {
        const formattedDate = new Date(expense.date).toISOString().split('T')[0]; // "YYYY-MM-DD"
        setEditId(expense._id);
        setEditDate(formattedDate);
        setEditAmount(expense.amount);
        setEditDescription(expense.description);
        setEditCategory(expense.category._id)
    }

    const handleUpdate = () => {
        
    }

    return(
        <>
            <div>
                <h2>My Expenses</h2>
                <button onClick={() => logout(navigate)}>Log Out</button> {/* Use logout from context */}

                <div>
                    <ExpenseForm categories={categories}  onExpenseAdded={handleAddExpenses} />
                </div>
                <div>
                    <ExpencseCategoryForm onCategoryAdded={(newCategory) => {
                        setCategories(prev => [...prev, newCategory]);
                        setEditCategory(newCategory._id);
                        console.log('New Category Added', newCategory);
                    }} />
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
                                    <th>Date</th>
                                    <th>Category</th>
                                    <th>Description</th>
                                    <th>Amount <small>(AED)</small></th>                                    
                                    </tr>
                                </thead>
                                <tbody>
                                    {expenses.map((expense) => (
                                    <tr key={expense._id}>
                                        {editId === expense._id ? (
                                            <>
                                                <td>
                                                    <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
                                                </td> 
                                                <td>
                                                    <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)}>
                                                        {categories.map(cat => (
                                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td>
                                                    <input type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                                                </td> 
                                                <td>
                                                    <input type="text" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} />
                                                </td>                                                 
                                                <td span='2'>
                                                    <button onClick={() => handleUpdate(expense._id)}>Update</button>
                                                </td>
                                            </>
                                        ):(
                                            <>
                                                <td>{expense.date}</td>
                                                <td>
                                                    {expense.category?.name || 'N/A'}
                                                </td>
                                                <td>{expense.description}</td>
                                                <td align="right">{Number(expense.amount).toFixed(2)}</td> 
                                                <td>
                                                    <button className="icon_button edit" onClick={() => handleEdit(expense)}>
                                                        <img src={iconEdit} alt="Edit record" width="20" height="20" /> 
                                                    </button>
                                                </td>     
                                                <td><button className="icon_button delete">
                                                    <img src={iconDelete} alt="Edit record" width="20" height="20" /></button>
                                                </td>
                                            </>
                                        )}
                                                                            
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