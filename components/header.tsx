import { Box, HStack, Divider, Tooltip, useBreakpointValue, Flex, Select } from '@chakra-ui/react';
import Link from 'next/link';
import { SpeechmaticsLogoHorizontalWhite, LogoutIcon } from './icons-library';
import accountContext, { ContractState } from '../utils/account-store-context';
import { useContext, useState } from 'react';

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
  const { accountStore } = useContext(accountContext);
  const [state, setState] = useState<ContractState>('active');

  return (
    <HStack pr='1em' spacing={breakValue < 3 ? '1em' : '2em'}>
      <Select
        variant='filled'
        color='white'
        value={accountStore.getAccountState()}
        onChange={(e) => {
          const val: ContractState =
            'active' === e.target.value ||
            'unpaid' === e.target.value ||
            'past_due' === e.target.value
              ? e.target.value
              : null;
          accountStore.setAccountState(val);
          setState(val);
        }}>
        <option typeof='ContractState' value='active'>
          active
        </option>
        <option value='past_due'>past_due</option>
        <option value='unpaid'>unpaid</option>
      </Select>
      {breakValue > 1 && (
        <>
          <Link href='https://docs.speechmatics.com'>
            <a target='_blank'>
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
          onClick={() => logout()}>
          <LogoutIcon w={20} h={20} color='var(--chakra-colors-smNavy-270)' />
        </Box>
      </Tooltip>
    </HStack>
  );
}

{
  /* <Link href="/account/" passHref>
        <Link>
          <Tooltip label="Account" placement="bottom"> */
}

{
  /* </Tooltip>
        </Link>
      </Link> */
}
