<script setup lang="ts">
    import { ref, type Ref, watch } from 'vue';
    import { useI18n } from 'vue-i18n';
    import { i18n } from '@/main';

    const { t } = useI18n();

    const MAX_INPUT_NUMBER = 999999999999999;
    const inputNumber: Ref<number | undefined> = ref(undefined);
    const resultText: Ref<string> = ref('');
    const errorMessage: Ref<string> = ref('');

    // Convert a number under 100 to text
    const convertUnderHundredToText = (currentNumber: number): string => {
        const currentNumberString = currentNumber.toString();

        if (currentNumber || currentNumber === 0) {
            // Underneath 20 or divisible by 10: just show the original number
            if (currentNumber < 20 || currentNumber % 10 === 0) {
                return t(`numbers.${currentNumber}`);
            } else {
                // Use the translation structure to create the number string
                return t(`structures.tens`, [
                    t(`numbers.${currentNumberString[0]}0`), // Notice the 0 at the end
                    t(`numbers.${currentNumberString[1]}`)
                ]);
            }
        }
        return '';
    };

    // Convert a number under 1000 to text
    const convertUnderThousandToText = (currentNumber: number): string => {
        const currentNumberString = currentNumber.toString();
        if (currentNumber) {
            if (currentNumber < 100) {
                // Number is lower then 100
                return convertUnderHundredToText(currentNumber);
            } else {
                // In Dutch, we use a different translation for 100 then for 200
                const prefix = (currentNumberString[0] === ('1'))
                    ? t('structures.single-prefix')
                    : t(`numbers.${currentNumberString[0]}`);
                if (currentNumber % 100 === 0) {
                    // Divisible by 100.
                    return t('structures.hundreds-sections', [prefix]);
                } else {
                    const tens = Number(currentNumberString.slice(-2));
                    // Use the translation structure to create the number string
                    return t(`structures.hundreds`, [
                        prefix,
                        convertUnderHundredToText(tens)
                    ]);
                }
            }
        }
        return '';
    };

    // Convert thousands (1000, 1000000 etc.) number to text
    const convertThousandsToText = (iteration = 0, currentNumber: number): string => {
        if (currentNumber) {
            let prefix = '';
            if (currentNumber < 100) {
                // Number is lower then 100
                prefix = convertUnderHundredToText(currentNumber);
            } else if (currentNumber < 1000) {
                // number is lower then 1000
                prefix = convertUnderThousandToText(currentNumber);
            }

            // Number is thousands, this is spelled differently in Dutch then millions or billions etc.
            if (iteration === 1) {
                return t('structures.thousands', [prefix]);
            }
            return t('structures.x-ands', [
                prefix,
                t(`numbers.thousands.${iteration}`)
            ]);
        }
        return '';
    }

    // Translate any number to text
    const convertNumberToText = (): void => {
        let currentInputString: string | undefined = inputNumber.value?.toString();
        let iteration = 0;
        let currentIndex = 0;
        let currentInputPart = '';

        resultText.value = '';
        if ((inputNumber?.value || inputNumber?.value === 0) && currentInputString) {
            if (!Number.isInteger(inputNumber.value)) {
                errorMessage.value = t('errors.decimal');
            } else if (inputNumber.value > MAX_INPUT_NUMBER) {
                errorMessage.value = t('errors.too-large');
            } else if (inputNumber.value === 0) {
                errorMessage.value = '';
                // Also show zero
                resultText.value = t(`numbers.${inputNumber.value}`);
            } else {
                errorMessage.value = '';
                // Use loop to calculate the number text
                do {
                    currentIndex = Math.min(3, currentInputString.length);
                    // Get the last thousand part of the input number
                    currentInputPart = currentInputString.slice(-1 * currentIndex);
                    // Get remainder and set currentInputNumber to new value minus the part we just took off
                    if (currentInputString?.length >= currentIndex) {
                        currentInputString = currentInputString.slice(-1 * currentInputString.length, -1 * currentIndex);
                    }
                    resultText.value = convertThousandsToText(iteration, Number(currentInputPart)).concat(resultText.value);
                    iteration++;
                } while (currentInputString?.length);
            }
        }
    };

    // When the locale changes re-convert the number to text
    watch(i18n.global.locale, () => {
        convertNumberToText();
    });
</script>

<template>
    <div class="number-form">
        <div class="number-form__input">
            <input
                v-model="inputNumber"
                type="number"
                min="0"
                max="999999999999999"
                @input="convertNumberToText"
            />
        </div>
        <div class="number-form__output">
            <template v-if="errorMessage">{{ errorMessage }}</template>
            <template v-else>{{ resultText }}</template>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .number-form {
        &__input,
        &__output {
            display: flex;
            min-height: 25vh;
            padding: 2rem;

            align-items: center;
            justify-content: center;

            text-align: center;
            font-size: 2rem;
        }

        input {
            border: 1px solid gray;
            font-size: 2rem;
        }
    }
</style>
