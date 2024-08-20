import { getFieldValue } from './getFormValue';
import { setFormErrors } from './setFormErrors';
import { BaseFormState, FormControlEvent } from './types';

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
        if (!validation) return;
        const value = getFieldValue(form.elements[name], new FormData(form).getAll(name));
        try {
            validation(value as any);
        } catch (err) {
            setFormErrors(form, { [name]: err.message }, { noReport: true });
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

    function handleInvalid() {
        validateForm();
    }

    function handleChange(e: FormControlEvent) {
        validateField(e.target.name);
    }

    form.addEventListener('submit', handleSubmit, { capture: true });
    form.addEventListener('invalid', handleInvalid, { capture: true });
    form.addEventListener('change', handleChange);
    form.addEventListener('ferma:change', handleChange, { capture: true });
}
