function Button ({children, onClick, type='button', variant='primary', classes}) {
    
    const baseStlye = "w-full max-w-[200px] mx-auto my-1 block px-4 py-2 rounded-sm font-medium focus:ring-2 focus:ring-blue-400 cursor-pointer focus:outline-none transition duration-300 shadow-sm";
      const variantStyles = {
        primary: "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-100",
        edit: "bg-green-700 text-white hover:bg-green-800 focus:ring-green-400",
        delete: "bg-red-700 text-white hover:bg-red-800 focus:ring-red-400",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
  };

    return(
        <button type={type} onClick={onClick} className={`${baseStlye} ${variantStyles[variant]}`}>
            {children}
        </button>
    )

}

export default Button;