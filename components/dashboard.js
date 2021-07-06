import { SpeechmaticsLogo } from '../components/Icons';
import { useRouter } from 'next/router'
import Link from 'next/link';
import menuData from '../static_data/menu-data'

export default function ({ children }) {

    const name = 'Michał';

    const router = useRouter();

    return <div className="dashboard_container">
        <div className="dashboard_sidenav">
            <SpeechmaticsLogo w={250} h={130} />
            <div className='hi_name'>Hi, {name}!</div>
            <div className='nav_menu'>
                {menuData.map((item) => <MenuElem item={item} key={item.path}
                    selected={router.pathname == item.path} />)}
            </div>
        </div>
        <div className="dashboard_content">
            {children}
        </div>
    </div>
}


function MenuElem({ item, selected }) {
    return <Link href={item.path}><div className={`menu_elem ${selected ? 'selected' : ''}`}>
        <div>{item.icon({})}</div>
        <div>{item.title}</div>
    </div></Link>
}


