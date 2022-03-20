import { CSSObject, extendTheme, theme as baseTheme } from '@chakra-ui/react';

const smTabStyle = {
  bg: 'smBlue.100',
  //also look for button[role="tab"]:not(:first-child)
  borderBottom: '1px solid #D1D7D6',
  borderTop: '2px solid #0000',
  borderLeft: '1px solid #0000',
  borderRight: '1px solid #0000',
  fontSize: '0.9em',
  py: '1.2em',
  px: '2.2em',
  fontFamily: 'Matter-Bold',
  color: 'smBlack.300',
  _selected: {
    color: 'smBlue.400',
    bg: 'white',
    borderTop: '2px solid #5398FC',
    borderLeft: '1px solid #D1D7D6',
    borderRight: '1px solid #D1D7D6',
    borderBottom: '1px solid #0000',
  },
  _focus: {
    boxShadow: 'none',
  },
} as CSSObject;

const theme = extendTheme({
  colors: {
    smGreen: {
      100: '#F4F9F8',
      200: '#EAF3F2',
      300: '#A7D0CD',
      400: '#4FA9A2',
      500: '#2A827A',
    },
    smBlue: {
      100: '#F5F9FF',
      150: '#E8F0F8',
      200: '#EAF3FF',
      300: '#BFD8FE',
      400: '#5398FC',
      500: '#386DFB',
    },
    smNavy: {
      100: '#F9FBFD', //dashboard background
      200: '#F8FAFD',
      250: '#F4F6F9',
      270: '#DFE0E3',
      300: '#AEB2B8',
      400: '#5E6673',
      500: '#263243',
    },
    smBlack: {
      100: '#F4F6F9',
      150: '#E1E5E8',
      200: '#D1D7D6',
      300: '#78808B',
      400: '#5A5D5F',
      500: '#000000',
    },
    smRed: {
      100: '#FAEFEF',
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
      150: '#ffffff26',
      500: '#FFFFFF',
    },
  },
  components: {
    Button: {
      variants: {
        speechmatics: {
          color: 'smWhite.500',
          bg: 'smBlue.500',
          borderRadius: '2px',
          mt: '1em',
          py: '1.8em',
          px: '2.5em',
          fontSize: '0.9em',
          _hover: {
            bg: 'smBlue.400',
            _disabled: {
              bg: 'smBlack.200',
            },
          },
          _focus: {
            boxShadow: 'none',
          },
          _active: {
            bg: 'smBlue.300',
          },
          _disabled: {
            bg: 'smBlack.300',
          },
        } as CSSObject,
        speechmaticsWhite: {
          color: 'smNavy.500',
          bg: 'smWhite.500',
          borderRadius: '2px',
          mt: '1em',
          py: '1.8em',
          px: '2.5em',
          fontSize: '0.9em',
          _hover: {
            bg: 'smBlue.100',
          },
          _focus: {
            boxShadow: 'none',
          },
          _active: {
            bg: 'smBlue.300',
          },
        } as CSSObject,
        speechmaticsOutline: {
          color: 'smBlue.500',
          bg: 'smWhite.500',
          borderRadius: '2px',
          border: '2px solid',
          borderColor: 'smBlue.500',
          mt: '1em',
          py: '1.4em',
          px: '2.5em',
          fontSize: '0.9em',
          _hover: {
            bg: 'smBlue.100',
          },
          _focus: {
            boxShadow: 'none',
          },
          _active: {
            bg: 'smBlue.300',
          },
        },
      },
    },
    Input: {
      variants: {
        speechmatics: {
          ...baseTheme.components.Input.defaultProps,
          field: {
            py: '1.8em',
            borderRadius: '2px',
            border: '1px solid #cacad0',
          },
        },
      },
    },

    Tabs: {
      variants: {
        speechmatics: {
          tab: smTabStyle,
          tabpanel: {
            bg: 'smWhite.500',
            padding: '1.5em',
          } as CSSObject,
          tabpanels: {
            border: '1px solid #D1D7D6',
            boxShadow: '4px 4px 7px #5A5D5F15',
          } as CSSObject,
        },
        speechmaticsCode: {
          tab: smTabStyle,
          tabpanel: {
            bg: 'smWhite.500',
            padding: '0em',
          } as CSSObject,
          tabpanels: {
            border: '1px solid #D1D7D6',
            boxShadow: '4px 4px 7px #5A5D5F15',
          } as CSSObject,
        },
      },
    },
  },
});

export default theme;
