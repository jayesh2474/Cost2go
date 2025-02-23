export function Card({ children, className }) {
    return (
      <div className={`bg-white rounded-2xl shadow-2xl p-6 ${className}`}>
        {children}
      </div>
    );
  }
  
  export function CardContent({ children, className }) {
    return (
      <div className={`p-4 ${className}`}>
        {children}
      </div>
    );
  }
  