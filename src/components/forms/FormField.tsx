import { ChangeEvent } from "react";
import { LawyerAuditQuestion } from "@/data/lawyer-audit-questions";

type FormFieldProps = {
  question: LawyerAuditQuestion;
  value?: string;
  onChange: (value: string) => void;
};

export function FormField({ question, value = "", onChange }: FormFieldProps) {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  const commonClasses =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200";

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700" htmlFor={question.id}>
        {question.label}
      </label>

      {question.type === "select" ? (
        <select
          id={question.id}
          value={value}
          onChange={handleChange}
          className={`${commonClasses} appearance-none`}
        >
          <option value="">Sélectionnez…</option>
          {question.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <textarea
          id={question.id}
          value={value}
          onChange={handleChange}
          placeholder={question.placeholder}
          rows={question.type === "textarea" ? 5 : 3}
          className={`${commonClasses} resize-none`}
        />
      )}
    </div>
  );
}
