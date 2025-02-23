export function Button({ children, onClick, className }) {
    return (
      <button
        onClick={onClick}
        className={`px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-lg transition duration-300 ${className}`}
      >
        {children}
      </button>
    );
  }
  