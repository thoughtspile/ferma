export function isPureRadio(controls: RadioNodeList) {
    let isRadio = true;
    controls.forEach(node => {
        isRadio = isRadio && (node as HTMLInputElement).type === 'radio';
    });
    return isRadio;
}