import React from 'react';
import { StyleSheet, TextStyle } from 'react-native';
import { Text, TextProps } from 'react-native-paper';
import { tokens } from './tokens';

// Mirrors the scale defined in the web app's theme.ts typography block.
// MUI variant -> RN style (font size / weight / color), so visual
// hierarchy stays consistent between web and mobile.

type MuiVariant = 'h1' | 'h2' | 'h3' | 'body1' | 'body2';

const variantStyles: Record<MuiVariant, TextStyle> = {
  h1: {
    fontSize: 28,
    fontWeight: '700',
    color: tokens.colors.brand.midnight,
  },
  h2: {
    fontSize: 22,
    fontWeight: '600',
    color: tokens.colors.brand.midnight,
  },
  h3: {
    fontSize: 16,
    fontWeight: '600',
    color: tokens.colors.brand.midnight,
  },
  body1: {
    fontSize: 14,
    fontWeight: '400',
    color: tokens.colors.brand.darkGray,
  },
  body2: {
    fontSize: 12,
    fontWeight: '400',
    color: tokens.colors.brand.darkGray,
  },
};

// Base font family — must match whatever family name you load via
// expo-font / useFonts (Inter_400Regular, Inter_600SemiBold, etc.)
// RN doesn't fake font-weight on a single family the way web does,
// so if you have weight-specific Inter files loaded, swap fontFamily
// per-variant instead of relying on fontWeight alone.
const BASE_FONT_FAMILY = 'Inter';

const styles = StyleSheet.create(
  Object.fromEntries(
    Object.entries(variantStyles).map(([key, style]) => [
      key,
      { ...style, fontFamily: BASE_FONT_FAMILY },
    ])
  ) as Record<MuiVariant, TextStyle>
);

interface TypographyProps extends Omit<TextProps<never>, 'variant'> {
  variant?: MuiVariant;
  children: React.ReactNode;
}

export function Typography({
  variant = 'body1',
  style,
  children,
  ...rest
}: TypographyProps) {
  return (
    <Text style={[styles[variant], style]} {...rest}>
      {children}
    </Text>
  );
}

// Convenience shorthands, e.g. <H1>Title</H1> instead of <Typography variant="h1">
export const H1 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h1" {...props} />
);
export const H2 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h2" {...props} />
);
export const H3 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h3" {...props} />
);
export const Body1 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="body1" {...props} />
);
export const Body2 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="body2" {...props} />
);