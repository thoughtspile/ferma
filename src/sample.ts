import { formObject, customValidations, domErrorMessages, invalid, errorController, setFormValue } from "./index";
import { submitController } from "./submitController";

const form = document.querySelector('form#payment') as HTMLFormElement;

const errors = errorController<'receiver'>(form);
customValidations(form, {
    receiver: (v) => {
        if (!v.startsWith('40817')) invalid('Account number must start with 40817');
    }
});
domErrorMessages(form);
submitController(form, () => {
    console.log(formObject(form));
    return new Promise((_, fail) => {
        setTimeout(() => {
            errors.setErrors({ receiver: 'account blocked' });
            fail();
        }, 1000);
    });
});
