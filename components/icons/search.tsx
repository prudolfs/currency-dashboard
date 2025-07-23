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
    {...props}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default SvgComponent
