const Input = ({label, type='text', value, onChange, placeholder, variant='default'}) => {

    const baseStyle = 'w-full bg-white border border-gray-300 px-3 py-2 mb-1 focus:outline-none focus:righ-2 focus:ring-gray-300 focus:border-gray-400';

    return(
        <div>
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