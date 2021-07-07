import { useRouter } from 'next/router'
import Link from 'next/link';
import menuData from '../static_data/menu-data'
import { useContext } from 'react';
import { LoginContext } from '../utils/login-context';
import { SpeechmaticsLogo, ExternalLink, AccountIcon, LogoutIcon } from '../components/Icons';

export default function Dashboard({ children }) {

    const router = useRouter();
    const context = useContext(LoginContext);

    return <div className="dashboard_container">
        <div className="dashboard_sidenav">
            <SpeechmaticsLogo w={250} h={130} />
            <div className='hi_name'>Hi, {context.data.name}!</div>
            <div className='nav_menu'>
                {menuData.map((item) => <MenuElem item={item} key={item.path}
                    selected={router.asPath == item.path} />)}
            </div>
            <a href='https://docs.speechmatics.com' target='_blank'>
                <div className='open_docs_button'>
                    <span>Open Documentation</span>
                    <ExternalLink color='white' />
                </div>
            </a>
        </div>
        <div className="dashboard_content">
            {children}
        </div>
        <div className="dashboard_side_bar">
            <AccountIcon w={30} h={30} />
            <Link href='/login/'>
                <div style={{ cursor: 'pointer' }}><LogoutIcon w={30} h={30} /></div>
            </Link>
        </div>
    </div >
}


function MenuElem({ item, selected }) {
    return <Link href={item.path}><div className={`menu_elem ${selected ? 'selected' : ''}`}>
        <div>{item.icon({})}</div>
        <div>{item.title}</div>
    </div></Link>
}


