import { FormControl, FormControlEvent } from "./types";

function getErrorContainer(input: FormControl) {
    return input.form.querySelector(`[data-ferma-error=${input.name}]`);
}

function getFirstInvalid(form: HTMLFormElement) {
    for (let i = 0; i < form.elements.length; i++) {
        if (!(form.elements[i] as HTMLInputElement).validity.valid) {
            return form.elements[i];
        }
    }
}

function syncErrorMessage(input: FormControl) {
    const errorContainer = getErrorContainer(input);
    errorContainer && (errorContainer.innerHTML = input.validationMessage);
}

function handleInvalid(e: FormControlEvent) {
    const input = e.target;
    const errorContainer = getErrorContainer(input);
    if (!errorContainer) return;
    
    e.preventDefault();
    syncErrorMessage(input);
    if (input === getFirstInvalid(input.form!)) {
        input.focus();
        input.scrollIntoView({ behavior: 'smooth' });
    }
}

export function domErrorMessages(form: HTMLFormElement): void {
    form.addEventListener('invalid', handleInvalid, { capture: true });
    form.addEventListener('input', (e: FormControlEvent) => syncErrorMessage(e.target));
    form.addEventListener('change', (e: FormControlEvent) => syncErrorMessage(e.target));
}
