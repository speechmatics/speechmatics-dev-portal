import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
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
      },
    },
  },
});

export default theme;
