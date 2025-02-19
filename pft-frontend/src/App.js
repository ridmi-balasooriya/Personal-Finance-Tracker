import './App.css';
import api from './api';
import {useState, useEffect} from 'react'

function App() {
  const [expenses, setExpenses] = useState([])
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    date: '',
  })

  //Fetch expenses from the backend
  useEffect(() => {
    api.get('/expenses')
    .then((response) => setExpenses(response.data))
    .catch(error => console.error("Error fetching expenses: ", error))
  }, [])

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setNewExpense({...newExpense, [name]:value })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/expenses', newExpense)
    .then((response) => {
      setExpenses([...expenses, response.data.newExpense]);
      setNewExpense({description:'', amount:'', date:''});
    })
    .catch((error) => {
      console.log('Error Adding Expenses:', error)
    })
  }

  return (
    <div className='app'>
      <h1>Personal Finance Tracker</h1>
      <div className='expense_from'>
        <form onSubmit={handleSubmit}>
          <input 
            type="text"
            name="description"
            placeholder="Description"
            value={newExpense.description}
            onChange={handleInputChange}
            required 
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={newExpense.amount}
            onChange={handleInputChange}
            required
          />
          <input 
            type="date"
            name="date"
            value={newExpense.date}
            onChange={handleInputChange}
            required
          />
          <button type='submit'>Add Expense</button>
        </form>
      </div>

      <div className='expense_list'>
        <table className='expense_table' border='1'>
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount <small>(AED)</small></th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
          {
            expenses.map((expense) => (
              <tr key={expense._id}>
                <td>{expense.description}</td>
                <td>{expense.amount}</td>
                <td>{expense.date}</td>
              </tr>
            ))
          }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
