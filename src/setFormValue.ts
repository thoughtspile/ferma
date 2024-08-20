import type { FormControlItem } from "./types";
import { isPureRadio } from "./utils";

export function setFormValue(form: HTMLFormElement, value: object) {
    for (const name in value) {
        const control: FormControlItem = form.elements[name];
        const fieldValue = value[name];
        if (control instanceof RadioNodeList) {
            if (isPureRadio(control)) {
                control.value = fieldValue;
                if (control.value === fieldValue) break;
            }
            const hasValue = (v: string) => Array.isArray(fieldValue) ? fieldValue.includes(v) : fieldValue === v;
            control.forEach(node => node instanceof HTMLInputElement && (node.checked = hasValue(node.value)));
        } else if (control instanceof HTMLInputElement && control.type === 'checkbox') {
            control.checked = !!fieldValue;
        } else if (control) {
            control.value = Array.isArray(fieldValue) ? fieldValue.join(',') : fieldValue;
        }
        (control instanceof RadioNodeList ? control[0] : control)?.dispatchEvent(new Event('ferma:change'));
    }
}
