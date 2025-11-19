'use client'
import React, { useState, useEffect } from 'react'
import { ResourceType } from '@/types'

import lodash from 'lodash'

export const Select = (    
    {children, resource, selectedResource, onSelect, onDeselect, selectedClassName}:
    {children?:React.ReactNode, resource: ResourceType, selectedResource: ResourceType | null, onSelect: () => void, onDeselect: () => void, selectedClassName:string}
) => {
     
    const [click, setClick] = useState(false)
    
    useEffect(()=>{
        if (!click) return; // Only handle when actually clicked
        
        const handleSelect = () => {
            if (selectedResource == null || !lodash.isEqual(selectedResource, resource)) {
                onSelect()
            } else if (lodash.isEqual(selectedResource, resource)) {
                onDeselect()
                console.log(`Deselected ${selectedResource.name}`)
            }
        }
        handleSelect()
    },[click])

    const isSelected = selectedResource != null && lodash.isEqual(selectedResource, resource);

    return (
        <div 
        className={`w-full h-full hover:cursor-pointer hover:opacity-75
            ${isSelected ? selectedClassName : ''}`
        } 
        onClick={()=>setClick(!click)}
        >
            {children}
        </div>
    )
}