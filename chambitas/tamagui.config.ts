import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui } from 'tamagui'
import { createAnimations } from '@tamagui/animations-react-native' // <--- 1. Importar

const animations = createAnimations({
  fast: {
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
  medium: {
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
  slow: {
    damping: 20,
    stiffness: 60,
  },
})

export const config = createTamagui({
  ...defaultConfig,
  animations: animations as any,
  media: {
    ...defaultConfig.media,
    // add your own media queries here, if wanted
  },
})

type OurConfig = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends OurConfig {}
}

export const TamaguiConfig = config