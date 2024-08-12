import { leform, ValidationError } from "./index";

const paymentForm = leform({
    receiver: (v) => {
        if (!v.startsWith('40817')) {
            throw new ValidationError('Account number must start with 40817');
        }
    }
});

paymentForm.attach(document.querySelector('form#payment')!);
