<script setup lang="ts">
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
</script>

<template>
    <div class="header">
        <div class="header__language-switcher">
            <select v-model="$i18n.locale">
                <option v-for="locale in $i18n.availableLocales" :key="`locale-${locale}`" :value="locale">{{ locale }}</option>
            </select>
        </div>
        <h1 class="header__title">{{ t('main.welcome') }}</h1>
    </div>
</template>

<style scoped lang="scss">
    .header {
        display: flex;
        min-height: 50vh;
        padding: 2rem;

        align-items: center;
        justify-content: center;
        flex-direction: column;

        background-color: darkgray;
        text-align: center;

        &__title {
            font-size: 2rem;

            @include min-width(md) {
                font-size: 3rem;
            }
            @include min-width(lg) {
                font-size: 4rem;
            }
        }

        &__language-switcher {
            align-self: flex-end;;

            select {
                font-size: 2rem;
            }
        }
    }
</style>
