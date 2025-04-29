export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center w-full h-64">
      <div className="w-12 h-12 border-4 border-t-4 rounded-full border-slate-200 border-t-emerald-600 animate-spin"></div>
    </div>
  )
}
