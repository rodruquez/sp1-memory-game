export const Button = ({ children, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition ${className}`}
    >
      {children}
    </button>
  );
};
