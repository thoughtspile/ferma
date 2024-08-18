import {defineConfig} from 'vitest/config'

export default defineConfig({
    test: {
        setupFiles: ['./vitest.setup.js'],
        environment: 'jsdom',
        coverage: {
            include: ['src/**/*.ts']
        }
    }
});