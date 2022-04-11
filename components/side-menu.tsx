import { Box, useBreakpointValue, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import menuData from "../static_data/menu-data";


export function MenuContainer() {
  const breakVal = useBreakpointValue({ base: 'none', sm: 'none', md: 'flex', lg: 'flex' });

  return <Box className="dashboard_sidenav" display={breakVal}>
    <Menu />
  </Box>
}


function Menu() {
  const router = useRouter();
  return (
    <VStack className="nav_menu" rowGap='0.8em'>
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
