import { setFormErrors, type ErrorDictionary } from './setFormErrors';
import { customValidations, ValidationSchema } from './customValidations';
import { getFormValue } from './getFormValue';
import { submitController, type Submitter } from './submitController';
import { setFormValue } from './setFormValue';
import { BaseFormState } from './types';

interface FermaOptions<FormShape extends BaseFormState> {
    submit?: Submitter;
    validate?: ValidationSchema<FormShape>;
}

export function ferma<FormShape extends BaseFormState>(
    form: HTMLFormElement,
    options: FermaOptions<FormShape> = {}
) {
    options.submit && submitController(form, options.submit);
    options.validate && customValidations(form, options.validate);
    return {
        getValue: () => getFormValue<FormShape>(form),
        setValue: (patch: Partial<FormShape>) => setFormValue(form, patch),
        setErrors: (errors: ErrorDictionary<FormShape>) => setFormErrors(form, errors),
    };
}
