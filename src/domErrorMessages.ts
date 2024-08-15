function getErrorContainer(input: HTMLInputElement) {
    const name = input?.name;
    return input.form?.querySelector(`[data-leform-error=${name}]`);
}

function handleInvalid(e: Event) {
    const input = e.target as HTMLInputElement;
    const errorContainer = getErrorContainer(input);
    if (!errorContainer) return;
    
    e.preventDefault();
    errorContainer.innerHTML = input.validationMessage;
    
    const firstInvalid = input.form?.querySelector(':invalid') as HTMLInputElement;
    firstInvalid.focus();
    firstInvalid.scrollIntoView({ behavior: 'smooth' });
}

export function domErrorMessages(form: HTMLFormElement): void {
    form.addEventListener('invalid', handleInvalid, { capture: true });
}
