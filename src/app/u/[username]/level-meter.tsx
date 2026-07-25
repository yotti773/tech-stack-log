export function LevelMeter({ value }: { value: number }) {
  return (
    <span className="level-meter" aria-label={`習熟度 ${value}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= value ? "on" : ""} />
      ))}
    </span>
  );
}
