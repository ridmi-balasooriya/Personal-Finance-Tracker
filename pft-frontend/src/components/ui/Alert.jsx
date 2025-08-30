import { useEffect } from "react";

const Alert = ({ type = 'info', children, onClear, delay = 3000 }) => {

    const baseClass = "block mt-2 mb-3 p-3 text-sm";
    const typeClasses = {
        success: "bg-green-100 text-green-700 border border-green-400",
        error: "bg-red-100 text-red-700 border border-red-400",
        info: "bg-blue-100 text-blue-900 border border-blue-400",
    };
    
    useEffect(() => {
        if(!children || !onClear) return;
            
        const timer = setTimeout(() => {
            onClear(); //clear message from the parent
        }, delay);

        return () => clearTimeout(timer); //cleanup on unmount
        
    }, [children, delay, onClear]);

    if(!children) return null;

    return(
        <span className={`${baseClass} ${typeClasses[type]}`}>
            {children}
        </span>
    )
}

export default Alert;