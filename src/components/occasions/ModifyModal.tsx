import { useRef, useEffect, useState } from 'react'
import EditOccasionComponent from './Edit'
import { useRouter } from 'next/router'
import { Occasion } from '@/types/occasions'

interface ModifyModalProps {
    isOpen: boolean
    onClose: () => void
    occasionId: number | null
    onSuccess?: () => void
}

export default function ModifyModal({ isOpen, onClose, occasionId, onSuccess }: ModifyModalProps) {
    const modalRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const [occasion, setOccasion] = useState<Occasion | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    // Fetch occasion data when the modal opens and occasionId changes
    useEffect(() => {
        if (isOpen && occasionId) {
            const fetchOccasion = async () => {
                setIsLoading(true)
                try {
                    const res = await fetch(`/api/occasions/${occasionId}`)
                    if (res.status === 401) {
                        router.push('/')
                        return
                    }
                    const data = await res.json()
                    setOccasion(data)
                } catch (error) {
                    console.error('Error fetching occasion:', error)
                } finally {
                    setIsLoading(false)
                }
            }
            fetchOccasion()
        }
    }, [isOpen, occasionId, router])

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

    const modifyOccasionFunction = async ({ label, type, tone, date, customInput, is_recurring }: any) => {
        if (!occasionId) return

        try {
            const response = await fetch(`/api/occasions/${occasionId}/modify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ label, type, tone, date, customInput, is_recurring })
            })

            const json = await response.json()
            if (!response.ok) {
                throw { type: 'OccasionModifyError', detail: json.error }
            }

            // Call onSuccess callback if provided
            if (onSuccess) {
                onSuccess()
            }

            onClose()
        } catch (error) {
            console.error('Error modifying occasion:', error)
            throw error
        }
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
                        Edit Occasion
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
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                        </div>
                    ) : occasion ? (
                        <EditOccasionComponent occasion={occasion} formSubmitFunction={modifyOccasionFunction} />
                    ) : (
                        <div className="text-center text-red-500">Failed to load occasion details</div>
                    )}
                </div>
            </div>
        </div>
    )
}