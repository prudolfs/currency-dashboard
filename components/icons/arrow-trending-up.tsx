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
      d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default SvgComponent
