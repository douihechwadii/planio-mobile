import type { MD3Theme } from 'react-native-paper';
import { MD3LightTheme, configureFonts } from 'react-native-paper';
import { tokens } from './tokens';

const fontConfig = {
    fontFamily: 'Inter',
}

export const theme: MD3Theme = {
    ...MD3LightTheme,
    fonts: configureFonts({ config: fontConfig }),
    roundness: 8,
    colors: {
        ...MD3LightTheme.colors,
        primary: tokens.colors.brand.red,
        onPrimary: tokens.colors.brand.white,
        primaryContainer: tokens.colors.brand.lightPink,

        secondary: tokens.colors.brand.midnight,
        onSecondary: tokens.colors.brand.white,

        error: tokens.colors.semantic.danger,
        errorContainer: tokens.colors.semantic.dangerLight,

        background: tokens.colors.brand.lightGray,
        surface: tokens.colors.brand.white,

        onBackground: tokens.colors.brand.midnight,
        onSurface: tokens.colors.brand.midnight,
        onSurfaceVariant: tokens.colors.brand.darkGray,

        outline: tokens.colors.brand.darkGray,
    },
};

export const customColors = {
    warning: tokens.colors.semantic.warning,
    warningLight: tokens.colors.semantic.warningLight,
    success: tokens.colors.semantic.success,
    successLight: tokens.colors.semantic.successLight,
    info: tokens.colors.semantic.info,
    infoLight: tokens.colors.semantic.infoLight,
    chart: tokens.colors.chart,
};