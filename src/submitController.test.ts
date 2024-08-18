import { customValidations, invalid } from "./customValidations";
import { vi, it, expect, describe, afterAll, beforeAll } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { submitController } from "./submitController";
import { beforeEach } from "node:test";

function createForm() {
    const form = document.createElement('form');
    form.innerHTML = '<button id="submit">submit</button>';
    const onSumbit = vi.fn((e: Event) => e.preventDefault());
    form.addEventListener('submit', onSumbit);
    document.body.appendChild(form);
    return { form, onSumbit };
}

const clickSubmit = () => userEvent.click(document.getElementById('submit')!);

const ignoreUnhandledRejection = () => {};
beforeAll(() => {
    process.on('unhandledRejection', ignoreUnhandledRejection);
});
afterAll(() => {
    process.off('unhandledRejection', ignoreUnhandledRejection)
});

it('calls submit on submit', async () => {
    const { form } = createForm();
    const submit = vi.fn(() => Promise.resolve());
    submitController(form, submit);
    await clickSubmit();
    expect(submit).toBeCalledTimes(1);
});

it('prevents default submit', async () => {
    const { form, onSumbit } = createForm();
    const submit = vi.fn(() => Promise.resolve());
    submitController(form, submit);
    await clickSubmit();
    expect(onSumbit.mock.calls[0]?.[0].defaultPrevented).toBe(true);
});

describe('submit lock', () => {
    it('prevents multiple submit', async () => {
        const { form } = createForm();
        const submit = vi.fn(() => new Promise<void>(() => {}));
        submitController(form, submit);
        await clickSubmit();
        await clickSubmit();
        expect(submit).toBeCalledTimes(1);
    });

    it('releases submit lock after failure', async () => {
        const { form } = createForm();
        const submit = vi.fn(() => Promise.reject());
        submitController(form, submit);
        await clickSubmit();
        submit.mockReset();
        await clickSubmit();
        expect(submit).toBeCalledTimes(1);
    });
    
    it('releases submit lock after success', async () => {
        const { form } = createForm();
        const submit = vi.fn(() => Promise.resolve());
        submitController(form, submit);
        await clickSubmit();
        submit.mockReset();
        await clickSubmit();
        expect(submit).toBeCalledTimes(1);
    });
});