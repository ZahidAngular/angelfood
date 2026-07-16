import { SOCIAL_LINKS } from "@/lib/site";

export function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
    </svg>
  );
}

export function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

export function SocialLinks({
  size = 18,
  className = "flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 transition-colors hover:bg-gold hover:text-ink",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <>
      <a
        href={SOCIAL_LINKS.instagram}
        target="_blank"
        rel="noreferrer"
        aria-label="Angel Food on Instagram"
        className={className}
      >
        <InstagramIcon size={size} />
      </a>
      <a
        href={SOCIAL_LINKS.facebook}
        target="_blank"
        rel="noreferrer"
        aria-label="Angel Food on Facebook"
        className={className}
      >
        <FacebookIcon size={size} />
      </a>
    </>
  );
}
