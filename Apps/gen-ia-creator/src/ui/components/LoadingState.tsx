export default function LoadingState() {
  return (
    <div className="flex h-screen items-center justify-center bg-[var(--bg)]">
      <div className="w-5 h-5 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin" />
    </div>
  )
}
