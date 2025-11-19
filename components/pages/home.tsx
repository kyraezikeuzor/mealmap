// app/page.tsx
'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ResourceType } from '@/types'

import { Rss } from 'lucide-react'
import { SidebarProvider, SidebarTrigger, Sidebar, SidebarContent, SidebarGroup } from "@/components/ui/sidebar"
import { Heading } from '@/components/ui/heading'
import { Resource } from '@/components/ui/resource'
import { Combobox } from '@/components/ui/combobox'
import { Clock } from '@/components/ui/clock'
import { MapComponent } from '@/components/ui/map'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Logo } from '@/components/ui/logo'
import { Popup } from '@/components/ui/popup'
import { Separator } from '@/components/ui/separator'
import { Theme } from '@/components/ui/theme'

import { states } from '@/data/states'

export default function Home() {
  const [selectedState, setSelectedState] = useState("")
  const [resources, setResources] = useState<ResourceType[]>([])
  const [selectedResource, setSelectedResource] = useState<ResourceType | null>(null)
  const [filteredResources, setFilteredResources] = useState<ResourceType[]>([])
  useEffect(() => {
    const getResources = async () => {
      try {
        const response = await axios.get('/api/resources');
        console.log(response)
        console.log("BEYONKA")
        setResources(response.data)
      } catch (error) {
        console.error('Error fetching resources:', error);
      }
    };
    getResources()
  }, [])

  const handleResourceSelect = (resource: ResourceType) => {
    setSelectedResource(resource)
  }

  useEffect(()=>{
      if (selectedState) {
        setFilteredResources(resources.filter((item) => {
          return item.state === selectedState;
        }));
      } else {
        setFilteredResources(resources)
      }
  },[selectedState, resources])


  return (
    <SidebarProvider>
      <Sidebar className='bg-background/50 backdrop-blur-md border-r'>
        <SidebarContent  className='py-2 px-2 bg-background/80 backdrop-blur overflow-y-hidden'>
          <SidebarGroup className='w-full flex flex-col space-y-1'>
            <div className='hidden lg:flex justify-between items-center absolute top-2 left-2 right-2'>
              <Logo/>
              <span className='flex flex-row items-center gap-1 w-fit bg-blue-500 text-white rounded-xl px-3 text-sm'><Rss className='w-3 h-3 text-white'/> Live</span>
            </div>
            <br className='hidden lg:block'/>
            <br className='hidden lg:block'/>
            <div className='flex flex-col gap-2'>
              <Heading as='h2'>
                Locate Food Resources Near You
              </Heading>
            </div>
            <div className='flex flex-col'>
              <p className='text-sm text-gray-400'>
                Data received from American food banks.
              </p>
            </div>
          </SidebarGroup>
          <Separator/>
          <SidebarGroup className='w-full h-full flex flex-col space-y-1'>
            <Heading as="h3">Showing { filteredResources && ( filteredResources.length )} resources in {selectedState || "all states"}</Heading>
            <Combobox
              list={states}
              category="state"
              onValueChange={(value) => setSelectedState(value)}
            />
            <ScrollArea className='w-full h-full max:h-[600px] flex-col '>
              {filteredResources?.map((item,index) => (
                <Resource 
                  key={index}
                  onSelect={()=>{handleResourceSelect(item)}} 
                  onDeselect={()=>{setSelectedResource(null)}}
                  resource={item}
                  selectedResource={selectedResource}
                />
              ))}
            </ScrollArea>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main className='w-full bg-transparent'>
        <SidebarTrigger className='absolute top-0 z-[100000] h-10 w-10 flex items-center justify-center' />
        <div className='lg:hidden absolute top-0 right-0 p-2 z-[9999]'>
          <Logo/>
        </div>
        <div className="pointer-events-auto">
          {resources && (
            <MapComponent 
              resources={resources} 
              selectedResource={selectedResource || (resources.length > 0 ? resources[0] : null)}
              setSelectedResource={setSelectedResource}  
            />
          )}
        </div>
        <div>
          {selectedResource != null &&
            <Popup
              onClickOut={()=>setSelectedResource(null)}
              resource={selectedResource}
            />
          }
        </div>
        <div className='w-full flex flex-col items-end pr-5 lg:pr-2 absolute left-2 top-12 lg:top-0  z-[99999]'>
          <Theme/>
        </div>
        <div className='absolute right-28 top-3 lg:hidden z-[9999]'>
          <Clock/>
        </div>
      </main>
    </SidebarProvider>
  );
}