import { Maybe } from "./types";
import { getNamedControl } from "./utils";

export type ErrorDictionary<FormShape extends Record<string, unknown>> = Partial<Record<keyof FormShape, Maybe<string>>>;

export function setFormErrors<FormShape extends Record<string, unknown>>(
    form: HTMLFormElement, 
    errors: ErrorDictionary<FormShape>,
) {
    for (const name in errors) {
        const el = getNamedControl(form, name);
        el?.setCustomValidity(errors[name] || '');
    }
    form.reportValidity();
}
