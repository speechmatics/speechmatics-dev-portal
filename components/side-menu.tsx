import { Box, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import menuData from "../static_data/menu-data";

export function Menu() {
  const router = useRouter();
  return (
    <VStack className="nav_menu" spacing='1.5em'>
      {menuData.map((item) => (
        <MenuElem item={item} key={item.path} selected={router.asPath == item.path} />
      ))}
    </VStack>
  );
}

function MenuElem({ item, selected }) {
  return (
    <Link href={item.path}>
      <div className={`menu_elem ${selected ? 'selected' : ''}`}>
        <div>
          {item.icon({
            color: selected ? 'var(--chakra-colors-smBlue-500)' : 'var(--chakra-colors-smNavy-400)',
          })}
        </div>
        <Box data-qa={`menu-${item.title.replace(' ', '-').toLowerCase()}`}
          pl='0.5em'>{item.title}</Box>
      </div>
    </Link>
  );
}
