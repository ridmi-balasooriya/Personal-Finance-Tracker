import { Input, Select, Button } from "../ui";

const EditExpenseRow = ({ //Props
    editDate,  editDescription, editCategory, editAmount, categories, 
    onChangeDate, onChangeCategory, onChangeDescription, onChangeAmount, onUpdate
}) => {
    return(
        <>
            <td>
                <Input type="date" value={editDate} onChange={(e) => onChangeDate(e.target.value)} />
            </td> 
            <td>
                <Select value={editCategory} onChange={(e) => onChangeCategory(e.target.value)} options={categories}></Select>
            </td>
            <td>
                <Input type="text" value={editDescription} onChange={(e) => onChangeDescription(e.target.value)} />
            </td> 
            <td>
                <Input  type="text" value={editAmount} onChange={(e) => onChangeAmount(e.target.value)} />
            </td>                                                 
            <td colSpan='2' align="center">
                <Button onClick={onUpdate} variant="primary">Update</Button>
            </td>
        </>
    );
}

export default EditExpenseRow;