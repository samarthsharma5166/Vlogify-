import { Button } from 'flowbite-react'
import React from 'react'

const CallToAction = () => {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-none text-center '>
      <div className='flex-1 justify-center flex flex-col'>
        <h2 className='text-2xl'>want to learn JavaScript?</h2>  
        <p className='text-gray-500 my-2'>Checkout these resources with 100 JavaScript Projects</p>
        <Button
          gradientDuoTone="purpleToPink"
          className="rounded-tl-xl rounded-bl-none"
        >
          <a href="https://www.100jsprojects.com/" target='_blank' rel='noopener noreferrer'>Learn More</a>
        </Button>
      </div>  
      <div className='p-3 flex-1'>
        <img src="https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg" alt="" srcset="" />
      </div>
    </div>
  )
}

export default CallToAction
