import { Box, HStack, Divider, Tooltip, Text } from "@chakra-ui/react";
import Link from "next/link";
import { SpeechmaticsLogoHorizontalWhite, AccountIcon, LogoutIcon } from "./icons-library";


export function HeaderBar({ logout, accountEmail }) {
  return (
    <Box className="header_bar">
      <Box p="0.5em 0em 0.5em 2em">
        <SpeechmaticsLogoHorizontalWhite w={200} h={50} />
      </Box>
      <Box>
        <RightSidePanel logout={logout} accountEmail={accountEmail} />
      </Box>
    </Box>
  );
}




export function RightSidePanel({ logout, accountEmail }) {
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
            >
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
        <AccountIcon w={20} h={20} color="#DFE0E3" />
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


