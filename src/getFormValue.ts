import { FieldType } from "./types";
import { isPureRadio } from "./utils";

export function getFieldValue(control: Element | RadioNodeList, allData: FormDataEntryValue[]): FieldType | undefined {
    const isMixed = control instanceof RadioNodeList && !isPureRadio(control);
    const isMultiple = (control as HTMLSelectElement).multiple;
    if (isMixed || isMultiple) return allData;

    const isInput = control instanceof HTMLInputElement;
    if (isInput && control.type === 'checkbox') {
        // use boolean for implicit-valued cehckbox only
        // serialize single checkbox with explicit value as array to allow dynamic option lists
        // unchecked checkbox is _not_ in FormData
        return control.value === 'on' ? true : allData;
    }
    if (isInput && control.type === 'number') {
        const value = control.valueAsNumber;
        return Number.isNaN(value) ? undefined : value;
    }
    // multiple is allowed on type="file|email"
    if (isInput && control.multiple) {
        return control.value.split(',');
    }

    return allData[0];
}

export function getFormValue<T>(form: HTMLFormElement): Partial<T> {
    const res = {} as Record<string, FieldType | undefined>;
    
    const data = new FormData(form);
    new Set(data.keys()).forEach((key) => {
        res[key] = getFieldValue(form.elements[key]!, data.getAll(key));
    });

    return res as T;
}
