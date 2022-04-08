import { Box, HStack, Divider, Tooltip, Text, useBreakpointValue } from "@chakra-ui/react";
import Link from "next/link";
import { SpeechmaticsLogoHorizontalWhite, LogoutIcon } from "./icons-library";


export function HeaderBar({ logout, accountEmail }) {

  return (
    <Box className="header_bar">
      <Link href="https://speechmatics.com">
        <Box p="0.5em 0em 0.5em 2em" cursor='pointer'>
          <SpeechmaticsLogoHorizontalWhite w={200} h={50} />
        </Box>
      </Link>

      <Box>
        <RightSidePanel logout={logout} accountEmail={accountEmail} />
      </Box>
    </Box>
  );
}

export function RightSidePanel({ logout, accountEmail }) {
  const breakVal = useBreakpointValue({
    base: 'base',
    xs: "xs",
    sm: "sm",
    md: "md",
    lg: "lg",
    xl: "xl",
    "2xl": "2xl"
  })
  return (
    <Box className="dashboard_side_bar">
      <HStack>
        <Link href="https://docs.speechmatics.com">
          <a target="_blank">
            <Text
              color="#DFE0E3"
              pr="1em"
              mt="-3px"
              fontFamily="RMNeue-Regular"
              _hover={{ color: '#F8FAFD' }}
            >{breakVal}{' '}
              Documentation
            </Text>
          </a>
        </Link>

        <Divider orientation="vertical" color="#5E6673" pr="1.5em" height="295%" />
      </HStack>
      {/* <Link href="/account/" passHref>
        <ChakraLink>
          <Tooltip label="Account" placement="bottom"> */}
      <div style={{ display: 'flex' }}>
        <Text
          whiteSpace="nowrap"
          color="#DFE0E3"
          mr="1em"
          mt="-3px"
          fontFamily="RMNeue-Regular"
          _hover={{ color: '#F8FAFD' }}
        >
          {accountEmail}
        </Text>
      </div>
      {/* </Tooltip>
        </ChakraLink>
      </Link> */}
      <Tooltip label="Log out" placement="bottom">
        <span
          style={{ cursor: 'pointer', marginLeft: '1em' }}
          data-qa="logout"
          onClick={() => logout()}
        >
          <LogoutIcon w={20} h={20} color="#DFE0E3" />
        </span>
      </Tooltip>
    </Box>
  );
}


