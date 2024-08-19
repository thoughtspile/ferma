export type Maybe<T> = T | false | null | undefined;
export type FormControl = (HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) & { form: HTMLFormElement };
export type FieldType = string | number | boolean | File | FormDataEntryValue[];
export type BaseFormState = { [name: string]: FieldType };

export type FormControlEvent = Event & { target: FormControl };
export type FormControlItem = RadioNodeList | FormControl | null;
