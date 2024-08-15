export function invalid(message: string) {
    throw new Error(message);
}

type FieldValidator = (value: string) => void;
type Validations = Record<string, FieldValidator>;

export function customValidations(form: HTMLFormElement, validations: Validations): void {
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
            validateField(form.elements[name] as HTMLInputElement);
        }
    }

    function handleSubmit(e: SubmitEvent) {
        const form = e.target as HTMLFormElement;
        validateForm(form);
        const isValid = form.reportValidity();
        if (isValid) return;
        e.stopPropagation();
        e.preventDefault();
    }

    function handleInvalid(e: Event) {
        const form = (e.target as HTMLInputElement)?.form!;
        validateForm(form);
    }

    function handleInput(e: Event) {
        validateField(e.target as HTMLInputElement);
    }

    form.addEventListener('submit', handleSubmit, { capture: true });
    form.addEventListener('input', handleInput);
    form.addEventListener('invalid', handleInvalid, { capture: true });
}
