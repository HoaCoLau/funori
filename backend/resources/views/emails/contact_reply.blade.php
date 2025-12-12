<!DOCTYPE html>
<html>
<head>
    <title>Reply to your contact request</title>
</head>
<body>
    <h1>Hello,</h1>
    <p>Thank you for contacting us. Here is our reply to your message regarding "{{ $originalSubject }}":</p>
    <div style="padding: 15px; background-color: #f5f5f5; border-left: 4px solid #333;">
        {!! nl2br(e($replyMessage)) !!}
    </div>
    <p>Best regards,<br>Admin Team</p>
</body>
</html>