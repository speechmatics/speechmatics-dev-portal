import { Box, HStack, Divider, Tooltip, Text, useBreakpointValue, IconButton, Flex } from "@chakra-ui/react";
import Link from "next/link";
import { FiMenu } from "react-icons/fi";
import { SpeechmaticsLogoHorizontalWhite, LogoutIcon } from "./icons-library";


export function HeaderBar({ logout, accountEmail }) {

  const breakValName = useBreakpointValue({
    base: 'base',
    xs: "23em",
    sm: "30em",
    md: "48em",
    lg: "62em",
    xl: "80em",
    "2xl": "96em"
  })

  const breakValue = useBreakpointValue({
    base: true,
    sm: true,
    md: false,
  })


  return (
    <Box className="header_bar">

      <Link href="https://speechmatics.com">
        <Box p="0.5em 0em 0.5em 2em" cursor='pointer'>
          <SpeechmaticsLogoHorizontalWhite w={breakValue ? 150 : 200} h={50} />
        </Box>
      </Link>

      <Box>
        <RightSidePanel logout={logout} accountEmail={accountEmail} breakValue={breakValue} />
      </Box>
    </Box>
  );
}

export function RightSidePanel({ logout, accountEmail, breakValue }) {
  const breakValueInner = useBreakpointValue({
    base: true,
    xs: true,
    sm: false,
    md: false,
  })
  return (
    <Box className="dashboard_side_bar">
      {!breakValueInner && <>
        <HStack>
          <Link href="https://docs.speechmatics.com">
            <a target="_blank">
              <Text
                color="#DFE0E3"
                pr="1em"
                mt="-3px"
                fontFamily="RMNeue-Regular"
                _hover={{ color: '#F8FAFD' }}
              >{breakValue}{' '}
                {breakValue ? 'Docs' : 'Documentation'}
              </Text>
            </a>
          </Link>
          <Divider orientation="vertical" color="#5E6673" pr="1.5em" height="295%" />
        </HStack>
      </>
      }
      {/* <Link href="/account/" passHref>
        <ChakraLink>
          <Tooltip label="Account" placement="bottom"> */}
      <Flex>
        <Text
          whiteSpace="nowrap"
          color="#DFE0E3"
          mt="-3px"
          fontFamily="RMNeue-Regular"
          _hover={{ color: '#F8FAFD' }}
          textOverflow='ellipsis'
          overflow='hidden'
          maxWidth='clamp(4em, calc(25vw + 100px), 25em)'
        >
          {accountEmail}
        </Text>
      </Flex>
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


