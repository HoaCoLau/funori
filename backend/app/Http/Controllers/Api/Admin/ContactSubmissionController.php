<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactReplyMail;

class ContactSubmissionController extends Controller
{
    public function index(Request $request)
    {
        $query = ContactSubmission::query();

        // Filter by status
        if ($request->has('status') && $request->status != '') {
            $query->where('status', $request->status);
        }

        // Search by name, email, or subject
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%");
            });
        }

        $submissions = $query->orderBy('submission_id', 'desc')->paginate(20);
        
        return response()->json([
            'success' => true,
            'data' => $submissions
        ]);
    }

    public function show($id)
    {
        $submission = ContactSubmission::find($id);
        if (!$submission) {
            return response()->json(['success' => false, 'message' => 'Submission not found'], 404);
        }
        return response()->json(['success' => true, 'data' => $submission]);
    }

    public function update(Request $request, $id)
    {
        $submission = ContactSubmission::find($id);
        if (!$submission) {
            return response()->json(['success' => false, 'message' => 'Submission not found'], 404);
        }

        $validated = $request->validate([
            'status' => 'required|in:new,read,replied',
        ]);

        $submission->update($validated);

        return response()->json(['success' => true, 'message' => 'Status updated successfully', 'data' => $submission]);
    }

    public function reply(Request $request, $id)
    {
        $submission = ContactSubmission::find($id);
        if (!$submission) {
            return response()->json(['success' => false, 'message' => 'Submission not found'], 404);
        }

        $validated = $request->validate([
            'message' => 'required|string',
        ]);

        // Send email
        try {
            Mail::to($submission->email)->send(new ContactReplyMail($validated['message'], $submission->subject));
            
            // Update status to replied
            $submission->update(['status' => 'replied']);

            return response()->json(['success' => true, 'message' => 'Reply sent successfully']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to send email: ' . $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $submission = ContactSubmission::find($id);
        if (!$submission) {
            return response()->json(['success' => false, 'message' => 'Submission not found'], 404);
        }

        $submission->delete();
        return response()->json(['success' => true, 'message' => 'Submission deleted successfully']);
    }
}
