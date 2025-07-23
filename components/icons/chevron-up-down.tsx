import * as React from 'react'
const SvgComponent = ({
  width = '24px',
  height = '24px',
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    className="size-6"
    fill="none"
    height={height}
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
    width={width}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default SvgComponent
