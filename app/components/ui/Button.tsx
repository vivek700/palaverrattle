import { cn } from "@/app/lib/utils/cn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  className,
  children,
  loading,
  ...props
}) => {
  const defaultClasses: string =
    " bg-slate-200 text-slate-950 py-3 px-5 font-semibold flex justify-center items-center transition-colors duration-300 rounded-full hover:bg-slate-950 hover:text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-500 focus:ring-offset-2";
  return (
    <button
      className={cn(defaultClasses, className)}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
