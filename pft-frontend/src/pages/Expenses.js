import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import AuthContext from "../context/authContext";

import ExpenseForm from "../components/expense/ExpenseForm";
import ExpencseCategoryForm from "../components/ExpencseCategoryForm";
import EditRow from "../components/expense/EditExpenseRow";
import { Alert } from "../components/ui";
import EditButton from "../components/ui/EditButton";
import DeleteButton from "../components/ui/DeleteButton";

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, logout} = useContext(AuthContext);
    const navigate = useNavigate();

    // Edit Status
    const [editId, setEditId] = useState('');
    const [categories, setCategories] = useState([]);
    const [editCategory, setEditCategory] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editAmount, setEditAmount] = useState('');
    const [editDate, setEditDate] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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

    const handleUpdate = async (expenseId) => {
        
        try{
            const token = user.token;
            
            const updateExpense = {
                date: editDate,
                category: editCategory,
                description: editDescription,
                amount: editAmount,
            };
           
            const { data } = await api.put(`expenses/${expenseId}`,
                updateExpense,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setExpenses((prev) => 
                prev.map((exp) => (exp._id === expenseId ? data.updatedExpense : exp))
            )

            setEditId('');
            setEditDate('');
            setEditCategory('');
            setEditDescription('');
            setEditAmount('');

            setSuccess('Expense record updated successfully.')

        }catch(err) {   
            console.error('Fail to update expese: ', err);
            alert('Error updating expense. Please try again.');
        }
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
                    {success && <Alert type="success">{success}</Alert>}
                    {loading ?(
                            <p>Loading expenses...</p>
                        ) : error ? (
                            <Alert type="error">{ error }</Alert>
                        ) : expenses.length === 0 ? (
                            <Alert type="info">No expenses found</Alert>
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
                                            <EditRow 
                                                editDate={editDate}
                                                editDescription={editDescription}
                                                editCategory={editCategory}
                                                editAmount={editAmount}
                                                categories={categories}
                                                onChangeDate={setEditDate}
                                                onChangeDescription={setEditDescription}
                                                onChangeCategory={setEditCategory}
                                                onChangeAmount={setEditAmount}
                                                onUpdate={(e) => handleUpdate(expense._id)}
                                            ></EditRow>
                                        ):(
                                            <>
                                                <td>{expense.date}</td>
                                                <td>
                                                    {expense.category?.name || 'N/A'}
                                                </td>
                                                <td>{expense.description}</td>
                                                <td align="right">{Number(expense.amount).toFixed(2)}</td> 
                                                <td>
                                                    <EditButton onEdit={() => handleEdit(expense)}></EditButton>
                                                </td>     
                                                <td>
                                                    <DeleteButton onDelete={() => handleEdit(expense)}></DeleteButton>
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