import { setFormValue } from "./setFormValue";
import { it, describe, expect } from 'vitest';

function createForm(html: string): HTMLFormElement {
    const form = document.createElement('form');
    form.innerHTML = html;
    document.body.appendChild(form);
    return form;
}

const getControl = (name: string) => document.getElementsByName(name)[0] as HTMLInputElement;

describe('plain controls', () => {
    it('sets input type=text', () => {
        const form = createForm(`
            <input name="one" value="one">
            <input name="two" value="two">
        `)
        setFormValue(form, { one: 'bingo', two: 'bongo' });
        expect(getControl('one')).toHaveValue('bingo');
        expect(getControl('two')).toHaveValue('bongo');
    });
    
    it('sets textarea', () => {
        const form = createForm(`
            <textarea name="text">long text</textarea>
        `);
        setFormValue(form, { text: 'other text' });
        expect(getControl('text')).toHaveValue('other text');
    });
    
    it('sets input type=number', () => {
        const form = createForm(`
            <input name="num" type="number" value="2">
        `);
        setFormValue(form, { num: 55 });
        expect(getControl('num')).toHaveValue(55);
    });

    it('sets invalid number to undefined', () => {
        const form = createForm(`
            <input name="num" type="number" value="99">
        `);
        setFormValue(form, { num: 'hello' });
        expect(getControl('num')).not.toHaveValue();
    })

    it('sets select', () => {
        const form = createForm(`
            <select name="options">
                <option value="yes" checked></option>
                <option value="no"></option>
            </select>
        `)
        setFormValue(form, { options: 'no' });
        expect(getControl('options')).toHaveValue('no');
    });
});

describe('checkbox', () => {
    it('can set group', () => {
        const form = createForm(`
            <input type="checkbox" name="checkbox" value="one" checked>
            <input type="checkbox" name="checkbox" value="two" checked>
            <input type="checkbox" name="checkbox" value="three">
        `);
        setFormValue(form, { checkbox: ['two', 'three'] });
        expect(new FormData(form).getAll('checkbox')).toEqual(['two', 'three']);
    });

    it('ignores missing values', () => {
        const form = createForm(`
            <input type="checkbox" name="checkbox" value="one" checked>
            <input type="checkbox" name="checkbox" value="two" checked>
            <input type="checkbox" name="checkbox" value="three">
        `);
        setFormValue(form, { checkbox: ['dick', 'three'] });
        expect(new FormData(form).getAll('checkbox')).toEqual(['three']);
    })

    it('can set group from one string', () => {
        const form = createForm(`
            <input type="checkbox" name="checkbox" value="one" checked>
            <input type="checkbox" name="checkbox" value="two">
            <input type="checkbox" name="checkbox" value="three">
        `)
        setFormValue(form, { checkbox: 'two' });
        expect(new FormData(form).getAll('checkbox')).toEqual(['two']);
    });

    it('can clear group on falsy', () => {
        const form = createForm(`
            <input type="checkbox" name="checkbox" value="one">
            <input type="checkbox" name="checkbox" value="two">
            <input type="checkbox" name="checkbox" value="three">
        `)
        setFormValue(form, { checkbox: false });
        expect(new FormData(form).getAll('checkbox')).toEqual([]);
    });
    
    it('can check one checkbox', () => {
        const form = createForm(`
            <input type="checkbox" name="checkme" checked>
        `)
        setFormValue(form, { checkme: true });
        expect(getControl('checkme')).toBeChecked();
    });
    
    it('can uncheck one checkbox', () => {
        const form = createForm(`
            <input type="checkbox" name="checkme" checked>
        `);
        setFormValue(form, { checkme: false });
        expect(getControl('checkme')).not.toBeChecked();
    });
})

describe('radio group', () => {
    function createRadio() {
        return createForm(`
            <input type="radio" name="radio" value="one" checked>
            <input type="radio" name="radio" value="two">
            <input type="radio" name="radio" value="three">
        `);
    }

    it('can set', () => {
        const form = createRadio();
        setFormValue(form, { radio: 'two' });
        expect(new FormData(form).get('radio')).toEqual('two');
    });
    
    it('can unset all on falsy', () => {
        const form = createRadio();
        setFormValue(form, { radio: false });
        expect(new FormData(form).getAll('radio')).toEqual([]);
    });
    
    it('unsets all on missing value', () => {
        const form = createRadio();
        setFormValue(form, { radio: 'dirty' });
        expect(new FormData(form).getAll('radio')).toEqual([]);
    });
});

it('ignores missing elements', () => {
    const form = createForm(`
        <input name="foo" value="bar">
    `);
    setFormValue(form, { missing: 'invalid' });
});