export class ValidationError extends Error {
}

type FieldError = { name: string; message: string };
export class MultiValidationError extends Error {
    constructor(public readonly items: FieldError[]) {
        super('');
    }
}

type FieldValidator = (value: string) => void;
type Validations = Record<string, FieldValidator>;

type Options = {
    sumbit: (form: HTMLFormElement) => Promise<void>
}

export function leform(validations: Validations, ops: Options) {
    const serverErrors = {};

    function validateField(el: HTMLInputElement): void {
        const serverError = serverErrors[el.name];
        if (serverError) {
            return el.setCustomValidity(serverError);
        }
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

    async function handleSubmit(e: SubmitEvent) {
        const form = e.target as HTMLFormElement;
        validateForm(form);
        form.reportValidity();
        e.preventDefault();
        try {
            await ops.sumbit(form);
        } catch (err) {
            if (err instanceof MultiValidationError) {
                err.items.forEach(({ name, message }) => {
                    serverErrors[name] = message;
                    validateField(form.elements[name]);
                });
                form.reportValidity();
            }
        }
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
        const target = e.target as HTMLInputElement;
        serverErrors[target.name] = null;
        validateField(target);
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
