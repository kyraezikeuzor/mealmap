'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'

import { ResourceType } from '@/types'

import { X } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

import { getGeocode, formatDeclarationTitle } from '@/lib/utils'
import { Button } from './button'
import Link from "next/link"
import { Phone } from 'lucide-react'
import { Apple } from 'lucide-react'
import { HandHelping } from 'lucide-react'
import { DollarSign } from 'lucide-react'
import { Globe } from 'lucide-react'


export const PopupImage = (
    {resource}:{resource:ResourceType}
  ) => {
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
  
    useEffect(() => {
        const fetchPhotoUrl = async () => {
            try {
                setLoading(true);
                const photo = await axios.get(`/api/unsplash?query=${resource.city},${resource.state}`)
                if (photo) {
                    setPhotoUrl(photo.data)
                } else {
                    setError('No photos available for this location.');
                }
            } catch (error) {
                console.error('Error fetching photo:', error);
                setError('No photos available for this location.');
            } finally {
                setLoading(false);
            }
        } 
        fetchPhotoUrl();
      }, [resource]);

  
    if (loading) {
      return <Skeleton className="h-[250px] w-full rounded-lg" />;
    }
  
    if (error) {
        return <div>{error}</div>;
    }
  
    return (
      <div>
        {photoUrl ? 
            <img src={photoUrl} alt="Location" className='h-[250px] w-full rounded-lg' />  :
            <Skeleton className="h-full w-full rounded-lg" />
        }
      </div>
    );
  };
  
export const Popup =  (
    {resource, onClickOut}:{resource: ResourceType, onClickOut: () => void}
  ) => {

    const [geocode, setGeocode] = useState()
    
    useEffect(()=>{
        const fetchGeocode = async () => {
            const data = await getGeocode(`${resource.address}, ${resource.state}`)
            const geocodeData = data.data   
            setGeocode(geocodeData)
        }
        fetchGeocode()
    })
  
    return (
        <div className='w-80 lg:w-1/4 2xl:w-1/6 ease-in-out backdrop-blur bg-background/75 py-2 absolute z-[99999] top-20 right-20 rounded-xl shadow-2xl border border-border'>
            <div className='relative flex flex-col space-y-2 '>
                <span onClick={()=>onClickOut()} className='bg-background absolute top-1 right-2 w-6 h-6 rounded-full p-1 flex flex-col items-center cursor-pointer'>
                    <X className='text-foreground'/>
                </span>
                <div className='flex flex-row flex-wrap space-x-2 items-center px-3'>
                    <span className='text-lg font-semibold leading-6'>
                        {formatDeclarationTitle(resource.name)}
                    </span>
                    <span
                      className='text-xs font-medium w-fit py-[1px] px-4 rounded-full text-white bg-red-500'
                    >
                      Food Bank
                    </span>
                </div>
                <div className='px-3'>
                    <PopupImage
                      resource={resource}
                    />
                </div>
                <div className='flex flex-row justify-between items-center'>
                    <div className='w-1/2 flex flex-col gap-1 px-3'>
                        <span className='text-gray-500 text-sm'>Important Links</span>
                        <div className='flex flex-col gap-1 text-sm'>
                            <Button variant="outline" className='bg-red-500 text-white flex flex-row items-center gap-1'>
                                <Apple className='w-4 h-4' /> <Link href={resource.find_food_link || 'https://google.com'}>Find Food</Link>
                            </Button>
                            
                            <Button variant="outline" className='bg-blue-400 text-white flex flex-row items-center gap-1'> 
                                <Phone className='w-4 h-4' /> <Link href={`tel:${resource.phone}`}> Call</Link>
                            </Button>
                        </div> 
                    </div>
                    <hr className='h-16 w-[2px] bg-border'/>
                    <div className='w-1/2 flex flex-col gap-1 px-3'>
                        <span className='text-gray-500 text-sm'>Location</span>
                        <span className='font-semibold text-base leading-5'>{resource.address}, {resource.state}</span>
                        <span className='font-semibold text-base leading-5'>{geocode}</span>
                    </div>
                </div>
                <hr className='w-full h-1 bg-border'/>
                <div className='w-full flex flex-col gap-1 px-3'>
                    <span className='text-gray-500 text-sm'>Important Details</span>
                    <div className='w-full flex flex-row gap-1 text-sm'>
                        <Button variant="outline" className='bg-green-500 text-white flex flex-row items-center gap-1'> 
                            <DollarSign className='w-4 h-4' /> <Link href={resource.donate_link || 'https://google.com'}>Donate</Link>
                        </Button>
                        <Button variant="outline" className='bg-yellow-500 text-white flex flex-row items-center gap-1'> 
                            <HandHelping className='w-4 h-4' /> <Link href={resource.volunteer_link || 'https://google.com'}>Volunteer</Link>
                        </Button>
                        <Button variant="outline" className='bg-purple-500 text-white flex flex-row items-center gap-1'> 
                            <Globe className='w-4 h-4' /> <Link href={resource.website || 'https://google.com'}>Visit</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
  }