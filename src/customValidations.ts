import { getValue } from './formObject';
import { setFormErrors } from './setFormErrors';

export function invalid(message: string) {
    throw new Error(message);
}

type ControlEvent = Event & { target: HTMLInputElement };
type FieldValidator = (value: any) => void;
type Validations = Record<string, FieldValidator>;

export function customValidations(form: HTMLFormElement, validations: Validations): void {
    function validateField(name: string): void {
        const validation = validations[name];
        if (!validation) return;
        const value = getValue(form.elements[name], new FormData(form).getAll(name));
        try {
            validation(value);
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

    function handleChange(e: ControlEvent) {
        validateField(e.target.name);
    }

    form.addEventListener('submit', handleSubmit, { capture: true });
    form.addEventListener('invalid', handleInvalid, { capture: true });
    form.addEventListener('change', handleChange);
}
