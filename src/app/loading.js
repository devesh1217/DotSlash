export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gov-light">
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-gov-primary animate-spin"></div>
        <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-4 border-b-4 border-gov-secondary animate-spin-slow"></div>
      </div>
    </div>
  );
}
