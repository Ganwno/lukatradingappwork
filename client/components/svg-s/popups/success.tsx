import { useEffect, useRef } from 'react'
import { typedUseSelector } from '../../../store'

let fired = false
export default function Success() {
  const isSuccess = typedUseSelector((s) => s.popupSlice.message)
  let popupRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (isSuccess && !fired) {
      fired = true

      popupRef.current?.classList.remove('-top-10')
      popupRef.current?.classList.add('top-5')

      // don't want user to create million timeouts
      setTimeout(() => {
        fired = false
        popupRef.current?.classList.remove('top-5')
        popupRef.current?.classList.add('-top-10')
      }, 2000)
    }
  }, [isSuccess])

  return (
    <div
      ref={popupRef}
      // style={isSuccess ? { display: 'flex' } : { display: 'none' }}
      className="absolute bg-green-500 bg-opacity-90 w-fit h-10 flex items-center -top-10
                 z-50 left-1/2 -translate-x-1/2 p-2 rounded-full transition-all justify-between"
    >
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 16 16"
        height="24px"
        width="24px"
        xmlns="http://www.w3.org/2000/svg"
        className="fill-green-900"
      >
        <path
          d="M16 8A8 8 0 
    1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"
        ></path>
      </svg>
      <span className="w-28 flex justify-center items-center">
        <h3 className="font-semibold text-green-900 ml-2">
          {isSuccess?.message}
        </h3>
      </span>
    </div>
  )
}
