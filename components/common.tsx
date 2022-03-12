import { Text, VStack } from '@chakra-ui/react';

export const SmPanel = ({ children, ...props }) => (
  <VStack className="sm_panel" alignItems="flex-start" {...props}>
    {children}
  </VStack>
);

export const PageHeader = ({ children }) => (
  <Text fontFamily="RMNeue-Bold" fontSize="2.2em" mt="2em">
    {children}
  </Text>
);

export const PageIntroduction = ({ children }) => (
  <Text fontFamily="RMNeue-Regular" fontSize="1.1em" color="smNavy.400">
    {children}
  </Text>
);
