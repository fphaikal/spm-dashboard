import { NextResponse } from 'next/server';

interface EmbedTokenPayloadIdentity {
  username: string;
  roles: string[];
  datasets: string[];
}

interface EmbedTokenPayload {
  accessLevel: string;
  identities: EmbedTokenPayloadIdentity[];
}

export async function POST(request: Request) {
  try {
    // Ambil body JSON dan ekstrak properti username
    const { username } = await request.json() 

    // Konfigurasi Power BI dari environment variables
    const tenantId = process.env.PBI_TENANT_ID;
    const clientId = process.env.PBI_CLIENT_ID;
    const clientSecret = process.env.PBI_CLIENT_SECRET;
    const groupId = process.env.PBI_GROUP_ID;
    const reportId = process.env.PBI_REPORT_ID;
    const datasetId = process.env.PBI_DATASET_ID;
    const embedUrl = process.env.PBI_EMBED_URL; // URL embed laporan dari Power BI Service

    // Validasi bahwa semua variabel sudah tersedia
    if (!tenantId || !clientId || !clientSecret || !groupId || !reportId || !datasetId || !embedUrl) {
      throw new Error('Konfigurasi Power BI belum lengkap.');
    }

    // 1. Dapatkan access token dari Azure AD
    const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/token`;
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        resource: 'https://analysis.windows.net/powerbi/api',
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });
    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
      throw new Error('Gagal mendapatkan access token');
    }
    const accessToken = tokenData.access_token;

    // 2. Buat payload untuk generate embed token dengan Effective Identity (RLS)
    const embedTokenPayload: EmbedTokenPayload = {
      accessLevel: "View",
      identities: [
        {
          username: username, // Identitas pengguna yang login
          roles: ["YourRoleName"], // Ganti dengan nama role sesuai model RLS Anda
          datasets: [datasetId],
        },
      ],
    };

    // 3. Panggil API Power BI untuk generate embed token
    const embedTokenUrl = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/reports/${reportId}/generatetoken`;
    const embedTokenResponse = await fetch(embedTokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(embedTokenPayload),
    });
    const embedTokenData = await embedTokenResponse.json();
    if (embedTokenData.error) {
      throw new Error(embedTokenData.error.message);
    }

    return NextResponse.json({
      embedToken: embedTokenData.token,
      embedUrl,
      reportId,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
