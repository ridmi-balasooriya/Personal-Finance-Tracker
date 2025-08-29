import { Button } from '.';
import iconDelete from "../../assets/icons/delete.svg";

const DeleteButton = ({ onDelete }) => {
    return(
        <Button variant="icon_button delete" onClick={onDelete}>
            <img src={iconDelete} alt='Delete record' width='20' height='20' />
        </Button>
    )
}

export default DeleteButton;