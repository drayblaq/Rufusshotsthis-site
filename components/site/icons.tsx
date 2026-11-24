/**
 * Tiny inline brand icons (lucide-react no longer ships brand logos).
 * Inline SVG = zero extra requests. All use currentColor, so they follow text colour.
 */

type IconProps = React.SVGProps<SVGSVGElement>;

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
  focusable: false,
} as const;

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg
      {...base}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      {...props}
    >
      {/* speech bubble with tail */}
      <path
        strokeLinejoin="round"
        d="M3.5 20.5l1.3-4.1a8.6 8.6 0 1 1 3.1 3l-4.4 1.1z"
      />
      {/* handset */}
      <path
        fill="currentColor"
        stroke="none"
        d="M9.2 7.4c.2 0 .4 0 .5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c-.1.1-.2.3 0 .5.4.7 1 1.4 1.6 1.9.6.5 1.1.8 1.6 1 .2.1.4.1.5-.1l.7-.8c.1-.2.3-.2.5-.1l1.6.8c.2.1.4.2.4.4 0 .3 0 1-.4 1.5-.4.5-1.2.9-1.9.9-.8 0-2.3-.4-3.9-1.8-1.6-1.4-2.6-3.1-2.8-3.8-.3-.8 0-2 .6-2.6.3-.4.6-.5.9-.5z"
      />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg
      {...base}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TikTokIcon(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" {...props}>
      <path d="M16.6 3c.3 2.1 1.6 3.6 3.9 3.8v3a7 7 0 0 1-3.9-1.2v6.3a5.9 5.9 0 1 1-5.9-5.9c.3 0 .6 0 .9.1v3.1a2.9 2.9 0 1 0 2 2.7V3h3z" />
    </svg>
  );
}
