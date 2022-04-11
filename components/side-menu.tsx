import { Box, IconButton, Slide, useBreakpointValue, useDisclosure, useOutsideClick, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef } from "react";
import { FiMenu } from "react-icons/fi";
import menuData from "../static_data/menu-data";


const animationVariants = {
  hidden: { opacity: 0, x: -40, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: -100 },
};

export function MenuContainer() {
  const showMenuBurger = useBreakpointValue({ base: true, xs: true, sm: true, md: false });

  if (showMenuBurger) return <MobileMenu />

  return <Box className="dashboard_sidenav">
    <Menu />
  </Box>
}

function MobileMenu() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const onBurgerClick = useCallback(() => {
    if (isOpen) onClose()
    else onOpen();
  }, []);

  useEffect(() => {
    return () => {
      onClose();
    }
  }, []);

  const ref = useRef()

  useOutsideClick({
    ref: ref,
    handler: () => onClose(),
  })

  return <>
    <Slide direction="left" in={isOpen}>
      <Box className="dashboard_sidenav" position={'absolute'} top='62px'
        display={isOpen ? 'unset' : 'none'}
        borderBottom='1px solid var(--chakra-colors-smBlack-180)' zIndex='100' ref={ref}>
        <Menu />
      </Box>
    </Slide>
    <Box position='absolute' top='62px' zIndex='101'>
      <IconButton icon={<FiMenu />} aria-label={''} size='lg'
        variant='ghost' _focus={{ boxShadow: 'none' }} onClick={onBurgerClick} />
    </Box>
  </>
}


function Menu() {
  const router = useRouter();
  return (
    <VStack className="nav_menu" rowGap='0.8em' height='400px'>
      {menuData.map((item) => (
        <MenuElem item={item} key={item.path} selected={router.asPath == item.path}
          paddingLeft='clamp(1em, 4.2vw, 3em)' paddingRight='clamp(1em, 4.2vw, 3em)' />
      ))}
    </VStack>
  );
}

function MenuElem({ item, selected, ...props }) {
  return (
    <Link href={item.path}>
      <Box className={`menu_elem ${selected ? 'selected' : ''}`} {...props}>
        <Box>
          {item.icon({
            mono: !Boolean(selected),
            width: "1.65em",
            height: "1.65em"
          })}
        </Box>
        <Box
          data-qa={`menu-${item.title.replace(' ', '-').toLowerCase()}`}
          pl='0.5em'>
          {item.title}
        </Box>
      </Box>
    </Link>
  );
}
