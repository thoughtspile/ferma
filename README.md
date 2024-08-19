# Ferma

> WIP: this is not a real package. For now, I'm just exploring the problem space.

I want to love native HTML forms. I really do. But the quirks of native forms don't make it so easy to love them. So I set out to build ferma to fix that. I'm aiming to acheive:

1. Custom client-side validation
2. Easy integration with server-side validation
3. Stylable error messages
4. JS callback on successful submit
5. Disable submit button while submit is running

Design constraints:

1. Works with vanilla JS
2. As small as possible
3. No components or CSS — bring your own

MVP non-goals:

1. No integration with component libraries
2. No server-side part

## Install

```sh
npm install --save ferma
```

## License

[MIT License](./LICENSE)
