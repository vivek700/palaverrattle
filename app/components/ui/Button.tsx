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
  return (
    <button
      className={cn(
        "flex items-center justify-center rounded-full bg-slate-300 px-5 py-3 font-semibold text-slate-900 transition-colors duration-300 hover:bg-slate-400  focus:outline-none focus:ring focus:ring-violet-500 focus:ring-offset-4 focus:ring-offset-gray-800",
        className,
      )}
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
