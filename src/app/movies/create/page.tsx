import CreateMovie from '@/app/components/client/CreateOrEditMovie'
import React from 'react'

export default function page() {
    return (
        <CreateMovie isEdit={false} />
    )
}
