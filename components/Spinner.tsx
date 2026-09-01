export default function Spinner({ size = 22 }: { size?: number }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="animate-spin rounded-full border-2 border-ember-100 border-t-ember-500"
      style={{ width: size, height: size }}
    />
  );
}
