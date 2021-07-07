import Link from 'next/link';
import Dashboard from '../components/dashboard';
import { useRef } from 'react';

export default function Transcribe({ }) {

    const fileInputRef = useRef();

    const onSelectFiles = (ev) => { };

    const openFileDialog = () => {
        fileInputRef.current?.click();
    }

    return <Dashboard>
        <h1>Submit a file</h1>

        <div className="description_text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </div>

        <div className='rouded_shadow_box active_subscriptions_status'>
            Drop a file here
        </div>
        <input type='file' ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={onSelectFiles}
            accept='video/*,audio/*' />
        <div className='default_button' onClick={openFileDialog}>or choose from the disk</div>
    </Dashboard>
}