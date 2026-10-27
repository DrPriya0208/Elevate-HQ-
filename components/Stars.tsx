type Props = { rating: number; className?: string };

/** Read-only star display. Not interactive — see ReviewForm's RatingInput for the form control. */
export default function Stars({ rating, className }: Props) {
  return (
    <span className={className} role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} aria-hidden="true" className={i < rating ? "text-deep-gold" : "text-line"}>
          ★
        </span>
      ))}
    </span>
  );
}
