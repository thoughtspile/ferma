import { formObject, leform, MultiValidationError, ValidationError } from "./index";

const form = document.querySelector('form#payment') as HTMLFormElement;

const paymentForm = leform({
    receiver: (v) => {
        if (!v.startsWith('40817')) {
            throw new ValidationError('Account number must start with 40817');
        }
    }
}, {
    sumbit: () => {
        console.log(formObject(form));
        return new Promise((_, fail) => {
            setTimeout(() => {
                fail(new MultiValidationError([{ name: 'receiver', message: 'account blocked' }]));
            }, 1000);
        });
    }
});

paymentForm.attach(form);
