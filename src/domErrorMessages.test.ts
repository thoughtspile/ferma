import { vi, it, expect, describe } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { domErrorMessages } from "./domErrorMessages";
import { customValidations, invalid } from './customValidations';

HTMLElement.prototype.scrollIntoView = vi.fn();

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
const getError = (name: string) => document.querySelector(`[data-ferma-error="${name}"]`) as HTMLDivElement;

describe('native validation', () => {
    it('shows native validation on input', async () => {
        const { form } = createForm(`
            <input type="number" max="10" name="foo">
            <div data-ferma-error="foo"></div>
        `);
        domErrorMessages(form);
        await userEvent.type(getControl('foo'), '999');
        expect(getError('foo')).not.toBeEmptyDOMElement();
    });

    it('shows native validation on submit', async () => {
        const { form } = createForm(`
            <input name="foo" required>
            <div data-ferma-error="foo"></div>
        `);
        domErrorMessages(form);
        await submit();
        expect(getError('foo')).not.toBeEmptyDOMElement();
        expect(getControl('foo')).toHaveFocus();
    });
});

it('focuses first invalid', async () => {
    const { form } = createForm(`
        <input name="foo">
        <div data-ferma-error="foo"></div>
        <input name="bar" required>
        <div data-ferma-error="bar"></div>
    `);
    domErrorMessages(form);
    await submit();
    expect(getControl('bar')).toHaveFocus();
})

it('shows custom validation on change', async () => {
    const { form } = createForm(`
        <input name="foo">
        <div data-ferma-error="foo"></div>
    `);
    customValidations(form, {
        foo: () => invalid('bad foo')
    });
    domErrorMessages(form);
    await userEvent.type(getControl('foo'), '999');
    // blur input
    await userEvent.click(document.body);
    expect(getError('foo')).toHaveTextContent('bad foo');
});

it('shows custom validation on submit', async () => {
    const { form } = createForm(`
        <input name="foo">
        <div data-ferma-error="foo"></div>
    `);
    customValidations(form, {
        foo: () => invalid('bad foo')
    });
    domErrorMessages(form);
    await submit();
    expect(getError('foo')).toHaveTextContent('bad foo');
    expect(getControl('foo')).toHaveFocus();
});

it('hides validation when fixed', async () => {
    const { form } = createForm(`
        <input name="foo" required>
        <div data-ferma-error="foo"></div>
    `);
    domErrorMessages(form);
    await submit();
    await userEvent.type(getControl('foo'), 'foo');
    expect(getError('foo')).toBeEmptyDOMElement();
});

it('does not prevent native reporting', async () => {
    const { form } = createForm(`
        <input name="foo" required>
    `);
    domErrorMessages(form);
    await submit();
});
