const Alert = ({ type = 'info', children }) => {
    const baseClass = 'message_span';
    const typeClasses = {
        success: 'success',
        error: 'error',
        info: 'info'
    }

    return(
        <span className={`${baseClass} ${typeClasses[type]}`}>
            {children}
        </span>
    )
}

export default Alert;