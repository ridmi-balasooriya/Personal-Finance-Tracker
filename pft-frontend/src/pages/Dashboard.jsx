import { ListIncome, IncomeForm } from "../components/income";

const Dashboard = () => {
    const now = new Date();
    const thisMonthFilters = {
        year: now.getFullYear(),
        month: now.getMonth() + 1, // JS months are 0-based
    };


    return(
        <div>
            <h2>Dashboard</h2>
            {/* Pass filter to ListIncome  */}
            <IncomeForm />
            <ListIncome filters={thisMonthFilters} />
        </div>
    );
}

export default Dashboard;