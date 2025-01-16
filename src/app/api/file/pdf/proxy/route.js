// // src/app/api/file/pdf/proxy/route.js

// import { NextResponse } from 'next/server';

// export async function GET(request) {
//   try {
//     // Parse request URL
//     const searchParams = new URL(request.url).searchParams;
//     const pdfUrl = searchParams.get('url');
   
//     if (!pdfUrl) {
//       console.error('Proxy: No URL provided');
//       return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
//     }

//     console.log('Proxy: Fetching PDF from:', pdfUrl);
    
//     // Parse original URL and preserve query parameters
//     const originalUrl = new URL(pdfUrl);
    
//     // Attempt to fetch the PDF
//     try {
//       const response = await fetch(originalUrl.toString(), {
//         headers: {
//           'Accept': '*/*',
//           'User-Agent': 'Mozilla/5.0',
//         },
//         credentials: 'include',
//         mode: 'cors',
//       });

//       if (!response.ok) {
//         throw new Error(`PDF fetch failed: ${response.status}`);
//       }

//       const pdfData = await response.blob();
      
//       // Return PDF with proper headers
//       return new NextResponse(pdfData, {
//         headers: {
//           'Content-Type': 'application/pdf',
//           'Content-Length': pdfData.size.toString(),
//           'Access-Control-Allow-Origin': '*',
//           'Access-Control-Allow-Methods': 'GET, OPTIONS',
//           'Access-Control-Allow-Headers': 'Content-Type, Authorization',
//           'Cache-Control': 'public, max-age=3600',
//         }
//       });

//     } catch (fetchError) {
//       console.error('Proxy: Fetch error:', fetchError);
//       return NextResponse.json(
//         { error: `Failed to fetch PDF: ${fetchError.message}` },
//         { status: 502 }
//       );
//     }

//   } catch (error) {
//     console.error('Proxy: General error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// // Add OPTIONS handler for CORS preflight
// export async function OPTIONS(request) {
//   return new NextResponse(null, {
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'GET, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type, Authorization',
//     },
//   });
// }