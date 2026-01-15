export default function Button({ children, onClick, className }) {
  return(
    <button onClick={onClick} className={`bg-primary border-primary text-center shadow-lg hover:bg-primary/80 transition ${className}`}>{children}</button>
  )
}
