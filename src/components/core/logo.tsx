'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import { useColorScheme } from '@mui/material/styles';

import { NoSsr } from '@/components/core/no-ssr';
import { Typography } from '@mui/material';

const HEIGHT = 60;
const WIDTH = 60;

type Color = 'dark' | 'light';

export interface LogoProps {
  color?: Color;
  emblem?: boolean;
  height?: number;
  width?: number;
}

export function Logo({ color = 'dark', emblem, height = HEIGHT, width = WIDTH }: LogoProps): React.JSX.Element {
  let url: string;

  if (emblem) {
    url = color === 'light' ? '/assets/logo-emblem.svg' : '/assets/logo-emblem--dark.svg';
  } else {
    url = color === 'light' ? '/assets/logo.svg' : '/assets/logo--dark.svg';
  }

  return (
    <Typography
      variant="h4"
      component="h1"
      sx={{
        color: 'white',
        fontWeight: 'bold',
        fontSize: '2rem',
        letterSpacing: '0.1em',
        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
        userSelect: 'none',
        textDecoration: 'none'
      }}
    >
      NHK
    </Typography>
  );
}

export interface DynamicLogoProps {
  colorDark?: Color;
  colorLight?: Color;
  emblem?: boolean;
  height?: number;
  width?: number;
}

export function DynamicLogo({
  colorDark = 'light',
  colorLight = 'dark',
  height = HEIGHT,
  width = WIDTH,
  ...props
}: DynamicLogoProps): React.JSX.Element {
  const { colorScheme } = useColorScheme();
  const color = colorScheme === 'dark' ? colorDark : colorLight;

  return (
    <NoSsr fallback={<Box sx={{ height: `${height}px`, width: `${width}px` }} />}>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          color: 'white',
          fontWeight: 'bold',
          fontSize: '2rem',
          letterSpacing: '0.1em',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          userSelect: 'none',
          textDecoration: 'none'
        }}
      >
        NHK
      </Typography>
    </NoSsr>
  );
}
