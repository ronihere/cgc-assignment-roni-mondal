import React, { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
    children: React.ReactNode,
}
export default function SecondaryButton(props: ButtonProps) {
    return (
        <button
            type={props.type}
            onClick={props.onClick}
            className="w-full h-[54px] rounded-[10px] border border-white text-white font-bold hover:bg-white hover:bg-opacity-10 transition-colors"
        >
            {props.children}
        </button>
    )
}
