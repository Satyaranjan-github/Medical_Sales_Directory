import { ChevronLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

const Navbar = () => {
    const navigate = useNavigate()

    return (
        <>
            {/* Top Header for search/profile */}
            <header className="p-5.5 bg-white border-b border-slate-200 flex items-center justify-between px-8" >
                <button onClick={() => navigate(-1)}>
                    <ChevronLeft className="size-8 border rounded-sm text-gray-500" />
                </button>
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">S</div>
            </ header >
        </>
    )
}

export default Navbar
