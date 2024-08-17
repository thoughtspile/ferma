// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { asyncValidations } from "./asyncValidations";
import { it, afterEach, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { customValidations } from './customValidations';

function createForm(html: string) {
    const form = document.createElement('form');
    form.innerHTML = html + '<button id="submit">submit</button>';
    document.body.appendChild(form);
    return form;
}

const getControl = (name: string) => document.getElementsByName(name)[0] as HTMLInputElement;

afterEach(() => {
    document.body.innerHTML = '';
});

it('can set validations', () => {
    const form = createForm(`
        <input name="foo">
        <input name="bar">
        <input name="baz">
    `);
    const h = asyncValidations(form);
    h.setErrors({
        foo: 'bad foo',
        bar: 'bad bar'
    });
    expect(getControl('foo')).toBeInvalid();
    expect(getControl('foo').validationMessage).toBe('bad foo');
    expect(getControl('bar')).toBeInvalid();
    expect(getControl('bar').validationMessage).toBe('bad bar');
    expect(getControl('baz')).not.toBeInvalid();
});

it('can clear validations', () => {
    const form = createForm(`
        <input name="foo">
        <input name="bar">
    `);
    const h = asyncValidations(form);
    h.setErrors({ foo: 'bad foo', bar: 'bad bar' });
    h.setErrors({ foo: 'bad foo', bar: false });
    expect(getControl('foo')).toBeInvalid();
    expect(getControl('foo').validationMessage).toBe('bad foo');
    expect(getControl('bar')).not.toBeInvalid();
});

it('ignores non-existent fields', () => {
    const form = createForm(`
        <input name="foo">
    `);
    const h = asyncValidations(form);
    expect(() => h.setErrors({ blah: 'blah' })).not.toThrow();
})

it('errors is cleared on input', async () => {
    const form = createForm(`
        <input name="foo">
    `);
    const h = asyncValidations(form);
    h.setErrors({ foo: 'bad foo' });
    await userEvent.type(getControl('foo'), 'blah');
    expect(getControl('foo')).not.toBeInvalid();
});

it.only('works with customValidations', () => {
    const form = createForm(`
        <input name="foo">
    `);
    customValidations(form, { foo: () => false });
    const h = asyncValidations(form);
    h.setErrors({ foo: 'bad foo' });
    console.log('assert');
    expect(getControl('foo').validationMessage).toBe('bad foo');
});
