export default function Tooltip({ children, text }) {
  return (
    <div className="group relative inline-block">
      {children}
      <div
        className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-2 
                   text-xs font-medium text-white bg-gray-900 rounded-lg 
                   whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 
                   transition-all duration-300 pointer-events-none
                   shadow-2xl border border-gray-700"
      >
        {text}
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 
                     border-8 border-transparent border-t-gray-900"
        />
      </div>
    </div>
  );
}