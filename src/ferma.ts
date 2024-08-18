import { setFormErrors } from './setFormErrors';
import { customValidations } from './customValidations';
import { domErrorMessages } from './domErrorMessages';
import { getFormValue } from './getFormValue';
import { submitController } from './submitController';
import { setFormValue } from './setFormValue';
import { FieldType } from './types';

export function ferma<T extends { [name: string]: FieldType }>(form: HTMLFormElement) {
    return {
        getValue: () => getFormValue<T>(form),
        setValue: (patch: Partial<T>) => setFormValue(form, patch),
    }
}
