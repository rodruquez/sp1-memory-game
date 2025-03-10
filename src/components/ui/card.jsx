export const Card = ({ children, className, onClick }) => {
  return (
    <div onClick={onClick} className={`p-4 rounded-lg shadow-md ${className}`}>
      {children}
    </div>
  );
};

export const CardContent = ({ children }) => {
  return <div>{children}</div>;
};
