import { FormControl, FormControlEvent } from "./types";

function getErrorContainer(input: FormControl) {
    return input.name ? input.form.querySelector(`[data-ferma-error=${input.name}]`) : null;
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

function onValidityChange(e: FormControlEvent) {
    syncErrorMessage(e.target)
}

function onInput(e: FormControlEvent) {
    e.target.validity.valid && syncErrorMessage(e.target);
}

export function domErrorMessages(form: HTMLFormElement): void {
    // fallback validations on submit without interaction
    form.addEventListener('invalid', handleInvalid, { capture: true });
    // listen to ferma custom validations
    form.addEventListener('ferma:validity', onValidityChange, { capture: true });
    // listen live native validations
    form.addEventListener('blur', onValidityChange, { capture: true });
    // clear native validations immediately when fixed
    form.addEventListener('input', onInput, { capture: true });
}
