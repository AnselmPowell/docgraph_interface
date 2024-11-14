// src/app/playground/containers/PlaygroundSectionA.client.jsx
'use client';

import { useState } from 'react';
import DraggableSeparator from './DraggableSeparator.client';

import ResponsiveCard from '../components/ResponsiveCard/ResponsiveCard.client';
import { cardMockData } from '../components/ResponsiveCard/mockData';

export default function PlaygroundSectionA() {
  const [splitA, setSplitA] = useState(50);
  const [splitB, setSplitB] = useState(50);

  const Button = ({ children, variant = 'primary' }) => (
    <button className="btn text-md m-2 transition-fast">
      I am a button
    </button>
  );
  return (
    <div className="w-full min-h-[95vh] flex flex-col">
      {/* Section A */}
      <section className="w-full h-[95vh] border-2 border-gray-200 p-4">
        <div className="h-full rounded-lg bg-gray-50 p-4">
          <h2 className="text-xl font-semibold mb-4">Playground 1A</h2>
          <div className="h-[calc(100%-2rem)]">
            <div className="flex h-full">
              <div 
                style={{ width: `${splitA}%` }} 
                className="overflow-auto "
              >
                  {/* content area */}

                  < Button/> 
                  {/* content area */}
              </div>
              <DraggableSeparator onChange={setSplitA} />
              <div 
                style={{ width: `${100 - splitA}%` }} 
                className="overflow-auto "
              >
                  {/* content area */}
                  


                  {/* content area */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section B */}
      <section className="w-full h-[95vh] border-2 border-gray-200 p-4">
        <div className="h-full rounded-lg bg-gray-50 p-4">
          <h2 className="text-xl font-semibold mb-4">Playground 1B</h2>
          <div className="h-[calc(100%-2rem)]">
            <div className="flex h-full">
              <div 
                style={{ width: `${splitB}%` }} 
                className="overflow-auto  p-4"
              >
                {/* content area */}
                

                  
                {/* content area */}
              </div>
              <DraggableSeparator onChange={setSplitB} />
              <div 
                style={{ width: `${100 - splitB}%` }} 
                className="overflow-auto  p-4"
              >
                 {/* content area */}
                  

                  
                  {/* content area */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}