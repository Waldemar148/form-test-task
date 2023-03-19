import { RatingProps, TextFieldProps } from '@mui/material'
import type { FormFieldDefinition, FormValue } from '../interfaces'

/**
 * Derives and returns the props for MUI TextField from the given arguments.
 * @param formField The form field definition object. This must contain the
 * field type and key and all props required for the given field type.
 * @param value The current value of the field. This will be simply passed
 * down to the field.
 * @param onChange The on change callback that will be called with the change
 * event as its only argument.
 * @param fieldErrors Optional. A string or list of string that will be passed
 * down to the field component as `helpText`. If this is defined, the field's
 * error will be set.
 * @returns The props object appropriate for a MUI TextField component.
 */
function getTextFieldProps({
    formField,
    value,
    onChange,
    fieldErrors,
}: {
    formField: FormFieldDefinition
    value: FormValue
    onChange: (value: FormValue) => void
    fieldErrors?: string | string[]
}): TextFieldProps {
    const fieldProps: TextFieldProps = {
        id: formField.key,
        label: formField.label,
        type: 'text',
        value,
        onChange: (ev) => {
            onChange(ev.target.value ?? null)
        },
    }
    if (formField.disabled) {
        fieldProps.disabled = true
    }
    if (formField.required) {
        fieldProps.required = true
    }
    if (formField.readOnly) {
        fieldProps.InputProps = { readOnly: true }
    }
    if (fieldErrors) {
        fieldProps.error = true
        fieldProps.helperText = Array.isArray(fieldErrors) ? fieldErrors.join(' ') : fieldErrors
    }

    return fieldProps
}

/**
 * Derives and returns the props for MUI TextField from the given arguments.
 * This field only allows the usre to input positive integers.
 *
 * @param formField The form field definition object. This must contain the
 * field type and key and all props required for the given field type.
 * @param value The current value of the field. This will be simply passed
 * down to the field.
 * @param onChange The on change callback that will be called with the change
 * event as its only argument.
 * @param fieldErrors Optional. A string or list of string that will be passed
 * down to the field component as `helpText`. If this is defined, the field's
 * error will be set.
 * @returns The props object appropriate for a MUI TextField component.
 */
function getNumberProps({
    formField,
    value,
    onChange,
    fieldErrors,
}: {
    formField: FormFieldDefinition
    value: FormValue
    onChange: (value: FormValue) => void
    fieldErrors?: string | string[]
}): TextFieldProps {
    const fieldProps: TextFieldProps = {
        id: formField.key,
        label: formField.label,
        value,
        onChange: (ev) => {
            const rawValue = ev.target.value ?? null
            if (rawValue === null || rawValue === '') {
                onChange(null)
            } else {
                try {
                    const numberValue = parseInt(rawValue.replace('-', ''))
                    onChange(Number.isNaN(numberValue) ? null : numberValue)
                } catch (e) {
                    // TODO: We need to tell the user to just use digits.
                }
            }
        },
    }
    if (formField.disabled) {
        fieldProps.disabled = true
    }
    if (formField.required) {
        fieldProps.required = true
    }
    if (formField.readOnly) {
        fieldProps.InputProps = { readOnly: true }
    }
    if (fieldErrors) {
        fieldProps.error = true
        fieldProps.helperText = Array.isArray(fieldErrors) ? fieldErrors.join(' ') : fieldErrors
    }

    return fieldProps
}

/**
 * Derives and returns the props for MUI Rating component from the given arguments.
 * @param formField The form field definition object. This must contain the
 * field type and key and all props required for the given field type.
 * @param value The current value of the field. This will be simply passed
 * down to the field.
 * @param onChange The on change callback that will be called with the change
 * event as its only argument.
 * @returns The props object appropriate for a MUI Rating component.
 */
function getRatingProps({
    formField,
    value,
    onChange,
}: {
    formField: FormFieldDefinition
    value: number | null
    onChange: (value: FormValue) => void
    fieldErrors?: string | string[]
}): RatingProps {
    const fieldProps: RatingProps = {
        id: formField.key,
        emptyLabelText: formField.required ? `${formField.label} *` : formField.label,
        value,
        onChange: (ev, value) => {
            onChange(value ?? null)
        },
    }
    if (formField.disabled) {
        fieldProps.disabled = true
    }
    if (formField.readOnly) {
        fieldProps.readOnly = true
    }
    if ((formField as any).upperBound) {
        fieldProps.max = (formField as any).upperBound
    }

    return fieldProps
}

export { getTextFieldProps, getNumberProps, getRatingProps }
