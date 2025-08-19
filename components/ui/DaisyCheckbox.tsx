interface DaisyCheckboxProps {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  children: React.ReactNode;
  id?: string;
}

export default function DaisyCheckbox({
  checked,
  onChange,
  children,
  id,
}: DaisyCheckboxProps) {
  return (
    <div className="form-control flex-1">
      <label className="label cursor-pointer justify-start gap-2 py-1">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="checkbox checkbox-warning checkbox-sm"
        />
        <span className="label-text text-gray-700 hover:text-yellow-600 text-sm">
          {children}
        </span>
      </label>
    </div>
  );
}
