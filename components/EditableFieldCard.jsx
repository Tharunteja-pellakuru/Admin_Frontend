import { Settings2, Trash2 } from "lucide-react";
import { useState } from "react";

/**
 * EditableFieldCard (Basic Form editor)
 */
const EditableFieldCard = ({ field, updateField }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  if (!field) return null;

  return (
    <div className="border border-gray-200 bg-white rounded-xl p-4 shadow-sm">
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-1 flex justify-center text-gray-400 cursor-grab">
          <span className="text-xl">⋮⋮</span>
        </div>

        <div className="col-span-5">
          <label className="text-[11px] font-semibold text-gray-500">
            LABEL
          </label>
          <input
            type="text"
            value={field.label}
            onChange={(e) => updateField(field.id, "label", e.target.value)}
            className="mt-1 w-full px-3 py-2 border rounded-md bg-gray-50"
          />
        </div>

        <div className="col-span-3">
          <label className="text-[11px] font-semibold text-gray-500">
            TYPE
          </label>
          <select
            value={field.type}
            onChange={(e) => updateField(field.id, "type", e.target.value)}
            className="mt-1 w-full px-3 py-2 border rounded-md bg-gray-50"
          >
            <option value="text">TEXT</option>
            <option value="email">EMAIL</option>
            <option value="number">NUMBER</option>
            <option value="url">URL</option>
            <option value="file">FILE</option>
            <option value="textarea">TEXTAREA</option>
          </select>
        </div>

        <div className="col-span-2 flex items-center mt-6">
          <input
            type="checkbox"
            checked={field.required}
            onChange={(e) =>
              updateField(field.id, "required", e.target.checked)
            }
            className="mr-2"
          />
          <span className="text-sm">Required</span>
        </div>

        <div className="col-span-1 flex justify-center mt-6">
          <button
            type="button"
            className="text-gray-400 hover:text-red-500"
            onClick={() => updateField(field.id, "delete")}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-green-600 text-xs mt-2 ml-12 hover:underline"
      >
        <span className="inline-flex items-center gap-1">
          Advanced Settings <Settings2 size={12} />
        </span>
      </button>

      {showAdvanced && (
        <div className="mt-4 ml-12 p-4 bg-gray-50 rounded-lg border border-gray-200 grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-600">Placeholder</label>
            <input
              type="text"
              value={field.placeholder || ""}
              onChange={(e) =>
                updateField(field.id, "placeholder", e.target.value)
              }
              className="mt-1 w-full px-3 py-2 border rounded-md bg-white"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600">Help Text</label>
            <input
              type="text"
              value={field.helpText || ""}
              onChange={(e) =>
                updateField(field.id, "helpText", e.target.value)
              }
              className="mt-1 w-full px-3 py-2 border rounded-md bg-white"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableFieldCard;
