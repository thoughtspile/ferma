import { ferma, domErrorMessages, invalid } from "./src";

type FormState = {
    username: string;
    receiver: string;
    amount: number;
    accept: string[];
    receiverType: 'legal' | 'physical';
};

const formEl = document.querySelector('form#payment') as HTMLFormElement;
const form = ferma<FormState>(formEl, {
    validate: {
        receiver: (v) => {
            if (!v || !v.startsWith('40817')) invalid('Account number must start with 40817');
        }
    },
    submit: () => {
        console.log(form.getValue());
        return new Promise((_, fail) => {
            setTimeout(() => {
                form.setErrors({ receiver: 'account blocked' });
                fail();
            }, 1000);
        });
    },
});

domErrorMessages(formEl);

document.getElementById('randomize')?.addEventListener('click', () => {
    form.setValue({ amount: Math.floor(Math.random() * 1000) });
});
