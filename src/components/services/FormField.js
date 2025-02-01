import React from 'react';

const FormField = React.memo(({ field, value, onChange }) => {
    return (
        <div className="relative">
            <label className="block text-sm font-medium text-gov-dark mb-1">
                {field.label}
                {field.required && <span className="text-gov-error">*</span>}
            </label>
            {field.type === 'select' ? (
                <select
                    id={field.name}
                    name={field.name}
                    value={value || ''}
                    onChange={onChange}
                    required={field.required}
                    className="w-full px-4 py-2 border border-gov-light rounded-md focus:border-gov-primary focus:ring-1 focus:ring-gov-primary"
                >
                    <option value="">Select {field.label}</option>
                    {field.options?.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            ) : (
                <input
                    id={field.name}
                    type={field.type}
                    name={field.name}
                    value={value || ''}
                    onChange={onChange}
                    required={field.required}
                    className="w-full px-4 py-2 border text-gov-text border-gov-light rounded-md focus:border-gov-primary focus:ring-1 focus:ring-gov-primary"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                />
            )}
        </div>
    );
});

FormField.displayName = 'FormField';

export default FormField;
