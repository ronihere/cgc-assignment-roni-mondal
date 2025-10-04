'use client'
import React, { ButtonHTMLAttributes } from 'react'

interface OutlineButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string; // custom text prop
    children: React.ReactNode,
}

export default function OutLineButton({ children, onClick, type, className }: OutlineButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`flex items-center gap-3 hover:opacity-80 transition-opacity ${className}`}
        >
            {children}
        </button>
    )
}
