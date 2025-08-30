const PublicLayout = ({ children }) => {
    return(
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-[50%_50%] lg:grid-cols-[55%_45%] bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="flex items-center justify-center p-10 bg-slate-50 sm:pb-0">
                <div className="max-w-md text-center md-text-left">
                    <h1 className="text-4xl font-extrabold mb-1 text-blue-600 tracking-wide uppercase text-center">
                        BudgetWise
                    </h1>
                    <p className="text-lg text-gray-600 mb-6 text-center max-w-md">
                        Your smart companion for managing budgets with ease.
                    </p>
                </div>                
            </div>            
            <div className="flex items-center justify-center">
                <div className="w-full max-w-md bg-slate-50 p-6 sm:p-10 shadow-lg">
                    { children }
                </div>
                             
            </div>            
        </div>
    );
}

export default PublicLayout;