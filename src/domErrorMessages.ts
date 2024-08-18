function getErrorContainer(input: HTMLInputElement) {
    return input.form?.querySelector(`[data-leform-error=${input?.name}]`);
}

function getFirstInvalid(form: HTMLFormElement) {
    for (let i = 0; i < form.elements.length; i++) {
        if (!(form.elements[i] as HTMLInputElement).validity.valid) {
            return form.elements[i];
        }
    }
}

function handleInvalid(e: Event) {
    const input = e.target as HTMLInputElement;
    const errorContainer = getErrorContainer(input);
    if (!errorContainer) return;
    
    e.preventDefault();
    errorContainer.innerHTML = input.validationMessage;
    if (input === getFirstInvalid(input.form!)) {
        input.focus();
        input.scrollIntoView({ behavior: 'smooth' });
    }
}

export function domErrorMessages(form: HTMLFormElement): void {
    form.addEventListener('invalid', handleInvalid, { capture: true });
}
