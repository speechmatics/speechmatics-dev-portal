import { Box } from "@chakra-ui/react";
import CookieConsent, { Cookies, getCookieConsentValue, resetCookieConsentValue } from "react-cookie-consent";

export function SmCookiesConsent({ onAccept }) {
  return <CookieConsent
    onAccept={onAccept}
    style={{
      backgroundColor: "#fffb",
      backdropFilter: 'blur(5px)', padding: '1em',
      alignItems: 'flex-start'
    }}
    contentStyle={{
    }}
    buttonText='Accept'
    buttonStyle={{ backgroundColor: 'var(--chakra-colors-smBlue-500)', color: 'var(--chakra-colors-smNavy-100)', padding: '0.5em 1.5em' }}
    declineButtonStyle={{
      backgroundColor: 'var(--chakra-colors-smWhite-500)',
      border: '1px solid', borderColor: 'var(--chakra-colors-smRed-500)',
      color: 'var(--chakra-colors-smRed-500)', padding: '0.5em 1.5em'
    }}
    declineButtonText='Decline'
    enableDeclineButton
    expires={30}

  >
    <Box color='smNavy.400'>We use analytics cookies to improve our service.</Box>
    <Box color='smNavy.350' fontSize='0.8em'>The analytics cookies are to help us understand our users' needs in order to meet them better. By clicking “Accept”, you consent to the use of these analytics cookies.</Box>
  </CookieConsent>
}