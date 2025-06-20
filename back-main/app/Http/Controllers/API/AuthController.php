<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\API\BaseController as BaseController;
use Illuminate\Support\Facades\Auth;
use Validator;
use App\Models\User;

class AuthController extends BaseController
{

    /**
     *  @OA\GET(
     *      path="/api/auth/me",
     *      summary="Informações do usuário logado",
     *      description="Informações do usuário logado",
     *      tags={"whoMe"},
     *      @OA\Parameter(
     *         name="email",
     *         in="query",
     *         description="email",
     *         required=true,
     *      ),
     *      @OA\Parameter(
     *          name="password",
     *          in="query",
     *          description="password",
     *          required=true,
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="OK",
     *          @OA\MediaType(
     *              mediaType="application/json",
     *          )
     *      ),
     *
     *  )
     */
    public static function whoMe(){
        return response()->json(Auth::user(),200);
    }

    /**
     *  @OA\POST(
     *      path="/api/auth/login",
     *      summary="Login do usuário",
     *      description="Login do usuário usando sanctum Laravel",
     *      tags={"Login, signin"},
     *      @OA\Parameter(
     *         name="email",
     *         in="query",
     *         description="email",
     *         required=true,
     *      ),
     *      @OA\Parameter(
     *          name="password",
     *          in="query",
     *          description="password",
     *          required=true,
     *      ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful login",
     *         @OA\JsonContent(
     *             @OA\Property(property="token", type="string", example="your-access-token")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Invalid credentials")
     *         )
     *     )
     * )
     */

    public function signin(Request $request)
    {

        if(Auth::attempt(['email' => $request->email, 'password' => $request->password])){

            $authUser = Auth::user();
            $success['token'] = $authUser->createToken('CARRERAIPA')->plainTextToken;
            $success['name'] = $authUser->name;
            $success['email'] = $authUser->email;
            $success['id'] = $authUser->id;
            $success['admin'] = $authUser->admin;
            $success['id_user_crypt'] = base64_encode($authUser->id);

            return $this->sendResponse($success, 'User signed in');
        }
        else{
            return $this->sendError('Unauthorised.', ['error'=>'Unauthorised']);
        }
    }

    public function signup(Request $request)
    {

        $check = User::where('email','=',$request->email)->count();

        if($check > 0){
            return $this->sendError('Usuário já cadastrado.', ['error'=>'E-mail já cadastrado.']);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|email',
            'password' => 'required',
            'confirm_password' => 'required|same:password',
        ]);

        if($validator->fails()){
            return $this->sendError('Error validation', $validator->errors());
        }

        $input = $request->all();
        $input['password'] = bcrypt($input['password']);
        $user = User::create($input);

        $success['token'] =  $user->createToken('AXONAPI')->plainTextToken;
        $success['name'] =  $user->name;

        return $this->sendResponse($success, 'User created successfully.');
    }

}
