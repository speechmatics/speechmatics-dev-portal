import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  components: {
    Button: {
      variants: {
        solid: {
          color: '#fff',
          background: '#001A3B',
        },
      },
    },
  },
});

export default theme;
