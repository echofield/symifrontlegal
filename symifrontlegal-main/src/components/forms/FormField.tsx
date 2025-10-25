import { LawyerAuditQuestion } from "@/data/lawyer-audit-questions";

type FormFieldProps = {
  question: LawyerAuditQuestion;
  value: string;
  onChange: (value: string) => void;
};

export function FormField({ question, value, onChange }: FormFieldProps) {
  const { id, label, type = "text", placeholder, options } = question;

  if (type === "select" && options) {
    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <select
          id={id}
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="" disabled>
            Sélectionnez une option
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <textarea
          id={id}
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}
