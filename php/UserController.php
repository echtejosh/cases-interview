<?php

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function deactivate(Request $request)
    {
        // best example -> DeactivateUserUseCase::execute($request->id)
        // reasoning is to adhere to separation of concern.
        // deactivation on controller shouldn't concern infrastructure routine
        // and should only know the reference to it's interface
        // subtract logic from inappropriate domain

        // logger is an example class being used for gdpr compliancy when
        // interacting with user data, and thus must be logged
        // gdpr article 5.2 for more details
        $logger = Logger::instance();
        $user = User::find($request->id);

        // this use case assumes that there's no fail condition
        // routines should fail gracefully
        if (!$user) {
            $logger->set($request, 'Request failed because the user cannot be found');

            return response()->json([
                'success' => false,
                'message' => 'Request failed'
            ]);
        }

        $user->active = false;

        // save failed and thus must be handled gracefully again
        try {
            $user->save();
        } catch (\Exception $e) {
            $logger->set($request, 'Request failed because an error occurred');

            return response()->json([
                'success' => false,
                'message' => 'Deactivation failed'
            ]);
        }

        // on absolute certainty, return expected result
        return response()->json([
            'success' => true,
            'message' => 'User deactivated'
        ]);
    }
}