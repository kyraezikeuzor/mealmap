import { PHASE_DEVELOPMENT_SERVER } from "next/dist/shared/lib/constants";


type ResourceType = {
    name: string,
    address: string,
    state: string,
    city: string,
    find_food_link: string,
    donate_link: string,
    volunteer_link: string,
    phone: string,
    website: string,
}

type CountyType = [
    name: string,   // County name
    state: string,  // State code
    county: string  // County code
]