'use client'
import OutLineButton from '@/app/components/client/outLineButton'
import { useRouter } from 'next/navigation'
import React from 'react'


export default function AddMovieButton() {
    const router = useRouter()
    return (
        <OutLineButton
            className="w-8 h-8 flex items-center justify-center"
            aria-label="Add movie"
            onClick={() => router.push('/movies/create')}
        >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_13_47)">
                    <path d="M17.3334 9.33329H14.6667V14.6666H9.33341V17.3333H14.6667V22.6666H17.3334V17.3333H22.6667V14.6666H17.3334V9.33329ZM16.0001 2.66663C8.64008 2.66663 2.66675 8.63996 2.66675 16C2.66675 23.36 8.64008 29.3333 16.0001 29.3333C23.3601 29.3333 29.3334 23.36 29.3334 16C29.3334 8.63996 23.3601 2.66663 16.0001 2.66663ZM16.0001 26.6666C10.1201 26.6666 5.33341 21.88 5.33341 16C5.33341 10.12 10.1201 5.33329 16.0001 5.33329C21.8801 5.33329 26.6667 10.12 26.6667 16C26.6667 21.88 21.8801 26.6666 16.0001 26.6666Z" fill="white" />
                </g>
                <defs>
                    <clipPath id="clip0_13_47">
                        <rect width="32" height="32" fill="white" />
                    </clipPath>
                </defs>
            </svg>
        </OutLineButton>
    )
}
