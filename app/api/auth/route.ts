import { NextResponse } from "next/server";
import { parseStringPromise } from "xml2js";
import crypto from "crypto";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const soapRequest = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
                 xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
                 xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <LoginLDAP xmlns="http://tempuri.org/">
        <Username>${username}</Username>
        <Password>${password}</Password>
      </LoginLDAP>
    </soap:Body>
  </soap:Envelope>`;

  try {
    const response = await fetch("https://api.isense.co.id/ws_ldap/ws_ldap.asmx", {
      method: "POST",
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        "SOAPAction": "http://tempuri.org/LoginLDAP",
      },
      body: soapRequest,
    });

    console.log(soapRequest);
    console.log(response);

    const xmlData = await response.text();
    const parsedData = await parseStringPromise(xmlData);
    const result = parsedData["soap:Envelope"]["soap:Body"][0]["LoginLDAPResponse"][0]["LoginLDAPResult"][0];

    console.log("SOAP Response:", xmlData);
    if (result === "False") {
      return NextResponse.json(
        { success: false, error: "Invalid Username or Password" },
        { status: 401 }
      );
    }

    // Menghasilkan token secara otomatis dengan crypto
    const token = crypto.randomBytes(32).toString("hex");

    const resWithCookie = NextResponse.json({ success: true, result }, { status: 200 });
    resWithCookie.cookies.set("token", token, {
      httpOnly: true,        // Cookie hanya dapat diakses oleh server
      path: "/",             // Cookie berlaku untuk seluruh aplikasi
      maxAge: 60 * 60 * 24,   // Cookie berlaku selama 1 hari (dalam detik)
    });

    return resWithCookie;
  } catch (error) {
    console.error("SOAP Request Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to authenticate" },
      { status: 500 }
    );
  }
}
