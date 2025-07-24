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
      d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default SvgComponent
