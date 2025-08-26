import React from 'react'

export function Card({title, subtitle, actions, children}){
  return (
    <section className="bg-white/95 backdrop-blur border border-gray-200 rounded-2xl shadow-sm p-4">
      <header className="flex items-center gap-3 mb-3">
        <div className="flex-1">
          <div className="text-sm font-semibold">{title}</div>
          {subtitle && <div className="text-xs text-neutral-500">{subtitle}</div>}
        </div>
        {actions}
      </header>
      <div>{children}</div>
    </section>
  )
}

export function Tag({tone='slate', children}){
  const tones = {
    slate: 'border-slate-200 text-slate-700 bg-slate-50',
    green: 'border-emerald-200 text-emerald-700 bg-emerald-50',
    rose: 'border-rose-200 text-rose-700 bg-rose-50',
    amber: 'border-amber-200 text-amber-700 bg-amber-50',
    indigo: 'border-indigo-200 text-indigo-700 bg-indigo-50',
  }
  return <span className={`px-2 py-0.5 text-xs rounded-lg border ${tones[tone]}`}>{children}</span>
}

export function Input(props){
  return <input {...props} className={`w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm ${props.className||''}`} />
}
export function Select(props){
  return <select {...props} className={`w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm ${props.className||''}`} />
}
export function Button({variant='default', className='', ...props}){
  const base = 'px-3 py-1.5 rounded-xl text-sm border transition';
  const map = {
    default: 'bg-white border-neutral-200 hover:bg-neutral-50',
    primary: 'bg-black text-white border-black hover:opacity-90',
    ghost: 'bg-transparent border-neutral-200 hover:bg-neutral-50',
  };
  return <button {...props} className={`${base} ${map[variant]} ${className}`} />;
}
