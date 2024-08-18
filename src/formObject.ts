type FormControl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
type FormValue = File | string | number | boolean;

function isPureRadio(controls: RadioNodeList) {
    let isRadio = true;
    controls.forEach(node => {
        isRadio = isRadio && (node as HTMLInputElement).type === 'radio';
    });
    return isRadio;
}

export function getValue(control: Element | RadioNodeList, allData: FormDataEntryValue[]): FormValue | FormValue[] | undefined {
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

export function formObject<T>(form: HTMLFormElement): T {
    const res = {} as Record<string, any>;
    
    const data = new FormData(form);
    new Set(data.keys()).forEach((key) => {
        res[key] = getValue(form.elements[key]!, data.getAll(key));
    });

    return res as T;
}
