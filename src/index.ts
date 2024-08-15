type FieldError = { name: string; message: string };
export class MultiValidationError extends Error {
    constructor(public readonly items: FieldError[]) {
        super('');
    }
}

export { customValidations, invalid } from './customValidations';
export { formObject } from './formObject';
