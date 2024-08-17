// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { customValidations, invalid } from "./customValidations";
import { vi, it, afterEach, expect, describe } from 'vitest';
import { userEvent } from '@testing-library/user-event';

function createForm(html: string) {
    const form = document.createElement('form');
    form.innerHTML = html + '<button id="submit">submit</button>';
    const onSumbit = vi.fn((e: Event) => e.preventDefault());
    form.addEventListener('submit', onSumbit);
    document.body.appendChild(form);
    return { form, onSumbit };
}

const submit = () => userEvent.click(document.getElementById('submit')!);
const getControl = (name: string) => document.getElementsByName(name)[0] as HTMLInputElement;

afterEach(() => {
    document.body.innerHTML = '';
});

it('applies custom validation', async () => {
    const { form, onSumbit } = createForm(`
        <input name="foo">
    `);
    customValidations(form, {
        foo: () => invalid('bad foo'),
    });
    await submit();
    expect(onSumbit).not.toBeCalled();
    expect(getControl('foo')).toBeInvalid();
    expect(getControl('foo').validationMessage).toBe('bad foo');
});

it('does not prevent submit if all valid', async () => {
    const { form, onSumbit } = createForm(`
        <input name="foo">
    `);
    customValidations(form, {
        foo: () => null,
    });
    await submit();
    expect(getControl('foo')).not.toBeInvalid();
    expect(onSumbit).toBeCalled();
})

describe('interaction with native validation', () => {
    it('native validation works', async () => {
        const { form, onSumbit } = createForm(`
            <input required name="foo">
        `);
        customValidations(form, {});
        await submit();
        expect(getControl('foo')).toBeInvalid();
        expect(onSumbit).not.toBeCalled();
    });

    it('failed native validation does not prevent custom validation', async () => {
        const { form, onSumbit } = createForm(`
            <input name="foo">
            <input name="bar" required>
        `);
        customValidations(form, {
            foo: () => invalid('bad foo'),
        });
        await submit();
        expect(onSumbit).not.toBeCalled();
        expect(getControl('foo')).toBeInvalid();
        expect(getControl('bar')).toBeInvalid();
    });

    it('custom validation overrides native', async () => {
        const { form, onSumbit } = createForm(`
            <input name="foo" required>
        `);
        customValidations(form, {
            foo: () => invalid('bad foo'),
        });
        await submit();
        expect(onSumbit).not.toBeCalled();
        expect(getControl('foo')).toBeInvalid();
        expect(getControl('foo').validationMessage).toBe('bad foo');
    });
});

describe('live validation', () => {
    // TODO: maybe we should
    it('initial state is not validated', () => {
        const { form } = createForm(`
            <input name="foo" value="bad">
        `);
        customValidations(form, {
            foo: () => invalid('bad foo'),
        });
        expect(getControl('foo')).not.toBeInvalid();
    });
    
    it('state is validated on change without submit', async () => {
        const { form } = createForm(`
            <input name="foo">
        `);
        customValidations(form, {
            foo: value => value === 'bad' ? invalid('bad foo') : null,
        });
        await userEvent.type(getControl('foo'), 'bad');
        expect(getControl('foo')).toBeInvalid();
        expect(getControl('foo').validationMessage).toBe('bad foo');
    });

    it('invalid flag is unset when fixed', async () => {
        const { form } = createForm(`
            <input name="foo" value="bad">
        `);
        customValidations(form, {
            foo: value => value === 'bad' ? invalid('bad foo') : null,
        });
        await submit();
        await userEvent.type(getControl('foo'), 'bar');
        expect(getControl('foo')).not.toBeInvalid();

    });
});