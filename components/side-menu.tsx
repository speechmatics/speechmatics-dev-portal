import {
  Box,
  IconButton,
  Slide,
  useBreakpointValue,
  useDisclosure,
  useOutsideClick,
  VStack
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import menuData from '../static_data/menu-data';
import { trackEvent } from '../utils/analytics';
import { accountStore } from '../utils/account-store-context';

export function MenuContainer() {
  const showMenuBurger = useBreakpointValue({ base: true, md: false });

  if (showMenuBurger) return <MobileMenu />;

  return (
    <Box className='dashboard_sidenav'>
      <Menu />
    </Box>
  );
}

function MobileMenu() {
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();

  useEffect(() => {
    return () => {
      onClose();
    };
  }, []);

  const ref = useRef();

  useOutsideClick({
    ref: ref,
    handler: () => onClose()
  });

  return (
    <Box ml={0}>
      <Slide direction='left' in={isOpen} style={{ zIndex: 20 }}>
        <Box
          position="relative"
          className='dashboard_sidenav'
          width="250px"
          top='62px'
          height='100%'
          ref={ref}
          borderBottom='1px solid var(--chakra-colors-smBlack-180)'
          borderTop='1px solid var(--chakra-colors-smBlack-180)'>
          <Menu />
        </Box>
      </Slide>
      <Box top='62px'>
        <IconButton
          icon={<FiMenu />}
          aria-label={''}
          size='lg'
          variant='ghost'
          _focus={{ boxShadow: 'none' }}
          onClick={onToggle}
        />
      </Box>
    </Box>
  );
}

function Menu() {
  const router = useRouter();
  return (
    <VStack className='nav_menu' rowGap='0.8em'>
      {menuData.map((item) => (
        <MenuElem
          item={item}
          key={item.path}
          selected={router.asPath == item.path}
          paddingLeft='clamp(1em, 4.2vw, 3em)'
          paddingRight='clamp(1em, 4.2vw, 3em)'
        />
      ))}
    </VStack>
  );
}

function MenuElem({ item, selected, ...props }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={accountStore.isLoading !== true ? item.path : ''} >
      <Box
        className={`menu_elem ${selected ? 'selected' : ''}`}
        {...props}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => {
          trackEvent('main_nav_click', 'Navigation', item.title);
        }}>
        <Box>
          {item.icon({
            mono: Boolean(selected) || isHovered,
            width: '1.65em',
            height: '1.65em'
          })}
        </Box>
        <Box data-qa={`menu-${item.title.replace(/\ /g, '-').toLowerCase()}`}
          fontFamily='RMNeue-Regular'
          pl='0.5em'>
          {item.title}
        </Box>
      </Box>
    </Link>
  );
}
