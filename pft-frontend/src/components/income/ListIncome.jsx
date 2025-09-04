import { useContext, useEffect, useRef, useState } from "react";
import GetIncome from "./GetIncome";
import api from "../../api";
import { Button, Alert } from "../ui";
import AuthContext from "../../context/authContext";

const ListIncome = ({ filters = {}, allowEditDelete = false }) => {
    
    const getIncomeRef = useRef(null);
    const [incomes, getIncomes] = useState([]);
    const [error, setError] = useState('')
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (getIncomeRef.current) {
            getIncomeRef.current.refresh(filters);
        }
    }, [filters]); // refresh whenever parent-provided filters change

    return(
        <>
            <GetIncome ref={getIncomeRef} filters={filters} />
        </>
    );
}

export default ListIncome;