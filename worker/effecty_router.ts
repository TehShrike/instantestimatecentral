import {Result, type FailureResult, type SuccessResult} from './effecty_middleware.ts'

const not_found = (pathname: string) => Result.failure(new Response(`Not Found: "${pathname}"`, { status: 404 }))
type NotFoundResult = FailureResult<Response>
const method_not_allowed = (method: string, pathname: string) => Result.failure(new Response(`Method Not Allowed: "${method}" for path "${pathname}"`, { status: 405 }))
type MethodNotAllowedResult = FailureResult<Response>

type RouterFunction<Context, SuccessValue, FailureValue, InterruptValue> = (context: Context) =>
	Result<SuccessValue, FailureValue, InterruptValue>
	| Promise<Result<SuccessValue, FailureValue, InterruptValue>>

type Router<Context, SuccessValue, FailureValue, InterruptValue> = {
	[pathname: string]: {
		[method: string]: RouterFunction<Context, SuccessValue, FailureValue, InterruptValue>
	}
}

export const route = async <Context, SuccessValue, FailureValue, InterruptValue>(
	router: Router<Context, SuccessValue, FailureValue, InterruptValue>,
	pathname: string,
	method: string,
	context: Context
): Promise<NotFoundResult | MethodNotAllowedResult | Result<SuccessValue, FailureValue, InterruptValue>> => {
	const route = router[pathname]
	if (!route) {
		return not_found(pathname)
	}

	const handler = route[method]
	if (!handler) {
		return method_not_allowed(method, pathname)
	}

	return handler(context)
}
