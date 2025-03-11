import { useRef, useEffect } from 'react'
import EditOccasionComponent from './Edit'
import { useRouter } from 'next/router'
import { useAuthSession } from '@/hooks/useAuthSession'

interface CreateModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function CreateModal({ isOpen, onClose }: CreateModalProps) {
    const modalRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const { refreshSession } = useAuthSession()

    // Add a click event listener to handle clicks outside the modal
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (isOpen && modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose()
            }
        }

        // Add the event listener when the modal is open
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        // Clean up the event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen, onClose])

    const createOccasionFunction = async ({ label, type, tone, date, customInput, is_recurring }: any) => {
        const response = await fetch('/api/occasions/new', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ label, type, tone, date, customInput, is_recurring })
        })

        if (!response.ok) {
            const json = await response.json()
            throw { type: 'OccasionCreateError', detail: json.error }
        }

        await refreshSession()
        onClose()
        router.push('/')
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div
                ref={modalRef}
                className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4"
            >
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-medium text-gray-900">
                        Create New Occasion
                    </h3>
                    <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500"
                        onClick={onClose}
                    >
                        <span className="sr-only">Close</span>
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-6">
                    <EditOccasionComponent formSubmitFunction={createOccasionFunction} />
                </div>
            </div>
        </div>
    )
}