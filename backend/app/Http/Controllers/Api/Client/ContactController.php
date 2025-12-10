<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Models\ContactSubmission;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'required|string|max:255',
            'message_content' => 'required|string',
        ]);

        $validated['status'] = 'new';

        $submission = ContactSubmission::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Your message has been sent successfully.',
            'data' => $submission
        ], 201);
    }
}
