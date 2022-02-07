import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  components: {
    Button: {
      baseStyle: {
        backgroundColor: '#001A3B',
      },
    },
  },
});

export default theme;
