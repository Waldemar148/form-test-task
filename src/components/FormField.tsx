import React from 'react'
import { Alert, Rating, TextField } from '@mui/material'
import type { FormFieldDefinition, FormValue } from '../interfaces'
import { getRatingProps, getNumberProps, getTextFieldProps } from '../helpers/getFieldProps'
export interface IFormFieldProps {
    /**
     * The current value of the field. This will be simply passed
     * down to the field.
     */
    value: FormValue
    /**
     * The form field definition object. This must contain the
     * field type and key and all props required for the given field type.
     */
    formField: FormFieldDefinition
    /**
     *
     * The on change callback that will be called with the change
     * event as its only argument.
     */
    onChange: (value: FormValue) => void
    /**
     * Optional. A string or list of string that will be passed
     * down to the field component as `helpText`. If this is defined, the field's
     * error will be set.
     */
    fieldErrors?: string | string[]
}

/**
 * Redners a single form field based on the given form field definition,
 * passes it the given value, onChange, and errors, and returns the result.
 */
export const FormField: React.FunctionComponent<IFormFieldProps> = React.memo(
    (props) => {
        const { formField, value, onChange, fieldErrors } = props

        return (
            <>
                {(() => {
                    switch (formField.type) {
                        case 'text': {
                            const fieldProps = getTextFieldProps({
                                formField,
                                value,
                                onChange,
                                fieldErrors,
                            })
                            return <TextField key={formField.key} {...fieldProps} />
                        }
                        case 'password': {
                            const fieldProps = getTextFieldProps({
                                formField,
                                value,
                                onChange,
                                fieldErrors,
                            })
                            fieldProps.type = 'password'
                            return <TextField key={formField.key} {...fieldProps} />
                        }
                        case 'number': {
                            const fieldProps = getNumberProps({
                                value: value ?? '',
                                formField,
                                onChange,
                                fieldErrors,
                            })
                            return <TextField key={formField.key} {...fieldProps} />
                        }
                        case 'rating': {
                            const fieldProps = getRatingProps({
                                formField,
                                value: value as number | null,
                                onChange,
                            })
                            return <Rating key={formField.key} {...fieldProps} />
                        }

                        default:
                            return (
                                <Alert key={formField.key} severity='error' variant='outlined'>
                                    {' '}
                                    {`Unknown field type: "${formField.type}"`}
                                </Alert>
                            )
                    }
                })()}
            </>
        )
    },
    (prevProps, nextProps) => prevProps.value === nextProps.value
)
