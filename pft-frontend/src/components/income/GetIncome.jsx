import { useState, useEffect, useContext, forwardRef, useImperativeHandle } from "react";
import api from '../../api';
import authContext from '../../context/authContext';
import { Alert } from '../ui';
import dayjs from "dayjs";

const GetIncome = forwardRef(({ filters = {}}, ref) => {
    const [incomes, setIncomes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('')
    const { user } = useContext(authContext);

    const fetchIncome = async (extraFilters = filters) => {
        if(!user || !user.token) return;

        try{

            setLoading(true)
            setError('')
            const token = user.token;

            // request with filter or default handle by backend
            const { data } = await api.get('/incomes', {
                headers: { Authorization: `Bearer ${user.token}` },
                params: extraFilters,
            });

            setIncomes(data);

        }catch (err) {
            console.error(err);
            setError('Failed to load incomes. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    // Expose fetchIncome to parent
    useImperativeHandle(ref, () => ({
        refresh: (customFilters) => fetchIncome(customFilters),
    }));
    
    useEffect(() => {
        if(user) fetchIncome();

    }, [user]);

    return(
        <div>
            <h2>My Income</h2>
            {loading ? (
                <p>Loading incomes...</p>
                ) : error? (
                    <Alert type="error" onClear={() => setError("")}>{error}</Alert>
                ) : incomes.length === 0 ? (
                    <Alert type="info">No incomes found</Alert>
                ) : (
                    <table  className="income_table" border="1">
                        <thead>
                            <th>Date</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Amount <small>(AED)</small></th>
                        </thead>
                        <tbody>
                            {incomes.map((income) =>
                            <tr key={income._id}>
                                <td>{dayjs(income.date).format("YYYY-MM-DD")}</td>
                                <td>{income.category?.name || 'N/A'}</td>
                                <td>{income.description}</td>
                                <td>{Number(income.amount).toFixed(2)}</td>
                            </tr>                                
                            )}
                        </tbody>
                    </table>
                )
            
            }
        </div>
    )
});

export default GetIncome;