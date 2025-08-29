function Button ({children, onClick, type='button', variant='primary', classes}) {
    
    const baseStlye = "button";
    

    return(
        <button type={type} onClick={onClick} className={`${baseStlye} ${variant}`}>
            {children}
        </button>
    )

}

export default Button;