import { LoaderIcon } from "lucide-react";
import { ButtonHTMLAttributes } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string; // custom text prop
}

export default function PrimaryButton({
    label,
    className = "",
    ...props
}: PrimaryButtonProps) {
    return (
        <button
            className={`w-full h-[54px] rounded-[10px] bg-primary text-white font-bold text-[16px] leading-6 hover:opacity-90 transition-opacity ${className}`
            }
            {...props}
        >
            {props.disabled ? <LoaderIcon className="mx-auto animate-spin" /> : props.children}
        </button>
    );
}

