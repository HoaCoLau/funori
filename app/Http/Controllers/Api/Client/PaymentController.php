<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Srmklive\PayPal\Services\PayPal as PayPalClient;
use App\Models\Order;
use App\Models\Payment;
use Carbon\Carbon;

class PaymentController extends Controller
{
    public function createPayment(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,order_id'
        ]);

        $order = Order::find($request->order_id);

        // Check if order is already paid or processed
        if (in_array($order->status, ['processing', 'shipped', 'completed'])) {
            return response()->json(['message' => 'Order is already paid or processed.'], 400);
        }

        $provider = new PayPalClient;
        $provider->setApiCredentials(config('paypal'));
        $paypalToken = $provider->getAccessToken();

        $response = $provider->createOrder([
            "intent" => "CAPTURE",
            "application_context" => [
                "return_url" => route('payment.success', ['order_id' => $order->order_id]),
                "cancel_url" => route('payment.cancel'),
            ],
            "purchase_units" => [
                0 => [
                    "amount" => [
                        "currency_code" => "USD",
                        "value" => number_format($order->total_amount / 25000, 2, '.', '') // Assuming 1 USD = 25,000 VND
                    ]
                ]
            ]
        ]);

        if (isset($response['id']) && $response['id'] != null) {
            foreach ($response['links'] as $link) {
                if ($link['rel'] == 'approve') {
                    return response()->json([
                        'success' => true,
                        'approval_url' => $link['href'],
                        'paypal_order_id' => $response['id']
                    ]);
                }
            }
        }

        return response()->json([
            'success' => false,
            'message' => 'Something went wrong with PayPal.',
            'details' => $response
        ], 500);
    }

    public function success(Request $request)
    {
        $provider = new PayPalClient;
        $provider->setApiCredentials(config('paypal'));
        $provider->getAccessToken();
        $response = $provider->capturePaymentOrder($request['token']);

        if (isset($response['status']) && $response['status'] == 'COMPLETED') {
            $orderId = $request->query('order_id');
            $order = Order::find($orderId);
            
            if ($order) {
                $order->status = 'processing'; // Update order status to processing
                $order->save();

                // Create Payment Record
                Payment::create([
                    'order_id' => $order->order_id,
                    'payment_method_id' => 2, // Assuming 2 is PayPal. You should check your DB.
                    'payment_status' => 'completed',
                    'amount' => $order->total_amount,
                    'transaction_code' => $response['id'],
                    'payment_date' => Carbon::now()
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Payment successful.',
                    'data' => $response
                ]);
            }
        }

        return response()->json([
            'success' => false,
            'message' => 'Payment failed.',
            'details' => $response
        ], 500);
    }

    public function cancel()
    {
        return response()->json([
            'success' => false,
            'message' => 'Payment cancelled.'
        ]);
    }
}
