type Maybe<T> = T | false | null | undefined;
interface SetErrorOptions {
    noReport?: boolean;
}

export function errorController<FormKeys extends string = string>(form: HTMLFormElement) {
    function setErrors(errors: Record<FormKeys, Maybe<string>>, ops: SetErrorOptions = {}) {
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
    return { setErrors };
}

function getNamedControl(form: HTMLFormElement, name: string): HTMLInputElement {
    const control = form.elements[name];
    return control instanceof RadioNodeList ? control[0] : control;
}
