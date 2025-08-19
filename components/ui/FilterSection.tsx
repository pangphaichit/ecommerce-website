import { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function FilterSection({ title, children }: FilterSectionProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-300 mb-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center w-full py-2 text-left font-semibold text-gray-700 hover:text-yellow-600 cursor-pointer"
      >
        <span>{title}</span>
        {open ? <Minus size={16} /> : <Plus size={16} />}
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}
