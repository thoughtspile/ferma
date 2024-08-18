import { errorController } from './errorController';
import { customValidations } from './customValidations';
import { domErrorMessages } from './domErrorMessages';
import { formObject } from './formObject';
import { submitController } from './submitController';
import { setFormValue } from './setFormValue';
import { FieldType } from './types';

export function ferma<T extends { [name: string]: FieldType }>(form: HTMLFormElement) {
    return {
        getValue: () => formObject<T>(form),
        setValue: (patch: Partial<T>) => setFormValue(form, patch),
    }
}
