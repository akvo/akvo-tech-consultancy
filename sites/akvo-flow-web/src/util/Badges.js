import React from 'react'
import {
    FaExclamationTriangle,
    FaCheckCircle,
} from 'react-icons/fa'

export const Mandatory = (identifier, answered) => {
    if (answered) {
        return (
            <FaCheckCircle
                color="green"
                className="float-right"
                id={identifier.id}
            />
        )
    }
    return (
        <FaExclamationTriangle
            color="red"
            className="float-right"
            id={identifier.id}
        />
    )
}
