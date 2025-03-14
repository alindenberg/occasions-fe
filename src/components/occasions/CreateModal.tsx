import { useRef, useEffect } from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/router'
import EditOccasionComponent from './Edit'

interface CreateModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
}

export default function CreateModal({ isOpen, onClose, onSuccess }: CreateModalProps) {
    const modalRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const { data: session } = useSession()
    const hasCredits = (session?.user?.credits ?? 0) > 0

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

        // Call onSuccess callback if provided
        if (onSuccess) {
            onSuccess()
        }

        onClose()
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
                    {hasCredits ? (
                        <EditOccasionComponent formSubmitFunction={createOccasionFunction} />
                    ) : (
                        <div className="text-center py-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-orange-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">You're out of credits</h3>
                            <p className="text-gray-600 mb-6">You need credits to create new occasions.</p>
                            <button
                                onClick={() => {
                                    onClose();
                                    router.push('/credits');
                                }}
                                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                            >
                                Purchase Credits
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}