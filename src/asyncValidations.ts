type Maybe<T> = T | false | null | undefined;

function getNamedControl(form: HTMLFormElement, name: string): HTMLInputElement | undefined {
    const control = form.elements[name];
    return control instanceof RadioNodeList ? control[0] : control;
}

function clearErrorOnInput(e: InputEvent & { target: HTMLInputElement }) {
    e.target.setCustomValidity('');
    e.target.removeEventListener('input', clearErrorOnInput);
}

export function asyncValidations<FormKeys extends string = string>(form: HTMLFormElement) {
    function setErrors(errors: Record<FormKeys, Maybe<string>>) {
        for (const name in errors) {
            const el = getNamedControl(form, name);
            el?.setCustomValidity(errors[name] || '');
            el?.addEventListener('input', clearErrorOnInput);
        }
        form.reportValidity();
    }
    return { setErrors };
}
