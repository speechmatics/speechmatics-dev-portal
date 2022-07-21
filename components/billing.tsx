import { useBreakpointValue, HStack, VStack, Box, Button } from '@chakra-ui/react';
import Link from 'next/link';
import { HeaderLabel, DescriptionLabel, pad, WarningBanner } from './common';
import { CardImage, CardGreyImage, DownloadInvoice } from './icons-library';
import { Text } from '@chakra-ui/react';
import { trackEvent } from '../utils/analytics';
import { useState, useCallback, useRef, useEffect } from 'react';

export const AddReplacePaymentCard = ({ paymentMethod, isLoading, deleteCard, accountState, highlight, setHighlight }) => {
  const breakVal = useBreakpointValue({
    base: 0,
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
    '2xl': 6
  });

  const updateButtonRef = useRef(null);

  const paymentMethodText = useCallback(() => {
    if (!paymentMethod) return 'No Payment Card Added';
    if (accountState === 'active') return 'Payment Card Active';
    if (['past_due', 'unpaid'].includes(accountState)) return 'Payment Card Issue';
  }, [paymentMethod, accountState]);

  useEffect(() => {
    if (highlight) {
      setTimeout(() => {
        updateButtonRef?.current?.focus();
        setTimeout(() => {
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
          setHighlight(false);
        }, 1000);
      }, 300);
    }
  }, [highlight]);

  return isLoading ? (
    <HStack width='100%' justifyContent='space-between' alignItems='flex-start'>
      <VStack alignItems='flex-start' spacing='1.6em'>
        <Box className='skeleton' height='2em' width='15em' />
        <Box className='skeleton' height='1em' width='18em' />
        <Box className='skeleton' height='3em' width='10em' />
      </VStack>
      {breakVal > 1 && <Box className='skeleton' height='185px' width='282px' />}
    </HStack>
  ) : (
    <HStack width='100%' justifyContent='space-between' alignItems='flex-start'>
      <VStack alignItems='flex-start'>
        <HeaderLabel>
          {paymentMethodText()}
          {breakVal < 2 && (
            <span style={{ display: 'inline-block', marginLeft: '0.5em' }}>
              {paymentMethod ? (
                <CardImage width={40} height={30} />
              ) : (
                <CardGreyImage width={40} height={30} />
              )}
            </span>
          )}
        </HeaderLabel>
        <DescriptionLabel>
          {paymentMethod
            ? `${paymentMethod?.card_type?.toUpperCase().replace(/_/g, ' ') || 'Card'} ending \
      ${paymentMethod?.masked_card_number?.slice(-4)}, expiring on \
      ${pad(paymentMethod?.expiration_month)}/${paymentMethod.expiration_year}`
            : 'Add a payment card to increase these limits.'}
        </DescriptionLabel>
        {accountState === 'unpaid' && (
          <Box width={{ base: '100%', lg: '90%' }} py={4}>
            <WarningBanner text='Please update your card details to transcribe more files. If you have recently made a payment, it may take a few minutes to update your account.' />
          </Box>
        )}
        <Box>
          <Link href='/subscribe/'>
            <Button
              ref={updateButtonRef}
              _focus={{
                bg: 'var(--chakra-colors-smOrange-500)'
              }}
              variant='speechmatics'
              alignSelf='flex-start'
              data-qa='button-add-replace-payment'
              onClick={() =>
                trackEvent(`billing_${paymentMethod ? 'replace' : 'add'}_card_click`, 'Action')
              }>
              {paymentMethod ? 'Replace Your Existing Payment Card' : 'Add a Payment Card'}
            </Button>
          </Link>
        </Box>
        {paymentMethod && (
          <Box fontSize='0.8em' pt='1em'>
            To delete your card, please{' '}
            <Text
              data-qa='button-delete-card'
              onClick={deleteCard}
              as='span'
              color='var(--chakra-colors-smBlue-500)'
              cursor='pointer'
              _hover={{ textDecoration: 'underline' }}>
              click here.
            </Text>
          </Box>
        )}
      </VStack>
      <Box position='relative'>
        {breakVal > 2 && (
          <>
            {' '}
            <Text
              position='absolute'
              color='#fff7'
              fontSize='1em'
              top='110px'
              right='14px'
              style={{ wordSpacing: '6px' }}>
              {paymentMethod?.masked_card_number || 'XXXX XXXX XXXX XXXX'}
            </Text>
            <Text position='absolute' color='#fff7' fontSize='.8em' top='135px' right='14px'>
              EXPIRY DATE{' '}
              {paymentMethod
                ? `${pad(paymentMethod.expiration_month)}/${paymentMethod.expiration_year}`
                : 'XX/XX'}
            </Text>
          </>
        )}
        {breakVal > 1 ? (
          paymentMethod ? (
            <CardImage width={breakVal > 3 ? 244 : 100} height={breakVal > 3 ? 168 : 70} />
          ) : (
            <CardGreyImage width={breakVal > 3 ? 244 : 100} height={breakVal > 3 ? 168 : 70} />
          )
        ) : null}
      </Box>
    </HStack>
  );
};

export const DownloadInvoiceHoverable = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box onMouseOver={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <DownloadInvoice mono={isHovered} height={24} />
    </Box>
  );
};
