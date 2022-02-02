import { useRouter } from "next/router";
import Link from "next/link";
import menuData from "../static_data/menu-data";
import { useEffect, useState } from "react";
import {
  SpeechmaticsLogo,
  ExternalLink,
  AccountIcon,
  LogoutIcon,
} from "./Icons";
import { Tooltip, Link as ChakraLink, Button } from "@chakra-ui/react";
import { useMsal } from "@azure/msal-react";
import TestApiBlock from "./call-test";
import { useB2CToken } from "../utils/get-b2c-token-hook";
import { callGetAccounts, callPostAccounts } from "../utils/call-api";

export default function Dashboard({ children }) {
  const router = useRouter();

  const { instance, accounts, inProgress } = useMsal();

  useEffect(() => {
    if (accounts.length == 0) {
      const st = setTimeout(() => router.push("/login/"), 1000);
      return () => clearTimeout(st);
    }
  }, []);

  const tokenPayload = useB2CToken(instance);

  const account = instance.getActiveAccount();

  const [mpAccount, setMpAccount] = useState();
  const [alreadySentRequest, setAlreadySentRequest] = useState<boolean>(false);

  useEffect(() => {
    console.log("calling GET /accounts to check the accounts", router.asPath);
    let isActive = true;
    if (!mpAccount && tokenPayload?.accessToken && !alreadySentRequest) {
      setAlreadySentRequest(true);
      callGetAccounts(tokenPayload.accessToken)
        .then((jsonResp: any) => {
          console.log("response from GET /accounts is", jsonResp);

          if (jsonResp && Array.isArray(jsonResp) && jsonResp.length == 0) {
            console.log(
              "no account on management platform, sending a request to create with POST /accounts"
            );

            return callPostAccounts(tokenPayload.accessToken).then(
              (jsonPostResp) => {
                console.log("response from POST /accounts", jsonPostResp);
                if (isActive) setMpAccount(jsonPostResp);
              }
            );
          } else if (jsonResp && Array.isArray && jsonResp.length > 0) {
            if (isActive) setMpAccount(jsonResp);
          }
        })
        .catch(console.error);
    }
    return () => {
      isActive = false;
    };
  }, [tokenPayload?.accessToken]);

  if (accounts.length == 0) {
    return <div>not logged in, redirecting...</div>;
  }

  return (
    <div className="dashboard_container">
      <div className="dashboard_sidenav">
        <SpeechmaticsLogo w={250} h={130} />
        <div className="hi_name">Hi, {account.name || account.username}!</div>
        <div className="nav_menu">
          {menuData.map((item) => (
            <MenuElem
              item={item}
              key={item.path}
              selected={router.asPath == item.path}
            />
          ))}
        </div>
        <a href="https://docs.speechmatics.com" target='_blank'>
          <div className="open_docs_button">
            <span style={{ marginRight: '8px' }}>
              See Documentation
            </span>
            <ExternalLink color="#ffffff" />
          </div>
        </a>
        <TestApiBlock tokenPayload={tokenPayload} />
      </div>
      <div className="dashboard_content">{children}</div>
      <div className="dashboard_side_bar">
        <Link href="/account/" passHref>
          <ChakraLink>
            <Tooltip label="Account" placement="left">
              <div style={{ cursor: "pointer" }}>
                <AccountIcon w={30} h={30} />
              </div>
            </Tooltip>
          </ChakraLink>
        </Link>
        <Tooltip label="Log out" placement="left">
          <span
            style={{ cursor: "pointer" }}
            onClick={() => instance.logoutRedirect()}
          >
            <LogoutIcon w={30} h={30} />
          </span>
        </Tooltip>
      </div>
    </div>
  );
}

function MenuElem({ item, selected }) {
  return (
    <Link href={item.path}>
      <div className={`menu_elem ${selected ? "selected" : ""}`}>
        <div>{item.icon({})}</div>
        <div>{item.title}</div>
      </div>
    </Link>
  );
}
