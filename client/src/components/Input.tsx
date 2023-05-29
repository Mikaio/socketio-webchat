import { classnames } from "../../tailwindcss.classnames";
import { display } from "tailwindcss-classnames";
import { typography } from "tailwindcss-classnames";
import { borderWidth } from "tailwindcss-classnames";
import { borderColor } from "tailwindcss-classnames";
import { ringColor } from "tailwindcss-classnames";
import { borderRadius } from "tailwindcss-classnames";
import { backgroundColor } from "tailwindcss-classnames";
import { width } from "tailwindcss-classnames";
import { padding } from "tailwindcss-classnames";
import { margin } from "tailwindcss-classnames";

export type InputProps = {
    value: string | number,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    label?: string,
    placeholder?: string,
    required?: boolean,
    textCenter?: boolean
}

export const Input = ({
    value,
    onChange,
    label = "",
    placeholder = "",
    required = false,
    textCenter = true
}: InputProps) => {

    const inputClassnames = classnames(
        display("block"),
        typography("text-gray-900", "text-sm", (textCenter ? "text-center" : "text-inherit")),
        borderWidth("border"),
        borderColor("border-gray-300", "focus:border-blue-500"),
        borderRadius("rounded-lg"),
        ringColor("focus:ring-blue-500"),
        backgroundColor("bg-zinc-200"),
        width("w-full"),
        padding("p-2.5"), 
    );

    const labelClassnames = classnames(
        display("block"),
        margin("mb-2"),
        typography("text-sm", "font-medium", "text-gray-900", (textCenter ? "text-center" : "text-inherit")),
    );

    return (
        <div>
            {
                label && (
                    <label
                        className={labelClassnames}
                    >
                        {label}
                    </label>
                )
            }
            <input
                className={inputClassnames}
                placeholder={placeholder}
                required={required}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}
