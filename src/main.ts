import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import '@/assets/styles/main.scss';
import App from '@/App.vue';
import nl from '@/translations/nl.json';
import en from '@/translations/en.json';

export const i18n = createI18n({
    legacy: false,
    locale: 'nl',
    fallbackLocale: 'en',
    messages: { nl, en },
});

const app = createApp(App);

app.use(i18n);
app.mount('#app')
