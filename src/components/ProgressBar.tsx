export function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div
      className="progress"
      role="progressbar"
      aria-label={`進捗 ${done}/${total}`}
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="progress-bar" style={{ width: `${pct}%` }} />
      <span className="progress-label">
        {done} / {total}（{pct}%）
      </span>
    </div>
  );
}
