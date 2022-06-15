import { MenuList, MenuItem, MenuDivider } from '@chakra-ui/react';
import { useContext } from 'react';
import { callGetTranscript, callGetDataFile } from '../utils/call-api';
import accountContext from '../utils/account-store-context';
import { trackEvent } from "../utils/analytics";

export const TranscriptDownloadMenu = ({ jobId, status, fileName }) => {
  const { tokenStore } = useContext(accountContext);
  const idToken = tokenStore.tokenPayload?.idToken;

  const downloadTranscript = (format) => {
    if (idToken) {
      callGetTranscript(idToken, jobId, format).then((response) => {
        const fName = `${jobId}.transcript.${format === 'json-v2' ? 'json' : format}`;
        const contentType = format === 'json-v2' ? 'application/json' : 'text/plain';
        const output = format === 'json-v2' ? JSON.stringify(response) : response;
        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(new Blob([output], { type: contentType }));
        a.download = fName;
        a.click();
      });
    }
  };

  const downloadDataFile = () => {
    if (idToken) {
      callGetDataFile(idToken, jobId).then((response) => {
        if (!!response) {
          const a = document.createElement('a');
          a.href = URL.createObjectURL(response);
          a.download = fileName;
          a.click();
        }
      });
    }
  };

<<<<<<< HEAD
  return <>
    <MenuList
      color="smNavy.400"
      border="1px solid"
      rounded="none"
      shadow="lg"
      fontSize={14}
      borderColor="smBlack.200"
      minW="0px"
      maxW={'180px'}
      p={2}
    >
      {status === ('done' || 'completed') && (
        <>
          <MenuItem
            onClick={(e) => {
              downloadTranscript('txt');
              trackEvent('download_transcription_txt', 'Action')
            }}
            _focus={{ color: 'smBlue.500' }}
          >
            Download as text
          </MenuItem>
          <MenuDivider />
        </>
      )}
      {status === ('done' || 'completed') && (
        <>
          <MenuItem
            onClick={(e) => {
              downloadTranscript('json-v2');
              trackEvent('download_transcription_json', 'Action')
            }}
            _focus={{ color: 'smBlue.500' }}
          >
            Download as JSON
          </MenuItem>
          <MenuDivider />
        </>
      )}
      {status === ('done' || 'completed') && (
        <>
          <MenuItem
            onClick={(e) => {
              downloadTranscript('srt');
              trackEvent('download_transcription_srt', 'Action')
            }}
            _focus={{ color: 'smBlue.500' }}
          >
            Download as SRT
          </MenuItem>
        </>
      )}
    </MenuList>
  </>
};
=======
  return (
    <>
      <MenuList
        color='smNavy.400'
        border='1px solid'
        rounded='none'
        shadow='lg'
        fontSize={14}
        borderColor='smBlack.200'
        minW='0px'
        maxW={'180px'}
        p={2}>
        {status === ('done' || 'completed') && (
          <>
            <MenuItem
              onClick={(e) => {
                downloadTranscript('txt');
              }}
              _focus={{ color: 'smBlue.500' }}>
              Download as text
            </MenuItem>
            <MenuDivider />
          </>
        )}
        {status === ('done' || 'completed') && (
          <>
            <MenuItem
              onClick={(e) => {
                downloadTranscript('json-v2');
              }}
              _focus={{ color: 'smBlue.500' }}>
              Download as JSON
            </MenuItem>
            <MenuDivider />
          </>
        )}
        {status === ('done' || 'completed') && (
          <>
            <MenuItem
              onClick={(e) => {
                downloadTranscript('srt');
              }}
              _focus={{ color: 'smBlue.500' }}>
              Download as SRT
            </MenuItem>
          </>
        )}
      </MenuList>
    </>
  );
};
>>>>>>> main
