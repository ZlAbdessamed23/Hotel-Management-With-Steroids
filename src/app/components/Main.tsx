import React from 'react'
import Section1 from './Section1'
import Section2 from './Section2'
import Section3 from './Section3'
import Section4 from './Section4'
import Pricing from './Pricing'
import About from './About'

export default function Main() {
  return (
    <div className='flex flex-col gap-20 pt-12 font-sans'>
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Pricing />
      <About />
    </div>
  )
}
