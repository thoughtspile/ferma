import { Maybe } from "./types";

interface SetErrorOptions {
    noReport?: boolean;
}

export function setFormErrors<FormShape extends Record<string, unknown>>(
    form: HTMLFormElement, 
    errors: Record<keyof FormShape, Maybe<string>>, 
    ops: SetErrorOptions = {}
) {
    for (const name in errors) {
        const el = getNamedControl(form, name);
        if (!el) continue;
        
        el.setCustomValidity(errors[name] || '');
        function clearErrorOnInput(e: InputEvent & { target: HTMLInputElement }) {
            if (e.target.name !== name) return;
            el?.setCustomValidity('');
            form.removeEventListener('input', clearErrorOnInput);
        }
        form.addEventListener('input', clearErrorOnInput);
    }
    !ops.noReport && form.reportValidity();
}

function getNamedControl(form: HTMLFormElement, name: string): HTMLInputElement {
    const control = form.elements[name];
    return control instanceof RadioNodeList ? control[0] : control;
}
