import { MenuList, MenuItem, MenuDivider } from '@chakra-ui/react';
import { useContext } from 'react';
import { callGetTranscript, callGetDataFile } from '../utils/call-api';
import accountContext from '../utils/account-store-context';
import { useIsAuthenticated } from '@azure/msal-react';

export const TranscriptDownloadMenu = ({ jobId, status, fileName }) => {
  const authenticated = useIsAuthenticated();

  const downloadTranscript = (format) => {
    if (authenticated) {
      callGetTranscript(jobId, format).then((response) => {
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
    if (authenticated) {
      callGetDataFile(jobId).then((response) => {
        if (!!response) {
          const a = document.createElement('a');
          a.href = URL.createObjectURL(response);
          a.download = fileName;
          a.click();
        }
      });
    }
  };

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
        p={2}
        zIndex='101'>
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
