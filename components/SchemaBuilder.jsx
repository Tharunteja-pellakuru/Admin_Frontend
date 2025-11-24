import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FieldType } from "../types";
import { Trash2, Plus, GripVertical, Settings2, Layers } from "lucide-react";

// SchemaBuilder now accepts onAddQuestion and onPreview as props
const SchemaBuilder = ({
  fields,
  steps,
  onChange,
  onAddQuestion,
  onPreview,
}) => {
  // <-- MODIFIED PROPS
  // Removed local state: const [previewMode, setPreviewMode] = useState(false);

  const [editingStepId, setEditingStepId] = useState(null);

  // Ensure fields and steps are arrays
  if (!Array.isArray(fields)) fields = [];
  if (!Array.isArray(steps) || steps.length === 0) {
    steps = [{ id: "step_default", title: "Application Form" }];
  }

  const addStep = () => {
    const newStep = {
      id: `step_${uuidv4()}`,
      title: `Step ${steps.length + 1}`,
    };
    onChange(fields, [...steps, newStep]);
  };

  const removeStep = (id) => {
    if (steps.length <= 1) return;
    const newSteps = steps.filter((s) => s.id !== id); // Reassign fields to first step or delete them? Let's reassign to first.
    const newFields = fields.map((f) =>
      f.stepId === id ? { ...f, stepId: newSteps[0].id } : f
    );
    onChange(newFields, newSteps);
  };

  const updateStep = (id, title) => {
    const newSteps = steps.map((s) => (s.id === id ? { ...s, title } : s));
    onChange(fields, newSteps);
  }; // Removed local addField function. Now uses onAddQuestion prop.

  const removeField = (id) => {
    onChange(
      fields.filter((f) => f.id !== id),
      steps
    );
  };

  const updateField = (index, key, value) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], [key]: value };
    onChange(newFields, steps);
  }; // Options management

  const handleOptions = (index, action, optIndex, val) => {
    const newFields = [...fields];
    const field = newFields[index];
    if (!field.options) field.options = [];
    if (action === "add")
      field.options.push(`Option ${field.options.length + 1}`);
    if (action === "remove" && typeof optIndex === "number")
      field.options.splice(optIndex, 1);
    if (action === "update" && typeof optIndex === "number" && val)
      field.options[optIndex] = val;
    onChange(newFields, steps);
  }; // Removed the entire previewMode block (if (previewMode) { return (...) })

  return (
    <div className="space-y-8">
           {" "}
      <div className="flex justify-between items-center">
                 
        <div className="flex gap-2">
                       
          <button
            type="button"
            onClick={addStep}
            className="text-sm flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-md hover:bg-gray-200 text-gray-700 transition-colors"
          >
                             <Layers size={16} /> Add Step              
          </button>
                       
          {/* FIX: New unified Add Question button (adds to first step) */}     
                           
        </div>
                {/* FIX: Bind Preview button to onPreview prop */}       {" "}
        <button
          type="button"
          onClick={onPreview} // <-- USE PROP
          className="text-sm px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 shadow-sm"
        >
                    Preview Form        {" "}
        </button>
             {" "}
      </div>
           {" "}
      {steps.map((step, sIdx) => (
        <div
          key={step.id}
          className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden"
        >
                     {" "}
          <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            {/* Step Title / Rename Mode */}
            {editingStepId === step.id ? (
              <input
                type="text"
                autoFocus
                value={step.title}
                onChange={(e) => updateStep(step.id, e.target.value)}
                onBlur={() => setEditingStepId(null)} // Exit rename mode
                className="bg-white border border-primary px-2 py-1 rounded text-sm focus:outline-none"
              />
            ) : (
              <h3
                className="font-bold text-gray-700 cursor-pointer hover:text-primary"
                onClick={() => setEditingStepId(step.id)} // Enter rename mode
              >
                {step.title}
              </h3>
            )}

            {/* Buttons */}
            <div className="flex gap-2 items-center">
              {/* Rename Button */}
              {editingStepId !== step.id && (
                <button
                  type="button"
                  onClick={() => setEditingStepId(step.id)}
                  className="text-gray-500 hover:text-primary p-1"
                >
                  <Settings2 size={16} />
                </button>
              )}

              {/* Delete Step */}
              {steps.length > 1 && (
                <button
                  onClick={() => removeStep(step.id)}
                  className="text-red-400 hover:text-red-600 p-1"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
                                 {" "}
          <div className="p-4 space-y-3">
                           {" "}
            {fields
              .filter((f) => f.stepId === step.id)
              .map((field) => {
                const index = fields.findIndex((f) => f.id === field.id);
                return (
                  <div
                    key={field.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all group"
                  >
                                               {" "}
                    <div className="flex gap-4">
                                                     {" "}
                      <div className="flex flex-col gap-1 pt-1 text-gray-300">
                                                           {" "}
                        <GripVertical
                          size={20}
                          className="cursor-grab hover:text-gray-500"
                        />
                                                       {" "}
                      </div>
                                                                               
                           {" "}
                      <div className="flex-1 space-y-4">
                                                           {" "}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                                                 {" "}
                          <div className="md:col-span-6">
                                                                       {" "}
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                              Label
                            </label>
                                                                       {" "}
                            <input
                              type="text"
                              value={field.label}
                              onChange={(e) =>
                                updateField(index, "label", e.target.value)
                              }
                              className="w-full mt-1 px-2 py-1.5 border border-gray-300 rounded text-sm bg-gray-50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            />
                                                                   {" "}
                          </div>
                                                                 {" "}
                          <div className="md:col-span-4">
                                                                         
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                              Type
                            </label>
                                                                         
                            <select
                              value={field.type}
                              onChange={(e) =>
                                updateField(index, "type", e.target.value)
                              }
                              className="w-full mt-1 px-2 py-1.5 border border-gray-300 rounded text-sm bg-gray-50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            >
                                                                             {" "}
                              {Object.values(FieldType).map((t) => (
                                <option key={t} value={t}>
                                  {t.replace("_", " ").toUpperCase()}
                                </option>
                              ))}
                                                                           
                            </select>
                                                                   {" "}
                          </div>
                                                                 {" "}
                          <div className="md:col-span-2 flex items-end pb-2">
                                                                       {" "}
                            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                                                                             {" "}
                              <input
                                type="checkbox"
                                checked={field.required}
                                onChange={(e) =>
                                  updateField(
                                    index,
                                    "required",
                                    e.target.checked
                                  )
                                }
                                className="rounded focus:ring-primary bg-white border border-gray-300 accent-green-600"
                              />
                                                                             
                              Required                                          
                               {" "}
                            </label>
                                                                   {" "}
                          </div>
                                                             {" "}
                        </div>
                                                           {" "}
                        {/* Advanced Settings Toggle */}                       
                                   {" "}
                        <details className="text-xs">
                                                                 {" "}
                          <summary className="text-primary cursor-pointer hover:underline inline-flex items-center gap-1 font-medium">
                            Advanced Settings <Settings2 size={12} />
                          </summary>
                                                                 {" "}
                          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-3 rounded-md">
                                                                       {" "}
                            <div>
                                                                             {" "}
                              <label className="block mb-1 text-gray-500">
                                Placeholder
                              </label>
                                                                             {" "}
                              <input
                                type="text"
                                value={field.placeholder || ""}
                                onChange={(e) =>
                                  updateField(
                                    index,
                                    "placeholder",
                                    e.target.value
                                  )
                                }
                                className="w-full px-2 py-1 border rounded text-sm bg-white"
                              />
                                                                         {" "}
                            </div>
                                                                         
                            <div>
                                                                             {" "}
                              <label className="block mb-1 text-gray-500">
                                Help Text
                              </label>
                                                                             {" "}
                              <input
                                type="text"
                                value={field.helpText || ""}
                                onChange={(e) =>
                                  updateField(index, "helpText", e.target.value)
                                }
                                className="w-full px-2 py-1 border rounded text-sm bg-white"
                              />
                                                                         {" "}
                            </div>
                                                                   {" "}
                          </div>
                                                             {" "}
                        </details>
                                                           {" "}
                        {/* Options Editor */}                                 
                         {" "}
                        {[
                          FieldType.DROPDOWN,
                          FieldType.RADIO,
                          FieldType.CHECKBOX,
                          FieldType.MULTI_SELECT,
                        ].includes(field.type) && (
                          <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                                                                       {" "}
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
                              Options
                            </label>
                                                                       {" "}
                            <div className="space-y-2">
                                                                             {" "}
                              {field.options?.map((opt, optIdx) => (
                                <div key={optIdx} className="flex gap-2">
                                                                               
                                           {" "}
                                  <input
                                    type="text"
                                    value={opt}
                                    onChange={(e) =>
                                      handleOptions(
                                        index,
                                        "update",
                                        optIdx,
                                        e.target.value
                                      )
                                    }
                                    className="flex-1 px-2 py-1 border rounded text-sm bg-white"
                                  />
                                                                               
                                           {" "}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleOptions(index, "remove", optIdx)
                                    }
                                    className="text-gray-400 hover:text-red-500"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                                                               
                                       {" "}
                                </div>
                              ))}
                                                                             {" "}
                              <button
                                type="button"
                                onClick={() => handleOptions(index, "add")}
                                className="text-xs text-primary font-medium hover:underline flex items-center gap-1 mt-1"
                              >
                                <Plus size={12} /> Add Option
                              </button>
                                                                         {" "}
                            </div>
                                                                   {" "}
                          </div>
                        )}
                                                       {" "}
                      </div>
                                                     {" "}
                      <button
                        type="button"
                        onClick={() => removeField(field.id)}
                        className="text-gray-300 hover:text-red-500 self-start mt-1 p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                                                 {" "}
                    </div>
                                           {" "}
                  </div>
                );
              })}
                                           {" "}
            {/* FIX: Single 'Add Question' button for each step */}             
             {" "}
            <button
              type="button"
              onClick={() => onAddQuestion(step.id)} // Calls prop with current step ID
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2 text-sm font-medium bg-white hover:bg-green-50"
            >
              <Plus size={16} /> Add Question to {step.title}{" "}
            </button>
                       {" "}
          </div>
                 {" "}
        </div>
      ))}
         {" "}
    </div>
  );
};

const PreviewInput = ({ field }) => {
  const cls =
    "w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all";
  switch (field.type) {
    case FieldType.TEXTAREA:
      return (
        <textarea className={cls} placeholder={field.placeholder} rows={3} />
      );
    case FieldType.DROPDOWN:
      return (
        <select className={cls}>
          <option>Select...</option>
          {field.options?.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      );
    case FieldType.RADIO:
      return (
        <div className="space-y-1">
          {field.options?.map((o, i) => (
            <label
              key={i}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <input
                type="radio"
                name={field.id}
                className="w-4 h-4 border border-gray-300 bg-white focus:ring-primary accent-green-600 cursor-pointer"
              />
              {o}
            </label>
          ))}
        </div>
      );
    case FieldType.CHECKBOX:
      return (
        <div className="space-y-1">
          {field.options?.map((o, i) => (
            <label
              key={i}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <input
                type="checkbox"
                className="w-4 h-4 border border-gray-300 rounded bg-white focus:ring-primary accent-green-600 cursor-pointer"
              />
              {o}
            </label>
          ))}
        </div>
      );
    case FieldType.RANGE:
      return <input type="range" className="w-full accent-green-600" />;
    case FieldType.TOGGLE:
      return (
        <div className="w-10 h-5 bg-gray-300 rounded-full relative">
          <div className="w-5 h-5 bg-white rounded-full shadow absolute left-0" />
        </div>
      );
    case FieldType.RATING:
      return (
        <div className="flex text-gray-300 text-xl gap-1">
          {"★★★★★".split("").map((s, i) => (
            <span key={i}>{s}</span>
          ))}
        </div>
      );
    case FieldType.FILE:
      return (
        <input
          type="file"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-primary hover:file:bg-green-100"
        />
      );
    default:
      return (
        <input
          type={field.type}
          className={cls}
          placeholder={field.placeholder}
        />
      );
  }
};

export default SchemaBuilder;
