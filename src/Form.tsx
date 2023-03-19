import { Stack } from '@mui/material'
import * as React from 'react'

import type { FormErrors, FormFieldDefinition, FormValue, FormValues } from './interfaces'
import { ErrorAlert } from './ErrorAlert'
import { FormField } from './FormField'

export interface FormProps {
    /**
     * An object mapping field keys to the value of the corresponding field.
     */
    values: FormValues
    /**
     * Is called when the form commits changes to the form fields.
     *
     * The passed value is either an updater that returns the new form values
     * object or the new form values object itself.
     */
    onChange: React.Dispatch<React.SetStateAction<FormValues>>
    /**
     * An array of form field definitions.
     *
     * The order fo the definitions determines the order of the fields on the
     * form.
     */
    formFields: FormFieldDefinition[]
    /**
     * Erorrs that should be displayed on this form.
     *
     * There can be field errors or non-field errors. The former are displayed
     * on the corresponding input, the latter will be displayed in an alert
     * above the form.
     */
    formErrors?: FormErrors
}

const usePrevious = (value: FormValues) => {
    const ref = React.useRef<FormValues>()
    React.useEffect(() => {
        ref.current = value
    })
    return ref.current
}

/**
 * Renders a list of form fields based on the provided form field definitions
 * and wires the fields up to display the given values and report back
 * changes.
 *
 * If provided, errors will be rendered on top of the form or on the fields
 * directly if applicable.
 */
export const Form: React.FunctionComponent<FormProps> = (props) => {
    const { formErrors, formFields, onChange, values } = props

    const errorAlerts = React.useMemo(() => {
        if (!formErrors || !formErrors.non_field_errors) {
            return null
        }
        if (Array.isArray(formErrors.non_field_errors)) {
            return formErrors.non_field_errors.map((err, idx) => <ErrorAlert key={`error-${idx}`} errors={err} />)
        }
        return <ErrorAlert errors={formErrors.non_field_errors} />
    }, [formErrors])

    const prevValues = usePrevious(values)

    const formInputs = React.useMemo(
        () =>
            formFields.map((formField) => (
                <FormField
                    key={formField.key}
                    formField={formField}
                    value={values[formField.key] ?? ''}
                    onChange={(value: FormValue) => onChange({ ...prevValues, [formField.key]: value })}
                    fieldErrors={
                        formErrors && typeof formErrors[formField.key] !== 'undefined'
                            ? formErrors[formField.key]
                            : undefined
                    }
                />
            )),
        [formErrors, formFields, onChange, prevValues, values]
    )

    return (
        <Stack spacing={2} data-testid={'form'}>
            {errorAlerts}
            {formInputs}
        </Stack>
    )
}

export default Form
