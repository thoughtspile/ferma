import { getFieldValue } from './getFormValue';
import { setFormErrors } from './setFormErrors';
import { BaseFormState, FormControlEvent } from './types';
import { getNamedControl } from './utils';

export function invalid(message: string) {
    throw new Error(message);
}

export type ValidationSchema<FormState extends BaseFormState> = {
    [Name in keyof FormState]?: (value: FormState[Name] | undefined) => void;
};

export function customValidations<FormState extends BaseFormState>(
    form: HTMLFormElement, 
    validations: ValidationSchema<FormState>
): void {
    function validateField(name: string): void {
        const validation = validations[name];
        const el = getNamedControl(form, name);
        try {
            if (validation) {
                const value = getFieldValue(form.elements[name], new FormData(form).getAll(name));
                validation(value as any);
            }
            el?.setCustomValidity('');
        } catch (err) {
            el?.setCustomValidity(err.message);
        }
    }

    function validateForm() {
        for (const name in validations) {
            validateField(name);
        }
    }

    function handleSubmit(e: SubmitEvent) {
        const form = e.target as HTMLFormElement;
        validateForm();
        const isValid = form.reportValidity();
        if (isValid) return;
        e.stopPropagation();
        e.preventDefault();
    }

    function handleChange(e: FormControlEvent) {
        validateField(e.target.name);
    }

    function revalidate() {
        for (const name in validations) {
            getNamedControl(form, name)?.validity.valid && validateField(name);
        }
    }

    // validate after native validation passed
    form.addEventListener('submit', handleSubmit, { capture: true });
    // validate after native validation failed
    form.addEventListener('invalid', revalidate, { capture: true });
    // live validation on change
    form.addEventListener('input', handleChange);
    // validate on setFormValue
    form.addEventListener('ferma:change', handleChange, { capture: true });
}
