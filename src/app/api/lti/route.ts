import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const body = Object.fromEntries(formData.entries());

    console.log('LTI Launch received!');
    console.log('Headers:', Object.fromEntries(request.headers.entries()));
    console.log('Body:', body);

    // Extract course info from LTI parameters
    const courseId = body.context_id || body.custom_canvas_course_id || 'BADM-350-Summer-2025';
    const userId = body.user_id || 'anonymous';
    const userName = body.lis_person_name_full || 'User';

    // Read the built React app HTML
    const htmlPath = join(process.cwd(), '.next/server/app/page.html');
    let htmlContent: string;
    
    try {
      htmlContent = readFileSync(htmlPath, 'utf8');
    } catch {
      // Fallback to a basic template if the built HTML isn't available
      htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Illinois Chat</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="/_next/static/chunks/polyfills.js"></script>
    <script src="/_next/static/chunks/webpack.js"></script>
    <script src="/_next/static/chunks/main-app.js"></script>
</head>
<body>
    <div id="__next"></div>
    <script src="/_next/static/chunks/app/layout.js"></script>
    <script src="/_next/static/chunks/app/page.js"></script>
</body>
</html>`;
    }

    // Inject LTI context into the HTML
    const ltiContextScript = `
    <script>
        window.LTI_CONTEXT = {
            courseId: '${courseId}',
            userId: '${userId}',
            userName: '${userName}',
            courseName: 'BADM 350: IT for Networked Organizations'
        };
    </script>`;

    // Insert the script before the closing </head> tag
    htmlContent = htmlContent.replace('</head>', ltiContextScript + '</head>');

    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('LTI Launch error:', error);
    return NextResponse.json(
      { error: 'Failed to process LTI launch' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'LTI endpoint is ready',
    timestamp: new Date().toISOString(),
  });
}