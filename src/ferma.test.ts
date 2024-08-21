import { expect, it, vi } from 'vitest';
import { ferma } from './ferma';
import userEvent from '@testing-library/user-event';
import { invalid } from './customValidations';

function createForm(html: string) {
    const form = document.createElement('form');
    form.innerHTML = html + '<button id="submit">submit</button>';
    document.body.appendChild(form);
    return { form };
}

const submit = () => userEvent.click(document.getElementById('submit')!);
const getControl = (name: string) => document.getElementsByName(name)[0] as HTMLInputElement;

it('can get value', () => {
    const { form } = createForm(`
        <input name="name" value="vladimir">
    `);
    expect(ferma(form).getValue()).toEqual({ name: 'vladimir' });
});

it('can set value', () => {
    const { form } = createForm(`
        <input name="name" value="vladimir">
    `);
    ferma(form).setValue({ name: 'bobby' });
    expect(getControl('name')).toHaveValue('bobby');
});

it('can set errors', () => {
    const { form } = createForm(`
        <input name="name" value="vladimir">
    `);
    ferma(form).setErrors({ name: 'dirty' });
    expect(getControl('name')).toBeInvalid();
    expect(getControl('name').validationMessage).toBe('dirty');
});

it('clears set errors on input', async () => {
    const { form } = createForm(`
        <input name="name" value="vladimir">
    `);
    ferma(form).setErrors({ name: 'dirty' });
    await userEvent.type(getControl('name'), 'f');
    expect(getControl('name')).not.toBeInvalid();
});

it('calls submitter', async () => {
    const { form } = createForm(`
        <input name="name" value="vladimir">
    `);
    const submit = vi.fn();
    ferma(form, { submit });
    await submit();
    expect(submit).toBeCalledTimes(1);
});

it('applies custom validation', async () => {
    const { form } = createForm(`
        <input name="name" value="vladimir">
    `);
    ferma(form, {
        validate: {
            name: v => v === 'vladimir' && invalid('bad name')
        }
    });
    await submit();
    expect(getControl('name')).toBeInvalid();
    expect(getControl('name').validationMessage).toBe('bad name');
});
