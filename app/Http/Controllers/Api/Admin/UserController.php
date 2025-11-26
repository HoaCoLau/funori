<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::with('role')->paginate(20);

        return response()->json([
            'success' => true,
            'message' => 'Lấy danh sách người dùng thành công',
            'data' => UserResource::collection($users)->response()->getData(true)
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::with(['role', 'addresses', 'orders'])->find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy người dùng',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Lấy chi tiết người dùng thành công',
            'data' => new UserResource($user)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy người dùng',
            ], 404);
        }

        $validated = $request->validate([
            'status' => 'required|in:active,blocked',
        ]);

        $user->update(['status' => $validated['status']]);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật trạng thái người dùng thành công',
            'data' => new UserResource($user)
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy người dùng',
            ], 404);
        }

        // Prevent deleting self or admin? Maybe later.
        
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa người dùng thành công',
        ]);
    }
}
