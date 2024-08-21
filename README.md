# Ferma: a 2 kB power-up for native HTML forms.

> Beware: alpha-quality software.

We all want to love native HTML forms — but they're tricky to work with. So, we've come up with two-way data binding to get a live form _model_ in JS, and do all kinds of JS stuff on it instead of using native features. But _what if_ we don't need live models, and _maybe_ we don't even need a framework to build a decent form?

Ferma is a vanilla JS library that gives us a low-tech way to work with forms:

- Serialize forms to JS objects.
- Set field values from JS.
- Work with checkbox / radio groups and multiple inputs.
- Validate data client-side, with any rules you want.
- Report field errors from API response with ease.
- Notify users via DOM error messages with great UX.

And with great perks:

- No framework required.
- Tiny: around __1–1.5 kB__ of JS, min + gzip. Modular, tree-shakable helpers available for every feature.
- Write less code with native HTML validations.

Limitations of the current version:

- Only supports flat form serialization (no nested objects / arrays).
- Does not play well with front-end frameworks (field errors are not observable, does not listen to controlled input changes).
- No multi-field live validation.

## Install

```sh
npm install --save ferma
```

## Example

Here's a simple HTML form to make a bank transfer:

```html
<form id="transfer">
    <label>
        Bank account number
        <input name="account" required>
        <div data-ferma-error="account"></div>
    </label>
    
    <label>
        Transfer amount, $
        <input name="amount" type="number" min="0" max="1000" required>
        <div data-ferma-error="amount"></div>
    </label>
    <!-- amount hints -->
    <button type="button" id="amount-hint-full">Full amount ($1000)</button>

    <label>
        <input name="terms" type="checkbox" required>
        I accept the terms
        <div data-ferma-error="terms"></div>
    </label>
    <button>Transfer</button>
</form>
```

Notice it's a neat vanilla HTML form with native validations (required, min / max, etc). The only special thing here is containers with `data-ferma-error` attribute that will be used to display validation errors in DOM instead of the default ugly popups.

This form already works OK, but with ferma we can add a custom validation, integrate with our JSON API, show pretty error messages and apply amount hints in just a few lines of code:

```js
import { ferma, domErrorMessages } from 'ferma';

const formElement = document.getElementById('transfer');
const fullAmountHint = document.getElementById('amount-hint-full');

const transferForm = ferma(formElement, {
    validate: {
        // validate account field
        account: v => {
            if (!v.startsWith('40817')) {
                return ferma.invalid('Account number must start with 40817');
            }
        },
    },
    submit: async () => {
        // Get a neatly serialized form value:
        alert(JSON.stringify(transferForm.getValue(), null, 2));
        // Asynchronously set field errors from API response
        transferForm.setErrors({
            account: 'account blocked'
        });
    },
});
// change input value on hint click
fullAmountHint.addEventListener('click', () => {
    transferForm.setValue({ amount: 1000 });
});
// Show validation errors in DOM containers
domErrorMessages(formElement);
```

[Try it out in the sandbox](https://jsfiddle.net/3n8wbgt6/7/)

## License

[MIT License](./LICENSE)
