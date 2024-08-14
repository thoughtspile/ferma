// @vitest-environment jsdom
import { formObject } from "./formObject";
import { it, describe, afterEach, expect } from 'vitest';

function createForm(html: string): HTMLFormElement {
    const form = document.createElement('form');
    form.innerHTML = html;
    return form;
}

afterEach(() => {
    document.body.innerHTML = '';
});

describe('plain controls', () => {
    it('serializes input type=text', () => {
        const form = createForm(`
            <input name="one" value="one">
            <input name="two" value="two">
        `)
        expect(formObject(form)).toEqual({ one: 'one', two: 'two' });
    });
    
    it('serializes textarea', () => {
        const form = createForm(`
            <textarea name="text">long text</textarea>
        `)
        expect(formObject(form)).toEqual({ text: 'long text' });
    });
    
    it('serializes input type=number', () => {
        const form = createForm(`
            <input name="num" type="number" value="2">
        `)
        expect(formObject(form)).toEqual({ num: 2 });
    });

    it('serializes select', () => {
        const form = createForm(`
            <select name="options">
                <option value="yes" checked></option>
                <option value="no"></option>
            </select>
        `)
        expect(formObject(form)).toEqual({ options: 'yes' });
    });
});

// jsdom does not support multiple
describe.skip('multiple', () => {
    it('serializes select multiple as array', () => {
        const form = createForm(`
            <select name="select" multiple>
                <option value="one" checked></option>
                <option value="two" checked></option>
            </select>
        `)
        expect(formObject(form)).toEqual({ select: ['one', 'two'] });
    });

    it('serializes select multiple with one value as array', () => {
        const form = createForm(`
            <select name="select" multiple>
                <option value="one"></option>
                <option value="two" checked></option>
            </select>
        `)
        expect(formObject(form)).toEqual({ select: ['two'] });
    });
    
    it('serializes empty select multiple as array', () => {
        const form = createForm(`
            <select name="select" multiple>
                <option value="one"></option>
                <option value="two"></option>
            </select>
        `)
        expect(formObject(form)).toEqual({ select: [] });
    });

    it('serializes email multiple as array', () => {
        const form = createForm(`
            <input name="recipients" type="email" value="me@me,you@you">
        `)
        expect(formObject(form)).toEqual({ recipients: ['me@me', 'you@you'] });
    });
});

describe('checkbox', () => {
    it('serializes checkbox groups', () => {
        const form = createForm(`
            <input type="checkbox" name="checkbox" value="one" checked>
            <input type="checkbox" name="checkbox" value="two" checked>
            <input type="checkbox" name="checkbox" value="three">
        `)
        expect(formObject(form)).toEqual({ checkbox: ['one', 'two'] });
    });

    it('serializes checkbox groups with one checked node', () => {
        const form = createForm(`
            <input type="checkbox" name="checkbox" value="one" checked>
            <input type="checkbox" name="checkbox" value="two">
            <input type="checkbox" name="checkbox" value="three">
        `)
        expect(formObject(form)).toEqual({ checkbox: ['one'] });
    });

    it('ignores checkbox groups with no checked nodes', () => {
        const form = createForm(`
            <input type="checkbox" name="checkbox" value="one">
            <input type="checkbox" name="checkbox" value="two">
            <input type="checkbox" name="checkbox" value="three">
        `)
        expect(formObject(form)).toEqual({});
    });
    
    it('serializes one checkbox as boolean', () => {
        const form = createForm(`
            <input type="checkbox" name="checkme" checked>
        `)
        expect(formObject(form)).toEqual({ checkme: true });
    });
    
    it('serializes one checkbox with value as array', () => {
        const form = createForm(`
            <input type="checkbox" name="options" value="only" checked>
        `)
        expect(formObject(form)).toEqual({ options: ['only'] });
    });
})

describe('groups', () => {
    it('multiple text inputs', () => {
        const form = createForm(`
            <input name="one" value="one">
            <input name="one" value="two">
        `)
        expect(formObject(form)).toEqual({ one: ['one', 'two'] });
    });
    
    it('multiple number inputs as text', () => {
        const form = createForm(`
            <input name="mix" type="number" value="1">
            <input name="mix" type="number" value="2">
        `)
        expect(formObject(form)).toEqual({ mix: ["1", "2"] });
    });

    describe('radio group', () => {
        it('serializes to plain value', () => {
            const form = createForm(`
                <input type="radio" name="radio" value="one" checked>
                <input type="radio" name="radio" value="two">
                <input type="radio" name="radio" value="three">
            `)
            expect(formObject(form)).toEqual({ radio: 'one' });
        });

        it('serializes mixed radio + plain to array', () => {
            const form = createForm(`
                <input type="radio" name="mixed" value="one" checked>
                <input type="radio" name="mixed" value="two">
                <input type="radio" name="mixed" value="three">
                <input name="mixed" value="extra">
            `)
            expect(formObject(form)).toEqual({ mixed: ['one', 'extra'] });
        });
    });
});
