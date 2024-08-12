import { leform, MultiValidationError, ValidationError } from "./index";

const paymentForm = leform({
    receiver: (v) => {
        if (!v.startsWith('40817')) {
            throw new ValidationError('Account number must start with 40817');
        }
    }
}, {
    sumbit: () => {
        return new Promise((_, fail) => {
            setTimeout(() => {
                fail(new MultiValidationError([{ name: 'receiver', message: 'account blocked' }]));
            }, 1000);
        });
    }
});

paymentForm.attach(document.querySelector('form#payment')!);
