import { Button } from './';
import iconEdit from '../../assets/icons/edit.svg';

const EditButton = ({ onEdit }) => {
    return(
        <Button variant='icon_button edit' onClick={onEdit}>
            <img src={iconEdit} alt='Edit record' width='20' height='20' />
        </Button>
    );
}

export default EditButton;