<<<<<<< HEAD
import { VStack, Box, Button, Text } from "@chakra-ui/react";
import Link from "next/link";
import { trackEvent } from "../utils/analytics";

=======
import { VStack, Box, Button, Text } from '@chakra-ui/react';
import Link from 'next/link';
>>>>>>> main

export const HomeBox = ({ bgColor, icon, iconPadding = '24px', text, buttonLabel, hrefUrl }) => {
  return (
    <VStack
      width='100%'
      bg={bgColor}
      borderRadius='2px'
      p='1.5em'
      spacing='1em'
      justifyContent='space-between'>
      <VStack>
        <Box borderRadius='full' width='88px' height='88px' bg='smWhite.150' p={iconPadding}>
          {icon}
        </Box>
        <Box
          fontFamily='RMNeue-Bold'
          fontSize='1.5em'
          lineHeight='1.2em'
          textAlign='center'
          color='smWhite.500'
          paddingX='1.8em'>
          {text}
        </Box>
      </VStack>
      <Link href={hrefUrl}>
<<<<<<< HEAD
        <Button variant="speechmaticsWhite" color={bgColor}
          onClick={() => { trackEvent('home_box_click', 'CTAs', buttonLabel) }}>
=======
        <Button variant='speechmaticsWhite' color={bgColor}>
>>>>>>> main
          {buttonLabel}
        </Button>
      </Link>
    </VStack>
<<<<<<< HEAD
  )
}

export const HomeWhiteBox = ({ icon, title, description, buttonLabel, hrefUrl }) => {

  return (
    <VStack
      className="sm_panel"
      width="100%"
      alignItems="center"
      justifyContent="space-between"
    >
      <VStack>
        <Box>{icon}</Box>
        <Text as="div" fontFamily="RMNeue-Bold" fontSize="1.1em" textAlign="center">
          {title}
        </Text>
        <Text
          as="div"
          fontFamily="RMNeue-Regular"
          fontSize="0.8em"
          color="smBlack.400"
          textAlign="center"
        >
          {description}
        </Text>
      </VStack>
      <Link href={hrefUrl}>
        <Button variant="speechmaticsOutline" width="100%"
          onClick={() => { trackEvent('home_white_box_click', 'CTAs', title) }}>
          {buttonLabel}
        </Button>
      </Link>
    </VStack>
  );
};
=======
  );
};
>>>>>>> main
