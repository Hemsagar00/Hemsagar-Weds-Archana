// Rose and marigold petals drifting down over the whole invitation. Pure CSS,
// decorative only, and removed entirely when the guest prefers reduced motion.

const PETALS = Array.from({ length: 14 }, (_, i) => ({
  left: (i * 37) % 100,
  delay: -((i * 1.7) % 12),
  duration: 9 + ((i * 3) % 7),
  drift: ((i % 5) - 2) * 18,
  size: 0.55 + ((i * 7) % 5) * 0.12,
  tone: i % 3,
}));

export default function Petals() {
  return (
    <div className="petals" aria-hidden="true">
      {PETALS.map((petal, i) => (
        <span
          key={i}
          className={`petal petal--${petal.tone}`}
          style={{
            left: `${petal.left}%`,
            '--petal-delay': `${petal.delay}s`,
            '--petal-duration': `${petal.duration}s`,
            '--petal-drift': `${petal.drift}vw`,
            '--petal-size': `${petal.size}rem`,
          }}
        />
      ))}
    </div>
  );
}
