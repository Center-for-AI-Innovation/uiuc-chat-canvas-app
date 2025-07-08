import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('LTI POST: Starting request processing');
    const formData = await request.formData();
    const body = Object.fromEntries(formData.entries());

    console.log('LTI Launch received!');
    console.log('Headers:', Object.fromEntries(request.headers.entries()));
    console.log('Body:', body);

    // Extract course info from LTI parameters
    console.log('LTI POST: Extracting user data');
    const courseId = String(body.context_id || body.custom_canvas_course_id || 'BADM-350-Summer-2025');
    const userId = String(body.user_id || 'anonymous');
    const userName = String(body.lis_person_name_full || 'User');
    const courseName = String(body.context_title || 'BADM 350: IT for Networked Organizations');
    
    console.log('LTI POST: Extracted data:', { courseId, userId, userName, courseName });
    
    // Create URL parameters for navigation
    const searchParams = new URLSearchParams({
      lti: 'true',
      courseId,
      userId, 
      userName,
      courseName
    });
    
    const targetURL = `/?${searchParams.toString()}`;
    console.log('LTI POST: Creating HTML response to navigate to:', targetURL);

    // Return HTML that performs client-side navigation (iframe-compatible)
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Loading Illinois Chat...</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 50px 20px;
            background: linear-gradient(135deg, #FF5F05 0%, #13294B 100%);
            color: white;
            text-align: center;
            min-height: calc(100vh - 140px);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        .spinner {
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top: 4px solid #FF5F05;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .welcome {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: #FF5F05;
        }
        .message {
            font-size: 1rem;
            opacity: 0.9;
            margin-bottom: 2rem;
        }
    </style>
</head>
<body>
    <div class="welcome">Illinois Chat</div>
    <div class="spinner"></div>
    <div class="message">Loading your personalized chat assistant...</div>
    <script>
        console.log('LTI: Navigating to main app');
        // Perform navigation after a brief moment to show loading state
        setTimeout(function() {
            window.location.href = '${targetURL}';
        }, 500);
    </script>
</body>
</html>`;

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Frame-Options': 'SAMEORIGIN',
        'Content-Security-Policy': 'frame-ancestors \'self\' https://*.instructure.com https://*.canvas.com',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('LTI Launch error:', error);
    return new Response(`
<!DOCTYPE html>
<html>
<head>
    <title>Error - Illinois Chat</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; color: #13294B; }
        .error { background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 5px; margin: 20px; }
    </style>
</head>
<body>
    <h1>Illinois Chat</h1>
    <div class="error">
        <h2>Unable to launch chat assistant</h2>
        <p>Please try again or contact your instructor for assistance.</p>
        <p>Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
    </div>
</body>
</html>`, {
      status: 500,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Frame-Options': 'SAMEORIGIN'
      }
    });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'LTI endpoint is ready',
    timestamp: new Date().toISOString(),
  });
}