// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { errorController } from "./errorController";
import { it, afterEach, expect, describe } from 'vitest';
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

it('can set errors', () => {
    const form = createForm(`
        <input name="foo">
        <input name="bar">
        <input name="baz">
    `);
    const h = errorController(form);
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

it('ignores non-existent fields', () => {
    const form = createForm(`
        <input name="foo">
    `);
    const h = errorController(form);
    expect(() => h.setErrors({ blah: 'blah' })).not.toThrow();
});

it('works with customValidations', () => {
    const form = createForm(`
        <input name="foo">
    `);
    customValidations(form, { foo: () => false });
    const h = errorController(form);
    h.setErrors({ foo: 'bad foo' });
    expect(getControl('foo').validationMessage).toBe('bad foo');
});

describe('can clear error', () => {
    it('via API', () => {
        const form = createForm(`
            <input name="foo">
            <input name="bar">
        `);
        const h = errorController(form);
        h.setErrors({ foo: 'bad foo', bar: 'bad bar' });
        h.setErrors({ foo: 'bad foo', bar: false });
        expect(getControl('foo').validationMessage).toBe('bad foo');
        expect(getControl('bar')).not.toBeInvalid();
    });

    it('on input', async () => {
        const form = createForm(`
            <input name="foo">
            <input name="bar">
        `);
        const h = errorController(form);
        h.setErrors({ foo: 'bad foo', bar: 'bad bar' });
        await userEvent.type(getControl('bar'), 'blah');
        expect(getControl('foo').validationMessage).toBe('bad foo');
        expect(getControl('bar')).not.toBeInvalid();
    });
    
    it('on checkbox', async () => {
        const form = createForm(`
            <input type="checkbox" name="foo">
        `);
        const h = errorController(form);
        h.setErrors({ foo: 'bad foo' });
        await userEvent.click(getControl('foo'));
        expect(getControl('foo')).not.toBeInvalid();
    });

    it('on multi-element control', async () => {
        const form = createForm(`
            <input id="beer" type="checkbox" value="beer" name="drink">
            <input id="wine" type="checkbox" value="wine" name="drink">
        `);
        const h = errorController(form);
        h.setErrors({ drink: 'pick drink' });
        await userEvent.click(document.getElementById('wine')!);
        const drinks = document.getElementsByName('drink');
        expect(drinks[0]).not.toBeInvalid();
        expect(drinks[1]).not.toBeInvalid();
    });
});
