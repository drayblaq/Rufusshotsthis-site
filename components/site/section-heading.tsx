/** Eyebrow label + heading used at the top of each section. */
export function SectionHeading({
  eyebrow,
  title,
  id,
  className,
}: {
  eyebrow: string;
  title: string;
  id?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="mt-2 text-3xl sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}
