import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    smGreen: {
      500: '#2A827A',
      700: '#4FA9A2',
      900: '#A7D0CD',
    },
    smBlue: {
      500: '#386DFB',
      600: '#5398FC',
      700: '#BFD8FE',
      900: '#E8F0F8',
    },
    smNavy: {
      500: '#263243',
      600: '#5E6673',
      700: '#AEB2B8',
      900: '#F9FBFD', //dashboard background
    },
    smBlack: {
      500: '#000000',
      700: '#5A5D5F',
      800: '#78808B',
      900: '#D1D7D6',
    },
    smRed: {
      500: '#D72F3F',
    },
    smPurple: {
      500: '#A64B82',
    },
    smYellow: {
      500: '#F8CF38',
    },
    smOrange: {
      500: '#CB6C43',
    },
    smWhite: {
      500: '#FFFFFF',
    },
  },
  components: {
    Button: {
      variants: {
        solid: {
          color: '#fff',
          background: '#001A3B',
          _hover: {
            background: '#004bab',
          },
        },
        speechmatics: {
          color: '#fff',
          background: 'red.500',
          borderRadius: '2px',
          _hover: {
            background: '#550000',
          },
        },
      },
    },
    Input: {
      variants: {
        speechmatics: {
          bg: 'red.500'
        }
      }
    },
    Tabs: {
      variants: {
        speechmatics: {
          background: '#ff0000',
          fontSize: '10px',
        },
      },
    },
    Tab: {
      variants: {
        speechmatics: {
          background: '#ff0000',
        },
      },
    },
  },
});

export default theme;
