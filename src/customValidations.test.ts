import { customValidations, invalid } from "./customValidations";
import { vi, it, expect, describe } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { setFormValue } from "./setFormValue";

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

describe('validation', () => {
    it('applies custom validation', async () => {
        const { form, onSumbit } = createForm(`
            <input name="foo" value="blah">
        `);
        const validateFoo = vi.fn(() => invalid('bad foo'));
        customValidations(form, { foo: validateFoo });
        await submit();
        expect(validateFoo).toBeCalledWith('blah');
        expect(onSumbit).not.toBeCalled();
        expect(getControl('foo')).toBeInvalid();
        expect(getControl('foo').validationMessage).toBe('bad foo');
    });

    it('validates radio group', async () => {
        const { form, onSumbit } = createForm(`
            <input type="radio" name="drink" value="beer" checked>
            <input type="radio" name="drink" value="wine">
        `);
        const validateDrink = vi.fn(() => invalid('bad drink'))
        customValidations(form, { drink: validateDrink });
        await submit();
        expect(validateDrink).toBeCalledWith('beer');
        expect(onSumbit).not.toBeCalled();
        expect(getControl('drink')).toBeInvalid();
        expect(getControl('drink').validationMessage).toBe('bad drink');
    });

    it('validates checkbox group', async () => {
        const { form, onSumbit } = createForm(`
            <input type="checkbox" name="drink" value="beer" checked>
            <input type="checkbox" name="drink" value="wine" checked>
        `);
        const validateDrink = vi.fn(() => invalid('bad drink'))
        customValidations(form, { drink: validateDrink });
        await submit();
        expect(validateDrink).toBeCalledWith(['beer', 'wine']);
        expect(onSumbit).not.toBeCalled();
        expect(getControl('drink')).toBeInvalid();
        expect(getControl('drink').validationMessage).toBe('bad drink');
    });
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
});

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
        // blur
        await userEvent.click(document.body);
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

describe('setFormValue interaction', () => {
    it.only('shows error on controlled change', () => {
        const { form } = createForm(`
            <input name="foo" value="">
        `);
        customValidations(form, {
            foo: (v) => v === 'bad' && invalid('bad foo'),
        });
        setFormValue(form, { foo: 'bad' });
        expect(getControl('foo')).toBeInvalid();
        expect(getControl('foo').validationMessage).toBe('bad foo');
    });
    
    it('fixes error on controlled change', async () => {
        const { form } = createForm(`
            <input name="foo" value="">
        `);
        customValidations(form, {
            foo: (v) => v !== 'good' && invalid('bad foo'),
        });
        await submit();
        setFormValue(form, { foo: 'good' });
        expect(getControl('foo')).not.toBeInvalid();
    });
});
