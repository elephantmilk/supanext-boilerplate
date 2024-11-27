export function Button({ variant = 'default', size = 'default', className, ...props }) {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:opacity-50"
  
  const variants = {
    default: "bg-brand hover:bg-brand/90 text-white",
    secondary: "bg-brand-light text-brand hover:bg-brand-light/80",
    outline: "border border-brand bg-transparent hover:bg-brand-light text-brand",
    ghost: "hover:bg-brand-light hover:text-brand",
    link: "text-brand underline-offset-4 hover:underline",
  }
  
  const sizes = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-9 px-3 text-sm",
    lg: "h-11 px-8 text-base",
    icon: "h-10 w-10",
  }
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  )
} 