export class ValidationError extends Error {
}

type FieldValidator = (value: string) => void;
type Validations = Record<string, FieldValidator>;

export function leform(validations: Validations) {
    function validateField(el: HTMLInputElement): void {
        const validation = validations[el.name];
        try {
            validation && validation(el.value);
            el.setCustomValidity('');
        } catch (err) {
            el.setCustomValidity(err.message);
        }
    }
    function validateForm(form: HTMLFormElement) {
        for (const name in validations) {
            validateField(form[name] as HTMLInputElement);
        }
    }
    function syncCustomError(e: Event) {
        const target = e.target as HTMLInputElement;
        const name = target?.name;
        const customMessage = target.form?.querySelector(`[data-leform-error=${name}]`);
        if (customMessage) {
            e.preventDefault();
            customMessage.innerHTML = target.validationMessage;
        }
    }

    function handleSubmit(e: SubmitEvent) {
        const form = e.target as HTMLFormElement;
        validateForm(form);
        const isValid = form.reportValidity();
        !isValid && e.preventDefault();
    }
    function handleInvalid(e: Event) {
        const form = (e.target as HTMLInputElement)?.form!;
        validateForm(form);
        syncCustomError(e);
        const firstInvalid = form.querySelector(':invalid') as HTMLInputElement;
        firstInvalid.focus();
        firstInvalid.scrollIntoView({ behavior: 'smooth' });
    }
    function handleInput(e: Event) {
        validateField(e.target as HTMLInputElement);
        syncCustomError(e);
    }

    return {
        attach: (form: HTMLFormElement) => {
            form.addEventListener('submit', handleSubmit);
            form.addEventListener('input', handleInput);
            form.addEventListener('invalid', handleInvalid, { capture: true });
        }
    }
}
