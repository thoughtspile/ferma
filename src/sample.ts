import { formObject, customValidations, domErrorMessages, invalid, setFormErrors } from "./index";
import { submitController } from "./submitController";

const form = document.querySelector('form#payment') as HTMLFormElement;

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
            setFormErrors(form, { receiver: 'account blocked' });
            fail();
        }, 1000);
    });
});
