import React from "react";

const Input = ({label, type='text', value, onChange, placeholder, variant='default'}) => {

    const baseStyle = 'input';

    return(
        <div className="input_div">
            {label && <label>{label}</label>}
            <input 
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`${baseStyle} ${variant}`}
            />
        </div>
    );

}

export default Input;