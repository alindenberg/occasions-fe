import CreateOccasionBtn from "@/components/CreateOccasionBtn";

export default function CreateOccasionPrompt() {
    return (
        <div className="text-center bg-gray-100 border-2 border-orange-400 p-4">
            <p>Well, that's bizarre.</p>
            <p className="pt-2">You don't have any upcoming occasions.</p>
            <p className="pt-2">Surely there's something to celebrate.</p>
            <CreateOccasionBtn />
        </div>
    )
}