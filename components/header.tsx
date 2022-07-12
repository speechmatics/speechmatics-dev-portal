import { Box, HStack, Divider, Tooltip, useBreakpointValue, Flex } from '@chakra-ui/react';
import Link from 'next/link';
import { trackEvent } from '../utils/analytics';
import { SpeechmaticsLogoHorizontalWhite, LogoutIcon } from './icons-library';

export function HeaderBar({ logout, accountEmail }) {
  const breakValue = useBreakpointValue({
    base: 0,
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
    '2xl': 6
  });

  return (
    <Box className='header_bar'>
      {/* <Box position='absolute' color='white'>{breakValue}</Box> */}
      <Link href='https://speechmatics.com'>
        <Box p='0.5em 1em 0.5em 2em' cursor='pointer'>
          <SpeechmaticsLogoHorizontalWhite w={breakValue < 2 ? 150 : 200} h={50} />
        </Box>
      </Link>
      <RightSidePanel logout={logout} accountEmail={accountEmail} breakValue={breakValue} />
    </Box>
  );
}

export function RightSidePanel({ logout, accountEmail, breakValue }) {

  return (
    <HStack pr='1em' spacing={breakValue < 3 ? '1em' : '2em'}>
      {breakValue > 1 && (
        <>
          <Link href='https://docs.speechmatics.com'>
            <a
              target='_blank'
              onClick={() =>
                trackEvent(
                  'Dashboard_documentation_click',
                  'LinkOut',
                  'Selected Documentation link'
                )
              }>
              <Box color='smNavy.270' _hover={{ color: 'smNavy.200' }}>
                {breakValue < 3 ? 'Docs' : 'Documentation'}
              </Box>
            </a>
          </Link>
          <Divider orientation='vertical' color='#5E6673' alignSelf='stretch' />
        </>
      )}
      <Flex>
        <Box
          whiteSpace='nowrap'
          color='smNavy.270'
          fontSize={breakValue < 2 ? '0.8em' : '1em'}
          paddingTop={breakValue < 2 ? '3px' : 'unset'}
          textOverflow='ellipsis'
          overflow='hidden'
          maxWidth={breakValue > 0 ? 'clamp(3em, 23vw, 25em)' : '3em'}>
          {accountEmail}
        </Box>
      </Flex>

      <Tooltip label='Log out' placement='bottom'>
        <Box
          style={{ cursor: 'pointer', marginLeft: '1em' }}
          data-qa='logout'
          onClick={() => (
            trackEvent('Dashboard_logout_click', 'B2C_Flow', 'Manual logout'), logout()
          )}>
          <LogoutIcon w={20} h={20} color='var(--chakra-colors-smNavy-270)' />
        </Box>
      </Tooltip>
    </HStack>
  );
}
