import { Apple } from 'lucide-react'

export function Logo() {
    return (
        <div className='bg-background/75 backdrop-blur px-2 py-[4px] rounded-md flex items-center space-x-2'>
            <div className='bg-red-500 p-[2.5px] rounded-sm'>
                <Apple className='text-white w-4 h-4'/>
            </div>
            <span className="text-base font-medium">MealMap</span>
        </div>
    )
}