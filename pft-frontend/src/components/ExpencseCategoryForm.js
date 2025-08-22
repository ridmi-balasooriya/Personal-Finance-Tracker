import { useState, useContext } from "react";
import api from "../api";
import AuthContext from "../context/authContext";
import {Button, Input} from "./ui";

const ExpencseCategoryForm = ({onCategoryAdded}) => {
    const [categoryName, setCategoryName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if(!categoryName.trim){
            setError('Category Name is Required.!');
            return;
        }

        try{
            setLoading(true);
            setError('');

            const token = user?.token;

            const {data} = await api.post('/categories',
                {name: categoryName, type:'expense'},
                { headers: {Authorization: `Bearer ${token}`}}
            );

            setCategoryName('');

            if(onCategoryAdded){
                onCategoryAdded(data); //Send new category back to parent component
            }

        } catch(err) {
            console.log(err);
            setError('Fail to add new Category. Try Again.!')
        } finally {
            setLoading(false);
        }

    }

    return(
        <>
            <form onSubmit={handleSubmit}>
                <Input type='text' placeholder='New Category' value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
                <Button type="submit" disabled={loading} variant="primary">{loading? "Adding..." : "Add Category"}</Button>
                {error && <span className="message_span error">{error}</span>}
            </form>
        </>
    );
}

export default ExpencseCategoryForm;