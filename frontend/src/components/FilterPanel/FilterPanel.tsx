'use client'
import { useState } from 'react';

export default function FilterPanel({ categories, onFilter }: { categories: string[]; onFilter: (category?: string, search?: string) => void }) {
  const [category, setCategory] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const applyFilters = () => onFilter(category || undefined, search.trim() || undefined);

  return (
    <div className="p-4 border rounded space-y-3">
      <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Search…" className="w-full border rounded px-2 py-1" />
      <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border rounded px-2 py-1">
        <option value="">All Categories</option>
        {categories.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <button onClick={applyFilters} className="w-full bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Apply</button>
    </div>
  );
}
