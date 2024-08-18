export function submitController(form: HTMLFormElement, handler: (e: SubmitEvent) => Promise<void>) {
    let isSubmitting = false;
    async function onSubmit(e: SubmitEvent) {
        e.preventDefault();
        if (isSubmitting) return;
        try {
            isSubmitting = true;
            await handler(e);
        } finally {
            isSubmitting = false;
        }
    }
    form.addEventListener('submit', onSubmit);
}
