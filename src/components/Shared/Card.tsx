export default function Card({ children, className, ...props }) {
  return (
    <div
      className={`rounded-3xl px-10 py-4 drop-shadow-xl bg-white text-gray-900 ${className}`}
      {...props}
    >
      {Object.keys(props)}
      {children}
    </div>
  );
}
