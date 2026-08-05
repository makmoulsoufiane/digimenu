<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsManager
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()?->isManager()) {
            abort(Response::HTTP_FORBIDDEN, 'Only managers can perform this action.');
        }

        return $next($request);
    }
}
