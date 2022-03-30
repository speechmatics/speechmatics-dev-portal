import Link from "next/link";
import { useRouter } from "next/router";
import menuData from "../static_data/menu-data";


export function Menu() {
  const router = useRouter();
  return (
    <div className="nav_menu">
      {menuData.map((item) => (
        <MenuElem item={item} key={item.path} selected={router.asPath == item.path} />
      ))}
    </div>
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
        <div>{item.title}</div>
      </div>
    </Link>
  );
}