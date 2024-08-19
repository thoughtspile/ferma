import { Maybe } from "./types";

interface SetErrorOptions {
    noReport?: boolean;
}

export type ErrorDictionary<FormShape extends Record<string, unknown>> = Partial<Record<keyof FormShape, Maybe<string>>>;

export function setFormErrors<FormShape extends Record<string, unknown>>(
    form: HTMLFormElement, 
    errors: ErrorDictionary<FormShape>, 
    ops: SetErrorOptions = {}
) {
    for (const name in errors) {
        const el = getNamedControl(form, name);
        if (!el) continue;
        
        el.setCustomValidity(errors[name] || '');
        el.dispatchEvent(new Event('ferma:validity'));
        function clearErrorOnInput(e: InputEvent & { target: HTMLInputElement }) {
            if (e.target.name !== name) return;
            el?.setCustomValidity('');
            el?.dispatchEvent(new Event('ferma:validity'));
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
