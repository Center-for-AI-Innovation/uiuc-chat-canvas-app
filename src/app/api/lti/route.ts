import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const body = Object.fromEntries(formData.entries());

    console.log('LTI Launch received!');
    console.log('Headers:', Object.fromEntries(request.headers.entries()));
    console.log('Body:', body);

    // Extract course info from LTI parameters
    const courseId = String(body.context_id || body.custom_canvas_course_id || 'BADM-350-Summer-2025');
    const userId = String(body.user_id || 'anonymous');
    const userName = String(body.lis_person_name_full || 'User');
    const courseName = String(body.context_title || 'BADM 350: IT for Networked Organizations');

    // Create a simple HTML page that redirects to the main app with LTI context
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Illinois Chat</title>
    <script>
        // Set LTI context in window object
        window.LTI_CONTEXT = {
            courseId: '${courseId}',
            userId: '${userId}',
            userName: '${userName.replace(/'/g, "\\'")}',
            courseName: '${courseName.replace(/'/g, "\\'")}'
        };
        
        // Redirect to main app after setting context
        window.location.href = '/';
    </script>
</head>
<body>
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
        <div style="text-align: center;">
            <div style="width: 40px; height: 40px; border: 4px solid #FF5F05; border-top: 4px solid transparent; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
            <p>Loading Illinois Chat...</p>
        </div>
    </div>
    <style>
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</body>
</html>`;

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