import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';

export default [
    {
        files: ['**/*.ts'], // Применять правила только к TypeScript файлам
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                project: './tsconfig.json', // Указываем путь к tsconfig.json
            },
        },
        plugins: {
            '@typescript-eslint': ts,
            prettier,
        },
        rules: {
            'no-console': 'warn', // Предупреждение на использование console.log
            '@typescript-eslint/no-unused-vars': 'warn', // Предупреждение на неиспользуемые переменные
            '@typescript-eslint/no-explicit-any': 'warn', // Предупреждение на использование any
            '@typescript-eslint/explicit-function-return-type': 'off', // Не требовать явного указания возвращаемого типа
            '@typescript-eslint/no-floating-promises': 'error', // Ошибка на забытые await
            '@typescript-eslint/require-await': 'warn', // Предупреждение на отсутствие await в асинхронных функциях
            '@typescript-eslint/no-misused-promises': 'error', // Ошибка на неправильное использование промисов

            '@typescript-eslint/no-non-null-assertion': 'off', // Разрешить non-null assertion (!)
            '@typescript-eslint/no-unsafe-argument': 'warn', // Предупреждение на небезопасные аргументы
            '@typescript-eslint/no-unsafe-assignment': 'warn', // Предупреждение на небезопасные присваивания
            '@typescript-eslint/no-unsafe-member-access': 'warn', // Предупреждение на небезопасный доступ к свойствам
            '@typescript-eslint/no-unsafe-call': 'warn', // Предупреждение на небезопасные вызовы

            'prettier/prettier': [
                'error',
                {
                    endOfLine: 'auto',
                },
            ], // Ошибка, если код не соответствует правилам Prettier
        },
    },
    {
        ignores: ['node_modules/', 'dist/'], // Игнорируемые файлы и папки
    },
];
