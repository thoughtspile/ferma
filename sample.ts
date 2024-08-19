import { ferma, domErrorMessages, invalid } from "./src";

type FormState = {
    username: string;
    receiver: string;
    amount: number;
    agree: string[];
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
    form.setValue({ 
        username: Math.random() > 0.5 ? 'thoughtspile' : 'dido',
        amount: Math.floor(Math.random() * 1000),
        receiver: Math.random() > 0.5 ? '40817117' : '48992381',
        agree: [Math.random() > 0.5 ? 'fee' : '', Math.random() > 0.5 ? 'conditions' : ''],
        receiverType: Math.random() > 0.5 ? 'legal' : 'physical',
    });
});
