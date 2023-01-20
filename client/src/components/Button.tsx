
enum ButtonColors {
    primary =  "bg-cyan-700",
    secondary = "bg-purple-700",
};

type Props = {
    onClick?: (...args: any[]) => void | ((...args: any[]) => Promise<unknown>),
    color: keyof typeof ButtonColors,
    children: React.ReactNode,
}

const Button: React.FC<Props> = (
    {
        onClick,
        color = "primary",
        children,
    }
) => {

    console.log(typeof children);

    return (
        <button
            onClick={onClick}
            className={`px-2 py-1 ${ButtonColors[color]} rounded-md`}
        >
            {
                typeof children === "string" ? (
                    <p
                        className="text-md text-white"
                    >
                        { children }
                    </p>
                ) : children
            }
        </button>
    );
}

export default Button;
