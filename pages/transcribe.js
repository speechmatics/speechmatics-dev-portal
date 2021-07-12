import Dashboard from '../components/dashboard';
import { useRef, useEffect } from 'react';
import Prism from "prismjs";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react"


export default function Transcribe({ }) {

    const fileInputRef = useRef();

    const onSelectFiles = (ev) => { };

    const openFileDialog = () => {
        fileInputRef.current?.click();
    }

    useEffect(() => {
        Prism.highlightAll();
    }, []);

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


        <Tabs p='2em 0em' w='700px'>
            <TabList>
                <Tab>Javascript</Tab>
                <Tab>Python</Tab>
                <Tab>bash</Tab>
            </TabList>

            <TabPanels>
                <TabPanel p={0}>
                    <pre>
                        <code className="language-javascript">
                            {`var ws = new WebSocket('wss://rta:9000/v2');
ws.binaryType = "arraybuffer";
ws.onopen = function(event) { onOpen(event) };
ws.onmessage = function(event) { onMessage(event) };
ws.onclose = function(event) { onClose(event) };
ws.onerror = function(event) { onError(event) };
`}
                        </code>
                    </pre>
                </TabPanel>
                <TabPanel p={0}>
                    <pre>
                        <code className="language-python">
                            {`python -m smwebsocket.cli --url wss://rta:9000/v2 --max-delay 3 --lang en test.mp3`}
                        </code>
                    </pre>
                </TabPanel>
                <TabPanel p={0}>
                    <pre>
                        <code className="language-bash">
                            {`curl -L -X POST https://asr.api.speechmatics.com/v2/jobs/ -H "Authorization: Bearer NDFjOTE3NGEtOWVm" -F data_file=@example.wav -F config="$(cat config.json)" | jq`}
                        </code>
                    </pre>
                </TabPanel>
            </TabPanels>
        </Tabs>

    </Dashboard>
}