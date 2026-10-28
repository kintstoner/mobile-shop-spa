// Inline icons from the Claude Design boards (24px grid, stroke-based, decorative).
interface IconProps {
  size?: number
  strokeWidth?: number
  className?: string
}

function Icon({
  size = 18,
  strokeWidth = 2,
  className,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  )
}

export const PhoneIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="6" y="2.5" width="12" height="19" rx="3" />
    <path d="M11 18h2" />
  </Icon>
)

export const BagIcon = (props: IconProps) => (
  <Icon size={24} strokeWidth={1.8} {...props}>
    <path d="M5 8h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9L5 8Z" />
    <path d="M9 10V6.5a3 3 0 0 1 6 0V10" />
  </Icon>
)

export const ArrowRightIcon = (props: IconProps) => (
  <Icon size={16} strokeWidth={2.2} {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
)

export const ArrowLeftIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </Icon>
)

export const SearchIcon = (props: IconProps) => (
  <Icon size={20} {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Icon>
)

export const NoResultsIcon = (props: IconProps) => (
  <Icon size={26} strokeWidth={1.8} {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5M8.5 8.5l5 5M13.5 8.5l-5 5" />
  </Icon>
)

export const CloseIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
)

export const CheckIcon = (props: IconProps) => (
  <Icon size={16} strokeWidth={2.6} {...props}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Icon>
)

export const SpinnerIcon = (props: IconProps) => (
  <Icon size={20} strokeWidth={2.4} {...props}>
    <path d="M12 3a9 9 0 1 0 9 9" />
  </Icon>
)

export const MinusCircleIcon = (props: IconProps) => (
  <Icon size={14} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12h8" />
  </Icon>
)

export const ZoomIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5M11 8v6M8 11h6" />
  </Icon>
)

export const GlobeIcon = (props: IconProps) => (
  <Icon size={16} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
  </Icon>
)

export const AlertIcon = (props: IconProps) => (
  <Icon size={26} strokeWidth={1.8} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5.5M12 16.5h.01" />
  </Icon>
)
