'use client'
import React from 'react'

import { ResourceType } from '@/types'
import { formatDeclarationTitle } from '@/lib/utils'
import { Select } from './select'

interface ResourceProps {
  resource: ResourceType,
  selectedResource: ResourceType | null, 
  onSelect: () => void, 
  onDeselect: () => void
}

export function Resource (
    { resource, selectedResource, onSelect, onDeselect }: ResourceProps) 
{

  return (
    <Select 
    resource={resource}
    selectedResource={selectedResource}
    onSelect={onSelect}
    onDeselect={onDeselect}
    selectedClassName='border-[3px] py-1 border-blue-400 rounded-xl shadow-sm bg-background'
    >
        <div className='h-fit flex flex-row items-center gap-3 px-2 py-2 border-b border-border '>
            <div>
                <span className=''>{resource.state}</span>
            </div>
            <div className='flex flex-col'>
                <span className='font-medium leading-6'>
                    {formatDeclarationTitle(resource.name)}{' '}
                    <span className='inline-flex w-fit bg-red-500 text-white font-medium rounded-lg px-2 text-xs items-center gap-1 ml-2'>
                        Food Bank
                    </span>
                </span>
                <span className='text-sm'>
                    {resource.address}
                </span>
            </div>
        </div>
    </Select>
  )
}
