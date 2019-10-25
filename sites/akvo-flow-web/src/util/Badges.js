import React from 'react'
import {
    FaExclamationTriangle,
    FaCheckCircle,
} from 'react-icons/fa'

export const Mandatory = (answered) => {
    if (answered) {
        return (
            <FaCheckCircle
                color="green"
                className="float-right"
            />
        )
    } else {
        return (
            <FaExclamationTriangle
                color="red"
                className="float-right"
            />
        )
    }
}
