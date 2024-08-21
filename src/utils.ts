export function isPureRadio(controls: RadioNodeList) {
    let isRadio = true;
    controls.forEach(node => {
        isRadio = isRadio && (node as HTMLInputElement).type === 'radio';
    });
    return isRadio;
}

export function getNamedControl(form: HTMLFormElement, name: string): HTMLInputElement | undefined {
    const control = form.elements[name];
    return control instanceof RadioNodeList ? control[0] : control;
}
