export type Maybe<T> = T | false | null | undefined;
export type FormControl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
export type FieldType = string | number | boolean | File | string[] | File[];
export type FormControlEvent = Event & { target: FormControl };
export type FormControlItem = RadioNodeList | FormControl | null;

