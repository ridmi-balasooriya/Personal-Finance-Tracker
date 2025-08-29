const Select = ({label, value, onChange, options, variant='default'}) => {
    const baseStyle = 'select'

    return(
        <div className="input_div">
            {label && <label>{label}</label>}
            <select value={value} onChange={onChange} className={`${baseStyle} ${variant}`}>
                <option value="">-- Select --</option>
                {options.map((opt) => (
                    <option key={opt._id} value={opt._id}>
                        {opt.name}
                    </option>
                
                ))}
            </select>
        </div>
    );
}

export default Select;