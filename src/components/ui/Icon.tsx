import type { SVGProps } from 'react'

type IconName =
  | 'plus'
  | 'chevronDown'
  | 'chevronRight'
  | 'chevronLeft'
  | 'moon'
  | 'sun'
  | 'delete'
  | 'check'

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName
}

export function Icon({ name, ...props }: IconProps) {
  const common = {
    width: 16,
    height: 16,
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    ...props,
  }

  switch (name) {
    case 'plus':
      return (
        <svg {...common} viewBox="0 0 10 10" aria-hidden="true">
          <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    case 'chevronDown':
      return (
        <svg {...common} viewBox="0 0 10 6" aria-hidden="true">
          <path d="m1 1 4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'chevronRight':
      return (
        <svg {...common} viewBox="0 0 7 10" aria-hidden="true">
          <path d="m1 1 4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'chevronLeft':
      return (
        <svg {...common} viewBox="0 0 7 10" aria-hidden="true">
          <path d="m6 1-4 4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'moon':
      return (
        <svg {...common} viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.5016 11.3423C19.2971 11.2912 19.0927 11.3423 18.9137 11.4701C18.2492 12.0324 17.4824 12.4924 16.639 12.7991C15.8466 13.1059 14.9776 13.2592 14.0575 13.2592C11.9872 13.2592 10.0958 12.4158 8.74121 11.0611C7.38658 9.70649 6.54313 7.81512 6.54313 5.74483C6.54313 4.87582 6.69649 4.03237 6.95208 3.26559C7.23323 2.4477 7.64217 1.70649 8.17891 1.06751C8.40895 0.786362 8.35783 0.377416 8.07668 0.147384C7.89776 0.0195887 7.69329 -0.0315295 7.48882 0.0195887C5.31629 0.607448 3.42492 1.91096 2.07029 3.64898C0.766773 5.36144 0 7.48285 0 9.78317C0 12.5691 1.1246 15.0995 2.96486 16.9397C4.80511 18.78 7.3099 19.9046 10.1214 19.9046C12.4728 19.9046 14.6454 19.0867 16.3834 17.732C18.147 16.3519 19.4249 14.3838 19.9617 12.1346C20.0639 11.7768 19.8594 11.419 19.5016 11.3423Z"/>
        </svg>
      )
    case 'sun':
      return (
        <svg {...common} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4" fill="currentColor" />
          <path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
    case 'delete':
      return (
        <svg width="13" height="16" viewBox="0 0 13 16" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M8.44442 0L9.33333 0.888875H12.4444V2.66667H0V0.888875H3.11108L4 0H8.44442ZM2.66667 16C1.68442 16 0.888875 15.2045 0.888875 14.2222V3.55554H11.5555V14.2222C11.5555 15.2045 10.76 16 9.77779 16H2.66667Z"/>
        </svg>
      )
    case 'check':
      return (
        <svg {...common} viewBox="0 0 12 10" aria-hidden="true">
          <path d="M1 5.4 4.2 9 11 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    default:
      return null
  }
}
