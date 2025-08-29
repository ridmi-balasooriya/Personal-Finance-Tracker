import { useEffect } from "react";

const Alert = ({ type = 'info', children, onClear, delay = 3000 }) => {
    const baseClass = 'message_span';
    const typeClasses = {
        success: 'success',
        error: 'error',
        info: 'info'
    }
    
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