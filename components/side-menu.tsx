import { Box, useBreakpointValue, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import menuData from "../static_data/menu-data";


export function MenuContainer() {
  const breakVal = useBreakpointValue({ base: 'none', lg: 'flex', md: 'none', sm: 'none' })

  return <Box className="dashboard_sidenav" width={['10em', '16.5em']} display={breakVal}>
    <Menu />
  </Box>
}


function Menu() {
  const router = useRouter();
  return (
    <VStack className="nav_menu" rowGap='0.8em'>
      {menuData.map((item) => (
        <MenuElem item={item} key={item.path} selected={router.asPath == item.path} paddingLeft={['1.75em', '2em', '3.75em']} />
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
